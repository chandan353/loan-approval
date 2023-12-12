const xlsx = require('xlsx');
const mysql = require('mysql');

const workbook = xlsx.readFile('loan_data.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'alemeno',
    auth_plugin: 'mysql_native_password'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    data.forEach((row) => {
        console.log(row);
        row.created_at = new Date();
        row.updated_at = new Date();
        const sql = 'INSERT INTO customer_loan_data SET ?';
        connection.query(sql, row, (err, result) => {
            if (err) throw err;
            console.log('Row inserted');
        });
    });
});
