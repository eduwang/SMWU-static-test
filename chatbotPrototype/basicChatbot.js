const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const input = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");
const systemPromptInput = document.getElementById("systemPrompt");

const messages = [];  // 전체 메시지를 저장하는 배열


input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && !e.shiftKey && input.value.trim() !== "") {
    e.preventDefault();

    const userMsg = input.value.trim();
    appendMessage("user", userMsg);
    input.value = "";

    // 히스토리에 추가
    messages.push({ role: "user", content: userMsg });

    const botReply = await fetchChatGPT(messages);  // 메시지 전체 전달
    appendMessage("bot", botReply);

    // 히스토리에 추가
    messages.push({ role: "assistant", content: botReply });
  }
});


function appendMessage(role, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = role;
  msgDiv.textContent = message;
  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getSelectedModel() {
  return document.querySelector('input[name="model"]:checked')?.value || "gpt-3.5-turbo";
}

async function fetchChatGPT(history) {
  try {
    const model = getSelectedModel();
    const systemPrompt = systemPromptInput.value || "당신은 친절한 챗봇입니다.";

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...history
    ];

    // 콘솔에 전달할 메시지 로그 출력
    console.log("🔍 API 요청 메시지:", fullMessages);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: fullMessages
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error("❌ API 오류:", data.error.message);
      return `⚠️ 오류: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content.trim() ?? "(응답 없음)";
  } catch (err) {
    console.error("❌ 네트워크 오류:", err);
    return `⚠️ 요청 실패: ${err.message}`;
  }
}
