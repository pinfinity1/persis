# راهنمای اتصال و فعال‌سازی سامانه ایمیل سازمانی پرسیس کوارتز

این مستند راهنمای راه‌اندازی کامل سامانه وب‌میل سازمانی (`mail.persisquartz.com`) و روتینگ ایمیل در کلادفلر بدون پرداخت هزینه است.

---

## ۱. تنظیم ساب‌دامین در Cloudflare DNS

برای اینکه ساب‌دامین `mail.persisquartz.com` مستقیماً به پروژه متصل شود:

1. وارد پنل **Cloudflare** و دامنه `persisquartz.com` شوید.
2. به بخش **DNS > Records** بروید.
3. یک رکورد جدید از نوع **CNAME** ایجاد کنید:
   * **Type:** `CNAME`
   * **Name:** `mail`
   * **Target:** `persisquartz.com` (یا IP سرور اصلی)
   * **Proxy status:** حتماً **Proxied** (ابر نارنجی روشن باشد تا SSL خودکار کلادفلر فعال شود).
   * **TTL:** `Auto`

---

## ۲. ایجاد و بارگذاری Cloudflare Email Worker (دریافت ایمیل)

برای دریافت و فوروارد خودکار ایمیل‌ها به سرور Next.js:

1. در منوی سمت چپ کلادفلر به بخش **Workers & Pages > Overview** بروید و روی **Create application > Create Worker** کلیک کنید.
2. نام ورکر را مثلاً `persis-email-router` بگذارید و روی **Deploy** کلیک کنید.
3. سپس روی **Edit code** کلیک کرده و تمام کدهای فایل `scripts/cloudflare-email-worker/worker.js` را داخل ادیتور کلادفلر کپی و Paste کنید.
4. دکمه **Save and Deploy** را بزنید.
5. به بخش **Settings > Variables** در صفحه همان ورکر بروید و دو متغیر محیطی زیر را اضافه کنید:
   * `WEBHOOK_URL`: `https://persisquartz.com/api/webhooks/mail-inbound`
   * `WEBHOOK_SECRET`: مقداری که در فایل `.env` سرور برای `EMAIL_WEBHOOK_SECRET` ست کرده‌اید.

---

## ۳. اتصال روتینگ کلادفلر به Worker

1. به بخش **Email Routing > Routing Rules** بروید.
2. در بخش **Catch-all rule** (یا ساخت قوانین دلخواه برای آدرس‌های خاص):
   * **Action:** گزینه **Send to a Worker** را انتخاب کنید.
   * **Destination:** ورکر ساخته‌شده (`persis-email-router`) را انتخاب نمایید.
3. وضعیت قانون را روی **Active** قرار دهید.

---

## ۴. رکوردهای SPF و DMARC (تضمین عدم ورود به اسپم)

برای اینکه ایمیل‌های ارسالی از طرف دامنه‌ی شما اسپم نشوند، در بخش **DNS > Records** رکوردهای TXT زیر را بررسی/اضافه نمایید:

* **رکورد SPF:**
  * **Type:** `TXT`
  * **Name:** `@`
  * **Content:** `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`
* **رکورد DMARC:**
  * **Type:** `TXT`
  * **Name:** `_dmarc`
  * **Content:** `v=DMARC1; p=quarantine; rua=mailto:admin@persisquartz.com`

---

## ۵. استفاده از سامانه

* دسترسی به وب‌میل: `https://mail.persisquartz.com` (یا `https://persisquartz.com/mail`)
* مدیریت صندوق‌ها و دسترسی کاربران: `https://persisquartz.com/persis-cp` (در بخش **سامانه ایمیل**)
