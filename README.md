# 🔗 URL Shortener

A simple **URL Shortener** built with **TypeScript**, **Express**, and **Prisma** (PostgreSQL).  
It allows you to convert a long URL into a short one, then redirect to it while counting visits.

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL 18 (via Docker Compose) + PgAdmin4 |
| Validation | Zod |
| Utilities | nanoid, normalize-url, helmet, cors |


---

# 🔗 Prerequisites

- Node.js (>=18)
- npm
- Docker + Docker Compose

---

# Launches
## Launch database (Postgres + PgAdmin)
From project root
```bash
docker compose up -d
```
PostgreSQL: localhost:5433
PgAdmin : http://localhost:5050

Login to PgAdmin:
```pgsql
email: admin@example.com
password: admin
```
Update database if needed
```bash
cd backend
cp .env.example .env
npm run prisma:migrate
npm run prisma:generate
```
## Launch backend
```bash
cd backend
npm install
npm run dev
```
Backend available on "http://localhost:3000"

---

## 🚀 Features

- Create short URLs (`POST /`)
- Redirect to long URL via slug (`GET /:slug`)
- Increment hit counter on redirect
- Strong URL validation & normalization
- Idempotent: same long URL → same slug