# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm, copy lockfile & package manifests, install deps
RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source & build
COPY . .
RUN pnpm build

# 2. Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
