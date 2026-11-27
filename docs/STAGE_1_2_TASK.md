# مأموریت Codex: اجرای مراحل ۱ و ۲

## قواعد
مخزن aynazhz/Forge-Studio، ابتدا main و AGENTS.md و PROJECT_CONTEXT.md را بررسی کن. کار در شاخه feature/stage-1-2-foundation، با commitهای کوچک، push و PR برای بررسی؛ main را بدون اجازه merge نکن. تغییرات موجود را حفظ کن. پروژه آموزشی است؛ ساده و قابل توضیح بساز. فقط مراحل ۱ و ۲. AI، AST/Visual Editor، terminal واقعی، Git integration، backend و cloud فعلاً خارج از محدوده‌اند. README و مستندات فارسی، نام‌های کد انگلیسی. هیچ نتیجه تست یا screenshot جعلی ثبت نکن.

## مرحله ۱: اثبات امکان‌پذیری
۱. Node/npm و دسترسی npm registry را بررسی کن. نسخه‌های سازگار و مستندات رسمی Monaco و runtime را بررسی کن. React + Vite + TypeScript و lockfile ایجاد کن؛ نسخه Node مورد نیاز را ثبت کن.
۲. یک آزمایش کوچک واقعی بساز: فایل App.tsx با عنوان و state/click counter، Monaco editor، runtime و Preview. ابتدا Sandpack را ارزیابی کن (React TS template و وابستگی‌های مشخص). تغییرات editor باید واقعاً به runtime برسد؛ نه iframe با HTML ساختگی یا شبیه‌سازی. بررسی کن وابستگی به سرویس bundler خارجی چیست و چه محدودیت‌هایی دارد. اگر نامناسب بود WebContainers یا گزینه معتبر را با توضیح، شرایط browser/cross-origin و مجوز ارزیابی کن.
۳. تغییر عنوان، اجرای state/click، ویرایش فایل دوم و خطای syntax/بازیابی پس از اصلاح را در مرورگر Chromium واقعی آزمایش کن. زمان تقریبی راه‌اندازی و به‌روزرسانی را با روش اندازه‌گیری ثبت کن؛ در صورت عدم امکان، صریحاً blocked بنویس. خطاها و وضعیت loading را نمایش بده.
۴. docs/evidence/STAGE_1.md شامل انتخاب runtime و trade-off، دستورات اجرا، محیط، خروجی واقعی، محدودیت‌ها و مسیر تست بساز. نمونه اولیه را در commit مستقل نگه دار یا با مسیر قابل بازتولید در تاریخچه مشخص کن. قبل از ادامه، صحت ارتباط editor و runtime را تأیید کن؛ اگر blocked شد، وضعیت را ثبت کن و مرحله دوم را فقط با محدودیت شفاف پیش ببر.

## مرحله ۲: هسته IDE
طراحی desktop-first حرفه‌ای، با CSS خوانا و تم تیره، نه یک داشبورد آماده. ساختار پیشنهادی:
- src/app/ : App و Workspace layout.
- src/features/workspace/ : Workspace، Explorer، TabBar، EditorPane، PreviewPane، اجزای resize.
- src/features/project/ : typeهای فایل/پوشه، store و عملیات خالص tree، قالب اولیه.
- src/features/runtime/ : adapter کوچک runtime و همگام‌سازی فایل‌ها.
- src/lib/ : persistence و ابزارهای مشترک.
- tests/ : آزمون‌های unit و browser. ساختار را اگر ساده‌تر شد اصلاح و مستند کن.

پیاده‌سازی:
- پروژه نمونه React/TS واقعی با فایل‌های متعدد، امکان ایجاد پروژه جدید و بازکردن پروژه ذخیره‌شده.
- درخت فایل/پوشه باز و بسته‌شونده؛ create/rename/delete فایل و پوشه، move با روش ساده قابل استفاده (drag-drop اجباری نیست)، جلوگیری از نام تکراری، مسیر نامعتبر، move به داخل فرزند، حذف ناخواسته؛ تأیید حذف پوشه غیرخالی.
- یک منبع حقیقت برای فایل‌ها با شناسه پایدار و مسیر معتبر؛ runtime projection است نه نسخه مستقل. تغییر محتوای Monaco به store و سپس runtime منتقل شود. تغییرات سریع و تعویض تب موجب گم‌شدن متن نشود. پس از rename/move/delete، مسیر runtime و مدل Monaco و تب‌ها همگام شوند؛ import refactoring خودکار لازم نیست، خطاهای import باید واقعی نشان داده شوند.
- تب چندفایلی، تب فعال، close، رفتار درست در حذف/تغییرنام فایل، حفظ undo/view state تا حد امکان با مدل‌های Monaco و dispose مناسب.
- syntax highlighting و قابلیت تکمیل کد Monaco در محدوده پشتیبانی واقعی (ادعای language server کامل نکن). جست‌وجوی متن در پروژه و بازکردن نتیجه. میانبرهای ساده و قابل دسترس.
- layout شامل نوار بالا، Explorer، TabBar/Editor و Preview قابل تغییر اندازه. وضعیت خالی، خطا و loading. labels قابل دسترس و focus واضح. terminal واقعی به مرحله سوم موکول شود، اگر پنل خطا هست نام درست داشته باشد.
- ذخیره خودکار IndexedDB (در صورت استفاده از راهکار ساده‌تر، علت و محدودیت را ثبت کن)، بازیابی بعد از reload، خطاهای ذخیره‌سازی قابل مشاهده. ذخیره metadata workspace/active file و فایل‌ها؛ مراقب race و overwrite داده باش. در نسخه اولیه چند پروژه با ذخیره محلی کافی است.
- Preview واقعی مرحله ۱ را یکپارچه کن. UI نمایشی یا mock را قابلیت کامل اعلام نکن.
- dependencies ضروری فقط. پکیج‌ها و secrets و node_modules و build artifacts وارد git نشوند.

## معیار قبولی و آزمون
- npm ci، npm run typecheck، npm run lint، npm run test (غیر watch)، npm run build و npm run test:e2e (نام اسکریپت‌ها را در README مطابق واقعیت ثبت کن).
- unit: create/rename/delete/move، نام تکراری، cycle، تب و فایل فعال، serialization/restore.
- browser: ایجاد پروژه، ویرایش App.tsx و دیدن عنوان جدید در Preview، اجرای counter، ایجاد فایل و import آن، switch/close tab بدون از دست دادن متن، rename/move/delete و مشاهده رفتار واقعی، reload و بازیابی، خطای syntax و اصلاح، resize پنل.
- تست‌های runtime وابسته به شبکه را با timeout و پیش‌نیاز شفاف اجرا کن؛ mock را معادل اجرای واقعی ندان. اگر شبکه یا مرورگر مانع است، evidence و وضعیت blocked ثبت کن. CI پایه typecheck/lint/unit/build و در صورت امکان مرورگر اضافه کن.
- بررسی خروجی build و اجرای واقعی dev server؛ screenshot واقعی در صورت امکان و بدون اطلاعات خصوصی. هیچ ادعای عملکرد عددی بدون اندازه‌گیری نکن.

## مستندات آموزشی الزامی
- README.md: معرفی، setup و اجرا، لینک مستندات، وضعیت واقعی.
- AGENTS.md: قواعد موجود را حفظ کن و مسیر ادامه را به‌روز کن.
- docs/PROJECT_CONTEXT.md: زمینه موجود را حفظ کن؛ تصمیم‌های جدید را با دلیل ثبت کن.
- docs/ARCHITECTURE.md: ماژول‌ها، flow از Monaco به store و runtime، persistence، محدودیت‌ها و نمودار Mermaid.
- docs/ROADMAP.md: مراحل ۱ تا ۶ با معیار پایان، scope و وابستگی.
- docs/LEARNING_PLAN.md: ترتیب یادگیری، پیش‌نیازها و قواعد همکاری.
- docs/lessons/01-browser-runtime.md و 02-ide-core.md: برای هر درس توضیح مفهومی از پایه، فایل‌های واقعی به ترتیب، مسئولیت هر کامپوننت/type/function، ورودی/خروجی، قطعه کد کوچک و توضیح خط به خط بخش‌های مهم، flow و خطاهای متداول، نحوه اجرای تست، تمرین بازسازی و سؤال دفاع. دانشجو باید خودش بتواند توضیح بدهد و تغییر کوچک بدهد.
- docs/PROGRESS.md: وضعیت هر مرحله planned/in progress/verified/blocked، commit، شواهد، تست‌های اجراشده و نشده، مشکلات، تصمیم‌ها، قدم بعدی دقیق.
- docs/evidence/STAGE_2.md: اجرای واقعی معیارها با نتیجه pass/fail/blocked.
- docs/reports/REPORT_01.md: گزارش فارسی طبیعی دانشجوی ترم ۷، درباره کار واقعاً انجام شده در دو مرحله، هدف، اقدامات، ابزارها، نتیجه، مشکلات، وضعیت تست و مرحله بعد. نقش کمک ابزار AI در پیاده‌سازی پایه را صادقانه بیان کن؛ ادعا نکن دانشجو شخصاً کد یا آزمایشی را انجام داده که انجام نداده است. اگر ناقص است گزارش پیشرفت باشد، نه گزارش تکمیل.

## تحویل
PR با خلاصه تغییرات، commit SHA، لینک گزارش و درس‌ها، نتایج دقیق تست، محدودیت‌ها، screenshot واقعی در صورت وجود و قدم بعدی. قبل از پایان diff را بازبینی کن، وضعیت git و remote را کنترل کن. اگر مانع وجود دارد کارهای قابل انجام را تکمیل و push کن و مانع را روشن گزارش بده. توقف پس از مرحله دوم؛ مراحل ۳ تا ۶ را فقط در roadmap تعریف کن.
