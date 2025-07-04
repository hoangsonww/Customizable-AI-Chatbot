# File: Dockerfile
# This Dockerfile is for a Next.js application,
# which is a React framework for building server-rendered applications.
# It uses Node.js as the base image and installs the necessary dependencies,
# builds the application, and sets up the container to run the app in production mode.

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Build-time secrets (so next build can see them)
ARG OPENAI_API_KEY
ARG FIREWORKS_API_KEY
ARG ANTHROPIC_API_KEY
ARG PINECONE_API_KEY

ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV FIREWORKS_API_KEY=${FIREWORKS_API_KEY}
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ENV PINECONE_API_KEY=${PINECONE_API_KEY}

# Install deps & build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Pull everything from the builder (/app includes .next, public, node_modules, next.config.js, etc)
COPY --from=builder /app /app

EXPOSE 3000
CMD ["npm", "start"]
