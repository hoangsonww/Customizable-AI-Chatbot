# File: Dockerfile
# This Dockerfile is for a Next.js application,
# which is a React framework for building server-rendered applications.
# It uses Node.js as the base image and installs the necessary dependencies,
# builds the application, and sets up the container to run the app in production mode.

# Use Node.js 18 (>=18.17.0) so Next.js build passes
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package manifests and install deps cleanly
COPY package*.json ./
RUN npm ci

# Copy rest of source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000

# Launch in production mode
CMD ["npm", "start"]
