# File: Dockerfile
# This Dockerfile is for a Next.js application,
# which is a React framework for building server-rendered applications.
# It uses Node.js as the base image and installs the necessary dependencies,
# builds the application, and sets up the container to run the app in production mode.

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# 1️⃣ Declare build-time args
ARG OPENAI_API_KEY
ARG FIREWORKS_API_KEY
ARG ANTHROPIC_API_KEY
ARG PINECONE_API_KEY

# 2️⃣ Expose them as ENV so next build can read process.env.*
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV FIREWORKS_API_KEY=${FIREWORKS_API_KEY}
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ENV PINECONE_API_KEY=${PINECONE_API_KEY}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
