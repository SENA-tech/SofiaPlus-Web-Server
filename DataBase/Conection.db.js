const mysql = require('mysql2');
// create the connection
const connection = mysql.createConnection(
    {
        host: 'buyt7bnf1x5ns42ibpvr-mysql.services.clever-cloud.com',
        user: 'ulmaiqqfzunpzdbd',
        password: 'bJKWmhV0Gj7MlvX6TiYY',
        database: 'buyt7bnf1x5ns42ibpvr'
    }
);

setInterval(() => {
    connection.query('SELECT * FROM userdata', (err, results) => {
        console.log('data');
    });
}, 40000)

module.exports = { connection }