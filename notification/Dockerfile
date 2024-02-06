
FROM node

# Set the working directory inside the container
WORKDIR /notf/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 8003

# Define the command to run your application
CMD ["npm", "start"]
