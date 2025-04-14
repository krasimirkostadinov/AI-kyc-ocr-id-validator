# Use Google's official Cloud SDK image with Alpine for lightweight build
FROM google/cloud-sdk:alpine

# Install system dependencies
RUN apk add --no-cache \
    nodejs \
    npm \
    tesseract-ocr \
    tesseract-ocr-data-bul \
    tesseract-ocr-data-eng \
    # Add these for Tesseract and potential image processing
    tesseract-ocr-data-osd \
    imagemagick

# Set working directory
WORKDIR /app

# Set Tesseract data path
ENV TESSDATA_PREFIX=/usr/share/tessdata

# Explicitly set language configuration
ENV TESSDATA_CONFIG="-l bul+eng"

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port (matching your server.js port)
EXPOSE 5000

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start backend
CMD ["npm", "start"]