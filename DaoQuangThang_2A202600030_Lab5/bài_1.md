# Phân tích lỗi Chatbot Ngân Hàng (AI UX)


| Nhóm lỗi | Ví dụ | Vì sao xảy ra | Hệ quả UX | Cách sửa (System) | Cách sửa (UX) |
|----------|------|--------------|-----------|-------------------|---------------|
| ❌ Out-of-scope | Hỏi crypto, đầu tư | Không detect domain | Trả lời sai, mất trust | Intent classifier | Thông báo phạm vi + gợi ý câu hợp lệ |
| ❌ Sai dữ liệu | Sai lãi suất | Data outdated, không query DB | Rủi ro tài chính | Kết nối DB realtime | Hiển thị nguồn + timestamp |
| ❌ Hiểu sai intent | “mo the tin dung” | Không normalize tiếng Việt | Trả lời sai | Preprocess + NLP tốt hơn | Hỏi lại + confirm |
| ❌ Không nhớ context | User hỏi tiếp câu 2 | Không lưu session | Trả lời lạc đề | Context memory | Hiển thị lại context |
| ❌ Trả lời quá chung chung | “Bạn có thể liên hệ…” | Prompt generic | Không giúp được user | Prompt tốt hơn | Gợi ý hành động cụ thể |
| ❌ Không xử lý multi-step | “Mở thẻ + hỏi phí” | Không hiểu flow | User phải hỏi lại nhiều lần | Flow engine | UI step-by-step |
| ❌ Không xử lý lỗi hệ thống | API fail | Không có fallback | Bot im lặng / lỗi | Retry + fallback | Thông báo rõ lỗi |
| ❌ Không explain | Trả kết quả không lý do | LLM chỉ output | User không tin | Add explanation layer | Hiển thị “vì sao” |
| ❌ Không cá nhân hóa | Trả lời chung | Không dùng user data | Trải nghiệm kém | User profile | Gợi ý cá nhân hóa |
| ❌ Overconfidence | Trả lời chắc chắn dù sai | Không có confidence score | Mất trust nặng | Add confidence threshold | Hiển thị “có thể không chính xác” |
| ❌ Không có undo/sửa | User nhập sai | Không có correction flow | Frustration | Edit intent | Nút “sửa câu hỏi” |
| ❌ Spam câu trả lời dài | Trả lời dài dòng | Không optimize UX | Khó đọc | Summarization | Bullet + highlight |
| ❌ Không có CTA | Không biết làm gì tiếp | Thiếu action design | Drop user | Action mapping | Nút “Mở thẻ”, “Xem lãi suất” |
| ❌ Không học từ user | User sửa nhưng bot không nhớ | Không có learning loop | Lặp lại lỗi | Feedback loop | “Cảm ơn, đã ghi nhận” |
| ❌ Không đa kênh | Web khác app | System rời rạc | UX không nhất quán | Sync backend | Đồng bộ trải nghiệm |

**Kết luận:** Chatbot ngân hàng cần ưu tiên độ chính xác và minh bạch hơn tốc độ. Quan trọng nhất là biết khi nào không chắc và cần fallback hoặc xác nhận lại với người dùng.