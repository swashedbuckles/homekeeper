# Frontend Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment to development
ENV NODE_ENV development

EXPOSE 3000

# Use development server with hot reloading
CMD ["npm", "start"]
