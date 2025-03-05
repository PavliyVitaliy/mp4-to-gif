const { exec } = require('child_process');
const path = require('path');

const NUM_REQUESTS = 1000;

const CONCURRENT_REQUESTS = 50;

let completedRequests = 0;

const API_URL = 'http://localhost:3000/api/upload';

const TEST_FILE = path.join(__dirname, 'test_sample-5s.mp4');

const sendRequest = (index) => {
    return new Promise((resolve, reject) => {
        console.log(`Sending request ${index + 1} of ${NUM_REQUESTS}...`);

        const command = `curl -X POST "${API_URL}" -H "Content-Type: multipart/form-data" -F "file=@${TEST_FILE};type=video/mp4"`;

        exec(command, (error) => {
            completedRequests++;
            if (completedRequests % CONCURRENT_REQUESTS === 0) {
                console.log(`Processed ${completedRequests} requests...`);
            }
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

// Running the test
const runLoadTest = async () => {
    console.log(`Starting load test: ${NUM_REQUESTS} requests, ${CONCURRENT_REQUESTS} at a time...`);

    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < NUM_REQUESTS; i++) {
        promises.push(sendRequest(i));

        if (i % CONCURRENT_REQUESTS === 0) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }

    await Promise.all(promises);
    const elapsedTime = (Date.now() - startTime) / 1000;
    console.log(`Load test completed in ${elapsedTime.toFixed(2)} seconds.`);
};

// Launch
runLoadTest();
