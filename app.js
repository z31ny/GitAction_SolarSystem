const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const promClient = require('prom-client');

const app = express();

// --- Prometheus setup ---
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics(); // Automatically collects default metrics (CPU, memory, event loop, etc.)

// Optional: custom counter example
const requestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// Middleware to count requests
app.use((req, res, next) => {
    res.on('finish', () => {
        requestCounter.labels(req.method, req.path, res.statusCode).inc();
    });
    next();
});

// --- Middlewares ---
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("MongoDB connection error: " + err)
    } else {
        console.log("MongoDB Connection Successful")
    }
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// --- Routes ---
app.post('/planet', (req, res) => {
    planetModel.findOne({ id: req.body.id }, (err, planetData) => {
        if (err || !planetData) {
            res.status(400).send("Error: Invalid Planet ID");
        } else {
            res.send(planetData);
        }
    });
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', (req, res) => {
    res.json({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV || "development"
    });
});

app.get('/live', (req, res) => {
    res.json({ "status": "live" });
});

app.get('/ready', (req, res) => {
    res.json({ "status": "ready" });
});

// --- Prometheus metrics endpoint ---
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server successfully running on port - ${PORT}`);
});

module.exports = app;
