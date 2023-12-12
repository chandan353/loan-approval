module.exports = (sequelize, DataTypes) => { 
    const customer = sequelize.define('customer',{
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        monthly_salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },

        approved_limit: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return customer
}