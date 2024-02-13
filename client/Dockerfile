# Stage 1: Build the React app
FROM node AS builder

WORKDIR /client/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the React app using NGINX
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=builder /client/src/app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY static.conf /etc/nginx/conf.d/default.conf
# Expose port 5173
EXPOSE 80

# Default command to run NGINX
CMD ["nginx", "-g", "daemon off;"]