const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

const API_URL = "https://api.perplexity.ai/chat/completions";
const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>검색 중입니다...</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: "간결하고 정확하게 답해줘" },
          {
            role: "user",
            content: `${query}과 관련하여 적합한 Youtube 비디오를 찾아주고 어떻게 만드는지 설명해줘. 
            단, 아래 유튜브 채널 내에서만 찾아주세요.
            https://www.youtube.com/@YOOXICMAN
            유투비 링크와 요약을 포함해주세요.`
          }
        ]
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const youtubeLinks = extractYouTubeLinks(content);

    // 결과 HTML 구성
    let resultHTML = `<div><h3>검색 결과 요약</h3><p>${content.replace(/\n/g, "<br>")}</p></div>`;

    if (youtubeLinks.length > 0) {
      resultHTML += `<h3>관련 영상</h3>`;
      youtubeLinks.forEach(link => {
        const videoId = extractVideoId(link);
        if (videoId) {
          resultHTML += `
            <div class="video-item">
              <a href="${link}" target="_blank">
                <img src="https://img.youtube.com/vi/${videoId}/0.jpg" alt="YouTube 썸네일" class="thumbnail"/>
              </a>
              <p><a href="${link}" target="_blank">${link}</a></p>
            </div>
          `;
        }
      });
    }

    resultsDiv.innerHTML = resultHTML;
  } catch (error) {
    console.error("검색 실패:", error);
    resultsDiv.innerHTML = "<p>오류가 발생했습니다. 다시 시도해주세요.</p>";
  }
});

// 🔍 유튜브 링크 추출 함수
function extractYouTubeLinks(text) {
  const urlRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/g;
  return text.match(urlRegex) || [];
}

// 🔍 video ID 추출 함수
function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}
