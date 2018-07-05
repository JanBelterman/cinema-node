const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');
const { validate } = require('../models/movie');

const router = express.Router();

router.get('/', auth, (req, res) => {

    database.query('SELECT * FROM movie', (error, result) => {
        if (error) console.log(error);

        res.status(200).send(result);

    });

});

router.get('/:ID', auth, (req, res) => {

    database.query(`SELECT * FROM movie WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) console.log(error);

        if (!result[0]) return res.status(404).send(`Request terminated: no movie found with ID: ${req.params.ID}`);

        res.status(200).send(result);

    });

});

router.post('/', authManager, (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`INSERT INTO movie SET ?`, req.body, (error, result) => {
        if (error) console.log(error);

        res.status(200).send({
            ID: result.insertId,
            title: req.body.title,
            description: req.body.description,
            runtime: req.body.runtime,
            genreID: req.body.genreID,
            director: req.body.director,
            production: req.body.production,
            releaseDate: req.body.releaseDate,
            rating: req.body.rating,
            imageURL: req.body.imageURL
        })

    });

});

router.put('/:ID', authManager, (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    let movie = {
        ID: req.params.ID,
        title: req.body.title,
        description: req.body.description,
        runtime: req.body.runtime,
        genreID: req.body.genreID,
        director: req.body.director,
        production: req.body.production,
        releaseDate: req.body.releaseDate,
        rating: req.body.rating,
        imageURL: req.body.imageURL
    }

    let sql =
        `UPDATE movie
        SET title = '${movie.title}',
        description = '${movie.description}',
        runtime = ${movie.runtime},
        genreID = ${movie.genreID},
        director = '${movie.director}',
        production = '${movie.production}',
        releaseDate = '${movie.releaseDate}',
        rating = ${movie.rating},
        imageURL = '${movie.imageURL}'
        WHERE ID = ${movie.ID}`;

    database.query(sql, req.body, (error, result) => {
        if (error) console.log(error);

        res.status(200).send(movie);

    });

});

module.exports = router;