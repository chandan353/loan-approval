const { body, param } = require('express-validator')

class ValidationRules {

	requiredStringWithMinLength(field,min) {
		return body(field)
			.exists()
			.withMessage(`${field} is required`)
			.isString()
			.withMessage(`${field} must be a string`)
			.isLength({
				min,
			})
			.withMessage(`${field} must be minimum ${min} characters`)
	}

    requiredNumber(field) {
		return body(field)
			.exists()
			.withMessage(`${field} is required`)
			.isNumeric()
			.withMessage(`${field} must be a number`)
	}

    requiredNumWithMinAndMaxLength(field, min, max) {
		return body(field)
			.exists()
			.withMessage(`${field} is required`)
			.isNumeric()
			.withMessage(`${field} must be a number`)
			.isLength({
				min,
				max,
			})
			.withMessage(`${field} must be between ${min} and ${max}`)
	}

    requiredFloat(field) {
        return body(field)
        .exists()
        .withMessage(`${field} is required`)
		.isNumeric()
        .isFloat()
        .withMessage(`${field} must be a float value`)
    }

	requiredNumberInParam(field) {
		return param(field)
			.exists()
			.withMessage(`${field} is required`)
			.isNumeric()
			.withMessage(`${field} must be a number`)
	}
}
module.exports = new ValidationRules()