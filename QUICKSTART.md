# 🚀 Quick Start Guide

## Bước 1: Cài đặt dependencies
```bash
npm install
```

## Bước 2: Cấu hình Firebase

### 2.1. Tạo Firebase Project
1. Truy cập https://console.firebase.google.com/
2. Click "Add project"
3. Đặt tên project (ví dụ: "ueb-trading")
4. Disable Google Analytics (không bắt buộc)
5. Click "Create project"

### 2.2. Enable Google Authentication
1. Trong Firebase Console, vào **Authentication**
2. Click tab **Sign-in method**
3. Click **Google** provider
4. Enable và Save
5. Thêm email hỗ trợ (support email)

### 2.3. Lấy Firebase Configuration
1. Click icon ⚙️ (Settings) > **Project settings**
2. Scroll xuống phần "Your apps"
3. Click icon **</>** (Web)
4. Đăng ký app với nickname (ví dụ: "UEB Web App")
5. Copy Firebase config object

### 2.4. Cập nhật Firebase Config
Mở file `src/lib/firebase.ts` và thay thế:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // Thay bằng giá trị thực
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Bước 3: Test Domain Restriction

**Lưu ý quan trọng:** Domain restriction `hd: 'vnu.edu.vn'` chỉ là **client-side validation**.

### Để test local:
1. Comment dòng validation trong `src/contexts/AuthContext.tsx`:
```typescript
// if (user && user.email && !user.email.endsWith('@vnu.edu.vn')) {
//   firebaseSignOut(auth);
//   setUser(null);
//   alert('Chỉ cho phép đăng nhập với email @vnu.edu.vn');
// }
```

2. Chạy app và đăng nhập với bất kỳ email Google nào
3. Sau khi test xong, uncomment lại để enable validation

### Để enforce domain restriction (Production):
Bạn cần setup Firebase Cloud Functions:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkEmailDomain = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  if (!email || !email.endsWith('@vnu.edu.vn')) {
    await admin.auth().deleteUser(user.uid);
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only @vnu.edu.vn emails are allowed'
    );
  }
});
```

## Bước 4: Chạy ứng dụng
```bash
npm run dev
```

Mở trình duyệt: http://localhost:5173

## Bước 5: Test Flow
1. Ứng dụng sẽ redirect đến `/login`
2. Click "Đăng nhập với Google"
3. Chọn tài khoản Google
4. Sau khi đăng nhập thành công, redirect đến `/dashboard`

## 🎨 Customize UI

### Thêm shadcn/ui components:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add form
```

### Thay đổi theme colors:
Edit `src/index.css` phần `:root` variables

## 🔧 Troubleshooting

### Lỗi: "Firebase: Error (auth/configuration-not-found)"
→ Kiểm tra lại Firebase config trong `src/lib/firebase.ts`

### Lỗi: "Firebase: Error (auth/unauthorized-domain)"
→ Thêm `localhost` vào Authorized domains trong Firebase Console
→ Authentication > Settings > Authorized domains

### Lỗi: Module not found
→ Chạy `npm install` lại

### Ứng dụng không hiển thị gì
→ Mở DevTools Console (F12) để xem lỗi
→ Kiểm tra Network tab xem có lỗi API không

## 📦 Build cho Production

```bash
npm run build
```

Output sẽ ở thư mục `dist/`

## 🚀 Deploy lên Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

## 📚 Next Steps

1. ✅ Thêm Firestore để lưu data
2. ✅ Tạo thêm pages: Trading, Portfolio, Settings
3. ✅ Thêm real-time trading features
4. ✅ Implement dark mode
5. ✅ Add toast notifications
6. ✅ Setup Firebase Security Rules

---

Nếu cần hỗ trợ, tham khảo:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Router Docs](https://reactrouter.com)
