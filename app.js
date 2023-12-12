const express = require('express');
require('dotenv').config()
const indexRouter = require('./index.router.js')
const db_connection = require('./models/index.js')
const Responder = require('./Responder.js')
const BodyParser = require('body-parser')	



const app = express();

db_connection.init();

app.use(BodyParser.json())
app.use('/',indexRouter)


app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res) {
	const error = req.app.get('env') === 'development' ? err : {}
	if (error) return Responder.respondWithNotFound(req, res, error)
})

/* PORT and listening app */
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server started on port [${port}] - http://localhost:${port}`);
});