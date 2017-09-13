var express = require('express');
var app = express();
var encrypt = require('md5');
var router = express.Router();
var jwt = require('jsonwebtoken');
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
                    res.json({ error: 0, message: "data inserted", data: data })
            })
        }
    })
});
router.post('/login', function(req, res, next) {
    validation.login_validation(req.body, function(err, data) {
        if (err) {
            next(err);
        } else {
            req.fetch.findOne({ username: data.username, password: data.password }, function(err, users_data) {
                if (err) {
                    next(err);
                } else if (data) {
                    var token = jwt.sign({ user_id: users_data._id }, "jwt_tok", {
                        expiresIn: 3600000
                    });
                    res.json({ token: token })
                } else {
                    res.json('Not a user!Get registered')
                }
            });
        }
    });
});
router.get('/user/get/:access_token', function(req, res, next) {
    var token = req.params.access_token;
    validation.validateAccess(req, function(err, data) {
        if (err) {
            next(err);
        } else {
            req.address_collection.find({ user_id: data.user_id }).populate('user_id').exec(function(err, address_data) {
                if (err) {
                    next(err);
                } else if (address_data) {
                    res.json({ error: 0, message: "data found", data: address_data })
                } else {
                    res.json("can't fetch data")
                }
            });
        }
    });
});
router.get('/user/delete/:access_token', function(req, res, next) {
    var token = req.params.access_token;
    validation.validateAccess(req, function(err, data) {
        req.fetch.findOne({ _id: req.params.access_token }, function(err, data) {
            if (err) {
                next(err);
            } else if (data) {
                req.fetch.remove({ "_id": data._id }, function(err, result) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({ error: 0, message: "data deleted", data: data });
                    }
                });
            } else {
                res.json({ error: 0, message: "data not found", data: data });
            }
        });
    });
});
router.get('/user/list/:page/:limit', function(req, res, next) {
    req.params.limit = parseInt(req.params.limit);
    req.fetch.find({}).skip((req.params.page) * req.params.limit).limit(req.params.limit).exec(function(err, data) {
        if (err) {
            next(err);
        } else if (data) {
            res.json(data);
        } else {
            res.json({ error: 0, message: "could not fetch data", data: data })
        }
    });
});
router.post('/user/address/:access_token', function(req, res, next) {
    var token = req.params.access_token;
    validation.validateAccess(req, function(err, access_token_data) {
        if (err) {
            next(err);
        } else {
            validation.validateAddress(req.body, function(err, data) {
                if (err) {
                    next(err);
                } else if (access_token_data) {
                    req.address_collection.findOneAndUpdate({ user_id: access_token_data.user_id }, { $set: { address: data.address, phone_no: data.phone_no } }, function(err, token_data) {
                        if (err) {
                            next(err);
                        } else {
                            if (!token_data) {
                                var userAddress = new req.address_collection({
                                    user_id: data.user_id,
                                    address: data.address,
                                    phone_no: data.phone_no
                                });
                                userAddress.save(function(err, data) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        res.json(data)
                                    }
                                });
                            } else {
                                res.json(token_data)
                            }
                        }
                    });

                } else {
                    res.json("Incorrect Access Token");
                }
            });
        }
    });
});
module.exports = router;