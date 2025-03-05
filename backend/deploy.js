const { execSync } = require("child_process");

const run = (cmd) => {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
};

try {
    console.log("1. Collecting images...");
    run("docker build -t mp4-to-gif-backend:latest -f Dockerfile.backend .");
    run("docker build -t mp4-to-gif-worker:latest -f Dockerfile.worker .");

    console.log("2. Deploying Swarm...");
    run("docker stack deploy -c docker-compose.swarm.yml mp4-to-gif-stack");

    console.log("Swarm launched successfully!");
} catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
}
