var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var validation = require('./validation');
var MongoClient = require('mongodb').MongoClient;
router.post('/form', function(req, res, next) {
    validation(req.body, function(err, data) {
        if (err) {
            res.status(400).json(err);
        } else {

            var detail = new req.fetch({
                username: data.username,
                email: data.email,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname
            })
            detail.save(function(err, data) {
                if (err) {
                    res.status(400).json(err.message);
                } else
                    res.json('Data Inserted')
            })
        }
    })
});
module.exports = router;
