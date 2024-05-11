### Noters

---

**Tech Stack**
Backend: Golang, Fiber, Docker, Postgres, Redis
Frontend: Typescript, React, Tailwindcss

---

**Features**

1. Authentication and user management
2. Create, read, update, delete notes

---

**Steps to run the app locally**

```bash
# 0. Clone the rpository
git clone https://github.com/m3rashid/noters.git
cd noters

# Make sure you have docker installed on your system
# 1. Start the backend
docker compose up

# Make sure you have nodejs (v20) on your system
# 2. Start the frontend
cd web
npm i -g pnpm serve
pnpm build
serve -s dist -p 5173
```
