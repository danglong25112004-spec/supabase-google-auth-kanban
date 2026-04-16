# TaskFlow - Ứng dụng Quản lý Công việc Hiện đại

Ứng dụng quản lý công việc (Kanban) được xây dựng bằng React, TypeScript, Tailwind CSS và Supabase.

## Tính năng
- Đăng nhập bằng Google OAuth qua Supabase Auth.
- Giao diện Dark Modern chuyên nghiệp.
- Bảng Kanban kéo thả (mô phỏng) với đầy đủ CRUD.
- Dashboard tổng quan với thống kê thời gian thực.
- Phân tích dữ liệu với biểu đồ trực quan.
- Quản lý hồ sơ người dùng.
- Responsive hoàn toàn cho Mobile và Desktop.

## Hướng dẫn thiết lập

### 1. Supabase Setup
1. Tạo một dự án mới trên [Supabase](https://supabase.com/).
2. Mở **SQL Editor** và chạy nội dung file `supabase_schema.sql`.
3. Bật **Google Auth** trong phần **Authentication > Providers**:
   - Cấu hình Client ID và Client Secret từ Google Cloud Console.
   - Thêm Redirect URI: `https://<your-project-id>.supabase.co/auth/v1/callback`.

### 2. Biến môi trường
Tạo file `.env` dựa trên `.env.example` và điền thông tin từ Supabase (Project Settings > API):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Chạy ứng dụng
```bash
npm install
npm run dev
```

## Cấu trúc thư mục
- `src/lib`: Cấu hình Supabase.
- `src/services`: Logic tương tác dữ liệu.
- `src/hooks`: Custom hooks (Auth).
- `src/components`: Các component dùng chung.
- `src/layouts`: Layout chính của ứng dụng.
- `src/pages`: Các trang chức năng.
- `src/types`: Định nghĩa kiểu dữ liệu TypeScript.
