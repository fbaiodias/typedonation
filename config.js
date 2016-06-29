const pack = require('./package')

const config = {
  target: 10000
}

config.hapi = {
  port: process.env.PORT || 8000
}

config.sequelize = {
  url: process.env.DATABASE_URL || 'postgres:///typedonation'
}

config.swagger = {
  basePath: config.url,
  info: {
    title: pack.name,
    description: pack.description
  }
}

module.exports = config
