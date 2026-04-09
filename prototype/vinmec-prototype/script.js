// Routing logic
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');
    
    // Update nav state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (viewId === 'create-report') {
        document.getElementById('nav-create').classList.add('active');
    }
}

let uploadedImageSrc = null;

// Upload preview
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('upload-zone').style.display = 'none';
        document.getElementById('file-preview').style.display = 'flex';
        document.getElementById('file-name').innerText = file.name;
        
        if (uploadedImageSrc) URL.revokeObjectURL(uploadedImageSrc);
        uploadedImageSrc = URL.createObjectURL(file);
    }
}

function resetUpload() {
    document.getElementById('file-input').value = "";
    document.getElementById('upload-zone').style.display = 'block';
    document.getElementById('file-preview').style.display = 'none';
    if (uploadedImageSrc) {
        URL.revokeObjectURL(uploadedImageSrc);
        uploadedImageSrc = null;
    }
}

// Upload submit mockup logic
function submitForAnalysis(isValidImage) {
    const notesInput = document.getElementById('clinical-notes').value || "Không có thông tin lâm sàng bổ sung";
    
    // Show Loading
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('active');

    setTimeout(() => {
        loadingOverlay.classList.remove('active');
        if (!isValidImage) {
            // Flow 2: Invalid image error
            document.getElementById('alert-modal').classList.add('active');
        } else {
            // Flow 3: Success, go to report
            document.getElementById('result-notes').innerText = notesInput;
            if (uploadedImageSrc) {
                document.getElementById('report-image').src = uploadedImageSrc;
            }
            switchView('report-result');
        }
    }, 2000);
}

function closeAlert() {
    document.getElementById('alert-modal').classList.remove('active');
    resetUpload(); // Require re-upload
}

// Chat Component logic
function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const inputEL = document.getElementById('chat-input');
    const userMsg = inputEL.value.trim();
    if (!userMsg) return;

    appendMessage('user', userMsg);
    inputEL.value = '';

    // Simulate AI thinking
    const typingId = appendTypingIndicator();
    
    const chatBody = document.getElementById('chat-messages');
    chatBody.scrollTop = chatBody.scrollHeight;

    // AI logic check (Step 4 Demo)
    setTimeout(() => {
        removeTypingIndicator(typingId);
        
        const lowerMsg = userMsg.toLowerCase();
        
        // Mock branch: Logical update request
        if (lowerMsg.includes('viêm phổi')) {
            appendMessage('ai', `Chào bác sĩ,\nTrên hình ảnh X-quang, chúng ta thấy **có hình ảnh gợi ý mạnh mẽ của đông đặc phổi (mờ đồng nhất)** đặc biệt là ở vùng giữa và dưới. Đây là một trong những dấu hiệu chính của viêm phổi.\n\nDo đó, báo cáo nháp ban đầu có thể đã đánh giá thiếu rủi ro này. Tôi xác nhận thông tin của bác sĩ là **hợp lý** và sẽ chỉnh sửa lại kết luận để cảnh báo thêm về khả năng viêm phổi.`);
            
            // Effect: automatically update report
            setTimeout(() => {
                const reportConclusion = document.getElementById('report-conclusion');
                const reportHighlight = document.getElementById('report-lung-highlight');
                
                reportHighlight.innerHTML = `<span class="text-highlight">Có hình ảnh gợi ý đông đặc phổi (mờ đồng nhất) ở vùng giữa và dưới, theo dõi viêm phổi.</span>`;
                reportConclusion.innerHTML = `<span class="text-highlight">Hình ảnh X-Quang ngực gợi ý có đông đặc phổi, nhiều khả năng liên quan đến viêm phổi. Đề xuất làm thêm xét nghiệm máu và lâm sàng để chẩn đoán xác định.</span>`;
                
                appendMessage('ai', '✅ *Báo cáo đã được cập nhật nội dung mờ đông đặc ở phổi và khuyến nghị*.');
            }, 1000);

        } 
        // Mock branch: Non-logical or invalid request
        else if (lowerMsg.includes('gãy xương') || lowerMsg.includes('chuẩn đoán ung thư')) {
            appendMessage('ai', `Dựa trên kết quả phân tích ảnh **Chest X-Ray** vừa tải lên, hệ thống không ghi nhận dấu hiệu nào của gãy xương sườn (hoặc khối u). Trục xương cân đối và không rạn nứt.\n\nYêu cầu thêm chi tiết này **không khớp với hình ảnh thực tế**. Bác sĩ có muốn tôi chỉ định thêm chụp CT cắt lớp để có góc nhìn chi tiết hơn không? Tôi sẽ giữ nguyên báo cáo để đảm bảo tính chính xác và an toàn y khoa.`);
        }
        // General Chat
        else {
            appendMessage('ai', 'Tôi đã ghi nhận ý kiến. Tuy nhiên yêu cầu chưa rõ ràng hoặc không ảnh hưởng logic lâm sàng hiện tại. Bác sĩ vui lòng mô tả rõ hơn vùng cần xem xét.');
        }

    }, 2500);
}

function appendMessage(sender, text) {
    const chatBody = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message message-${sender}`;
    // simple formatting for newlines and bolds mock
    let formattedText = text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>');
    msgDiv.innerHTML = formattedText;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function appendTypingIndicator() {
    const chatBody = document.getElementById('chat-messages');
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'chat-typing';
    typingDiv.innerHTML = `<span></span><span></span><span></span>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typingId;
}

function removeTypingIndicator(id) {
    const typingDiv = document.getElementById(id);
    if (typingDiv) {
        typingDiv.remove();
    }
}
