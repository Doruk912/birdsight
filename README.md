# BirdSight

Currently in development

## Run the Project

### 1) Clone the repository

```powershell
git clone https://github.com/Doruk912/birdsight.git
cd BirdSight
```

### 2) Run docker compose


```powershell
docker compose up -d
```

### 3) Start the Spring Boot backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 4) Start the Next.js frontend

```powershell
cd frontend
npm install
npm run dev
```