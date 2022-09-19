const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//DataBase
const { connection } = require('../DataBase/Conection.db')

router.post('/search', (req, res) => {
    try {
        const { Query } = req.body;
        console.log(Query);
        if ( Query === '') {
            console.log('Busqueda vacia');
        } else {
            let consulta = mysql.format(`SELECT * FROM courses WHERE nombre LIKE ?`, [`%${Query}%`])
            connection.query(consulta, (err, results) => {
                res.json(
                    results
                )
            })
        }
    } catch (e) {
        console.log(e);
    }
})

router.get('/getter', (req, res) => {
    let consulta = mysql.format(`SELECT * FROM courses`);
    connection.query(consulta, (err, results) => {
        res.json(
            results
        )
    })
})

/* router.post('/create', async (req, res) => {
    try {
        const { FirstName, SecondName, Identification, Type, Password } = req.body;
        if (FirstName === '' || SecondName === '' || Identification === '' || Type === '' || Password === '') {
            res.send({
                ERROR_CODE: 400,
                MESSAGE: "Campos Incompletos"
            });
        } else {
            let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [Identification])
            connection.query(consulta, (err, results) => {
                console.log(results);
                if (results.length === 0) {
                    let consulta = mysql.format(`INSERT INTO userdata (nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, [FirstName, SecondName, Type, Identification, Password, 3, 1])
                    connection.query(consulta, (err, results) => {
                        err ? console.log(err) : res.json(
                            {
                                MESSAGE: "Usuario Generado Exitosamente"
                            }
                        );
                    });
                } else {
                    const { documento, identificacion } = results[0];
                    if (identificacion === parseInt(Identification) && documento === parseInt(Type)) {
                        res.json(
                            {
                                MESSAGE: "Usuario Existente"
                            }
                        )
                    } else {
                        let consulta = mysql.format(`INSERT INTO userdata (nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, [FirstName, SecondName, Type, Identification, Password, 3, 1])
                        connection.query(consulta, (err, results) => {
                            err ? console.log(err) : res.json(
                                {
                                    MESSAGE: "Usuario Generado Exitosamente"
                                }
                            );
                        });
                    }
                }
            })
        }
    } catch (e) {
        console.log(e);
    }
}); */

module.exports = router