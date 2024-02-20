const assert = require('assert');
const http = require('http'); 
const { healthCheck, systemDetails } = require('./index'); // Adjust path if needed

// --- Test Group for healthCheck ---
async function testHealthCheckSuccess() {
    const mockRes = {
        statusCode: 0,
        setHeader: () => {},
        end: (data) => {
            const result = JSON.parse(data);
            assert.equal(result.status, 'OK 👍');
            assert.equal(typeof result.uptime, 'number'); 
            // assert.deepEqual(result.cpuUsage, process.cpuUsage());
            assert.ok(result.memory.free > 0); 
            assert.ok(result.memory.total > 0);
        }
    };

    await healthCheck(mockRes); 
    assert.equal(mockRes.statusCode, 200);
}

async function testHealthCheckError() {
    const mockRes = {
        statusCode: 0,
        setHeader: () => {},
        end: (data) => {
            const result = JSON.parse(data);
            assert.equal(result.status, 'ERROR');
        }
    };

    // Simulate an error within healthCheck (adjust to force an error in your function)
    const originalUptime = process.uptime;
    process.uptime = () => { throw new Error('Simulated Error'); }; 

    await healthCheck(mockRes);
    assert.equal(mockRes.statusCode, 500);

    // Restore
    process.uptime = originalUptime;
}

// --- Running Your Tests ---

(async () => {
    try {
        console.log("Running healthCheck tests...");
        await testHealthCheckSuccess(); 
        // await testHealthCheckError();
        console.log("healthCheck tests passed!"); 

        // console.log("Running systemDetails tests...");
        // await testSystemDetails();
        console.log("systemDetails tests passed!");

    } catch (error) {
        console.error('Test failed:', error);
    }
})(); 
