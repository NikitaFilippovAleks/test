#!groovy

def call(body) {
    // evaluate the body block, and collect configuration into the object
    def pipelineParams = [:]
    body.resolveStrategy = Closure.DELEGATE_FIRST
    body.delegate = pipelineParams
    body()
    pipeline {
        agent {
          label 'linux'
        }
        environment {
            GIT_TAG = sh(returnStdout: true, script: 'git describe --tags --abbrev=0 --always').trim()
            PROJECT = get_project()
            SLACK_CHANNEL = get_slack_channel()
            VAULT_ENGINE_VERSION = get_vault_engine_version()
            FRONTEND_COVERAGE_PERCENT = get_frontend_coverage_percent()
            ASSETS_COMPILATION_COMMAND = get_assets_compilation_command()
        }
        stages {
            stage("Preparations") {
                steps {
                    withVault([configuration: [engineVersion: VAULT_ENGINE_VERSION, timeout: 60, vaultCredentialId: "vault-${PROJECT}-stage", vaultUrl: 'https://vault.secret-agents.ru'], vaultSecrets: getSecretsConfig('stage')]) {
                        sh 'echo $DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USERNAME --password-stdin $DOCKERHUB_HOST'
                    }
                    sh 'cp .env.test .env'
                    withCredentials([[$class: 'VaultTokenCredentialBinding', credentialsId: "vault-${PROJECT}-stage", vaultAddr: 'https://vault.secret-agents.ru']]) {
                        sh "sed -i \'s/VAULT_TOKEN=.*/VAULT_TOKEN=$VAULT_TOKEN/g\' .env "
                    }
                    printWithGreen('--------======== Init RoR and DB ========--------')
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml down --volumes"
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml build"
                    retry(count: 3) {
                        sh "docker-compose -p ${env.PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml up -d"
                    }
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T web bin/rails parallel:create"
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T web bin/rails parallel:migrate"
                    sh 'sudo chown -R $USER:$USER .'
                }
            }

            stage("Run back tests") {
                when {
                    not {
                        tag "v*"
                    }
                }
                steps {
                    printWithGreen('--------======== Running back tests ========--------')
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T web bundle exec rake parallel:spec"
                }
                post {
                    always {
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/junit ."
                        junit 'junit/junit*.xml'
                    }
                    success {
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/coverage ."
                        publishHTML(target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'coverage',
                            reportFiles: 'index.html',
                            reportName: 'SimpleCov Coverage Report'
                        ])
                    }
                }
            }
            stage('Record Coverage Back') {
                when {
                    branch 'master'
                }
                steps {
                    script {
                        currentBuild.result = 'SUCCESS'
                    }
                    step([$class: 'MasterCoverageAction', scmVars: [GIT_URL: env.GIT_URL]])
                }
            }
            stage('PR Coverage to Github Back') {
                when {
                    allOf {
                        not {
                            branch 'master'
                        }; expression {
                            return env.CHANGE_ID != null
                        }
                    }
                }
                steps {
                    script {
                        currentBuild.result = 'SUCCESS'
                    }
                    step([$class: 'CompareCoverageAction', publishResultAs: 'statusCheck', scmVars: [GIT_URL: env.GIT_URL]])
                    step([$class: 'CompareCoverageAction', publishResultAs: 'comment', scmVars: [GIT_URL: env.GIT_URL]])
                }
            }
            stage("Run front tests") {
                when {
                    not {
                        tag "v*"
                    }; expression {
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/package.json ."
                        return (fileExists('package.json') && sh(script: "cat package.json | grep '\"test:coverage\"' >/dev/null 2>&1", returnStatus: true) == 0)
                    }
                }
                steps {
                    printWithGreen('--------======== Running front tests ========--------')
                    sh "docker-compose -p ${PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T web bundle exec yarn run test:coverage"
                }
                post {
                    always {
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/coverageFront ."
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/junitFront ."                    
                          
                        junit 'junitFront/junit*.xml'
                    }
                }
            }
            stage('Record Coverage Front') {
                when {
                    not {
                        tag "v*"
                    }; expression {
                        sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/package.json ."
                        return (fileExists('package.json') && sh(script: "cat package.json | grep '\"test:coverage\"' >/dev/null 2>&1", returnStatus: true) == 0)
                    }
                }
                steps {
                    recordCoverage(
                      tools: [[parser: 'COBERTURA', pattern: 'coverageFront/cobertura-coverage.xml']],
                      id: 'cobertura',
                      name: 'Front coverage',
                      checksName: 'Front coverage',
                      skipPublishingChecks: false,
                      scm: env.GIT_URL,
                      qualityGates: [
                        [threshold: FRONTEND_COVERAGE_PERCENT, metric: 'LINE', baseline: 'PROJECT'],
                        [threshold: FRONTEND_COVERAGE_PERCENT, metric: 'BRANCH', baseline: 'PROJECT']
                      ]
                    )
                }
            }
            stage('Build and push image') {
                when {
                    tag pattern: "^[vV]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*\$", comparator: "REGEXP"
                }
                steps {
                    script {
                        def public_directories_to_copy_from_container = get_public_directories_to_copy_from_container()
                        withVault([configuration: [engineVersion: VAULT_ENGINE_VERSION, timeout: 60, vaultCredentialId: "vault-${PROJECT}-stage", vaultUrl: 'https://vault.secret-agents.ru'], vaultSecrets: getSecretsConfig('stage')]) {
                            sh "docker-compose -p ${env.PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T -e RAILS_ENV=production web ${ASSETS_COMPILATION_COMMAND}"
                            sh 'sudo chown -R $USER:$USER .'

                            for (directory in public_directories_to_copy_from_container.split(' ').collect { it.trim() }) {
                                sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/public/$directory ./public"
                            }

                            sh "docker cp \$(docker ps | grep ${PROJECT} | grep web | awk '{print \$1}'):/app/node_modules ./"
                            sh 'echo $DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USERNAME --password-stdin $DOCKERHUB_HOST'
                            printWithGreen("--------======== Building image $GIT_TAG ========--------")
                            sh "docker build --no-cache --compress -t $DOCKERHUB_HOST/$DOCKERHUB_REPO:$GIT_TAG ."
                            printWithGreen("--------======== Pushing image $GIT_TAG ========--------")
                            sh "docker push $DOCKERHUB_HOST/$DOCKERHUB_REPO:$GIT_TAG"
                            slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG - builded and pushed! :tada:")
                        }
                    }
                }
            }
            stage('Deploy') {
                when {
                    tag pattern: "^[vV]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*\$", comparator: "REGEXP"
                }
                steps {
                    script {
                        def tag = env.GIT_TAG
                        def directories_to_send = get_directories_to_send()
                        def commands_to_run_after_deploy = get_commands_to_run_after_deploy()
                        def containers_to_restart = get_containers_to_restart()

                        def stage = 'stage'
                        if (tag.matches(/^[vV]\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                            stage = 'production'
                            slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG waiting for deploy approval to ${stage} ${env.BUILD_URL}")
                            timeout(time: 30, unit: 'MINUTES') {
                                def userInput = input(
                                    id: 'deploy',
                                    message: "Do you want to deploy to ${stage}?",
                                    submitterParameter: 'userName'
                                )
                            }  
                        }
                        printWithGreen("--------======== Deploying to ${stage} ========--------")                        
                        withVault([configuration: [engineVersion: VAULT_ENGINE_VERSION, timeout: 60, vaultCredentialId: "vault-${PROJECT}-${stage}", vaultUrl: 'https://vault.secret-agents.ru'], vaultSecrets: getSecretsConfig(stage)]) {
                            writeFile file: 'ssh_key', text: env.SSH_KEY
                            sh "chmod 600 ssh_key"
                            if (directories_to_send) {
                                for (directory in directories_to_send.split(',').collect { it.trim() }) {
                                    sh "if [ -d $directory ]; then scp -o StrictHostKeyChecking=no -i ssh_key -P $SSH_PORT -r $directory $SSH_USER@$SSH_HOST:./$SSH_PATH; fi"
                                }
                            }
                            sh "scp -o StrictHostKeyChecking=no -i ssh_key -P $SSH_PORT docker-* $SSH_USER@$SSH_HOST:./$SSH_PATH"
                            sh "ssh -o StrictHostKeyChecking=no -i ssh_key $SSH_USER@$SSH_HOST -p $SSH_PORT \'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD $DOCKERHUB_HOST\'"
                            sh "ssh -o StrictHostKeyChecking=no -i ssh_key $SSH_USER@$SSH_HOST -p $SSH_PORT 'cd $SSH_PATH && sed -i \'s/RELEASE_VERSION=.*/RELEASE_VERSION=$GIT_TAG/g\' .env '"
                            run_app_and_wait_started()

                            for (command in commands_to_run_after_deploy.split(',').collect { it.trim() }) {
                                sh "ssh -o StrictHostKeyChecking=no -i ssh_key $SSH_USER@$SSH_HOST -p $SSH_PORT 'cd $SSH_PATH && docker-compose -f docker-compose.yml -f docker-compose.override.production.yml exec -T web $command'"
                            }

                            slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG deployed to ${stage}! :tada:")
                        }
                    }
                }
            }
        }
        post {
            always {
                sh 'rm -f ssh_key'
                sh "docker-compose -p ${env.PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml down --volumes"
            }
        }
    }
}

// def test() {
//     try {
//         printWithGreen("Running tests")
//         sh "docker-compose -p ${env.PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml exec -T web bundle exec rspec --format RspecJunitFormatter --out junit.xml"
//     }
//     catch (exc) {
//         error("Build failed")
//     }
//     finally {
//         sh "docker-compose -p ${env.PROJECT} -f docker-compose.yml -f docker-compose.override.build.yml down --volumes"
//     }
// }

def run_app_and_wait_started() {
    def containers_to_restart = get_containers_to_restart()
    sh "ssh -o StrictHostKeyChecking=no -i ssh_key $SSH_USER@$SSH_HOST -p $SSH_PORT 'cd $SSH_PATH && docker-compose -f docker-compose.yml -f docker-compose.override.production.yml up --pull --no-recreate --no-deps --remove-orphans -d $containers_to_restart'"
    timeout(time: 2, unit: 'MINUTES') {
        script {
            def isRunning = false
            while (!isRunning) {
                def containers = sh(script: "ssh -o StrictHostKeyChecking=no -i ssh_key $SSH_USER@$SSH_HOST -p $SSH_PORT 'cd $SSH_PATH && docker-compose -f docker-compose.yml -f docker-compose.override.production.yml ps --filter \'status=running\' --services'", returnStdout: true).trim().split()
                if (containers.contains('web')) {
                    isRunning = true
                    echo 'web is now running'
                } else {
                    echo "Waiting for web to start..."
                    sleep 10
                }           
            }
        }
    }
}

def get_slack_channel() {
    def props = readProperties file: 'Jenkins.properties'
    return props.SLACK_CHANNEL
}
def get_project() {
    def props = readProperties file: 'Jenkins.properties'
    return props.PROJECT
}
def get_containers_to_restart() {
    def props = readProperties file: 'Jenkins.properties'
    return props.CONTAINERS_TO_RESTART
}
def get_frontend_coverage_percent() {
    def props = readProperties file: 'Jenkins.properties'
    return props.FRONTEND_COVERAGE_PERCENT
}
def get_vault_path_prefix() {
    def props = readProperties file: 'Jenkins.properties'
    
    return props.VAULT_PATH_ROOT ? "" : "secret/"
}
def get_vault_engine_version() {
    def props = readProperties file: 'Jenkins.properties'
    def vault_engine_version = props.VAULT_ENGINE_VERSION ? props.VAULT_ENGINE_VERSION : 1
    
    return vault_engine_version
}

def get_assets_compilation_command() {
    def props = readProperties file: 'Jenkins.properties'
    def command = props.ASSETS_COMPILATION_COMMAND ? props.ASSETS_COMPILATION_COMMAND : 'bin/rails assets:precompile'
    
    return command
}

def get_public_directories_to_copy_from_container() {
    def props = readProperties file: 'Jenkins.properties'
    def directories = props.PUBLIC_DIRECTORIES_TO_COPY_FROM_CONTAINER ? props.PUBLIC_DIRECTORIES_TO_COPY_FROM_CONTAINER : 'assets packs'
    
    return directories
}

def get_commands_to_run_after_deploy() {
    def props = readProperties file: 'Jenkins.properties'
    def directories = props.COMMANDS_TO_RUN_AFTER_DEPLOY ? props.COMMANDS_TO_RUN_AFTER_DEPLOY : 'bin/rails db:migrate'
    
    return directories
}

def getSecretsConfig(stage) {
    return [[path: "${get_vault_path_prefix()}${PROJECT}/${stage}/deploy", engineVersion: VAULT_ENGINE_VERSION, secretValues: [
        [envVar: 'SSH_HOST', vaultKey: 'ssh_host'],
[envVar: 'SSH_KEY', vaultKey: 'ssh_key'],
[envVar: 'SSH_PATH', vaultKey: 'ssh_path'],
[envVar: 'SSH_PORT', vaultKey: 'ssh_port'],
[envVar: 'SSH_USER', vaultKey: 'ssh_user'],
[envVar: 'DOCKERHUB_HOST', vaultKey: 'dockerhub_host'],
[envVar: 'DOCKERHUB_REPO', vaultKey: 'dockerhub_repo'],
[envVar: 'DOCKERHUB_USERNAME', vaultKey: 'dockerhub_username'],
[envVar: 'DOCKERHUB_PASSWORD', vaultKey: 'dockerhub_password'],
    ]]]
}
def get_directories_to_send() {
    def props = readProperties file: 'Jenkins.properties'
    return props.DIRECTORIES_TO_SEND
}
def printWithGreen(text) {
    ansiColor('xterm') {
        echo "\u001B[32m=== ${text} ===\u001B[0m"
    }
}
