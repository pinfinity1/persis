FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ۱. ساخت پوشه کش برای Next.js با دسترسی کاربر غیر روت
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# ۲. کپی خروجی استاندارد Standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# ۳. کپی فایل‌های استاتیک دقیقاً درون .next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ۴. کپی پوشه public همراه با دسترسی کاربر nextjs برای لود بدون خطای تصاویر
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]