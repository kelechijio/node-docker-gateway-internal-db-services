FROM node:20.16.0

LABEL authors="kelechi"

# Set working directory specifically for the client app
WORKDIR /gateway_service

# Copy package.json and install dependencies first
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the client app
COPY . .

# Expose port 3000 (publicly accessible)
EXPOSE 3000

# Start the client app
CMD ["npm", "start"]
