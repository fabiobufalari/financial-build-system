# Dockerfile para financial-recovery-system (Frontend Vite)

# ---- Estágio de Build ----
FROM node:18-alpine AS builder
LABEL stage="builder"
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# OPCIONAL: Verifique o conteúdo após o build:
RUN echo "Conteúdo de /app após o build:" && ls -la /app
RUN echo "Conteúdo de /app/dist (se existir) após o build:" && ls -la /app/dist


# ---- Estágio de Produção (com servidor Node.js 'serve') ----
FROM node:18-alpine AS runner
LABEL stage="production"
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN npm install -g serve

# Copia a pasta de build do Vite (geralmente 'dist')
COPY --from=builder /app/dist ./dist

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000 

# -s indica single-page application mode
# -l 3000 escuta na porta 3000
# O diretório a ser servido é 'dist'
# Adicionado --host 0.0.0.0 para garantir que escute em todas as interfaces dentro do container
CMD ["serve", "-s", "dist", "-l", "3000"]