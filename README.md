# Forge Studio

⁧محیط توسعهٔ یکپارچهٔ تحت وب برای پروژهٔ کارشناسی مهندسی کامپیوتر. در این نسخه می‌توان یک پروژهٔ نمونهٔ React/TypeScript ساخت، فایل‌ها را در Monaco ویرایش کرد و اجرای واقعی آن‌ها را در Preview دید. پروژه‌ها در مرورگر ذخیره و دوباره باز می‌شوند.⁩

[نمای واقعی محیط Forge Studio](docs/evidence/forge-studio.png)

## ⁧راه‌اندازی⁩

⁧پیش‌نیاز، Node.js نسخهٔ 22.13 یا بالاتر از سری 22، یا Node.js نسخهٔ 24 به بالا، همراه npm و یک مرورگر دسکتاپ است. برای اجرای محلی از آدرس `localhost` استفاده کنید. Preview به دسترسی شبکه به سرویس Sandpack و منابع وابستگی پروژهٔ نمونه نیاز دارد.⁩

```sh
npm ci
npm run dev
```

⁧آدرس چاپ‌شده توسط Vite را باز کنید. در `src/App.tsx` پروژهٔ داخل IDE، عنوان `Make it yours.` را تغییر دهید و نتیجه را در Preview ببینید. دکمهٔ `Increment` روی state واقعی React کار می‌کند. برای ساخت نمونهٔ مستقل از `New project` و برای بازکردن نمونه‌های ذخیره‌شده از انتخابگر پروژه استفاده کنید. ایجاد و انتقال فایل یا پوشه از Explorer انجام می‌شود. `Ctrl+Shift+F` یا `⌘+Shift+F` جست‌وجو را باز می‌کند و `F2` روی ردیف فایل یا پوشه، تغییرنام را باز می‌کند. برای تغییر عرض Preview، جداکننده را بکشید یا بعد از فوکوس با کلیدهای جهت حرکت دهید.⁩

## ⁧فرمان‌های بررسی⁩

```sh
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

⁧آزمون واحد یک‌بار اجرا می‌شود. آزمون مرورگر از سرور واقعی Vite و iframe واقعی Sandpack استفاده می‌کند و به شبکه نیاز دارد. اگر Chrome از قبل نصب است، متغیر `PLAYWRIGHT_CHANNEL=chrome` را هنگام اجرای آزمون تنظیم کنید. برای بررسی خروجی ساخت، بعد از `npm run build` از `npm run preview` استفاده کنید.⁩

## ⁧مسیر مطالعه و وضعیت⁩

- ⁧زمینه، محدوده و ترتیب مراحل.⁩ [زمینهٔ پروژه](docs/PROJECT_CONTEXT.md) · [نقشهٔ راه](docs/ROADMAP.md)
- ⁧ساختار کد و روش یادگیری.⁩ [معماری](docs/ARCHITECTURE.md) · [برنامهٔ آموزشی](docs/LEARNING_PLAN.md)
- ⁧آموزش همراه کد واقعی.⁩ [درس ۱: اجرای React در مرورگر](docs/lessons/01-browser-runtime.md) · [درس ۲: هستهٔ IDE](docs/lessons/02-ide-core.md)
- ⁧نتایج آزمون‌ها و محدودیت‌های نسخه.⁩ [شواهد مرحلهٔ ۱](docs/evidence/STAGE_1.md) · [شواهد مرحلهٔ ۲](docs/evidence/STAGE_2.md) · [وضعیت پروژه](docs/PROGRESS.md)
- ⁧گزارش کار دورهٔ کارشناسی.⁩ [گزارش اول](docs/reports/REPORT_01.md)
