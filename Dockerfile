# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ARG DATABASE_URL
ARG RESEND_API_KEY
ARG COHERE_API_KEY
ENV DATABASE_URL=${DATABASE_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV COHERE_API_KEY=${COHERE_API_KEY}
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]