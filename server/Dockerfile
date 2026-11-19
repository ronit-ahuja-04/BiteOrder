# ---- BiteOrder API (Node.js + Express + Socket.IO) ----
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Application code
COPY . .

# Run as the unprivileged "node" user
USER node

EXPOSE 5001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5001/health || exit 1

CMD ["node", "server.js"]
