# Use Node.js v18 as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 8080 for the application
EXPOSE 8080

# Build the application
RUN npm run build

# Run the application
CMD ["npm", "run", "start:prod"]
