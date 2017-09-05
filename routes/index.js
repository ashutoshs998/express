var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var validation = require('./validation');
// var middleware = require("../midleware/middleware.js")
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
            req.fetch.findOne({ username: data.username, password: data.password }, function(err, access_token) {
                if (err) {
                    next(err);
                }
                if(access_token)
                res.json('logged in. access_token: ' + access_token._id)
            else
                res.json('invalid user! Get registered')
            });
        }
    });
});
router.get('/user/get/:access_token', function(req, res, next) {
    var token = req.params.access_token;
    validation.validateAccess(req, function(err, data){
        req.fetch.find({}, function(err, user_data) {
            if (err) {
                next(err);
            }else if (data){
                res.json(user_data)
            }else if(!data) {
                res.json('userdetails not found');
            }
        });
    });
});
router.get('/user/delete/:access_token', function(req, res, next) {
    req.fetch.findOne({ _id: req.params.access_token }, function(err, data) {
        if (err) {
            next(err);
        } else if (data) {
            req.fetch.remove({ "_id": data._id }, function(err, result) {
                if (err) {
                    next(err);
                } else {
                    res.json('data deleted');
                }
            });
        } else {
            res.json('data not found');
        }
    });
});
module.exports = router;
