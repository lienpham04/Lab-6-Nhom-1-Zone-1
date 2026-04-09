# Prototype — Hệ thống Phân tích Ảnh Y Khoa AI (MedVision)

## 1. Mô tả
Ứng dụng Web AI (MedVision) hỗ trợ bác sĩ tự động sinh báo cáo X-Quang và tham vấn Y khoa từ hình ảnh. 
**Điểm nổi bật:** Kiến trúc hệ thống là sự kết hợp giữa **Orchestrator Agent** điều phối VLM Analysis và cơ chế **Self-Refinement Agent** (tự đánh giá, tinh chỉnh báo cáo). Bác sĩ có thể trực tiếp chat với hệ thống từ giao diện Báo cáo để yêu cầu chỉnh sửa, AI sẽ tự động phân tích và update dữ liệu trên báo cáo, sau đó hỗ trợ xuất file PDF chuẩn chỉ nhanh chóng.

## 2. Level phát triển: Working Prototype
Hệ thống đã đạt mức chạy thực tế với Backend Database và AI tích hợp sẵn:
- Chạy qua Lovable Cloud (Supabase) Database schema, xác thực người dùng (Auth).
- Sử dụng AI Gateway kết hợp mô hình xử lý VLM tân tiến để xử lý ảnh X-Quang và VQA trực tiếp.
- Cơ chế Self-Refinement và Orchestrator được build vào Edge Functions độc lập.

## 3. Link truy cập
https://preview--vinradiology.lovable.app/

## 4. Công cụ (Tools & Tech Stack)
- **Frontend Layer:** React 18, TypeScript 5, Vite 5.
- **UI Framework/Design:** Tailwind CSS v3, hệ thống UI component shadcn/ui.
- **State Management & Routing:** TanStack React Query, React Router v6.
- **Backend Services:** Supabase Auth, PostgreSQL Supabase DB.
- **AI Core:** Supabase Edge Functions (chạy runtime Deno), Lovable AI Gateway.
- **Trích xuất văn bản:** html2pdf.js.

## Phân công
| Thành viên | Phần | Output |
|-----------|------|--------|
| Phạm Hải Đăng | Spec phần 3, 4 + prototype draft | spec-final.md phần 3, 4 + prototype-readme.md + prototype-draft/vinmec-prototype |
| Phạm Hoàng Long | Spec phần 5 + final prototype | spec-final.md phần 5 + vinradiology |
| Nguyễn Khánh Huyền | Spec phần 1 + demo slides | spec-final.md phần 1 + demo-slides.pdf |
| Phạm Hoàng Kim Liên | Spec phần 2 + poster | spec-final.md phần 2 + poster |
| Đào Quang Thắng | Spec phần 6 + prototype draft | spec-final.md phần 6 + prototype-draft/medreport-ai |