const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//DataBase
const { connection } = require('../DataBase/Conection.db')

router.post('/search', (req, res) => {
    try {
        const { Query } = req.body;
        console.log(Query);
        if (Query === '') {
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

router.post('/create', async (req, res) => {
    try {
        const { _permission, _code, name, teacher, type, image, description, requirements, skills, start, end, duration } = req.body;
        console.log(name, teacher, type, image, description, requirements, skills, start, end, duration);
        if (name === '' || teacher === '' || type === '' || image === '' || description === '' || requirements === '' || skills === '' || start === '' || end == '' || duration === '') {
            res.send({
                CODE: 400,
                MESSAGE: "Campos Incompletos"
            });
            res.status(400)
        } else {
            let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [_code])
            connection.query(consulta, (err, results) => {
                if (results[0].identificacion === _code && results[0].permisos === _permission) {
                    let consulta = mysql.format(`INSERT INTO courses ( nombre, instructor, tipo, image, descripcion, requisitos, habilidades, inicio, fin, duracion, estado) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`, [name, teacher, type, image, description, requirements, skills, start, end, duration])
                    connection.query(consulta, (err, results) => {
                        err ? console.log(err) : res.json({
                            CODE: 200,
                            MESSAGE: "Curso Creado Exitosamente"
                        });
                    })
                } else {
                    res.json({
                        CODE: 400,
                        MESSAGE: "Solicitud no aprobada"
                    });
                }
            })


        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router