module.exports = (sequelize, DataTypes) => {
    const customer_loan_data = sequelize.define('customer_loan_data',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        loan_id: {
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

        monthly_payment: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        emi_paid_on_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        start_date: {
            type: DataTypes.STRING,
            allowNull: false
        },

        end_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
    })
    return customer_loan_data
}
