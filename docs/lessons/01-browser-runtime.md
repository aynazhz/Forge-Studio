# ⁧درس ۱: کد React چگونه در Preview اجرا می‌شود؟⁩

## ⁧هدف و پیش‌نیاز⁩

⁧بعد از این درس بتوانید توضیح دهید متن داخل ویرایشگر چطور به کد قابل اجرا تبدیل می‌شود. قبل از شروع، مفهوم تابع، `import` و `export` جاوااسکریپت، JSX، مقدار state و اثر کلیک را مرور کنید. در `npm run dev`، Vite پروژهٔ Forge Studio را اجرا می‌کند. پروژهٔ داخل IDE از رشته‌هایی تشکیل شده است که در `template.ts` تعریف می‌شوند و داخل Sandpack اجرا می‌شوند.⁩

## ⁧فایل‌ها را به این ترتیب بخوانید⁩

1. ⁧`src/features/project/template.ts` را از `starterFiles` بخوانید. کلیدها مسیر مجازی‌اند و مقدارها رشتهٔ متنی. `/package.json` ورودی و نسخهٔ React را تعیین می‌کند. `/index.tsx` با `createRoot`، کامپوننت App را روی `#root` نصب می‌کند و CSS نمونه را import می‌کند. `/src/App.tsx` JSX و state دارد. `/src/caption.ts` از یک ماژول دیگر مقدار می‌دهد.⁩
2. ⁧`src/features/workspace/monaco.ts` را بخوانید. `languageFor(path)` از پسوند رشتهٔ زبان Monaco را برمی‌گرداند. `getWorker` زبان را به worker خود Vite وصل می‌کند. worker به پردازش تکمیل و بررسی نحوی کمک می‌کند. Monaco مدل متنی دارد و نمای آن را به کاربر نشان می‌دهد.⁩
3. ⁧در `src/features/workspace/EditorPane.tsx`، `onDidChangeModelContent` نقطهٔ خواندن مقدار جدید است. callback، شناسهٔ فایل و کل متن را به `onEdit` می‌دهد. در `src/app/App.tsx`، تغییر توسط `editFile` به state می‌رسد و `runtimeFiles` محاسبه می‌شود.⁩
4. ⁧در `src/features/runtime/sandpack.ts`، `sandboxSetup(files)` نگاشت مسیر به متن را به ساختار `SandboxSetup` تبدیل می‌کند. مقدار `template` نوع runtime را مشخص می‌کند. تابع فقط داده برمی‌گرداند و API شبکه فراخوانی نمی‌کند.⁩
5. ⁧در `src/features/workspace/PreviewPane.tsx`، prop به نام `files` از Workspace می‌آید. یک `SandpackRuntime` برای iframe باز می‌شود و `listen` نتیجهٔ ساخت را می‌گیرد. تغییر بعد از ۲۲۰ میلی‌ثانیه سکوت با `updateSandbox` ارسال می‌شود. effect هنگام خروج، timer و listener و کلاینت را آزاد می‌کند.⁩
6. ⁧`tests/browser/runtime.spec.ts` عنوان، شمارنده، فایل دوم و بازیابی خطا را در iframe بررسی می‌کند. `tests/browser/editor.ts` متن را از مسیر واقعی ورود صفحه‌کلید به Monaco می‌دهد. اندازه‌گیری با دیدن محتوای مقصد پایان می‌یابد.⁩

## ⁧دو قطعهٔ کوچک را باز کنید⁩

```tsx
const [count, setCount] = useState(0)
return <button onClick={() => setCount(count + 1)}>{count}</button>
```

⁧خط اول state محلی کامپوننت را با مقدار اولیهٔ صفر می‌سازد. خط دوم مقدار را نمایش می‌دهد و پس از کلیک مقدار جدید را به React می‌دهد تا دوباره render کند. این state داخل پروژهٔ نمونه است، در حالی که متن همین code در state فایل‌های IDE ذخیره می‌شود.⁩

```ts
return {
  template: 'create-react-app-typescript',
  files: Object.fromEntries(
    Object.entries(files).map(([path, code]) => [path, { code }]),
  ),
}
```

⁧خط `template` حالت React TypeScript را انتخاب می‌کند. `Object.entries` از شیء ورودی جفت‌های مسیر/متن می‌سازد. `map` متن هر فایل را در شیء دارای فیلد `code` می‌گذارد. `Object.fromEntries` از جفت‌ها یک نگاشت جدید می‌سازد. این تبدیل source of truth پروژه را تغییر نمی‌دهد.⁩

## ⁧به ترتیب خودتان بازسازی کنید⁩

1. ⁧با Vite یک پوستهٔ خالی بسازید. ابتدا یک فایل ورودی، HTML و یک App شمارنده را به صورت رشته آماده کنید. پس از باز کردن Preview، کلیک روی شمارنده را امتحان کنید.⁩
2. ⁧یک Monaco با مدل `App.tsx` بسازید. روی تغییر مدل مقدار آن را در state بگذارید. در مرحلهٔ بعد state را به `updateSandbox` بدهید. معیار قبولی، تغییر عنوان از خود editor است.⁩
3. ⁧یک فایل دوم با export ثابت اضافه کنید، آن را در App وارد کنید و تغییر آن را در خروجی ببینید. سپس یک خطای نحوی ایجاد و اصلاح کنید.⁩
4. ⁧loading، نتیجهٔ build و error را با متن‌های جداگانه نمایش دهید. در یک نسخهٔ تمرینی callback را log کنید و نوع پیام‌های Sandpack را تشخیص دهید. cleanup را در زمان تعویض پروژه بررسی کنید.⁩

```sh
npm ci
npx playwright install chromium
npm run test:e2e -- runtime.spec.ts
```

⁧اگر عنوان اولیه دیده نشد، دسترسی شبکه و وضعیت Preview را بررسی کنید. اگر متن جدید به Preview نرسید، ابتدا کنترل کنید که مدل درست فعال بوده، سپس مسیر فایل را در `sandboxSetup` بررسی کنید. برای import خراب، مسیر نسبی باید از فایل واردکننده محاسبه شود. در syntax error ممکن است مرورگر آخرین خروجی سالم را زیر پیام خطا نگه دارد.⁩

## ⁧تمرین و دفاع⁩

- ⁧یک دکمهٔ `Reset` و یک مقدار exportشده از فایل دیگر اضافه کنید. آزمون باید رفتار هر دو را از داخل Preview بررسی کند.⁩
- ⁧سه بار زمان شروع را با پروفایل تازه اندازه بگیرید و دادهٔ خام، شرایط شبکه و روش مشاهدهٔ عنوان را بنویسید. چرا یک اندازه‌گیری برای ادعای سرعت کافی نیست؟⁩
- ⁧استاد ممکن است بپرسد چرا تغییر متن Monaco به خودی خود React را اجرا نمی‌کند. کدام بخش کد را برای اجرا آماده می‌کند و هر بخش در چه مبدأیی اجرا می‌شود؟⁩
- ⁧استاد ممکن است بپرسد اگر import به فایل وجودنداشته اشاره کند، Monaco، TypeScript پروژهٔ میزبان و Sandpack هر کدام چه کاری می‌کنند؟ نحوهٔ تشخیص خطا را از روی آزمون توضیح دهید.⁩

[نمونهٔ مستقل در تاریخچه](https://github.com/aynazhz/Forge-Studio/commit/cc784b9972a82c3116fa727fee85b4e55ed6dbc7) · [شواهد اجرا](../evidence/STAGE_1.md)
