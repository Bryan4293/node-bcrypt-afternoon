const express = require('express');
const session = require('express-session');
const massive = require('massive')
require('dotenv').config()
const app = express();
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware');
const {CONNECTION_STRING, SESSION_SECRET} = process.env;

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('Database Connected (^_^)')
});

app.use(session({
    secret: SESSION_SECRET,
    resave:true,
    saveUninitialized: false
}));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

const PORT = 4000

app.listen(PORT, () =>console.log(`Listening to Port ${PORT}`))