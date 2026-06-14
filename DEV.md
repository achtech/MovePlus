# Frontend / Backend sync

## Development (frontend + backend separate)

1. Start PostgreSQL and the backend:
   ```bash
   cd ../moveplus-backend
   mvn spring-boot:run
   ```
2. Start the Angular dev server (proxies `/api` to `http://localhost:8080`):
   ```bash
   npm start
   ```
3. Open `http://localhost:4200`

## Production-style (embedded in JAR)

Build the frontend and copy it into the backend static folder, then package:

```bash
npm run build:backend
cd ../moveplus-backend
mvn package -DskipTests
java -jar target/moveplus-backend-1.0.0.jar
```

Open `http://localhost:8080`

## Login accounts

| Username | Password     | Role      |
|----------|--------------|-----------|
| Kahlid   | Khalid@2026  | Admin     |
| Layla    | Layla@2026   | Assistant |
