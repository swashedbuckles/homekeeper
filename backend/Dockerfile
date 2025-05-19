FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Set environment to development by default
ENV NODE_ENV=development

# Build TypeScript code
RUN npm run build

# Expose the port
EXPOSE 4000

# In development, use nodemon for hot reloading
# In production, run the compiled JS directly
CMD ["npm", "run", "dev"]