var encrypt = require('md5');
module.exports = function(body, callback) {
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
};
