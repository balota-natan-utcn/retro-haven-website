var express = require('express');
const { WebSocketServer } = require('ws');
var cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
var app = express();
app.use(cors());
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const imagesFolder = path.join(__dirname, 'images');
app.use('/images', express.static('images'));

let users = require('./db/users.json');
let products = require('./db/products.json');

// 🛠 Save products to file
const saveProductsToFile = () => {
    fs.writeFileSync(path.join(__dirname, 'db/products.json'), JSON.stringify(products, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

app.get('/image', (req, res) => {
    res.json({ src: './banner.jpg' });
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id == productId);
    if (product) {
        return res.json(product);
    }
    return res.status(404).send('Product not found');
});

app.delete('/product/:id', (req, res) => {
    const productId = req.params.id;
    const initialLength = products.length;
    products = products.filter(product => product.id != productId);

    if (products.length < initialLength) {
        saveProductsToFile();
        return res.json(true);
    }
    return res.status(404).send('Product not found');
});

app.post('/auth', (req, res) => {
    const status = req.body.message === 'abc' ? 'OK' : 'NOK';
    res.json({ status });
});

app.post('/products', (req, res) => {
    const product = req.body;
    let updated = false;

    products = products.map(p => {
        if (p.id == product.id) {
            updated = true;
            return product;
        }
        return p;
    });

    if (!updated) {
        return res.status(404).send('Product not found');
    }

    saveProductsToFile();
    return res.json(product);
});

app.put('/products', (req, res) => {
    const product = req.body;
    const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
    const newProduct = { ...product, id: maxId + 1 };
    products.push(newProduct);
    saveProductsToFile();
    return res.json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = +req.params.id;
    const updatedProduct = req.body;

    let index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).send('Product not found');
    }

    products[index] = updatedProduct;
    saveProductsToFile();
    return res.json(updatedProduct);
});

app.get('/daily-commits', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const gitCommand = `git log --since="${today} 00:00" --until="${today} 23:59" --oneline -- "../" | wc -l`;

    exec(gitCommand, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error('Git command error:', error || stderr);
            return res.status(500).json({ error: 'Failed to retrieve commit count' });
        }

        const commitCount = parseInt(stdout.trim());
        res.json({
            date: today,
            commitCount,
            directory: 'parent folder'
        });
    });
});

const server = app.listen(3100, () => {
    console.log('Server running @ http://localhost:3100');
});

/* Web sockets */
const clients = new Map();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    console.log('Client connected');
    clients.set(ws, {
        ip: req.socket.remoteAddress,
        connectedAt: new Date()
    });

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`ACK: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});
