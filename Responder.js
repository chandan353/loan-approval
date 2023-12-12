let { validationResult } = require('express-validator')

class Responder {
	respondWithSuccess(req, res, data, message = '') {
		res.status(200)
		return this.respond(req, res, 1, message, data)
	}

	respondWithError(req, res, error) {
		res.status(500)
		return this.respond(req, res, 0, 'Something went wrong' + ' | ' + error.toString())
	}

	respondWithValidationError(req, res, errors, msg = 'validation failed') {
		res.status(422)
		return this.respond(req, res, 0, msg, errors)
	}

	respondWithNotFound(req, res, msg = 'Data not found') {
		res.status(404)
		return this.respond(req, res, 0, msg)
	}

    respond(req, res, status, message, data) {
		if (status)
			return res.json({
				status,
				data,
				message,
			})
		else
			return res.json({
				status,
				message,
				error: data,
			})
	}

	validate(req, res, next) {
		const errors = validationResult(req).formatWith(({ msg }) => {
			return msg
		})
		if (!errors.isEmpty()) {
			return this.respondWithValidationError(req, res, errors.mapped())
		}
		next()
	}
}

module.exports = new Responder()
