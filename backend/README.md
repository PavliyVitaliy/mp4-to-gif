# MP4 to GIF Converter

MP4 to GIF Converter is a high-load multi-user service that accepts **MP4** video and converts it to **GIF**. The service supports scalability via **Docker Swarm** and processes **up to 1000 requests per minute**.

### **Technology stack**

- **Backend:** Node.js (Express)
- **Queues:** BullMQ + Redis
- **Logging:** Pino
- **Containerization:** Docker, Docker Swarm
- **Frontend:** Angular

---

## **Configuration via `.env`**

The project uses the **`.env`** file to store configuration.
An example is available in **`.env.example`**.

### **Creating `.env`**

1. Copy `.env.example` to `.env`:

```sh
cp .env.example .env
```

## **Launching the project**

### 1. Local launch (without Docker)

> **Requirements:**
>
> - Installed **Node.js 18+**
> - **Redis** (locally or via Docker)

1. Install dependencies:

```sh
yarn install
```

2. Start Redis (if not installed locally)

```sh
docker run -d --name redis -p 6379:6379 redis
```

3. Start the server:

```sh
yarn start
```

4. Start workers to process tasks:

```sh
node dist/workers/videoWorker.js
```

The API is now available at: http://localhost:3000

### 2. Run via Docker (local)

> **Requirements:**
>
> - **Docker**
> - **Docker Compose**

1. Build and run containers:

```sh
docker compose up --build -d
```

2. The API will be available at http://localhost:3000

To stop containers:

```sh
docker compose down
```

### 3. Running via Docker Swarm

> **Requirements:**
>
> - **Docker Swarm (initialized by docker swarm init command)**

1. Run **deploy.js** (it will automatically build the images and deploy the stack):

```sh
node deploy.js
```

2. Check running services

```sh
docker service ls
```

3. Stop Swarm:

```sh
docker stack rm mp4-to-gif-stack
```

## **Load testing**

For performance testing, _load_test.js_ is used.

For details, see **load_test/README.md**

## **Possible improvements**

- GIF optimization (size compression, fps change)
- Adding monitoring (Prometheus, Grafana)
- AWS S3 support for file storage
- Load balancing via Nginx
