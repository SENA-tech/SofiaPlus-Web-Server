const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

//DataBase
const { connection } = require('../DataBase/Conection.db')

router.get('/create', (req, res) => res.send('user create ENDPOINT'))

router.post('/log', async (req, res) => {
    try {
        const { Type, Identification, Password } = req.body;
        if (Type === '' || Identification === '' || Password === '') {
            res.send({
                ERROR_CODE: 400,
                DESCRIPTION_ERROR: "Campos Incompletos"
            });
        } else {
            let consulta = mysql.format(`SELECT * FROM usersdata WHERE identification = ?`, [Identification])
            connection.query(consulta, (err, results) => {
                const {id,  nombres, type, identification, password } = results[0];
                if (type === Type && identification === Identification && password === Password) {
                    
                } else {
                    res.json(
                        {

                        }
                    )
                }
            })
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/create', async (req, res) => {
    try {
        const { FirstName, SecondName, Identification, Type, Password } = req.body;
        if (FirstName === '' || SecondName === '' || Identification === '' || Type === '' || Password === '') {
            res.send({
                ERROR_CODE: 400,
                DESCRIPTION_ERROR: "Campos Incompletos"
            });
        } else {
            let consulta = mysql.format(`INSERT INTO userdata (nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, [FirstName, SecondName, Type, Identification, Password, 3, 1])
            connection.query(consulta, (err, results) => {
                err ? console.log(err) : console.log(results);
            });
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router