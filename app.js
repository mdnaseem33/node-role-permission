const express= require('express');
require('module-alias/register');
const bodyParser = require('body-parser');
const session= require('express-session');
require('dotenv').config();
var MongoDBStore = require('connect-mongodb-session')(session);
const connectDB = require("@utils/mongodb.js")
const app= express();
var flash = require('connect-flash');
require('ejs');
// Connect to MongoDB
connectDB();
const port= process.env.PORT || 8080;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var store = new MongoDBStore({
	uri: process.env.MONGO
  });
app.use(session({
	key: process.env.SESSION_KEY,
	secret: process.env.SESSION_SECRET,
	store: store,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(flash());
// Middleware to handle errors
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
  });

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(require('./app/middleware/change-response'));
app.use("/", require("./routes/web"));

app.use('/api', require("./routes/api"));

const server = app.listen(port, () => {
    console.log(`listensing on port ${port}`);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.error('Unhandled Rejection:', err);
});
