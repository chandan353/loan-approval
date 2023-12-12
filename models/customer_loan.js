module.exports = (sequelize, DataTypes) => {
    const customer_loan = sequelize.define('customer_loan',{
        
        loan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        loan_amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        tenure: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        interest_rate: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        monthly_installment: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        emi_paid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        
        amount_paid: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },

        emi_payable: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },

        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
    
    })
    return customer_loan
}