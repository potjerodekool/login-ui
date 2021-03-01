FROM nginx:stable-alpine
COPY build /usr/share/nginx/html/login
COPY nginx.conf /etc/nginx