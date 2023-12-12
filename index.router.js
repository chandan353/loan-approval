const Controller = require("./Controller");
const express = require('express');
const ValidationRules = require('./ValidationRules.js')
const Responder = require('./Responder.js')
const router = express.Router()

router.post('/register',
    [   
        ValidationRules.requiredStringWithMinLength('first_name',3),
        ValidationRules.requiredStringWithMinLength('last_name',3),
        ValidationRules.requiredNumber('age'),
        ValidationRules.requiredNumber('monthly_income'),
        ValidationRules.requiredNumWithMinAndMaxLength('phone_number',10,10)
    ],
    Responder.validate.bind(Responder),
    Controller.register.bind(Controller))


router.post('/check-eligibility',
    [
        ValidationRules.requiredNumber('customer_id'),
        ValidationRules.requiredFloat('loan_amount'),
        ValidationRules.requiredFloat('interest_rate'),
        ValidationRules.requiredNumber('tenure')
    ],
    Responder.validate.bind(Responder),
    Controller.check_eligibility.bind(Controller))


router.post('/create-loan',
    [
        ValidationRules.requiredNumber('customer_id'),
        ValidationRules.requiredFloat('loan_amount'),
        ValidationRules.requiredFloat('interest_rate'),
        ValidationRules.requiredNumber('tenure')
    ],
    Responder.validate.bind(Responder),
    Controller.create_loan.bind(Controller))


router.get('/view-loan/:loan_id',
    [
        ValidationRules.requiredNumberInParam('loan_id')
    ],
    Responder.validate.bind(Responder),
    Controller.view_loan.bind(Controller))


router.get('/make-payment/:customer_id/:loan_id',
    [
        ValidationRules.requiredNumberInParam('customer_id'),
        ValidationRules.requiredNumberInParam('loan_id'),
        ValidationRules.requiredFloat('emi')
    ],
    Responder.validate.bind(Responder),
    Controller.make_payment.bind(Controller))


router.get('/view-statement/:customer_id/:loan_id',
    [
        ValidationRules.requiredNumberInParam('customer_id'),
        ValidationRules.requiredNumberInParam('loan_id')
    ],
    Responder.validate.bind(Responder),
    Controller.view_statement.bind(Controller))



module.exports = router

