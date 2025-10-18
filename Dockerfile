# Use the official Node.js 18 Alpine image as the base image
FROM node:20-alpine

# Install build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove build dependencies to reduce image size
RUN apk del make gcc g++ python3

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
