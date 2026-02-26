# 🔗 URL Shortener

A simple and type-safe **URL Shortener** built with **TypeScript**, **Express**, **React**, and **Prisma (PostgreSQL)**.  
When a user submits a long URL, the backend generates a short alphanumeric slug, stores it in the database, and returns a shortened link.  
Accessing that link automatically redirects to the original URL via an HTTP 302 redirect.

<br>

## 🚀 Features

- ✳️ Create short URLs (POST /)

- 🔁 Redirect to long URL via slug (GET /:slug)

- 📋 List existing links (GET /links)

- 🔢 Increment hit counter on redirect

- ✅ Strong validation & normalization (Zod + normalize-url)

- ♻️ Idempotent — same long URL → same slug

- ⚡ Simple React frontend with live form validation

- 🔐 Security middleware (Helmet, CORS)

<br>

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Language | TypeScript |
| Runtime | Node.js |
| Backend Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL 18 (via Docker Compose) + PgAdmin4 |
| Validation | Zod |
| Utils | nanoid + normalize-url + helmet + cors |
| Frontend | React + Vite + react-hook-form + Zod + SCSS |
| Testing | Jest |

<br>

## ⚙️ Prerequisites

- Node.js **>= 18**
- npm
- Docker + Docker Compose

<br>

## 🐘 Database Setup

From the project root:

```bash
docker compose up -d
```

- PostgreSQL → http://localhost:5433
- PgAdmin → http://localhost:5050

Login credentials (defined in `docker-compose.yml`):
```psql
Email: admin@example.com
Password: admin
```
## 🏗️ Initialize project
Initialize environment variables in folders `/backend` and `/frontend`:
```bash
cp .env.example .env
```

Then initialize Prisma
```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
```

<br>

## 🖥️ Launch Backend

```bash
cd backend
npm install
npm run dev
```
Server available at → http://localhost:3000

<br>

## 🖥️ Launch Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend available at → http://localhost:5173
