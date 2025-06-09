FROM node:22-alpine

WORKDIR /app

# Copy workspace package.json files for dependency resolution
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install all workspace dependencies from root
RUN npm install

# Copy shared package source and build it
COPY shared/ ./shared/
RUN npm run build -w shared

# Copy frontend source
COPY frontend/ ./frontend/

# Set working directory to frontend
WORKDIR /app/frontend

# Set environment to development
ENV NODE_ENV=development

# Expose the port
EXPOSE 3000

# Use development server with hot reloading
CMD ["npm", "run", "dev"]