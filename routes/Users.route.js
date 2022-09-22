const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//DataBase
const { connection } = require('../DataBase/Conection.db')

router.get('/create', (req, res) => res.send('user create ENDPOINT'))

router.post('/log', async (req, res) => {
    try {
        const { Type, Identification, Password } = req.body;
        if (Type === '' || Identification === '' || Password === '') {
            res.send({
                CODE: 400,
                MESSAGE: "Campos Incompletos"
            });
            res.status(400)
        } else {
            console.log(parseInt(Type), parseInt(Identification), Password);
            let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [Identification])
            connection.query(consulta, (err, results) => {
                console.log(results[0]);
                const { id, nombres, documento, identificacion, password, permisos } = results[0];
                if (documento === parseInt(Type) && identificacion === parseInt(Identification) && password === Password) {
                    res.json(
                        {
                            CODE: 200,
                            _name: nombres,
                            _key: identificacion,
                            _permissions: permisos
                        }
                    )
                    res.status(200)
                } else {
                    res.json(
                        {
                            CODE: 400,
                            MESSAGE: "Logueo Erroneo, intentelo nuevamente"
                        }
                    )
                    res.status(400)
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
                CODE: 400,
                MESSAGE: "Campos Incompletos"
            });
            res.status(400)
        } else {
            let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [Identification])
            connection.query(consulta, (err, results) => {
                if (results.length === 0) {
                    let consulta = mysql.format(`INSERT INTO userdata (nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, [FirstName, SecondName, Type, Identification, Password, 3, 1])
                    connection.query(consulta, (err, results) => {
                        err ? console.log(err) : res.json(
                            {
                                CODE: 201,
                                MESSAGE: "Usuario Generado Exitosamente"
                            }
                        );
                        res.status(201)
                    });
                } else {
                    const { documento, identificacion } = results[0];
                    if (identificacion === parseInt(Identification) && documento === parseInt(Type)) {
                        res.json(
                            {
                                CODE: 304,
                                MESSAGE: "Usuario Existente"
                            }
                        )
                        res.status(304)
                    } else {
                        let consulta = mysql.format(`INSERT INTO userdata (nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, [FirstName, SecondName, Type, Identification, Password, 3, 1])
                        connection.query(consulta, (err, results) => {
                            err ? console.log(err) : res.json(
                                {
                                    CODE: 200,
                                    MESSAGE: "Usuario Generado Exitosamente"
                                }
                            );
                            res.status(200)
                        });
                    }
                }
            })
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router