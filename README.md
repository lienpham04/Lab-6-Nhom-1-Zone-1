# 🏥 AI Product Hackathon — Nhóm 1 (Zone 1)
**Project:** Vinmec Medical AI (Hệ thống Hỗ trợ Đọc Ảnh Y Tế)  
**Track:** Vinmec *(AI Research)*

Kính gửi Mentor / Ban giám khảo! Chào mừng mọi người đến với repository bài làm cuối khóa Hackathon (Day 6) của Nhóm 1 - Zone 1.

Để minh bạch việc chấm điểm, nhóm đã thiết lập cấu trúc repo chính xác theo các Delivery yêu cầu. Dưới đây là hướng dẫn xem và đánh giá bài của nhóm.

---

## 🎯 Danh mục Chấm Điểm (Deliverables)

Tất cả các tài liệu cốt lõi đều được sắp xếp rõ ràng ngay ở thư mục gốc của repo này:

### 1. Bản Đặc tả Sản phẩm AI (SPEC Final)
👉 **[Mời đọc file: `spec-final.md`](./spec-final.md)**
Đây là bộ tài liệu hoàn thiện 100% gồm 6 phần theo format giảng viên cung cấp:
- **Phân tích chiến lược:** AI Product Canvas (Tập trung điểm Trust, Feasibility và Justify cho việc dùng mô hình Augmentation thay vì Automation theo đúng chuẩn đặc thù y tế).
- **Luồng người dùng:** User Stories 4 paths.
- **Tiêu chuẩn đo lường:** Evaluation Metrics (Ưu tiên *Recall* cao chót vót > 95% thay vì precision để không bỏ lọt bệnh nhân ở giai đoạn sớm).
- **Rủi ro:** Top 3 Failure Modes (Đóng bọc Guardrail cho Hallucination).
- **Hiệu quả kinh doanh:** Mô hình ROI theo 3 mức độ và các chỉ số Kill Criteria rõ ràng.
- Bản tóm tắt dự án (Mini AI Spec).

### 2. Mô hình Chạy Thử (Prototype)
👉 **[Mời đọc tài liệu hướng dẫn: `prototype-readme.md`](./prototype-readme.md)**

👉 **[Trải nghiệm Code thật: Thư mục `vinradiology/`](./vinradiology/)**
- **Chất lượng:** Nhóm đã nâng cấp từ giao diện tĩnh UI Mockup thành một **Working Prototype Fullstack**.
- Prototype mang kiến trúc Client React/Vite - Backend Base Supabase - **Edge Functions AI Engine (LLM VQA thật sự)**.
- Người dùng có thể upload ảnh X-Quang, AI tự động sinh báo cáo chuẩn y khoa. Đặc biệt có tính năng **"Self-Refinement qua Chat"**: bác sĩ chat với Bot giải thích logic, Bot tự động modify lại kết quả báo cáo ban đầu mà không cần bác sĩ gõ.
- **Link trải nghiệm live:** [Vinmec Medical AI](https://preview--vinradiology.lovable.app/)

### 3. Ấn phẩm Demo (Slides / Poster)
👉 **[Tải xuống/Xem file: `demo-slides.pdf`](./demo-slides.pdf)**
- Poster / Slide 5 phút mô tả tường tận hành trình: Nỗi đau (Problem) → Giải pháp (Solution) → Cách xử lý sai số (Handling AI Errors) → Quy trình thực tế.

---

## 👥 Phân công công việc (Thành viên)
Sự thành công của dự án có được nhờ công sức đóng góp chéo từ tất cả thành viên trong suốt hai ngày làm việc cật lực:

| Thành viên | Phân công chịu trách nhiệm | Mapping Điểm số |
|:---|:---|:---|
| **Nguyễn Khánh Huyền** | Spec phần 1 + Demo Slides | Đóng góp Product Canvas |
| **Phạm Hoàng Kim Liên** | Spec phần 2 + Poster/Demo script | Đóng góp định hình luồng User Stories |
| **Phạm Hải Đăng** | Spec phần 3, 4 + Prototype thiết kế v1 | Đóng góp lõi Metric Đánh giá, Risk & System Mockup |
| **Phạm Hoàng Long** | Spec phần 5 + Final Prototype | Kiến trúc hệ thống AI/Fullstack thực tiễn & Cân đối ROI |
| **Đào Quang Thắng** | Spec phần 6 + Prototype sơ khởi | Mini AI Spec & System Mockup |

Cảm ơn Mentor đã dành thời gian quý báu đánh giá thành quả của nhóm. Chúc Mentor chấm bài suôn sẻ và có một ngày Demo Day rực rỡ! Vinmec Medical AI xin cảm ơn!
# Lab06-Nhom1-Zone1
