#!groovy

def call(body) {
    // evaluate the body block, and collect configuration into the object
  def pipelineParams = [:]
  body.resolveStrategy = Closure.DELEGATE_FIRST
  body.delegate = pipelineParams
  body()
  pipeline {
    agent none

    stages {
      stage('Select environment') {
        agent {
          label 'linux'
        }

        environment {
          GIT_TAG = sh(returnStdout: true, script: 'git describe --tags --abbrev=0 --always').trim()
          PROJECT = get_project()
          SLACK_CHANNEL = get_slack_channel()
          VERSION = getVersionForStores(GIT_TAG)
          PATH = "/opt/homebrew/opt/ruby/bin:/opt/homebrew/opt/node@18/bin:/opt/homebrew/opt/yarn/bin:$PATH"
        }
            
        when {
          tag pattern: "^[vV]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}-.*\$", comparator: "REGEXP"
        }
            
        steps {
          script {
            slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG waiting for choosing environment for deploy ${env.BUILD_URL}")
            timeout(time: 30, unit: 'MINUTES') {
              def userInput = input(
                id: 'deploy',
                message: 'Choose deploy environment',
                submitterParameter: 'userName',
                parameters: [
                  choice(
                    choices: ['stage', 'production'],
                    name: 'DEPLOY_ENVIRONMENT'
                  )
                ]
              )

              env.PROJECT_ENV = userInput.DEPLOY_ENVIRONMENT
            }
          }
        }
      }
      
      stage('Deploy app to stores') {
        parallel {
          stage('Android') {
            agent {
              label 'linux'
            }

            environment {
              GIT_TAG = sh(returnStdout: true, script: 'git describe --tags --abbrev=0 --always').trim()
              PROJECT = get_project()
              SLACK_CHANNEL = get_slack_channel()
              VERSION = getVersionForStores(GIT_TAG)
              PATH = "/opt/homebrew/opt/ruby/bin:/opt/homebrew/opt/node@18/bin:/opt/homebrew/opt/yarn/bin:$PATH"
            }
            
            when {
              tag pattern: "^[vV]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}-.*\$", comparator: "REGEXP"
            }
            
            post {
              always {
                sh 'rm -f ssh_key'
                sh "docker-compose -p ${env.PROJECT} down --volumes"
              }
            }

            stages {
              stage('Prepation .env file for android') {
                steps {
                  prepareEnv()
                }
              }

              stage('Preparation system for android') {
                steps {
                  withCredentials([usernamePassword(
                    credentialsId: 'github_sa',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                  )]) {
                    withVault([configuration: [engineVersion: 2, timeout: 60, vaultCredentialId: "vault-${PROJECT}-${env.PROJECT_ENV}", vaultUrl: 'https://vault.secret-agents.ru'], vaultSecrets: getSecretsConfig(env.PROJECT_ENV)]) {
                      sh "docker-compose -p ${PROJECT} build --no-cache --build-arg username=$USERNAME --build-arg password=$PASSWORD"
                      retry(count: 3) {
                        sh "docker-compose -p ${env.PROJECT} up -d"
                      }
                    }
                  }
                }
              }

              stage('Deploy android') {
                steps {
                  script {
                    printWithGreen("--------======== Deploying to android ${env.PROJECT_ENV} ========--------")
                    sh "docker-compose -p ${env.PROJECT} exec -T app bundle exec fastlane android deploy"
                    slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG android deployed to ${env.PROJECT_ENV}! :tada:")
                  }
                }
              }
            }
          }

          stage('iOS') {
            agent {
              label 'mac'
            }

            environment {
              GIT_TAG = sh(returnStdout: true, script: 'git describe --tags --abbrev=0 --always').trim()
              PROJECT = get_project()
              SLACK_CHANNEL = get_slack_channel()
              VERSION = getVersionForStores(GIT_TAG)
              PATH = "/opt/homebrew/opt/ruby/bin:/opt/homebrew/opt/node@18/bin:/opt/homebrew/opt/yarn/bin:$PATH"
            }
            
            when {
              tag pattern: "^[vV]\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}-.*\$", comparator: "REGEXP"
            }

            post {
              always {
                sh 'rm -f ssh_key'
                sh "docker-compose -p ${env.PROJECT} down --volumes"
              }
            }

            stages {
              stage('Prepation .env file for iOS') {
                steps {
                  prepareEnv()
                }
              }

              stage('Preparation system for iOS') {
                steps {
                  sh 'bundle install'
                  sh 'yarn install'
                  sh 'cd ios && bundle exec pod install --repo-update'
                }
              }

              stage('Deploy iOS') {
                steps {
                  sh 'bundle exec fastlane ios deploy'
                  slackSend(color: "good", channel: env.SLACK_CHANNEL, message: "$GIT_TAG ios deployed to ${env.PROJECT_ENV}! :tada:")
                }
              }
            }
          }
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

def getSecretsConfig(stage) {
  return [[path: "${PROJECT}/${stage}/deploy", engineVersion: 2, secretValues: [
      [envVar: 'AMPLITUDE_INIT_KEY', vaultKey: 'amplitude_init_key'],
      [envVar: 'ANDROID_KEYSTORE_FILE_BASE64', vaultKey: 'android_keystore_base64'],
      [envVar: 'ANDROID_KEYSTORE_PASSWORD', vaultKey: 'android_keystore_password'],
      [envVar: 'ANDROID_KEY_ALIAS', vaultKey: 'android_key_alias'],
      [envVar: 'ANDROID_KEY_PASSWORD', vaultKey: 'android_key_password'],
      [envVar: 'ANDROID_SERVICE_ACCOUNT_BASE64', vaultKey: 'android_service_account_base64'],
      [envVar: 'ANDROID_GOOGLE_SERVICES_BASE64', vaultKey: 'android_google_services_base64'],
      [envVar: 'API_URL', vaultKey: 'api_url'],
      [envVar: 'API_KEY', vaultKey: 'api_key'],
      [envVar: 'APPLE_KEY_ID', vaultKey: 'apple_key_id'],
      [envVar: 'APPLE_KEY_FILE_BASE64', vaultKey: 'apple_key_file_base64'],
      [envVar: 'APPLE_ISSUER_ID', vaultKey: 'apple_issuer_id'],
      [envVar: 'APPLE_TEAM_ID', vaultKey: 'apple_team_id'],
      [envVar: 'FIREBASE_SENDER_ID', vaultKey: 'firebase_sender_id'],
      [envVar: 'HMAC_SECRET_KEY', vaultKey: 'hmac_secret_key']
  ]]]
}

def printWithGreen(text) {
  ansiColor('xterm') {
    echo "\u001B[32m=== ${text} ===\u001B[0m"
  }
}

def base64Decode(encodedString){
  byte[] decoded = encodedString.decodeBase64()
  return decoded
}

def getVersionForStores(git_tag){
  def matcher = (git_tag =~ /(?:v)?(\d+\.\d+\.\d+)/)

  if (matcher.find()) {
    return matcher.group(1)
  }

  return null
}
def prepareEnv() {
  withVault([configuration: [engineVersion: 2, timeout: 60, vaultCredentialId: "vault-${PROJECT}-${env.PROJECT_ENV}", vaultUrl: 'https://vault.secret-agents.ru'], vaultSecrets: getSecretsConfig(env.PROJECT_ENV)]) {
    script {
      if (fileExists('.env')) {
          sh 'rm .env'
      }
    }

    sh 'touch .env'
    sh "echo API_URL=\"${API_URL}\" >> .env"
    sh "echo API_KEY=${API_KEY} >> .env"
    sh "echo HMAC_SECRET_KEY=${HMAC_SECRET_KEY} >> .env"
    sh "echo FIREBASE_SENDER_ID=${FIREBASE_SENDER_ID} >> .env"
    
    sh "echo ANDROID_SERVICE_ACCOUNT_JSON_FILE=/app/fastlane/service-account.json >> .env"
    sh "echo ANDROID_KEYSTORE_FILE=/app/fastlane/keystore.jks >> .env"
    sh "echo ANDROID_KEYSTORE_FILE_BASE64=${ANDROID_KEYSTORE_FILE_BASE64} >> .env"
    sh "echo ANDROID_KEYSTORE_PASSWORD=\"${ANDROID_KEYSTORE_PASSWORD}\" >> .env"
    sh "echo ANDROID_KEY_ALIAS=${ANDROID_KEY_ALIAS} >> .env"
    sh "echo ANDROID_KEY_PASSWORD=\"${ANDROID_KEY_PASSWORD}\" >> .env"
    
    sh "echo APPLE_KEY_ID=\"${APPLE_KEY_ID}\" >> .env"
    sh "echo APPLE_ISSUER_ID=\"${APPLE_ISSUER_ID}\" >> .env"
    sh "echo APPLE_TEAM_ID=\"${APPLE_TEAM_ID}\" >> .env"

    sh "echo AMPLITUDE_INIT_KEY=\"${AMPLITUDE_INIT_KEY}\" >> .env"
    sh "echo ENVIRONMENT=${env.PROJECT_ENV} >> .env"
    sh "echo REACTOTRON_URL=0.0.0.0 >> .env"
    sh "echo VERSION=${VERSION} >> .env"

    script {
      writeFile file: 'fastlane/service-account.json', text: new String(base64Decode(env.ANDROID_SERVICE_ACCOUNT_BASE64))
      writeFile file: 'android/app/google-services.json', text: new String(base64Decode(env.ANDROID_GOOGLE_SERVICES_BASE64))
    }

    sh "echo ${env.APPLE_KEY_FILE_BASE64} | base64 --decode > apple_key_file.p8"
    sh "echo ${env.ANDROID_KEYSTORE_FILE_BASE64} | base64 --decode > fastlane/keystore.jks"

    script {
      if (fileExists('fastlane/metadata/android/ru-RU/changelogs/default.txt')) {
        sh 'rm fastlane/metadata/android/ru-RU/changelogs/default.txt'
      }
    }

    sh 'mkdir -p fastlane/metadata/android/ru-RU/changelogs'
    sh 'touch fastlane/metadata/android/ru-RU/changelogs/default.txt'
    sh "echo ${env.PROJECT_ENV} build >> fastlane/metadata/android/ru-RU/changelogs/default.txt"
  }
}
