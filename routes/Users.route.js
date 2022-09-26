const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//DataBase
const { connection } = require('../DataBase/Conection.db')

router.post('/data', (req, res) => {
    const { _key } = req.body;
    let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [_key]);
    connection.query(consulta, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            if (results.length === 0) {
                res.json({
                    _id: 'indefinidio',
                    _name: 'Usuario',
                    _lastName: 'No Encontrado',
                    _type: 'Indefinido',
                })
            } else {
                res.json({
                    _id: results[0].identificacion,
                    _name: results[0].nombres,
                    _lastName: results[0].apellidos,
                    _type: results[0].documento === 1 ? 'Cedula de Ciudadania' : results[0].documento === 2 ? 'Tarjeta de Identidad' : 'Cedula de Extranjeria',
                    _profileimage: results[0].imagen
                })
            }
        }
    })
})

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
                if (err) {
                    console.log(err)
                } else {
                    console.log(results[0]);
                    const { imagen, nombres, documento, identificacion, password, permisos } = results[0];
                    if (documento === parseInt(Type) && identificacion === parseInt(Identification) && password === Password) {
                        res.json(
                            {
                                CODE: 200,
                                _name: nombres,
                                _key: identificacion,
                                _permissions: permisos,
                                _profileimage: imagen
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
                }
            })
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/create', async (req, res) => {
    try {
        const { FirstName, SecondName, Identification, Type, Password, Image } = req.body;
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
                    if (Image == '') {
                        let consulta = mysql.format(`INSERT INTO userdata ( imagen, nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [null, FirstName, SecondName, Type, Identification, Password, 3, 1])
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
                        let consulta = mysql.format(`INSERT INTO userdata ( imagen, nombres, apellidos, documento, identificacion, password, permisos, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [Image, FirstName, SecondName, Type, Identification, Password, 3, 1])
                        connection.query(consulta, (err, results) => {
                            err ? console.log(err) : res.json(
                                {
                                    CODE: 201,
                                    MESSAGE: "Usuario Generado Exitosamente"
                                }
                            );
                            res.status(201)
                        })
                    }
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