# Use an official Node.js runtime as a parent image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to the web server's directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port that the app runs on
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
