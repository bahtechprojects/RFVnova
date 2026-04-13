FROM node:20-alpine

WORKDIR /app

# Backend
COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Frontend - build dentro do mesmo estágio para evitar cache
COPY frontend/ ./frontend-src/
RUN cd frontend-src && npm install && npm run build && \
    cp -r dist ../public && \
    cd .. && rm -rf frontend-src

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
