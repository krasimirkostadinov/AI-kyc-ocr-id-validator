# Use Google's official Cloud SDK image with Node.js
FROM google/cloud-sdk:alpine

# Install Node.js manually
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
