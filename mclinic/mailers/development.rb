config.action_mailer.default_url_options = {
  host: Settings.rails.host,
  port: Settings.rails.port,
  protocol: Settings.rails.protocol
}

config.action_mailer.perform_deliveries = true
config.action_mailer.default charset: 'utf-8'
config.action_mailer.delivery_method = :smtp
config.action_mailer.asset_host = "#{Settings.rails.protocol}://#{Settings.rails.host}:#{Settings.rails.port}"
config.action_mailer.smtp_settings = {
  address: Settings.smtp.address,
  port: Settings.smtp.port,
  user_name: 'MC',
  password: '5fSkzLNrArIANggCfXxUeDBB',
  authentication: :plain,
  enable_starttls_auto: true
}


user = User.create(email: 'naruto@mail.ru', password: 'beta1234', username: 'naruto', card_loyalty_id: 'Staff123456', avatar: '')
User.new(email: 'naruto@mail.ru', password: 'beta1234').save(validate: false)
