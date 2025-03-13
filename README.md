# NodeGreet: Microservices API

## 📌 Overview

NodeGreet is a microservices-based API system consisting of a **client-facing service**, an **internal service**, and a **PostgreSQL database**. The **client-facing service** interacts with users and forwards requests to the **internal service**, which communicates directly with the database.

---

## 🏗 Architecture

```
                           ┌──────────────────────┐
                           │  User / Client       │
                           └────────▲────────────┘
                                    │
                                    ▼
                           ┌──────────────────────┐
                           │  Client Service      │
                           │  (Express.js)        │
                           └────────▲─────────────┘
                                    │
                                    ▼
                           ┌──────────────────────┐
                           │  Internal Service    │
                           │  (Express.js)        │
                           └────────▲────────────-┘
                                    │
                                    ▼
                           ┌──────────────────────┐
                           │  PostgreSQL Database │
                           └──────────────────────┘
```

---

## ⚡ Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2️⃣ Clone the Repository (not uploaded yet)

```sh
git clone https://github.com/yourusername/nodegreet.git
cd nodegreet
```

### 3️⃣ Start the Services

Run the following command to build and start the services:

```sh
docker-compose up --build -d
```

This will start:

- **Client Service** (Port `3000`)
- **Internal Service** (Internal network only, Port `4000`)
- **PostgreSQL Database** (Internal network only, Port `5432`)

### 4️⃣ Stopping the Services

```sh
docker-compose down
```

---

## 🌍 API Endpoints

### **Client Service (Public)** `http://localhost:3000`

| Method | Endpoint        | Description               |
| ------ |-----------------| ------------------------- |
| GET    | `/getPosts`     | Fetch all posts           |
| GET    | `/getPosts/:id` | Fetch a single post by ID |

Example:

```sh
curl http://localhost:3000/getPosts
```

### **Internal Service (Private)** `http://internal_service:4000`

| Method | Endpoint     | Description                                        |
| ------ | ------------ | -------------------------------------------------- |
| GET    | `/posts`     | Fetch all posts (used by client service)           |
| GET    | `/posts/:id` | Fetch a single post by ID (used by client service) |

This service is **NOT publicly accessible** and only communicates within the **Docker network**.

---

## 🛠 Environment Variables

The application uses the following environment variables (found in `docker-compose.yml`):

```env
POSTGRES_USER=kc
POSTGRES_PASSWORD=kcpass
POSTGRES_DB=kcdb
INTERNAL_SERVICE_URL=http://internal_service:4000
```

---

## 🏗 Docker Setup

### 📂 Folder Structure

```
📂 nodegreet/
├── 📂 client_app/                # Client-facing Node.js service
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   └── routes/
│
├── 📂 internal_service/           # Internal Node.js service
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   ├── routes/    
│   └── wait-for-db.sh             # Script to wait for PostgreSQL
│
├── docker-compose.yml             # Docker Compose setup
├── .env (optional)                # Environment variables
└── README.md                      # You are here
```

### 🐳 Docker Compose Services

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: postgres_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: kc
      POSTGRES_PASSWORD: kcpass
      POSTGRES_DB: kcdb
    tmpfs:
      - /var/lib/postgresql/data
    networks:
      - backend

  internal_service:
    build: ./internal_service
    container_name: internal_service
    depends_on:
      - postgres
    environment:
      - DB_HOST=postgres
      - DB_USER=kc
      - DB_PASSWORD=kcpass
      - DB_NAME=kcdb
    networks:
      - backend

  client_app:
    build: ./client_app
    container_name: client_app
    ports:
      - "3000:3000"
    depends_on:
      - internal_service
    environment:
      - INTERNAL_SERVICE_URL=http://internal_service:4000
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

---

## 🔥 Running Tests

To test if the **internal service is private**, run:

```sh
curl http://localhost:4000  # Should fail (Connection Refused)
```

To test if the **client service communicates with internal service**, run:

```sh
curl http://localhost:3000/getPosts  # Should return posts from DB
```

---

## 🚀 Deployment

For production, use **Docker Swarm** or **Kubernetes** to orchestrate your services.

```sh
docker stack deploy -c docker-compose.yml nodegreet
```

---

## 👨‍💻 Contributors

- **Kelechi** - [GitHub](https://github.com/kelechijio)

---

## 📜 License

This project is **MIT licensed**.
