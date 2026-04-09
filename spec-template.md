# SPEC — AI Product Hackathon: Medical VLM

**Nhóm:** Nhóm AI Research - Y Tế
**Track:** ☐ VinFast · ☑ Vinmec *(AI Research)* · ☐ VinUni-VinSchool · ☐ XanhSM · ☐ Open
**Problem statement (1 câu):** *Bác sĩ chẩn đoán hình ảnh đang quá tải vì khối lượng phim chụp lớn (X-ray, CT) gây mệt mỏi dễ dẫn đến sai sót; Medical VLM giúp giải quyết bằng cách tự động phân tích ảnh y tế, sinh dự thảo báo cáo chẩn đoán (Report Generation) và trả lời hỏi đáp trực quan (Visual QA).*

---

## 1. AI Product Canvas

|   | Value | Trust | Feasibility |
|---|-------|-------|-------------|
| **Câu hỏi** | User nào? Pain gì? AI giải gì? | Khi AI sai thì sao? User sửa bằng cách nào? | Cost/latency bao nhiêu? Risk chính? |
| **Trả lời** | *Bác sĩ chẩn đoán hình ảnh mất ~10-15 phút/ca phức tạp để đọc và viết báo cáo thủ công. Trợ lý VLM tự sinh text gợi ý, rút ngắn xuống còn 2-3 phút, hỗ trợ hỏi đáp chéo.* | *AI sai có thể dẫn tới phác đồ điều trị sai (nguy hiểm tính mạng). Bác sĩ phải nhìn thấy ngay bằng cách đối chiếu highlight của AI vs chuyên môn, sửa bằng nút "Edit Report" trên Web.* | *Chi phí inference khá đắt (~$0.05/ảnh) do chạy GPU. Latency 5-10s. Risk chính: Hallucination (AI tự "bịa" ra khối u không có thật).* |

**Automation hay augmentation?** ☐ Automation · ☑ Augmentation
Justify: *Lĩnh vực Y tế bắt buộc dùng Augmentation. Bác sĩ MANG TRÁCH NHIỆM PHÁP LÝ cuối cùng, AI chỉ đóng vai trò phân tích sơ bộ bộ lọc số 1.*

**Learning signal:**

1. User correction đi vào đâu? *Lưu vào Database làm "Ground-Truth" (Dữ liệu dán nhãn của chuyên gia).*
2. Product thu signal gì để biết tốt lên hay tệ đi? *Tỷ lệ Chấp nhận ngay (Acceptance Rate) không cần sửa, và Số ký tự bị bác sĩ xóa/edit (Edit Distance).*
3. Data thuộc loại nào? ☐ User-specific · ☑ Domain-specific *(Y khoa)* · ☐ Real-time · ☑ Human-judgment *(Chất xám bác sĩ)* 
   Có marginal value không? (Model đã biết cái này chưa?) *Có marginal value THẬT SỰ CAO, vì dữ liệu y tế dán nhãn bởi chuyên gia rất đắt và hiếm, public model chưa thể tiếp cận trọn vẹn đặc thù tại từng bệnh viện.*

---

## 2. User Stories — 4 paths

### Feature: *Trợ lý AI Tự động sinh báo cáo chẩn đoán (Report Generation)*

**Trigger:** *Bác sĩ upload 1 tấm ảnh X-Ray lồng ngực bệnh nhân lên Web App → Gọi hàm Inference từ VLM...*

| Path | Câu hỏi thiết kế | Mô tả |
|------|-------------------|-------|
| Happy — AI đúng, tự tin | User thấy gì? Flow kết thúc ra sao? | *Sinh ra báo cáo đúng, bác sĩ chỉ cần đọc và ký tên.* |
| Low-confidence — AI không chắc | System báo "không chắc" bằng cách nào? User quyết thế nào? | *AI chỉ hiển thị cảnh báo đỏ lợt và ghi thêm dòng: "Chất lượng mờ, cần đối chiếu lâm sàng thêm về khả năng u tinh tế". Bác sĩ chú ý soi kỹ hơn khu vực đó.* |
| Failure — AI sai | User biết AI sai bằng cách nào? Recover ra sao? | *Nếu AI nhầm, bác sĩ thấy vô lý, bấm nút [Reject] kết quả hoặc dùng chuột gạch bỏ dòng chữ kết luận đó ngay trên giao diện web.* |
| Correction — user sửa | User sửa bằng cách nào? Data đó đi vào đâu? | *Bác sĩ bấm vào UI, tự gõ lại báo cáo thủ công. Văn bản mới (đã sửa) + tấm ảnh X-ray gốc sẽ được luân chuyển vào Datapool đẩy qua cho bộ phận MLOps để dành cho đợt Fine-tune model tiếp theo.* |

---

## 3. Eval metrics + threshold

**Optimize precision hay recall?** ☐ Precision · ☑ Recall
Tại sao? *Trong ngành Y, thà "bắt nhầm còn hơn bỏ sót" (Thà false positive phải kiểm tra lại, còn hơn False negative bỏ lọt bệnh nhân ung thư giai đoạn sớm). Tối ưu hóa RECALL để AI quét ra tất cả các dấu hiệu nghi ngờ tổn thương dù là nhỏ nhất.*
Nếu sai ngược lại thì chuyện gì xảy ra? *Nếu tối ưu Precision mà Low Recall -> AI sẽ cho kết quả rất "sạch" và an toàn, nhưng vô tình bỏ sót các tổn thương mờ nhạt, dẫn đến bác sĩ chủ quan tin vào AI, gây hậu quả nghiêm trọng.*

| Metric | Threshold | Red flag (dừng khi) |
|--------|-----------|---------------------|
| *Recall/Sensitivity (Độ nhạy phát hiện bệnh)* | *≥ 95%* | *Recall < 80% trong 2 tuần liên tiếp* |
| *Acceptance Rate (Bác sĩ không cần sửa report)* | *≥ 60%* | *< 20% (AI tạo ra vô số "rác", bác sĩ thà tự làm còn hơn đọc)* |

---

## 4. Top 3 failure modes

*Liệt kê cách product có thể fail — không phải list features.*
*"Failure mode nào user KHÔNG BIẾT bị sai? Đó là cái nguy hiểm nhất."*

| # | Trigger | Hậu quả | Mitigation |
|---|---------|---------|------------|
| 1 | *Ngộ nhận (Hallucination)* | *AI bịa ra một khối u không tồn tại (False Positive tự tin cao).* | *Giải pháp UX: Giao diện luôn kèm dòng disclaimer "Đây là dự thảo, Vui lòng kiểm tra lại", ép bác sĩ phải tick ☑ "Tôi đã xem".* |
| 2 | *Phim chụp chất lượng kém / bị nhiễu độ sáng / nhòe* | *AI đọc nhòe → Đưa ra chẩn đoán "Bình thường" che mắt phần tổn thương dưới bóng mờ.* | *Tiền xử lý (Pre-processing filter) bằng thuật toán thị giác CV để cảnh báo "Chất lượng phim quá tối/sáng, đề nghị từ chối phân tích AI".* |
| 3 | *Hỏi đáp (Visual QA) ngoài chuyên môn Y tế* | *Bác sĩ (hoặc người nhà) test chatbot up ảnh chế hoặc hỏi ngoài lề gây lỗi hệ thống.* | *Model Fine-Tuned phải có system prompt Guardrail chặn mọi chủ đề off-topic, chỉ trả lời phạm vi giải phẫu hình ảnh y khoa.* |

---

## 5. ROI 3 kịch bản

|   | Conservative (Thận trọng)| Realistic (Thực tế) | Optimistic (Lạc quan) |
|---|-------------|-----------|------------|
| **Assumption** | *10 bác sĩ khoa hình ảnh dùng thử, 50% hài lòng* | *20 bác sĩ dùng, 75% hài lòng* | *Triển khai toàn chuỗi viện (100+ bác sĩ), 90% hài lòng* |
| **Cost** | *$50/tháng (Cloud GPU + Database)* | *$100/tháng (Nâng resource server)* | *$500/tháng (Dedicated instances)* |
| **Benefit** | *Mỗi người giảm 1h/ngày, quen flow mới.* | *Giảm 25% nguồn lực, Bác sĩ tập trung vào case khó.* | *Tốc độ trả KQ cho bệnh nhân x2, doanh thu viện tăng 15%, zero sai sót.* |
| **Net** | *Chưa lãi tài chính rõ ràng, nhưng thu được learning signal* | *Hòa vốn đầu tư AI, lãi về công suất* | *Cực kỳ lợi nhuận về lâu dài* |

**Kill criteria:** *Khi nào nên dừng? Khi System báo lỗi Server hoặc thời gian xử lý AI lâu hơn quá 30 giây/ảnh (Làm bác sĩ chậm tiến độ hơn so với không dùng), hoặc tỷ lệ sửa bài > 90% trong tháng đầu tiên deployment.*

---

## 6. Mini AI spec (1 trang)

**Tóm tắt Dự án: Medical VLM - Nền tảng Hỗ trợ Đọc Ảnh Y Tế**

**1. Vấn đề giải quyết:**
Chu trình chẩn đoán hình ảnh hiện tại mang tính thủ công 100%, một file DICOM/X-ray phải được quan sát rất tốn sức. Cường độ cao vào giờ cao điểm dẫn tới dễ bỏ sót tổn thương. Hơn thế, việc gõ các template chẩn đoán lặp đi lặp lại rất tốn giờ.

**2. Giải pháp AI:**
Sử dụng công nghệ Vision-Language Model (VLM), fine-tune trên dữ liệu chuyên biệt Y tế (MIMIC-CXR hoặc tập Custom Hospital Dataset), được bọc bằng web-app UI trực quan: 
- Nạp ảnh lên -> Model trích xuất thông tin ảnh -> Sinh dự thảo Báo cáo Y khoa ngay trên màn hình.
- Phục vụ cơ chế Chat QA qua text để bác sĩ "truy vấn" tấm ảnh ngay lập tức. 

**3. Cơ chế hoạt động (Augmentation):**
AI tuyệt đối không ra mặt trực tiếp cho bệnh nhân. AI chỉ đóng vị trí Cố vấn cho bác sĩ (Second Opinion Tool). Flow kết nối yêu cầu bác sĩ bắt buộc phải Review UI và bấm "Ký tên điện tử" nếu Đồng ý, hoặc sửa trực tiếp chữ ngay trên màn hình. 

**4. Quality & Risk:**
Mô hình sẽ theo đuổi tối đa ngưỡng "Recall" để đánh sập rủi ro bỏ lọt bệnh nhân. Risk lớn nhất là Hallucinations bị model sinh nội dung vô lý, được Mitigation (giảm thiểu) thông qua guardrail rule-based và yêu cầu confirm bắt buộc từ chuyên gia con người.

**5. Vòng lặp cải thiện (Data Flywheel):**
Sản phẩm ban đầu sẽ thô, nhưng những thao tác, sửa chữ, xóa báo cáo của Bác sĩ sẽ được Record lại thành cặp (Image X-Ray vs Khẳng định chính xác của chuyên gia). DB này chính là "mỏ vàng" để team AI huấn luyện định kỳ lại Base Model, tạo ra Data Flywheel đưa chất lượng nền tảng tiệm cận với vị bác sĩ giỏi nhất của bệnh viện.