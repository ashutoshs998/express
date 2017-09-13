var encrypt = require('md5');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
module.exports = {
    register_validation: function(body, callback) {
        var valid_mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (body.username == null || body.username == "")
            callback("empty username!!", "");
        else if (!(body.email.match(valid_mail)))
            callback("invalid email address!", "");
        else if (body.email == null || body.email == "")
            callback("empty email!!", "");
        else if (body.password == null || body.password == "")
            callback("enter password!!", "");
        else if (body.con_password == null || body.con_password == "")
            callback("empty confirm password!!", "");
        else if (!(encrypt(body.password) == encrypt(body.con_password)))
            callback("You have entered passwords do not match !", "");
        else if (body.firstname == null || body.firstname == "")
            callback("empty firstname!!", "");
        else if (body.lastname == null || body.lastname == "")
            callback("empty lastname!!", "");
        else {
            body.password = encrypt(body.password);
            callback("", body);
        }
    },
    login_validation: function(body, callback) {
        if (body.username == "")
            callback("empty username!", "");
        else if (body.password == "")
            callback("empty password!", "");
        else {
            body.password = encrypt(body.password);
            callback("", body);
        }
    },
    validateAccess: function(req, callback) {
        jwt.verify(req.params.access_token, jwt_tok, function(err, access_token_data) {
            if (err) {
                next(err);
            } else {
                callback("", access_token_data);
            }
        });
    },
    validateAddress: function(body, callback) {
        if (body.user_id == null || body.user_id == "") {
            callback("enter user id", "");
        } else if (body.phone_no == null || body.phone_no == "") {
            callback("enter phone no", "");
        } else if (body.address.length) {
            _.forEach(body.address, function(data, key) {
                if (data.city == null || data.city == "") {
                    callback("enter city", "");
                } else if (data.state == null || data.state == "") {
                    callback("enter state", "");
                } else if (data.pin_code == null || data.pin_code == "") {
                    callback("enter pin_code", "");
                } else if (body.address.length == (key + 1)) {
                    callback("", body);
                }
            });
        } else {
            callback("enter address", null)
        }
    }
};