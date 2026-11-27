# ⁧پیشرفت Forge Studio⁩

- ⁧مرحلهٔ ۱ — `verified`. نمونهٔ مستقل، ارتباط Monaco به Sandpack، عنوان، state، فایل دوم و خطا/بازیابی در Chromium تأیید شد.⁩ [commit نمونه](https://github.com/aynazhz/Forge-Studio/commit/cc784b9972a82c3116fa727fee85b4e55ed6dbc7) · [شواهد مرحلهٔ ۱](evidence/STAGE_1.md)
- ⁧مرحلهٔ ۲ — `verified` در محیط محلی. فضای کار، مدیریت فایل و پوشه، تب و ویرایشگر، Preview و ذخیرهٔ IndexedDB آزموده شد.⁩ [commit هستهٔ IDE](https://github.com/aynazhz/Forge-Studio/commit/e3c90075142f9fa410f87d7824ba69e795ec8eea) · [شواهد مرحلهٔ ۲](evidence/STAGE_2.md) · [گزارش کار ۱](reports/REPORT_01.md)
- ⁧مرحلهٔ ۳ — `planned`، آزمایش و انتخاب runtime و پس از آن Terminal و اجرای کامل‌تر.⁩
- ⁧مرحلهٔ ۴ — `planned`، Visual Inspector و تغییر محدود AST.⁩
- ⁧مرحلهٔ ۵ — `planned`، Task Assistant، diff و تأیید تغییر.⁩
- ⁧مرحلهٔ ۶ — `planned`، تکمیل آزمون یکپارچه، export و دموی کارشناسی.⁩

## ⁧شواهد و تصمیم‌ها⁩

⁧در Windows با Node 22.23.5 و npm 10.7.0، نصب، typecheck، lint، ۷ آزمون واحد، build، ۵ آزمون مرورگر Chrome/Chromium و بررسی خروجی build اجرا و موفق شدند. آزمون‌هایی مثل جابه‌جایی فایل و import تازه، تعارض دو تب مرورگر و خطای ذخیره نیز پوشش دارند. Firefox، Safari، عملکرد پروژهٔ بزرگ، اجرای بدون شبکه و self-host کردن bundler بررسی نشده‌اند.⁩

⁧برای رفع ناسازگاری نسخهٔ Node پیش‌فرض از Node 22 استفاده شد. Sandbox خارجی برای اثبات اجرا سریع‌تر به نتیجه رسید و به صورت adapter کوچک به هسته وصل شد. خطای ذخیره و اختلاف revision قابل مشاهده است. بررسی معنایی Monaco به علت جدا بودن حل وابستگی‌ها در Sandpack غیرفعال است. هشدار حجم خروجی Vite باقی است و build موفق است.⁩

## ⁧قدم بعدی دقیق⁩

⁧دانشجو در `src/features/workspace/PreviewPane.tsx` از `new SandpackRuntime` شروع کند. قرارداد `sandboxSetup` را کنار تست واقعی runtime بخواند و آزمایش Chromium مستقلی برای اجرای React/Vite، شروع، خروجی، خطا و توقف در runtime کاندید بسازد. نتیجه همراه شرایط مرورگر، شبکه و مجوز پیش از هر تغییر در Workspace برای بازبینی ارائه شود.⁩ [مسیر آموزش](LEARNING_PLAN.md#stage-3-start)
