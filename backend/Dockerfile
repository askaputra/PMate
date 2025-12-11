# Gunakan Node.js versi ringan
FROM node:18-alpine

# Set folder kerja dalam container
WORKDIR /app

# Copy file dependency dulu (agar caching layer optimal)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy sisa source code
COPY . .

# Expose port aplikasi (misal 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]