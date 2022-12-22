const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const functions = require('firebase-functions');

const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');
const BCRYPT_SALT_ROUNDS = 12;

const nodemailer = require('nodemailer');

var db;
const url = 'mongodb+srv://testuser:testpass@cluster0.wtnbhkz.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) return console.log(err);
    db = database.db('coaching-chatbot');
});

// create an email transport object
const transporter = nodemailer.createTransport({
    service: 'Zoho',
    auth: {
        user: 'workio.app2@zohomail.com',
        pass: '!_Le7M.rjL5uqTJ'
    }
});

const date = new Date();
const offset = date.getTimezoneOffset();
date.setMinutes(date.getMinutes() - offset + 480);  // Singapore TImezone is 8 hours behind
const currentDate = date.toISOString().substr(0, 10);

// code to fetch email notification schedules and send emails using Nodemailer
exports.sendScheduledEmails = functions.pubsub.schedule('* * * * *').onRun(async () => {
    console.log('sendScheduledEmails function is running');
    // query the database for email notification schedules that are due to be sent
    const schedules = await db.collection("notifications").find({ scheduledTime: { $lte: currentDate } }).toArray();
    // send emails using Nodemailer
    schedules.forEach(async (schedule) => {
        transporter.sendMail({
            from: 'workio.app2@zohomail.com',
            to: schedule.email,
            subject: 'You got a reminder from Workio',
            text: schedule.message
        }, async (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
});

//Authentication
exports.authuser = functions.https.onRequest((req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.collection('users').findOne({ "name": username }, {
        password: 1, role: 1,
        _id: 0
    }, (err, result) => {
        if (result == null) res2.send([{ "auth": false }]);
        else {
            bcrypt.compare(password, result.password, (err, res) => {
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

// create user
exports.reguser = functions.https.onRequest((req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
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
exports.getAllUsers = functions.https.onRequest((req, res) => {
    db.collection('users').find().toArray((err, results) => {
        if (err) return console.log(err);
        console.log(results);
        res.send(results);
    });
});

// get users data by id
exports.getUserById = functions.https.onRequest((req, res) => {
    var userId = req.params._id
    db.collection('users').findOne({ _id: ObjectId(userId) },
        (err, results) => {
            if (err) return console.log(err);
            res.send(results);
        });
});

// delete user based on id
exports.deleteUser = functions.https.onRequest((req, res) => {
    var userId = req.params.userId
    db.collection('users').deleteOne({ userId }, (err,
        results) => {
        res.send(results);
    });
});

//change password
exports.changePassword = functions.https.onRequest((req, res) => {
    var password = req.body.password;
    var userId = req.params._id
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
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
exports.changeEmail = functions.https.onRequest((req, res) => {
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
exports.getAllTasks = functions.https.onRequest((req, res) => {
    db.collection('tasks').find().toArray((err, results) => {
        if (err) return console.log(err);
        console.log(results);
        res.send(results);
    });
});

// retrieve all tasks by userID
exports.getAllTasksByUserId = functions.https.onRequest((req, res) => {
    db.collection('tasks').find({ "userId": req.params.userId }).toArray((err, results) => {
        if (err) return console.log(err);
        res.send(results);
    });
});

// get selected post's data by id
exports.getTaskById = functions.https.onRequest((req, res) => {
    db.collection('tasks').findOne({ "_id": ObjectId(req.params._id) },
        (err, results) => {
            res.send(results);
        });
});

// create task
exports.createTask = functions.https.onRequest(async (req, res) => {
    var title = req.body.title;
    var dueBy = req.body.dueBy;
    var reminder = req.body.reminder;
    var userId = req.body.userId;
    const result = await db.collection('tasks').insertOne({ userId, title, dueBy, reminder });
    res.send({ insertedId: result.insertedId });
});

// delete task based on id
exports.deleteTask = functions.https.onRequest((req, res) => {
    db.collection('tasks').deleteOne({ _id: ObjectId(req.params._id) }, (err,
        results) => {
        res.send(results);
    });
});

// update task based on id
exports.updateTask = functions.https.onRequest((req, res) => {
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
        res.send({ insertedId: result.insertedId });
    });
});

//Notfication
// retrieve all noti
exports.getAllNotifications = functions.https.onRequest((req, res) => {
    db.collection('notifications').find().toArray((err, results) => {
        if (err) return console.log(err);
        console.log(results);
        res.send(results);
    });
});

// get notfication by taskId
exports.getAllNotificationsByTaskId = functions.https.onRequest((req, res) => {
    db.collection('notifications').findOne({ "taskId": req.params.taskId }, (err, results) => {
        if (err) return console.log(err);
        res.send(results);
    });
});

// add a notification
exports.createNotification = functions.https.onRequest((req, res) => {
    var taskId = req.body.taskId;
    var email = req.body.email;
    var message = req.body.message;
    var scheduledTime = req.body.scheduledTime
    db.collection('notifications').insertOne({
        "taskId": taskId, "email": email, "message": message, "scheduledTime": scheduledTime
    }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('notification saved to database')
        res.send(result);
    });
})

// delete noti based on id
exports.deleteNotification = functions.https.onRequest((req, res) => {
    db.collection('notifications').deleteOne({ _id: ObjectId(req.params._id) }, (err,
        results) => {
        if (err) return console.log(err)
        res.send(results);
    });
});

// update notif based on id
exports.UpdateNotification = functions.https.onRequest((req, res) => {
    var taskId = req.body.taskId;
    var email = req.body.email;
    var message = req.body.message;
    var scheduledTime = req.body.scheduledTime
    console.log(req.params + 'notif params')
    console.log(req.body + 'notif body')
    db.collection('notifications').updateOne({ _id: ObjectId(req.params._id) }, {
        $set: { "taskId": taskId, "email": email, "message": message, "scheduledTime": scheduledTime }
    }, (err, result) => {
        if (err) return console.log(err)
        console.log(result)
        console.log('notification updated')
        res.send(result);
    });
});

exports.api = functions.https.onRequest(router);