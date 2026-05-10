# Deployment Documentation

## Infrastructure
- **Server IP**: 10.10.1.2
- **Environment**: Linux VM (Ubuntu)
- **Database**: MySQL (Database: `todo`, User: `todo`)
- **Process Manager**: PM2

## CI/CD Pipeline
- **Tool**: GitHub Actions
- **Runner**: Self-Hosted Runner (configured on the VM to bypass private network restrictions).
- **Workflow**: Automated build (TypeScript) and deployment on every push to the `main` branch.

## Verification
The pipeline was verified by making a code change in `index.ts`. The updated log `server started - DevOps Pipeline Verified!` was successfully observed in the PM2 logs after an automated deployment.

