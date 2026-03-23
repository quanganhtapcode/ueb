# UEB Trading Platform

Hệ thống giao dịch được xây dựng với React, TypeScript, shadcn/ui và Firebase Authentication.

## 🚀 Tính năng

- ✅ **React 19** với TypeScript
- ✅ **Vite** cho development và build nhanh
- ✅ **shadcn/ui** - UI components đẹp và accessible
- ✅ **Tailwind CSS** cho styling
- ✅ **Firebase Authentication** với Google Sign-In
- ✅ **Domain Restriction** - Chỉ cho phép email @vnu.edu.vn
- ✅ **React Router** với Protected Routes
- ✅ **Responsive Design**

## 📋 Yêu cầu

- Node.js 18+ 
- npm hoặc yarn
- Tài khoản Firebase project

## 🔧 Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
cd UEB
npm install
```

### 2. Cấu hình Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **Project Settings** > **General** và copy Firebase config
4. Vào **Authentication** > **Sign-in method**
   - Enable **Google** provider
   - Thêm domain `vnu.edu.vn` vào **Authorized domains** (nếu cần)

5. Cập nhật file `src/lib/firebase.ts` với Firebase config của bạn:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Cấu hình Google OAuth với Domain Restriction

Để hạn chế chỉ cho phép email @vnu.edu.vn đăng nhập:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project Firebase của bạn
3. Vào **APIs & Services** > **Credentials**
4. Click vào OAuth 2.0 Client ID
5. Scroll xuống phần **Restrictions**
6. Chọn **Add URI** trong **Authorized redirect URIs**
7. Thêm: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`

**Lưu ý:** Domain restriction (`hd: 'vnu.edu.vn'`) trong code chỉ là client-side validation. Để bảo mật hoàn toàn, bạn cần:
- Kiểm tra email domain trong Firebase Cloud Functions
- Hoặc sử dụng Firebase Auth Custom Claims

## 🚀 Chạy ứng dụng

### Development mode

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx  # Auth state management
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   └── utils.ts         # Utility functions
├── pages/
│   ├── LoginPage.tsx    # Login với Google
│   └── DashboardPage.tsx
├── App.tsx
└── main.tsx
```

## 🔐 Authentication Flow

1. User truy cập ứng dụng
2. Nếu chưa đăng nhập → redirect đến `/login`
3. Click "Đăng nhập với Google"
4. Chọn tài khoản Google với đuôi @vnu.edu.vn
5. Nếu email không phải @vnu.edu.vn → từ chối và hiển thị lỗi
6. Đăng nhập thành công → redirect đến `/dashboard`

## 🎨 Thêm shadcn/ui Components

Dự án đã được cấu hình sẵn cho shadcn/ui. Để thêm components mới:

```bash
npx shadcn@latest add [component-name]
```

Ví dụ:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
```

## 🔨 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📝 To-Do / Mở rộng

- [ ] Thêm Firestore để lưu trữ dữ liệu giao dịch
- [ ] Tích hợp API giao dịch thực tế
- [ ] Thêm các trang: Trading, Portfolio, History
- [ ] Thêm Dark mode toggle
- [ ] Thêm notification system
- [ ] Deploy lên Firebase Hosting

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Firebase configuration
2. Đảm bảo Google Auth đã được enable
3. Kiểm tra console logs trong browser

---

Made with ❤️ for VNU students

