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

module.exports = { connection }