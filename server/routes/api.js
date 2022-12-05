const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const BCRYPT_SALT_ROUNDS = 12;

// declare axios for making http requests
const axios = require('axios');
var db;

MongoClient.connect('mongodb+srv://testuser:testpass@cluster0.wtnbhkz.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) return console.log(err);
    db = database.db('coaching-chatbot');
});

router.route('/authuser').post(function (req, res2) {
    var username = req.body.username;
    var password = req.body.password;
    db.collection('users').findOne({ "name": username }, {
        password: 1, role: 1,
        _id: 0
    }, function (err, result) {
        if (result == null) res2.send([{ "auth": false }]);
        else {
            bcrypt.compare(password, result.password, function (err, res) {
                if (err || res == false) {
                    res2.send([{ "auth": false }]);
                } else {
                    console.log(result)
                    let payload = { userId: result._id, username: result.name, role: result.role };
                    let token = jwt.sign(payload, "secretkey", {expiresIn: '2h'});
                    res2.send([{ "auth": true, "role": result.role, "token": token }]);
                    console.log(token)
                }
            });
        }
    });
});
router.route('/reguser').post(function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.collection('users').insertOne({
            "name": username, "email": email, "password": hash,
            "role": role
        }, (err, result) => {
            if (err) return console.log(err)
            console.log(result)
            console.log('user registered')
            res.send(result);
        });
    });
})

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
        return res.status(401).send("Unauthorized request");
    }
    let payload = jwt.verify(token, "secretkey");
    if (!payload) {
        return res.status(401).send("Unauthorized request");
    }
    req.userId = payload.userId;

    next();
}

module.exports = router;