FROM node:20.16.0

LABEL authors="kelechi"

# Set working directory specifically for the client app
WORKDIR /internal_service

# Install netcat for health checks
RUN apt-get update && apt-get install -y netcat-traditional

# Copy package.json and install dependencies first
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the client app
COPY . .

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expose port 3000 (publicly accessible)
EXPOSE 4000

# Start the client app
CMD ["/wait-for-db.sh", "npm", "start"]



