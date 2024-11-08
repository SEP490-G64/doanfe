# Stage 1: Build the application
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Copy application code
COPY . .

# Build the Next.js application
RUN yarn build

# Stage 2: Serve the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app ./

# Install only production dependencies
RUN yarn install --production

# Expose the Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["yarn", "start"]