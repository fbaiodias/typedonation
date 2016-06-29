'use strict'

const Joi = require('joi')
const config = require('../../config')

const routes = []

routes.push({
  method: 'POST',
  path: '/',
  config: {
    tags: ['api'],
    validate: {
      payload: Joi.object().keys({
        form_response: Joi.object().keys({
          form_id: Joi.string().required(),
          submitted_at: Joi.string().required(),
          answers: Joi.array()
        }).unknown().required()
      }).unknown()
    },
    pre: [
      { method: 'responses.create(payload.form_response)', assign: 'response' }
    ],
    handler: function (request, reply) {
      console.log(JSON.stringify(request.pre.response, null, 2))
      reply()
    },
    description: 'Typeform webhook endpoint'
  }
})

routes.push({
  method: 'GET',
  path: '/',
  config: {
    tags: ['api'],
    pre: [
      { method: 'responses.list()', assign: 'responses' }
    ],
    handler: function (request, reply) {
      let current = 0
      let contributors = []
      request.pre.responses.forEach((res) => {
        res.answers.forEach((a) => {
          if (a.type === 'number') {
            current += a.number
            return
          }

          contributors.push({ name: a.text })
        })
      })

      reply.view('index', {
        target: config.target,
        current: current,
        contributors: contributors,
        percentage: (100 * current / config.target)
      })
    },
    description: 'Lists saved responses'
  }
})

module.exports = routes
