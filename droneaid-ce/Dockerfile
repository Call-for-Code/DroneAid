# pull the official base image  
FROM node:13.12.0-alpine

FROM nginxinc/nginx-unprivileged
COPY src/ /etc/nginx/html

USER 101
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx-debug", "-g", "daemon off;"]