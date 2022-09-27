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
            connection.query(`SELECT * FROM courses`, (err, results) => {
                res.json(
                    results
                )
            })
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

router.post('/delete', (req, res) => {
    const { courseId } = req.body;
    let consulta = mysql.format(`DELETE FROM courses WHERE id = ?`, [courseId])
    connection.query(consulta, (err, results) => {
        err ? console.log(err) : res.json(
            results
        )
    })
})

router.get('/getter', (req, res) => {
    connection.query(`SELECT * FROM courses`, (err, results) => {
        res.json(results)
    })
})

router.post('/select', (req, res) => {
    const { _token, _key } = req.body;
    let consulta = mysql.format(`SELECT * FROM courses WHERE id = ?`, [_token]);
    connection.query(consulta, (err, results) => {
        if (err && results.length === 0) {
            console.log(err);
        } else {
            let consulta = mysql.format(`SELECT * FROM userdata WHERE id = ?`, [_key]);
            connection.query(consulta, (err, results) => {
                if (err && results.length === 0) {
                    console.log('hubo un error');
                } else {
                    let consulta = mysql.format(`INSERT INTO inscriptions (usuario, curso, estado) VALUES (?, ?, ?)`, [_key, parseInt(_token), 1])
                    connection.query(consulta, (err, results) => {
                        err ? console.log(err) : res.json(results)
                    })
                }
            })
        }
    })
})

router.post('/filter', (req, res) => {
    const { Query } = req.body;
    let consulta = mysql.format(`SELECT * FROM courses WHERE tipo = ?`, [Query]);
    connection.query(consulta, (err, results) => {
        if (err && results.length === 0) {
            console.log(err);
        } else {
            res.json(
                results
            )
        }
    })
})

router.post('/create', async (req, res) => {
    try {
        const { _permission, _code, name, teacher, type, image, description, requirements, skills, start, end, duration } = req.body;
        console.log(name, teacher, type, image, description, requirements, skills, start, end, duration);
        if (name === '' || teacher === '' || type === '' || description === '' || requirements === '' || skills === '' || start === '' || end == '' || duration === '') {
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

router.post('/edit', (req, res) => {
    try {
        console.log('edit route complete');
        const { _permission, _code, id, name, teacher, type, image, description, requirements, skills, start, end, duration } = req.body;
        console.log(name, teacher, type, image, description, requirements, skills, start, end, duration);
        if (name === '' || teacher === '' || type === '' || description === '' || requirements === '' || skills === '' || start === '' || end == '' || duration === '') {
            res.send({
                CODE: 400,
                MESSAGE: "Campos Incompletos"
            });
            res.status(400)
        } else {
            let consulta = mysql.format(`SELECT * FROM userdata WHERE identificacion = ?`, [_code])
            connection.query(consulta, (err, results) => {
                if (results[0].identificacion === _code && results[0].permisos === _permission) {
                    let consulta = mysql.format(`SELECT * FROM courses WHERE id = ?`, [id])
                    connection.query(consulta, (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let consulta = mysql.format(`UPDATE courses SET nombre = ?, instructor = ?, tipo = ?, image = ?, descripcion = ?, requisitos = ?, habilidades = ?, inicio = ?, fin = ?, duracion = ? WHERE id = ?`, [name, teacher, type, image, description, requirements, skills, start, end, duration, id])
                            connection.query(consulta, (err, results) => {
                                err ? console.log(err) : res.json({
                                    CODE: 200,
                                    MESSAGE: "Curso Editado Exitosamente"
                                });
                            })
                        }
                    })
                }
            })
        }
    } catch (e) {
        res.json({
            CODE: 400,
            MESSAGE: "Solicitud no aprobada"
        });
        console.log(e);
    }
});

router.post('/getter', (req, res) => {
    const { key_user } = req.body;
    let consulta = mysql.format(`SELECT curso FROM inscriptions WHERE usuario = ?`, [key_user])
    connection.query(consulta, (err, results) => {
        let cursos_obtenidos = [];
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            let consulta = mysql.format(`SELECT * FROM courses WHERE id = ?`, [element.curso])
            connection.query(consulta, (err, results) => {
                cursos_obtenidos = [...cursos_obtenidos, results[0]]
            })
        }
        setTimeout(() => res.json(cursos_obtenidos), 3000)
    })
})

module.exports = router