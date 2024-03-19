require('dotenv').config()

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

// Configurar Swagger UI Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.APP_PORT || 8081;
const host = process.env.APP_HOST || '127.0.0.1';

const router = require('./server/routes/product.routes');

app.use('/api', router);
//levantando server
app.listen(port, host); 

console.log(`Ejecutando servidor en ${host}:${port}`);