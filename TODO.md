# TODO List for Docker Setup

- [x] Update src/rabbitmq/rabbitmq.module.ts to use RABBITMQ_URI environment variable
- [x] Create Dockerfile for the NestJS backend
- [x] Create docker-compose.yml with services for postgres, redis, rabbitmq, and backend
- [x] Test the Docker setup (run docker-compose up)

# TODO List for CI/CD Implementation

- [x] Create .github/workflows/ci.yml for GitHub Actions CI/CD
  - [x] Set up workflow triggers (push and PR to main)
  - [x] Add CI job: Node.js setup, install deps, lint, test, build
  - [x] Add CD job: Build and push Docker image to GitHub Container Registry on main pushes
