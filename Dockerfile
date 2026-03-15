# Stage 1: Build the React application
# เปลี่ยนมาใช้ Node 22 เพื่อให้รองรับกับ Vite ตัวล่าสุด
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# คัดลอกไฟล์ที่ build เสร็จแล้วไปไว้ในโฟลเดอร์ของ Nginx
COPY --from=build /app/dist /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]