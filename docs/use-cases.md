# Website Tree & Use Cases

## Public Pages (App)

### 1. Home Page (صفحه اصلی)

صفحه فرود اصلی سایت برای ایجاد اولین برداشت قوی (First Impression)، معرفی ارزش‌های برند و هدایت کاربر به صفحات کلیدی.

- **Section 1: Hero Banner (هدر و تصویر اصلی)**
  - **ویژوال:** ویدیوی اسلایدری لوکس و جذاب (یا تصویر باکیفیت بالا با کنترل حجمی جهت LCP و سرعت لود زیر ۱.۵ ثانیه) به‌صورت Loop/Replay خودکار (مشابه سبک صفحه اول سایت Cambria).
  - **محتوا:** شعار اصلی برند (Brand Tagline) + دکمه‌های فراخوان به عمل (CTA)".

- **Section 2: Brand Intro & Quick CTA (معرفی کوتاه و کاتالوگ)**
  - **محتوا:** خلاصه داستان برند و ارزش‌های محوری.
  - **امکانات:** باکس هدایت سریع کاربر برای مشاهده کاتالوگ دیجیتال.

* **Section 3: Top Categories & Featured Products (دسته‌بندی‌ها و محصولات منتخب)**
  - **ویژوال:**
    - نمایش **دسته‌بندی‌های اصلی** به‌صورت Grid جذاب همراه با انیمیشن‌های تعاملی (Scroll Effects).
    - نمایش **فقط ۶ الی ۸ محصول پرفروش/جدید (Featured Products)** به‌صورت اسلایدر یا Grid کوتاه جهت حفظ سرعت سایت.
  - **امکانات:**
    - فیلتر سریع بر اساس کاربرد یا رنگ (Quick Filter).
    - دکمه فراخوان "مشاهده تمام محصول" جهت هدایت کاربر به صفحه جامع (`/products`).

- **Section 4: Visualization Tools & Dealers (ابزارهای بصری‌سازی و نمایندگی‌ها)**
  - **امکانات:**
    - بخش جستجوی سریع نمایندگی‌ها (Dealers Locator) و امکان **ثبت سفارش نمونه (Request a Sample)**.

- **Section 5: Why Us / Unique Selling Proposition (چرا ما؟)**
  - **محتوا:** دلایل تمایز، کیفیت متریال، گارانتی و استانداردهای بین‌المللی به‌صورت آیکونیک و خلاصه.

- **Section 6: Contact Banner & Footer (ارتباط با ما و فوتر)**
  - **محتوا:** بنر دعوت به ارتباط/مشاوره + فرم سریع یا هدایت به صفحه `/contact`.
  - **فوتر:** دسترسی سریع به تمام صفحات، شبکه‌های اجتماعی، اطلاعات تماس و قوانین سایت.

---

### 2. Products Page:

- `/products`: List/Grid of all products with filtering and pagination.
- `/products/[slug]`: Single product detail page.

### 3. Applications Page:

- `/applications`: Shows where and how clients can use the materials (usage cases).

### 4. Catalog Page:

- `/catalogs`: List of digital catalogs. Client can view or download them.

### 5. Dealers Page:

- `/dealers`: Directory/List of all authorized dealers for purchasing.

### 6. Info Pages:

- `/about`: About us and FAQ section.
- `/privacy-policy`: Privacy Policy and Terms of Service.

### 7. Contact Us Page:

- `/contact`: Contact form (handled via SMTP/Nodemailer) and company details.

---

## Admin Panel (Payload CMS)

- Manage Products, Categories, Projects, Blog Posts, Catalogs, and Dealers.
- Multi-language content management.
