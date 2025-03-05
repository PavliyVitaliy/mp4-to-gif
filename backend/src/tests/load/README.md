# Load Testing for MP4 to GIF Converter

## Description

This script allows you to load test the service by sending **1000 POST requests** to download MP4 videos and convert them to GIF.

---

## **How ​​to run the test**

> **Requirements:**
>
> - **Node.js 18+**
> - **curl** (installed by default on Linux/macOS, for Windows you can use `Git Bash`)

1. Go to the `load_test` folder:

```sh
cd load_test

```

2. Run the test:

```sh
node load_test.js
```

## **How to extend the test**

- Add API response handling (e.g. check that the GIF was successfully created)
- Add saving results to the log
- Support for other HTTP methods (GET, PUT, DELETE)
- Add test result reports
