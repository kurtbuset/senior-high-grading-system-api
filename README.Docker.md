# Docker Setup for Senior High Grading System API

This guide explains how to run the Senior High Grading System API with MySQL using Docker.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Start the Application

```bash
# Start both MySQL and Backend services
docker-compose up -d

# View logs
docker-compose logs -f

# View only backend logs
docker-compose logs -f backend

# View only MySQL logs
docker-compose logs -f mysql
```

### 2. Run Database Migrations

After the containers are running, execute migrations:

```bash
# Run migrations
docker-compose exec backend npx sequelize-cli db:migrate

# Run seeders (if needed)
docker-compose exec backend npm run seed
```

### 3. Access the Application

- **Backend API**: http://localhost:4000
- **MySQL Database**: localhost:3306

## Docker Commands

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete all database data)

```bash
docker-compose down -v
```

### Rebuild Containers

```bash
docker-compose up -d --build
```

### Access MySQL CLI

```bash
docker-compose exec mysql mysql -u senior_high_user -p senior-high-db
# Password: rootpassword123
```

### Access Backend Container Shell

```bash
docker-compose exec backend sh
```

### View Container Status

```bash
docker-compose ps
```

## Configuration

### Environment Variables

The `.env` file contains all configuration:

```env
# Database Configuration
DB_HOST=mysql          # Container name (don't change when using Docker)
DB_PORT=3306
DB_USER=senior_high_user
DB_PASS=rootpassword123
DB_NAME=senior-high-db
```

### Custom MySQL Configuration

To change MySQL settings, modify the `docker-compose.yml` file under the `mysql` service.

## Troubleshooting

### MySQL Connection Issues

If the backend can't connect to MySQL:

1. Check if MySQL is healthy:

   ```bash
   docker-compose ps
   ```

2. Check MySQL logs:

   ```bash
   docker-compose logs mysql
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

### Reset Database

To completely reset the database:

```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Run migrations again
docker-compose exec backend npx sequelize-cli db:migrate
```

### Port Conflicts

If port 3306 or 4000 is already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3307:3306" # Change host port (left side)
```

## Development Workflow

### Local Development with Docker MySQL

If you want to run the backend locally but use Docker for MySQL only:

1. Start only MySQL:

   ```bash
   docker-compose up -d mysql
   ```

2. Update `.env` to use localhost:

   ```env
   DB_HOST=localhost
   ```

3. Run backend locally:
   ```bash
   npm start
   ```

### Production Deployment

For production, update the following:

1. Change passwords in `.env`
2. Set `NODE_ENV=production`
3. Use proper secrets for `JWT_SECRET`
4. Consider using Docker secrets or environment-specific configs

## File Structure

```
senior-high-grading-system-api/
├── docker-compose.yml       # Docker orchestration
├── Dockerfile              # Backend container definition
├── .dockerignore          # Files to exclude from Docker build
├── .env                   # Environment variables
├── init-db/               # MySQL initialization scripts
│   └── 01-init.sql       # Database setup script
└── README.Docker.md      # This file
```

## Notes

- MySQL data persists in a Docker volume named `mysql_data`
- The backend container uses volume mounting for hot-reload during development
- Health checks ensure MySQL is ready before the backend starts
- All services communicate through a dedicated Docker network
