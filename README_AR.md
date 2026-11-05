# Alkholy.A — نسخة الويب

نسخة ويب متجاوبة للهاتف والكمبيوتر، مبنية على Firebase Authentication وCloud Firestore.
لا تستخدم Firebase Storage في هذه النسخة.

## المزايا الموجودة
- إنشاء حساب وتسجيل الدخول بالبريد وكلمة المرور.
- إنشاء/تحديث ملف المستخدم داخل `Users` باستخدام UID كمعرّف المستند.
- البحث عن المستخدمين وبدء محادثة خاصة.
- رسائل نصية مباشرة عبر Firestore.
- تحديث آخر رسالة في `Conversations`.
- حالات نصية تنتهي بعد 24 ساعة.
- تعديل الاسم الظاهر.
- العربية والإنجليزية والفرنسية.
- تصميم متجاوب للهاتف والكمبيوتر.

## ملاحظات مهمة
- المكالمات الصوتية غير مفعلة في هذه النسخة.
- الصور والفيديو والملفات مؤجلة لأن Firebase Storage غير مفعّل.
- لا تضع Service Account أو مفاتيح Admin SDK داخل ملفات الواجهة.
- ملف إعداد Firebase Web config يحتوي بيانات تعريف تطبيق الويب، وليس مفتاح Admin. لا تنشر أي أسرار أو كلمات مرور.
- هذه النسخة لا تحذف أو تنقل بياناتك القديمة. ستنشئ محادثات جديدة بمعرّف ثابت مبني على UID الطرفين.

## 1) إضافة إعداد Firebase
1. افتح `firebase-config.js`.
2. من Firebase Console افتح Project settings ثم General ثم Your apps.
3. اختر تطبيق الويب وانسخ إعدادات `firebaseConfig`.
4. ضع القيم في الملف مكان `PASTE_...` مع إبقاء أسماء المفاتيح كما هي.

## 2) Authentication
تأكد من تفعيل Email/Password في Authentication > Sign-in method.

## 3) Firestore
تستخدم النسخة هذه المجموعات بأحرفها كما هي:
- `Users`
- `Conversations`
- `Messages`

**قواعد Firestore:** راجع ملف `firestore.rules` قبل نشره. القواعد الموجودة في مشروعك حالياً تمنع قراءة ملفات المستخدمين الآخرين؛ لذلك البحث وقائمة الحالات لن يعملا حتى تسمح القواعد للمستخدم المسجل بقراءة ملفات `Users`. القواعد المرفقة تسمح بقراءة ملفات المستخدمين المسجلين فقط، مع قصر الإنشاء والتعديل على صاحب المستند. انسخها إلى تبويب Rules بعد مراجعتها ثم اضغط Publish. لا تستخدم قواعد مفتوحة مثل `allow read, write: if true`.

## 4) تشغيل التطبيق
لا تفتح `index.html` بالنقر المباشر؛ استخدم خادماً محلياً لأن الملفات تستخدم JavaScript modules.
- عبر VS Code: إضافة Live Server ثم Open with Live Server.
- أو عبر Python: من مجلد المشروع شغّل `python -m http.server 8000` ثم افتح `http://localhost:8000`.

## 5) النشر
يمكن نشر الملفات الثابتة على استضافة HTTPS تدعم static sites. لا ترفع `README_AR.md` إذا كنت لا تريد إظهاره للزوار.

## فهارس Firestore
إذا طلب Firestore إنشاء فهرس عند فتح الرسائل أو قائمة المحادثات، افتح رابط إنشاء الفهرس الذي يظهر في رسالة الخطأ، ثم أنشئ الفهرس وانتظر اكتماله.

## بنية البيانات
`Users/{uid}`:
- `Name`, `name`, `displayName`, `email`, `Status`, `createdAt`
- الحالات: `statusText`, `statusExpiresAt`, `statusUpdatedAt`

`Conversations/{sortedUid1__sortedUid2}`:
- `user1`, `user2`, `lastMessage`, `updatedAt`

`Messages/{autoId}`:
- `senderId`, `receiverId`, `conversationId`, `message`, `timestamp`
