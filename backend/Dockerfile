# Multi-stage production Dockerfile for Buzz Backend
# Stage 1: Build TypeScript output
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/

RUN npm run build && npm prune --production

# Stage 2: Production runtime image
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security hardening
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S buzzuser -G nodejs

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json

USER buzzuser

EXPOSE 5000

CMD ["node", "dist/server.js"]
