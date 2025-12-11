# --- Stage 1: Build ---
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve dengan Nginx ---
FROM nginx:alpine
# Copy hasil build dari Stage 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# (Optional) Copy custom nginx config jika ada routing khusus
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]