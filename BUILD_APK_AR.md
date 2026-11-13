# Ahmed alkholy — Android APK build

هذا المشروع جاهز للبناء عبر GitHub Actions من الهاتف، ولا يحتاج إلى Android Studio على الهاتف.

## إنشاء APK من الهاتف

1. فك ضغط ملف ZIP ثم ارفع **محتويات مجلد `alkholy_project`** إلى مستودع GitHub جديد.
   يجب أن يكون `build.gradle` و`settings.gradle` ومجلد `app` في جذر المستودع.
2. افتح المستودع في GitHub ثم اختر تبويب **Actions**.
3. اختر **Build Ahmed alkholy APK** ثم اضغط **Run workflow**.
4. انتظر حتى تنتهي العملية بعلامة خضراء.
5. افتح نتيجة التشغيل (workflow run)، وانزل إلى **Artifacts**.
6. نزّل `Ahmed-alkholy-debug-apk.zip`، وافتحه على الهاتف واستخرج `app-debug.apk` ثم ثبّته.

يمكن أن يبدأ البناء تلقائياً أيضاً عند رفع الملفات إلى فرع `main` أو `master`.

## معلومات الإصدار

- اسم التطبيق: Ahmed alkholy
- Android application ID: `com.alkholy.a`
- Minimum Android: 6.0 (API 23)
- Build: Debug APK للاختبار
- واجهة التطبيق: ملفات HTML/CSS/JavaScript محلية داخل WebView
- API الحالي وفق ملف README داخل المشروع: `https://medoaoft.fwh.is/api/index.php`
- المصادقة: PHP/MySQL، ولا يستخدم هذا الإصدار Firebase Authentication.

## حدود النسخة الحالية

هذا البناء لا يضيف وظائف غير موجودة في المصدر. وفق توثيق المشروع، رفع الصور والمكالمات الصوتية والإشعارات الفورية غير مكتملة في هذه النسخة. يجب اختبار تسجيل الدخول والاتصال بالخادم بعد تثبيت APK.

## ملاحظات أمان

- لا تضع كلمات مرور الاستضافة أو قاعدة البيانات أو مفاتيح خاصة داخل GitHub.
- ملف APK الناتج Debug مخصص للاختبار، وليس إصداراً نهائياً للنشر على المتجر.
- يلزم اتصال إنترنت للوصول إلى واجهة PHP API.
