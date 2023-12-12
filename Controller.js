const Responder = require('./Responder.js');
const db_connection = require('./models/index.js');

class Controller {
    async register(req, res, next) {
        try {
            const { first_name, last_name, age, monthly_income, phone_number } =
                req.body;
            const approved_limit =
                Math.round((36 * monthly_income) / 100000) * 100000;

            const customer = await db_connection.customer_model.create({
                first_name,
                last_name,
                age,
                monthly_salary: monthly_income,
                phone_number,
                approved_limit,
            });

            if (!customer) {
                return Responder.respondWithError(
                    req,
                    res,
                    'Error creating customer'
                );
            }

            let customer_data = {
                customer_id: customer.customer_id,
                name: customer.first_name + ' ' + customer.last_name,
                age: customer.age,
                monthly_income: customer.monthly_salary,
                phone_number: customer.phone_number,
                approved_limit: customer.approved_limit,
            };
            return Responder.respondWithSuccess(
                req,
                res,
                customer_data,
                'Customer created successfully'
            );
        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async check_eligibility(req, res, next) {
        try {
            const { customer_id, loan_amount, interest_rate, tenure } =
                req.body;

            const eligible = await this.check_eligibility_background(
                customer_id,
                loan_amount,
                tenure,
                interest_rate
            );

            let data = {
                customer_id,
                approval: eligible.approval,
                interest_rate: eligible.interest_rate,
                corrected_interest_rate: eligible.corrected_interest_rate,
                tenure,
                monthly_installment: eligible.monthly_installment
            }


            if (eligible.approval===true) {
                return Responder.respondWithSuccess(
                    req,
                    res,
                    { data },
                    'Congratulations! You are eligible for the loan'
                );
            } else {
                data.monthly_installment = 'N/A';
                data.corrected_interest_rate = 'N/A';
                
                return Responder.respondWithSuccess(
                    req,
                    res,
                    { data },
                    'Sorry! You are not eligible for the loan'
                );
            }
        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async create_loan(req, res, next) {
        try {
            const { customer_id, loan_amount, interest_rate, tenure } =
                req.body;

            const eligible = await this.check_eligibility_background(
                customer_id,
                loan_amount,
                tenure,
                interest_rate
            );

            let data = {
                loan_id: null,
                customer_id: customer_id,
                loan_approved: eligible.approval,
                message:"Sorry you are not eligible for this loan",
                monthly_installment: eligible.monthly_installment,
            };
            if (eligible) {
                const loan = await db_connection.customer_loan_model.create({
                    customer_id,
                    loan_amount,
                    interest_rate: eligible.corrected_interest_rate,
                    tenure,
                    monthly_installment: eligible.monthly_installment,
                    start_date: new Date(),
                    end_date: new Date(
                        new Date().setMonth(new Date().getMonth() + tenure)
                    ),
                });

                if (!loan) {
                    return Responder.respondWithError(
                        req,
                        res,
                        'Error creating loan'
                    );
                }

                data.loan_id = loan.loan_id;
                data.message = "Congratulations! Your loan has been approved";

                return Responder.respondWithSuccess(
                    req,
                    res,
                    data,
                    'Loan created successfully'
                );
            } else {
                data.monthly_installment = 'N/A';
                return Responder.respondWithSuccess(
                    req,
                    res,
                    data,
                    'You are not eligible for this loan you can try with some different amount'
                );
            }
        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async view_loan(req, res, next) {
        try {
            const { loan_id } = req.params;

            db_connection.customer_loan_model.hasOne(db_connection.customer_model, {
                sourceKey: 'customer_id',
                foreignKey: 'customer_id',
            });

            const loan = await db_connection.customer_loan_model.findOne({
                where: {
                    loan_id,
                },
                include: [
                    {
                        model: db_connection.customer_model,
                    },
                ],
            });
            console.log(loan);

            if (!loan) {
                return Responder.respondWithError(req, res, 'No loan found');
            }

            let data = {
                loan_id: loan.loan_id,
                customer: {
                    first_name: loan.customer.first_name,
                    last_name: loan.customer.last_name,
                    phone_number: loan.customer.phone_number,
                    age: loan.customer.age,
                },
                loan_amount: loan.loan_amount,
                interest_rate: loan.interest_rate,
                monthly_installment: loan.monthly_payment,
                tenure: loan.tenure,
            };

            return Responder.respondWithSuccess(
                req,
                res,
                data,
                'Loan found successfully'
            );
        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async make_payment(req, res, next) {
        try {
            const { customer_id, loan_id } = req.params;
            const emi = req.body.emi;
            let new_emi_payable;

            const loan = await db_connection.customer_loan_model.findOne({
                where: {
                    customer_id,
                    loan_id,
                },
            });

            if (!loan) {
                return Responder.respondWithError(req, res, 'No loan found');
            }

            if(loan.emi_payable !== 0 || loan.emi_payable !== null){
                if(loan.emi_payable < emi){
                    new_emi_payable = loan.monthly_installment - (emi - loan.emi_payable);
                }
                if(loan.emi_payable > emi){
                    new_emi_payable = loan.monthly_installment + (loan.emi_payable - emi);
                }
                else{
                    new_emi_payable = loan.monthly_installment;
                }
            }
            else {
                if(loan.monthly_installment < emi){
                    new_emi_payable = loan.monthly_installment - (emi - loan.monthly_installment);
                }
                if(loan.monthly_installment > emi){
                    new_emi_payable = loan.monthly_installment + (loan.monthly_installment - emi);
                }
                else{
                    new_emi_payable = loan.monthly_installment;
                }
            }    

            const updated_data = await db_connection.customer_loan_model.update(
                {
                    emi_paid: loan.emi_paid + 1,
                    amount_paid: loan.amount_paid + emi,
                    emi_payable: new_emi_payable,
                },
                {
                    where: {
                        customer_id,
                        loan_id,
                    },
                }
            );
            if(!updated_data){
                return Responder.respondWithError(req, res, 'Error in making payment');
            }

            return Responder.respondWithSuccess(
                req,
                res,
                {emi_payable: new_emi_payable},
                'Payment made successfully'
            );

        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async view_statement(req, res, next) {
        try {
            const { customer_id, loan_id } = req.params;

            const loan = await db_connection.customer_loan_model.findOne({
                where: {
                    customer_id,
                    loan_id,
                },
            });

            if (!loan) {
                return Responder.respondWithError(req, res, 'No loan found');
            }

            let data = {
                customer_id: loan.customer_id,
                loan_id: loan.loan_id,
                principal: loan.loan_amount,
                interest_rate: loan.interest_rate,
                Amount_paid: loan.amount_paid,
                monthly_installment: loan.monthly_payment,
                repayments_left: loan.tenure - loan.emi_paid,
            };

            return Responder.respondWithSuccess(
                req,
                res,
                data,
                'Statement Created successfully'
            );
        } catch (error) {
            console.log(error);
            return Responder.respondWithError(req, res, error);
        }
    }

    async check_eligibility_background(
        customer_id,
        loan_amount,
        tenure,
        interest_rate
    ) {
        try {
            const weightages = {
                emiPaidOnTime: 0.4,
                numberOfLoansTaken: 0.1,
                loanActivityInCurrentYear: 0.2,
                loanApprovedVolume: 0.2,
                currentLoansSum: 0.1,
            };

            const currentYear = new Date().getFullYear();

            const customer = await db_connection.customer_model.findOne({
                where: {
                    customer_id,
                },
            });

            const customer_previous_data =
                await db_connection.customer_loan_data_model.findAll({
                    where: {
                        customer_id,
                    },
                });

            let emiPaidOnTime = 0;
            let loanApprovedVolume = 0;
            let numberOfLoansTaken = 0;
            let loanActivityInCurrentYear = 0;
            let total_emi = 0;
            let approval;
            let corrected_interest_rate;

            for (let data of customer_previous_data) {
                emiPaidOnTime += data.emi_paid_on_time;
                loanApprovedVolume += data.loan_amount;
                numberOfLoansTaken += 1;
                total_emi = data.monthly_payment;

                const loanYear = new Date(data.start_date).getFullYear();
                if (loanYear === currentYear) {
                    loanActivityInCurrentYear += 1;
                }
            }

            let credit_score;
            if (loanApprovedVolume > customer.approved_limit) {
                credit_score = 0;
                approval = false;
            } else {
                credit_score =
                    emiPaidOnTime * weightages.emiPaidOnTime +
                    numberOfLoansTaken * weightages.numberOfLoansTaken +
                    loanActivityInCurrentYear *
                        weightages.loanActivityInCurrentYear +
                    loanApprovedVolume * weightages.loanApprovedVolume +
                    loan_amount * weightages.currentLoansSum;

                credit_score = Math.round(credit_score);
            }

            if (credit_score > 100) {
                credit_score = 100;
            }

            if (credit_score > 50) {
                approval = true;
                corrected_interest_rate = 0;
            } else if (50 >= credit_score && credit_score > 30) {
                approval = true;
                corrected_interest_rate = 12;
            } else if (30 >= credit_score && credit_score > 10) {
                approval = true;
                corrected_interest_rate = 16;
            } else {
                approval = false;
            }

            let amt_to_be_paid =
                loan_amount + loan_amount * (corrected_interest_rate / 100);
            let monthly_installment = amt_to_be_paid / tenure;

            total_emi += monthly_installment;

            if (total_emi > (50 * customer.monthly_salary) / 100) {
                approval = false;
            }

            let eligible;

                eligible = {
                    customer_id,
                    loan_amount,
                    tenure,
                    monthly_installment,
                    approval: true,
                };
                if (approval) {
                eligible.corrected_interest_rate = corrected_interest_rate;
                eligible.interest_rate = interest_rate;
                return eligible;
            } else {
                return eligible.approval = false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
module.exports = new Controller();
