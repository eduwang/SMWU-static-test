const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const channelId = "UC0VR2v4TZeGcOrZHnmwbU_Q"; // 육식맨

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>검색 중입니다...</p>";

  try {
    const videos = await searchYouTubeInChannel(query, channelId);

    if (videos.length === 0) {
      resultsDiv.innerHTML = "<p>관련 영상을 찾을 수 없습니다.</p>";
      return;
    }

    let resultHTML = `<h3>‘${query}’ 관련 육식맨 영상</h3>`;

    for (const v of videos) {
      const summary = await getPerplexitySummary(query, v.url);

      resultHTML += `
        <div class="video-row">
          <div class="video-left">
            <a href="${v.url}" target="_blank">
              <img src="${v.thumbnail}" alt="썸네일" class="thumbnail" />
            </a>
            <p><strong>${v.title}</strong></p>
            <p><a href="${v.url}" target="_blank">${v.url}</a></p>
          </div>
          <div class="video-right">
            <p>${summary.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `;
    }

    resultsDiv.innerHTML = resultHTML;
  } catch (error) {
    console.error("검색 실패:", error);
    resultsDiv.innerHTML = "<p>오류가 발생했습니다. 다시 시도해주세요.</p>";
  }
});

// ✅ YouTube 검색 함수
async function searchYouTubeInChannel(query, channelId, maxResults = 3) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&channelId=${channelId}&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.items.map(item => ({
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }));
}

// ✅ Perplexity 요약 요청 함수
async function getPerplexitySummary(query, videoUrl) {
  const apiUrl = "https://api.perplexity.ai/chat/completions";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [
        { role: "system", content: "모든 응답은 한국어로 해주세요. 요리를 쉽게 설명하세요." },
        {
          role: "user",
          content: `이 영상(${videoUrl})에서 설명하는 요리 방법을 간략히 요약해 주세요.`
        }
      ]
    })
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "요약을 불러올 수 없습니다.";
}
