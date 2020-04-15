const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const app = express();

// built-in middleware
app.use(express.json());
// 3rd party
app.use(helmet());
// app.use(morgan('dev'));

//custom from function below
app.use(methodLogger);
app.use(addName);
app.use(lockout);

app.use('/api/hubs', hubsRouter);

app.get('/', (req, res) => {
	const nameInsert = req.name ? ` ${req.name}` : '';

	res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

//custom middleware functions

function methodLogger(req, res, next) {
	console.log(`${req.method} Request`);
	next();
}

function addName(req, res, next) {
	req.name = req.name || 'Rufus';
	next();
}

// function lockout(req, res, next) {
// 	res.status(403).json({ message: 'api lockout in force' });
// }

function lockout(req, res, next) {
	var d = new Date().getSeconds();
	if (d % 2 !== 0) {
		res.status(403).send('api lockout in force');
	}
	next();
}
module.exports = app;
