# Node.js Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN yarn global add nodemon

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
