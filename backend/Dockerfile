FROM node:22-alpine

WORKDIR /app

# Copy workspace package.json files for dependency resolution
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install all workspace dependencies from root
RUN npm install

# Copy shared package source and build it
COPY shared/ ./shared/
RUN npm run build -w shared

# Copy backend source
COPY backend/ ./backend/

# Set working directory to backend
WORKDIR /app/backend

# Set environment to development by default
ENV NODE_ENV=development

# Build TypeScript code
RUN npm run build

# Expose the port
EXPOSE 4000

# In development, use nodemon for hot reloading
# In production, run the compiled JS directly
CMD ["npm", "run", "dev"]