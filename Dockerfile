# File: Dockerfile
# This Dockerfile is for a Next.js application,
# which is a React framework for building server-rendered applications.
# It uses Node.js as the base image and installs the necessary dependencies,
# builds the application, and sets up the container to run the app in production mode.

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only install production deps
COPY package.json package-lock.json ./
RUN npm ci --production

# Bring over build output and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
