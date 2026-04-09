import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PatientInfo {
  age: string;
  gender: string;
  history: string;
  clinicalNotes: string;
}

export async function generateMedicalReport(patientInfo: PatientInfo, imageDescription: string, modality: string = 'xray') {
  if (modality !== 'xray') {
    return "Hiện tại hệ thống chỉ hỗ trợ phân tích X-quang.";
  }

  const prompt = `
Bạn là "MedReport AI – AI hỗ trợ bác sĩ". Hãy thực hiện MODE 1: GENERATE REPORT.

INPUT:
- Modality: ${modality}
- Patient Info: Age ${patientInfo.age}, Gender ${patientInfo.gender}, History: ${patientInfo.history}
- Notes: ${patientInfo.clinicalNotes}
- Image Description: ${imageDescription}

YÊU CẦU:
1. Sử dụng ngôn ngữ y khoa chuyên nghiệp, tiếng Việt.
2. KHÔNG đưa ra chẩn đoán tuyệt đối (dùng "có thể", "nghi ngờ", "chưa loại trừ").
3. Ưu tiên thông tin từ ghi chú của bác sĩ.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:

### 🧾 BÁO CÁO X-QUANG

**1. Thông tin bệnh nhân**
* Giới tính: ${patientInfo.gender}
* Tuổi: ${patientInfo.age}
* Tiền sử bệnh: ${patientInfo.history || 'Chưa ghi nhận'}

---
**2. Mô tả hình ảnh X-quang**
(Mô tả cấu trúc phổi / xương và ghi nhận bất thường dựa trên mô tả: ${imageDescription})

---
**3. Nhận định sơ bộ**
(Dựa trên hình ảnh và lâm sàng: ${patientInfo.clinicalNotes})

---
**4. Chẩn đoán đề xuất**
(Đưa ra các khả năng, không kết luận tuyệt đối)

---
**5. Khuyến nghị**
(Đề xuất CT / MRI / theo dõi hoặc xét nghiệm bổ sung)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating medical report:", error);
    throw error;
  }
}

export async function editMedicalReport(currentReport: string, doctorMessage: string, patientInfo: PatientInfo) {
  const prompt = `
Bạn là "MedReport AI – AI hỗ trợ bác sĩ". Hãy thực hiện MODE 2: EDIT REPORT (CHAT).

INPUT:
- Current Report: ${currentReport}
- Doctor Message: ${doctorMessage}
- Patient Info: Age ${patientInfo.age}, Gender ${patientInfo.gender}

NHIỆM VỤ:
1. Sửa đổi báo cáo HIỆN TẠI dựa trên yêu cầu của bác sĩ.
2. KHÔNG viết lại toàn bộ nếu không cần thiết. Chỉ sửa phần liên quan.
3. Ưu tiên tuyệt đối ý kiến của bác sĩ.
4. Giữ nguyên cấu trúc 5 phần của báo cáo X-quang.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:

### 🔧 CẬP NHẬT BÁO CÁO

**Yêu cầu:**
${doctorMessage}

---
**Thay đổi:**

OLD:
(Đoạn văn bản cũ cần thay đổi)

NEW:
(Đoạn văn bản mới sau khi sửa)

---
**Báo cáo sau cập nhật:**
(Toàn bộ nội dung báo cáo mới hoàn chỉnh)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error editing medical report:", error);
    throw error;
  }
}

export interface AnalyticsData {
  total_reports: number;
  total_patients: number;
  time_range: string;
  reports: Array<{
    diagnosis: string;
    age: number;
    gender: string;
  }>;
}

export async function generateAnalyticsSummary(data: AnalyticsData) {
  const prompt = `
Bạn là "MedReport AI – AI hỗ trợ bác sĩ". Hãy thực hiện MODE 4: ANALYTICS.

INPUT:
- Tổng số báo cáo: ${data.total_reports}
- Tổng số bệnh nhân: ${data.total_patients}
- Danh sách chẩn đoán: ${JSON.stringify(data.reports)}
- Khoảng thời gian: ${data.time_range}

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:

### 📈 TỔNG QUAN
(Tóm tắt các con số thống kê chính)

---
### 🧠 INSIGHT
(Phân tích xu hướng bệnh lý, tỷ lệ bất thường, phân tích theo độ tuổi/giới tính nếu có)

---
### ⚠️ CẢNH BÁO
(Các dấu hiệu bất thường cần chú ý hoặc sự gia tăng đột biến của một loại bệnh)

---
### 💡 GỢI Ý
(Đề xuất hành động cho bác sĩ hoặc cải thiện quy trình)

QUY TẮC:
- Không bịa đặt thông tin nếu thiếu dữ liệu.
- Tập trung vào các xu hướng thực tế.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    throw error;
  }
}

export async function finalizeReport(report: string) {
  const prompt = `
Bạn là "MedReport AI – AI hỗ trợ bác sĩ". Hãy thực hiện MODE 3: FINALIZE (SAVE & EXIT).

NHIỆM VỤ:
1. Làm sạch báo cáo: Xóa toàn bộ các dấu vết chỉnh sửa (OLD/NEW, ghi chú chat, diff).
2. Đảm bảo ngôn ngữ y khoa chuyên nghiệp, chuẩn để lưu trữ và xuất PDF.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:

### ✅ BÁO CÁO HOÀN TẤT
(Nội dung báo cáo sạch sẽ, đầy đủ 5 phần)

---
### 🧾 TÓM TẮT NGẮN
* Chẩn đoán chính: ...
* Tình trạng: (bình thường / nghi ngờ / cần theo dõi / khẩn cấp)
* Ghi chú: ...

BÁO CÁO CẦN XỬ LÝ:
${report}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error finalizing report:", error);
    throw error;
  }
}

export async function submitFeedback(originalReport: string, patientInfo: PatientInfo, finalReport?: string) {
  if (!finalReport) return "Feedback received.";

  const prompt = `
Bạn là "MedReport AI – AI hỗ trợ bác sĩ". Hãy thực hiện MODE 5: LEARNING FROM DOCTOR.

INPUT:
- Original AI Output: ${originalReport}
- Doctor Edited Version: ${finalReport}

NHIỆM VỤ:
1. Phân tích sự khác biệt giữa bản gốc của AI và bản bác sĩ đã sửa.
2. Rút ra bài học để cải thiện khả năng tạo báo cáo trong tương lai.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:

### 🧠 PHÂN TÍCH

**Sai sót:**
(AI đã thiếu sót hoặc nhầm lẫn ở đâu?)

**Chỉnh sửa:**
(Bác sĩ đã thay đổi những gì quan trọng?)

**Bài học:**
(AI cần lưu ý gì cho các trường hợp tương tự?)

---
### 📌 RULE
If <điều kiện lâm sàng/yêu cầu bác sĩ> → then <hành vi AI tốt hơn trong tương lai>
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("AI Learning Output:", response.text);
    return response.text;
  } catch (error) {
    console.error("Error in learning mode:", error);
    return "Feedback processed.";
  }
}
