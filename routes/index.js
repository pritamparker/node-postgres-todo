var swaggerJSDoc = require('swagger-jsdoc');
var express = require('express');
var router = express.Router();
var config = require(__dirname + '/../config.js')
const pg = require('pg');
const path = require('path');
const connectionString = config.connectionString;

router.get('/',(req,res,next)=>{
  res.send("Welcome to todo API");
});
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'node-postgres-todo API',
    version: '1.0.0',
    description: 'A web app for todo application using node and postgres',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

/**
 * @swagger
 * definition:
 *   todo:
 *     properties:
 *       id:
 *         type: integer
 *       text:
 *         type: string
 *       complete:
 *         type: boolean
 */
/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     tags:
 *       - todo
 *     description: Returns all todo lists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of list
 *         schema:
 *           $ref: '#/definitions/todo'
 */
 /* GET home page. */
router.get('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     tags:
 *       - todo
 *     description: Creates a new todo list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: todo list
 *         description: id of todo list
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/todo'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
 /**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     tags: todo
 *     description: Updates a single todo list
 *     produces: application/json
 *     parameters:
 *       name: todo
 *       description: Fields for the todo resource
 *       in: body
 *       schema:
 *         type: array
 *         $ref: '#/definitions/todo'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     tags:
 *       - todo
 *     description: Deletes a single todo list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: todo's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
// serve swagger
router.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
module.exports = router;
