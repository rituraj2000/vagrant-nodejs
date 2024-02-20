const http = require('http');
const os = require('os');

const hostname = '0.0.0.0'; 
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        healthCheck(res);
    } else if (req.url === '/') {
        systemDetails(res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

async function healthCheck(res) {
    try {
        // Use os.freemem() and os.totalmem() for disk space
        const diskSpace = {
            free: os.freemem(),
            total: os.totalmem()
        };

        const healthData = {
            status: 'OK 👍',
            uptime: process.uptime(),
            memory: {
                free: os.freemem(),
                total: os.totalmem()
            },
            cpuUsage: process.cpuUsage(),
            disk: diskSpace // Use the object we created
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(healthData, null, 2));

    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ERROR', message: error.message }));
    }
}

function systemDetails(res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const details = {
        uptime: os.uptime(), // Uptime in seconds
        osType: os.type(),
        osPlatform: os.platform(),
        osRelease: os.release(),
        cpuArch: os.arch(),
        memory: {
            total: os.totalmem(),
            free: os.freemem()
        }
    };

    res.end(JSON.stringify(details, null, 2)); 
}

module.exports = { healthCheck, systemDetails };
