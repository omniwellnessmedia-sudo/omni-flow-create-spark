# Multi-stage Docker build for production (fixed)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (package-lock.json will be copied if present)
COPY package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (outputs to /app/dist by default for Vite)
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install curl required by the HEALTHCHECK (and keep image small)
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (ensure nginx.conf exists and is correct)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]