# 💬 BaaNudi – MERN Chat Application with Splunk SOC Integration

A real-time chat application built using the **MERN Stack**, **Socket.IO**, **Cloudinary**, and **JWT Authentication**.

In addition to the normal chat functionality, this project demonstrates how to integrate a web application with a **Security Operations Center (SOC)** by forwarding security events to **Splunk Enterprise** using **HTTP Event Collector (HEC)** and **ngrok**.

---

# Live Demo

**Hosted Application**

https://baanudi.onrender.com/

---

# Features

## Chat Features

* User Registration & Login
* JWT Authentication
* Real-time Messaging using Socket.IO
* Online / Offline User Status
* Image Sharing using Cloudinary
* Responsive UI
* Secure Cookie Authentication

---

## SOC / Security Features

* Security event logging
* Splunk Enterprise integration
* HTTP Event Collector (HEC)
* ngrok tunnel for local Splunk
* Real client IP logging
* JSON formatted events
* Fire-and-forget logging (application never crashes if Splunk is offline)

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* DaisyUI
* Ant Design
* Zustand
* Axios
* Socket.IO Client

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT
* bcryptjs
* Cloudinary

---

# SOC Architecture

```
                User
                  │
                  ▼
          Render Hosted Website
                  │
                  ▼
          Express Backend
                  │
          Security Event
                  │
                  ▼
            ngrok  Tunnel
                  │
                  ▼
      Local Splunk Enterprise
                  │
                  ▼
      Search / Dashboards / Alerts
```

The backend sends security-related events to Splunk through the HTTP Event Collector (HEC). Since Splunk is running locally, ngrok creates a secure public HTTPS tunnel that allows the Render-hosted backend to send logs to your local machine.

---

# Project Structure

```
ChatApplication/

│
├── backend/
│   ├── src/
│   ├── lib/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── package.json
```

---

# Prerequisites

Install the following software before starting.

* Node.js (20+ recommended)
* npm
* MongoDB Atlas (or Local MongoDB)
* Cloudinary Account
* Git
* Splunk Enterprise
* ngrok

---

# Step 1 - Clone Repository

```
git clone https://github.com/cybmanuer/ChatApplication.git

cd ChatApplication
```

---

# Step 2 - Install Dependencies

```
npm run build
```

or manually

```
cd backend
npm install

cd ../frontend
npm install
```

---

# Step 3 - Create Cloudinary Account

Create a free account.

Copy

* Cloud Name
* API Key
* API Secret

These values will be used inside the backend `.env`.

---

# Step 4 - Create MongoDB Atlas Database

1. Create a free Atlas cluster.
2. Create a database user.
3. Allow your IP.
4. Copy the MongoDB Connection String.

Example:

```
mongodb+srv://username:password@cluster.mongodb.net/chatapp
```

---

# Step 5 - Configure Backend Environment

Create

```
backend/.env
```

Example:

```
PORT=5001

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

NODE_ENV=production

CLOUDINARY_CLOUD_NAME=YOUR_NAME
CLOUDINARY_API_KEY=YOUR_KEY
CLOUDINARY_API_SECRET=YOUR_SECRET

SPLUNK_HEC_URL=https://YOUR_NGROK_URL

SPLUNK_HEC_TOKEN=YOUR_HEC_TOKEN

SPLUNK_INDEX=chatapp_lab
```

---

# Step 6 - Run Project Locally

Backend

```
cd backend

npm run dev
```

Frontend

```
cd frontend

npm run dev
```


# Installing Splunk Enterprise

1. Download Splunk Enterprise.
2. Install using default settings.
3. Open

```
http://localhost:8000
```

4. Login.

---

# Creating a Splunk Index

Open

```
Settings

→ Indexes

→ New Index
```

Create

```
chatapp_lab
```

Save.

---

# Enable HTTP Event Collector (HEC)

Go to

```
Settings

→ Data Inputs

→ HTTP Event Collector
```

Enable

```
Global Settings

Enable HTTP Event Collector

Disable SSL (in dev)
```

Save.

---

# Create HEC Token

Navigate to

```
Settings

→ Data Inputs

→ HTTP Event Collector

→ New Token
```

Fill

```
Name

BaaNudiHEC
```

Select Index

```
chatapp_lab
```

Finish setup.

Copy the generated token.

Example

```
01234567-abcd-9876-efgh-1234567890ab
```

Paste this value into

```
SPLUNK_HEC_TOKEN
```

inside your backend `.env` or Render environment variables.

---

# Install ngrok

Download ngrok.

Login and authenticate (https://dashboard.ngrok.com).

Example

```
ngrok config add-authtoken YOUR_AUTH_TOKEN
```


---

# Expose Splunk Using ngrok

ngrok will generate an HTTPS address similar to

```
https://abcd-12-34-56.ngrok-free.app
```

Copy this URL.
Add in .env 
Example

Correct
```
SPLUNK_HEC_URL=https://abcd.ngrok-free.app
```


Run

```
ngrok http --url=https://<your domain>.ngrok-free.dev 8088
```


---

# Splunk Environment Variables

```
SPLUNK_HEC_URL=https://YOUR_NGROK_URL

SPLUNK_HEC_TOKEN=YOUR_TOKEN

SPLUNK_INDEX=chatapp_lab
```

---


# SO In Short : Simple Steps to Run application 

Before starting — get Splunk and ngrok running
Start Splunk (if it's not already running as a Windows service) — launch it and confirm you can log into Splunk Web at http://localhost:8000 with your admin credentials.
Start the ngrok tunnel in its own terminal, and leave it running:
# Terminal 0
```
   ngrok http --url=https://your-domain.ngrok-free.dev 8088
```
Confirm the "Forwarding" line shows your domain pointing at localhost:8088. Keep this terminal open the whole time you're testing.

Set your local backend .env

Open backend/.env and make sure these three are set (alongside your existing MONGODB_URI, JWT_SECRET, PORT, NODE_ENV=development):

```
SPLUNK_HEC_URL=https://your-domain.ngrok-free.dev
SPLUNK_HEC_TOKEN=<your HEC token>
SPLUNK_INDEX=chatapp_lab
```

No trailing slash on the URL. NODE_ENV=development matters too — your generateToken sets the cookie's secure flag based on it, and without it the login cookie won't work over plain http://localhost.

Start the app

Two terminals:

# Terminal 1 — backend
cd backend
npm run dev

Confirm you see server is running on PORT: <your port> and MongoDB Connected with no errors.

# Terminal 2 — frontend
cd frontend
npm run dev

Open the URL it prints (http://localhost:5173).

# How Security Logging Works

Whenever an important security-related action occurs, the backend creates a JSON event containing information such as:

* Event Type
* Timestamp
* Client IP Address
* User Agent
* HTTP Method
* API Endpoint
* Logged-in User ID (if available)
* Email (if available)
* Additional event-specific information

The backend then sends this JSON to:

```
https://YOUR_NGROK_URL/services/collector
```

Splunk stores the event inside the configured index.

If Splunk or ngrok is unavailable, the application continues working normally because logging failures are ignored (fire-and-forget design).

---

# Code Changes Made for SOC Integration

This project includes several modifications to support SOC integration:

### 1. Added Splunk Logger

A dedicated logger sends security events to Splunk HEC.

Location

```
backend/lib/splunkLogger.js
```

Responsibilities

* Reads HEC URL and Token from environment variables
* Creates JSON payload
* Sends logs to Splunk
* Prevents logging failures from affecting application users

---

### 2. Added Splunk Environment Variables

Added support for

```
SPLUNK_HEC_URL

SPLUNK_HEC_TOKEN

SPLUNK_INDEX
```

inside `.env`.

---

### 3. Trust Proxy Enabled

The Express server includes

```
app.set("trust proxy", true);
```

This ensures that when the application is deployed behind Render (and ngrok), the backend records the actual client IP instead of the proxy IP.

---

### 4. JSON Event Format

Each security event contains useful fields including:

* event_type
* application
* timestamp
* ip
* user_agent
* method
* endpoint
* userId
* email

This makes searching and creating dashboards in Splunk easier.

---

# Verify Everything

1. Start Splunk.
2. Start ngrok.
3. Ensure Render is deployed with correct environment variables.
4. Open the chat application.
5. Register or log in.
6. Perform actions that generate security events.

---

# Search Events in Splunk

Example searches

```
index=chatapp_lab
```

---

# Troubleshooting

## No logs appear

* Ensure Splunk is running.
* Verify HEC is enabled.
* Check the HEC token.
* Check the SSL is disabled in local/dev.
* Verify the ngrok tunnel is active.
* Confirm `SPLUNK_HEC_URL` points to the ngrok HTTPS URL.
* Confirm the selected index exists.

---



# Future Improvements
* Email alerts
* GeoIP analysis
* MITRE ATT&CK mapping

---

This project demonstrates how a modern web application can integrate with SOC tooling by forwarding security telemetry from a cloud-hosted application to a locally running Splunk Enterprise instance using ngrok and HTTP Event Collector.
