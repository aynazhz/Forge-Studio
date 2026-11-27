# ⁧شواهد مرحلهٔ ۱: اجرای React در مرورگر⁩

⁧وضعیت `verified`. نسخهٔ مستقل آزمایش در اولین commit شاخه با پیام `Verify Monaco to React browser runtime` ثبت شده است. آزمون پس از یکپارچه‌شدن با IDE نیز با همان رفتارها در `tests/browser/runtime.spec.ts` قابل اجراست.⁩

## ⁧انتخاب و پیش‌نیاز⁩

⁧قالب React TypeScript سند Sandpack را بررسی کردیم. نمونه از کلاینت مستقیم `@codesandbox/sandpack-client@2.19.8`، قالب `create-react-app-typescript` و ورودی `/index.tsx` استفاده می‌کند. `react` و `react-dom` پروژهٔ نمونه روی `18.3.1` ثابت‌اند. پوستهٔ IDE پروژهٔ جداگانه‌ای با React 19، Vite 7 و Monaco 0.52 است. Monaco و workerهایش از خود Vite بارگذاری می‌شوند.⁩

⁧Sandpack فایل‌ها را به iframe با مبدأ مستقل CodeSandbox روی `2-19-8-sandpack.codesandbox.io` می‌فرستد. bundler در مرورگر کد را تبدیل و اجرا می‌کند و بارگذاری bundler و وابستگی نمونه به شبکه نیاز دارد. مسدود شدن دامنه، شبکهٔ محدود، خطای دریافت پکیج یا اختلال سرویس می‌تواند Preview را از دسترس خارج کند. پروژه همچنان قابل ویرایش است. منابع کد پروژهٔ آزمایشی به iframe بیرونی فرستاده می‌شوند. بستهٔ کلاینت مجوز Apache-2.0 دارد. میزبانی مستقل bundler در راهنمای رسمی ممکن است و در این مرحله آزموده نشده است. بررسی سازگاری و مجوز WebContainers به تصمیم مرحلهٔ ۳ واگذار شده است.⁩

- [Sandpack Client](https://sandpack.codesandbox.io/docs/advanced-usage/client)
- [Sandpack templates](https://sandpack.codesandbox.io/docs/getting-started/usage)
- [Sandpack and Monaco](https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor)
- [Hosting the bundler](https://sandpack.codesandbox.io/docs/guides/hosting-the-bundler)
- [Monaco Editor](https://github.com/microsoft/monaco-editor)
- [Vite 7 and Node requirements](https://vite.dev/blog/announcing-vite7)

## ⁧بازتولید⁩

```sh
npm ci
npx playwright install chromium
npm run dev
npm run test:e2e -- runtime.spec.ts
```

⁧آزمون سرور Vite جداگانه‌ای روی درگاه 4173 بالا می‌آورد. نصب Chromium قابل جایگزینی با Chrome نصب‌شده از طریق متغیر `PLAYWRIGHT_CHANNEL=chrome` است. سقف انتظار assertion برابر ۳۰ ثانیه و سقف سناریو ۹۰ ثانیه است.⁩

## ⁧مشاهده در نمونهٔ مستقل⁩

⁧Windows، Node `22.23.5`، npm `10.7.0` و Google Chrome با موتور Chromium در حالت headless. Node پیش‌فرض سیستم `20.15.0` بود و برای نسخهٔ Vite انتخابی از Node 22 استفاده شد. `npm ping` پاسخ داد. آزمون یک بار پس از اصلاح selector برای تفکیک هشدار Monaco از هشدار Preview با نتیجهٔ ۱ موفق اجرا شد.⁩

- ⁧شروع و نمایش عنوان اولیه و کلیک روی شمارنده تا مقدار ۱: `pass`.⁩
- ⁧جایگزینی عنوان در Monaco و نمایش عنوان تازه در iframe: `pass`.⁩
- ⁧تغییر فایل importشدهٔ `caption.ts` و نمایش متن جدید: `pass`.⁩
- ⁧ایجاد خطای واقعی `Unexpected token` و بازگشت خروجی پس از اصلاح: `pass`.⁩
- ⁧بارگذاری اولیه حدود ۶٫۵ ثانیه، از قبل از `page.goto` تا مشاهدهٔ عنوان. به‌روزرسانی عنوان حدود ۲۰۲ میلی‌ثانیه، از قبل از اعمال متن در Monaco تا مشاهدهٔ عنوان جدید در iframe. هر عدد یک مشاهده است و زمان Vite، مرورگر، شبکه و فاصلهٔ بررسی assertion را در خود دارد.⁩

⁧در نمونه، خطای build بالای آخرین خروجی سالم نمایش داده شد. این رفتار اجازه می‌دهد کاربر پیام را ببیند و بعد از اصلاح همان مسیر را ادامه دهد. React type checking چرخهٔ Preview جزو این آزمایش نیست. درخت فایل و ذخیرهٔ محلی در مرحلهٔ ۲ اضافه می‌شوند.⁩
