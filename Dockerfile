# Dockerfile

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install --no-fund --force

# Copy source files
COPY . .

# Build the Astro site
RUN npm run build

# Debug - verify build output location
RUN ls -la && ls -la dist || ls -la build

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from build stage
# Try both common output directories
COPY --from=build /app/dist /usr/share/nginx/html
# COPY --from=build /app/build /usr/share/nginx/html

# Debug - verify files copied correctly
RUN ls -la /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]