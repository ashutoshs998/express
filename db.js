module.exports = function() {
    var mongoose = require('mongoose');
    var http = require('http');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    mongoose.Promise = global.Promise;
    var conn = mongoose.connect('mongodb://localhost/user_details_db');
    var user_details = mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    }, {
        collection: 'user_details',
        strict: true
    });
    var access_detail = mongoose.Schema({
        user_id: { type: String, required: true },
        access_token: { type: String, required: true },
        expiry: { type: String, required: true },
    }, {
        collection: 'access_token',
        strict: true
    });
    var user_address = mongoose.Schema({
        user_id: { type: String, required: true, ref: "get_data" },
        address: [{
            city: String,
            state: String,
            pin_code: Number
        }],
        phone_no: Number
    }, {
        collection: 'address',
        strict: true
    });
    var get_data = conn.model("get_data", user_details);
    var access_token_model = conn.model('access_token', access_detail);
    var user_address_model = conn.model('user_address_model', user_address);
    return function(req, res, next) {
        req.fetch = get_data;
        req.access_token_collection = access_token_model;
        req.address_collection = user_address_model;
        next();
    }
}