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

//Authentication
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
                    let payload = { userId: result._id, email: result.email, username: result.name, role: result.role };
                    let token = jwt.sign(payload, "secretkey", { expiresIn: '2h' });
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

//User
// retrieve all users 
router.route('/users').get(function (req, res) {
    db.collection('users').find().toArray(function (err, results) {
        if (err) return console.log(err);
        console.log(results);
        res.send(results);
    });
});

// get users data by id
router.route('/users/:_id').get(function (req, res) {
    var userId = req.params._id
    db.collection('users').findOne({ _id: ObjectId(userId) },
        (err, results) => {
            if (err) return console.log(err);
            res.send(results);
        });
});

// delete user based on id
router.route('/users/:_id').delete(function (req, res) {
    var userId = req.params.userId
    db.collection('users').deleteOne({ userId }, (err,
        results) => {
        res.send(results);
    });
});

//change password
router.route('/users/passwordreset/:_id').put(function (req, res) {
    var password = req.body.password;
    var userId = req.params._id
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.collection('users').updateOne({ _id: ObjectId(userId) }, {
            $set: { "password": hash }
        }, (err, result) => {
            if (err) return console.log(err)
            console.log(result)
            console.log('password changed')
            res.send(result);
        });
    });
})

//change email
router.route('/users/emailreset/:_id').put(function (req, res) {
    var email = req.body.email;
    var userId = req.params._id
    db.collection('users').updateOne({ _id: ObjectId(userId) }, {
        $set: { "email": email }
    }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('email changed')
        res.send(result);
    });
});


//To-Do
// retrieve all tasks
router.route('/tasks').get(function (req, res) {
    db.collection('tasks').find().toArray(function (err, results) {
        if (err) return console.log(err);
        console.log(results);
        res.send(results);
    });
});

// retrieve all tasks by userID
router.route('/tasks/user/:userid').get(function (req, res) {
    db.collection('tasks').find({ "userId": req.params.userid }).toArray(function (err, results) {
        if (err) return console.log(err);
        res.send(results);
    });
});

// get selected post's data by id
router.route('/tasks/:_id').get(function (req, res) {
    db.collection('tasks').findOne({ "_id": ObjectId(req.params._id) },
        (err, results) => {
            res.send(results);
        });
});

// add a task
router.route('/tasks').post(function (req, res) {
    var title = req.body.title;
    var dueBy = req.body.dueBy;
    var reminder = req.body.reminder;
    var userId = req.body.userId;
    db.collection('tasks').insertOne({
        "userId": userId, "title": title, "dueBy": dueBy,
        "reminder": reminder
    }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('task saved to database')
        res.send(result);
    });

})

// delete task based on id
router.route('/tasks/:_id').delete(function (req, res) {
    db.collection('tasks').deleteOne({ _id: ObjectId(req.params._id) }, (err,
        results) => {
        res.send(results);
    });
});

// update task based on id
router.route('/tasks/:_id').put(function (req, res) {
    var taskId = req.params._id
    var userId = req.body.userId
    var title = req.body.title
    var dueBy = req.body.dueBy
    var reminder = req.body.reminder
    console.log(req.params)
    console.log(req.body)
    db.collection('tasks').updateOne({ _id: ObjectId(taskId) }, {
        $set: { "userId": userId, "title": title, "dueBy": dueBy, "reminder": reminder }
    }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('task updated')
        res.send(result);
    });
});

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