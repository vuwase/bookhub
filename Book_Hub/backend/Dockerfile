# Use official Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose port (adjust if your app uses a different one)
EXPOSE 5000

# Start the server
CMD [ "node", "server.js" ]
