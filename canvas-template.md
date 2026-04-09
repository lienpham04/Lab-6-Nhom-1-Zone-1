# AI Product Canvas — template

Điền Canvas cho product AI của nhóm. Mỗi ô có câu hỏi guide — trả lời trực tiếp, xóa phần in nghiêng khi điền.

---

## Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| **Câu hỏi guide** | User nào? Pain gì? AI giải quyết gì mà cách hiện tại không giải được? | Khi AI sai thì user bị ảnh hưởng thế nào? User biết AI sai bằng cách nào? User sửa bằng cách nào? | Cost bao nhiêu/request? Latency bao lâu? Risk chính là gì? |
| **Trả lời** | *Bác sĩ chẩn đoán hình ảnh mất ~10-15 phút/ca phức tạp để đọc và viết báo cáo thủ công. Trợ lý VLM tự sinh text gợi ý, rút ngắn xuống còn 2-3 phút, hỗ trợ hỏi đáp chéo.* | *AI sai có thể dẫn tới phác đồ điều trị sai (nguy hiểm tính mạng). Bác sĩ phải nhìn thấy ngay bằng cách đối chiếu highlight của AI vs chuyên môn, sửa bằng nút "Edit Report" trên Web.* | *Chi phí inference khá đắt (~$0.05/ảnh) do chạy GPU. Latency 5-10s. Risk chính: Hallucination (AI tự "bịa" ra khối u không có thật).* |

---

## Automation hay augmentation?

☐ Automation — AI làm thay, user không can thiệp
☑ Augmentation — AI gợi ý, user quyết định cuối cùng

**Justify:** *Lĩnh vực Y tế bắt buộc dùng Augmentation. Bác sĩ MANG TRÁCH NHIỆM PHÁP LÝ cuối cùng, AI chỉ đóng vai trò phân tích sơ bộ bộ lọc số 1 (Second Opinion).*

---

## Learning signal

| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | User correction đi vào đâu? | *Lưu vào Database làm "Ground-Truth" (Dữ liệu dán nhãn của chuyên gia).* |
| 2 | Product thu signal gì để biết tốt lên hay tệ đi? | *Tỷ lệ Chấp nhận ngay (Acceptance Rate) không cần sửa, và Số ký tự bị bác sĩ xóa/edit (Edit Distance).* |
| 3 | Data thuộc loại nào? ☐ User-specific · ☑ Domain-specific · ☐ Real-time · ☑ Human-judgment · ☐ Khác: ___ | *Chất xám bác sĩ* |

**Có marginal value không?** *Có marginal value THẬT SỰ CAO, vì dữ liệu y tế dán nhãn bởi chuyên gia rất đắt và hiếm, public model chưa thể tiếp cận trọn vẹn đặc thù tại từng bệnh viện.*
___

---

## Cách dùng

1. Điền Value trước — chưa rõ pain thì chưa điền Trust/Feasibility
2. Trust: trả lời 4 câu UX (đúng → sai → không chắc → user sửa)
3. Feasibility: ước lượng cost, không cần chính xác — order of magnitude đủ
4. Learning signal: nghĩ về vòng lặp dài hạn, không chỉ demo ngày mai
5. Đánh [?] cho chỗ chưa biết — Canvas là hypothesis, không phải đáp án