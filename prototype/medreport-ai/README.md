<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏥 MedReport AI – AI Hỗ Trợ Bác Sĩ Viết Báo Cáo Y Khoa

---

## 📌 Giới thiệu

**MedReport AI** là hệ thống web sử dụng trí tuệ nhân tạo (Gemini) để hỗ trợ bác sĩ trong việc tối ưu hóa quy trình lập trình báo cáo y khoa:

* Tạo báo cáo X-quang tự động từ mô tả hình ảnh và thông tin lâm sàng.
* Chỉnh sửa báo cáo thông minh thông qua giao diện Chat (AI Copilot).
* Lưu trữ và quản lý báo cáo tập trung.
* Phân tích dữ liệu bệnh lý (Dashboard Analytics).
* Học hỏi và cải thiện từ các chỉnh sửa thực tế của bác sĩ (Feedback Learning).

👉 Mục tiêu: **Giảm thời gian nhập liệu + Tăng hiệu suất làm việc cho đội ngũ y bác sĩ.**

---

## 🎯 Tính năng chính

### 👨‍⚕️ Bác sĩ (Doctor)
* **Tạo báo cáo:** Nhập thông tin bệnh nhân và mô tả hình ảnh để AI sinh báo cáo tự động.
* **AI Copilot:** Chỉnh sửa nhanh các phần của báo cáo bằng ngôn ngữ tự nhiên (ví dụ: "Thêm tiền sử hen suyễn").
* **Hoàn thiện:** Làm sạch báo cáo, xóa các ghi chú kĩ thuật để sẵn sàng lưu trữ/in ấn.
* **Quản lý:** Xem lịch sử báo cáo và dashboard phân tích xu hướng bệnh lý.

### 🧑‍🤝‍🧑 Bệnh nhân (Patient)
* Theo dõi kết quả chẩn đoán và thông tin cá nhân.
* Xem lịch sử khám bệnh và các khuyến nghị từ bác sĩ.

---

## 🧠 AI Capabilities (Multi-mode)

Hệ thống hoạt động dựa trên 5 chế độ (Mode) xử lý chuyên biệt:

1. **Generate Report (Mode 1):** Tạo báo cáo X-quang chuẩn y khoa 5 phần dựa trên input bác sĩ.
2. **Edit via Chat (Mode 2):** Tiếp nhận yêu cầu chỉnh sửa và cập nhật báo cáo một cách thông minh, ưu tiên ý kiến chuyên môn của bác sĩ.
3. **Finalize Report (Mode 3):** Làm sạch văn bản, chuẩn hóa ngôn ngữ y khoa để xuất PDF.
4. **Analytics (Mode 4):** Phân tích dữ liệu tổng hợp để đưa ra Insight, Cảnh báo và Gợi ý.
5. **Learning Loop (Mode 5):** So sánh AI Output và bản chỉnh sửa cuối cùng của bác sĩ để rút ra các "Rule" cải thiện thuật toán.

---

## ⚙️ Kiến trúc hệ thống

Dự án được xây dựng với kiến trúc hiện đại, tập trung vào tốc độ và khả năng phản hồi thời gian thực:

```
Giao diện người dùng (React + Vite)
        ↓
Xử lý logic & AI Agent (TypeScript)
        ↓
Mô hình ngôn ngữ lớn (Gemini 3.1 Flash)
        ↓
Lưu trữ dữ liệu (Browser LocalStorage)
```

---

## 🔄 Luồng hoạt động (Workflow)

```
[ Đăng nhập Bác sĩ ]
        ↓
[ Nhập thông tin bệnh nhân + Mô tả X-Quang ]
        ↓
[ AI Generate Report ]
        ↓
[ Chat chỉnh sửa với Copilot ]
        ↓
[ Finalize - Hoàn thiện & Lưu trữ ]
        ↓
[ AI Learning & Dashboard Update ]
```

---

## 📂 Cấu trúc project

```
medreport-ai/
 ├── src/
 │    ├── components/     # Các thành phần giao diện (Login, Dashboard, ...)
 │    ├── services/       # Xử lý Logic AI (GeminiService.ts)
 │    ├── assets/         # Tài nguyên hình ảnh, style
 │    ├── App.tsx         # Luồng điều hướng chính
 │    └── main.tsx        # Entry point của ứng dụng
 ├── public/              # File tĩnh
 ├── index.html           # File HTML chính
 ├── vite.config.ts       # Cấu hình Vite
 ├── package.json         # Danh sách thư viện & Scripts
 └── .env.local           # Biến môi trường (API Key)
```

---

## 🚀 Cách chạy project (LOCAL)

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt **Node.js** trên máy tính.

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình API Key
Tạo file `.env.local` tại thư mục gốc và thêm khóa API của bạn:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 🔥 Điểm mạnh dự án
* ✅ **AI Copilot:** Hỗ trợ tương tác tự nhiên, hiểu ngữ cảnh y khoa.
* ✅ **Workflow hoàn chỉnh:** Từ khâu nhập liệu đến hoàn tất báo cáo chỉ trong vài phút.
* ✅ **Tự học (Learning Loop):** Hệ thống thông minh hơn sau mỗi lần sử dụng.
* ✅ **Trực quan:** Dashboard giúp bác sĩ có cái nhìn tổng quát về tình hình bệnh nhân.

---

## 🚀 Hướng phát triển
* Tích hợp Computer Vision để tự động phát hiện dấu hiệu bệnh từ ảnh X-quang.
* Hỗ trợ đa ngôn ngữ và đa phương thức (MRI, CT, Siêu âm).
* Kết nối cơ sở dữ liệu cloud (PostgreSQL/MongoDB) để đồng bộ dữ liệu đa thiết bị.
* Hỗ trợ nhập liệu bằng giọng nói (Voice-to-Report).

---
**Tác giả:** MedReport AI Team
**Version:** 1.0.0-beta
