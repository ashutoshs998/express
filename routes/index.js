var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var validation = require('./validation');
var MongoClient = require('mongodb').MongoClient;
router.post('/register', function(req, res, next) {
    validation.register_validation(req.body, function(err, data) {
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
router.post('/login', function(req, res, next) {
    validation.login_validation(req.body, function(err, data) {
        if (err) {
            next(err);
        } else {
            req.fetch.findOne({ username: data.username, password: data.password }, function(err, token) {
                if (err) {
                    next(err);
                }
                if(token)
                res.json('logged in! access token: ' + token._id)
            else
                res.json('invalid user! Get registered')
            });
        }
    });
});
module.exports = router;
