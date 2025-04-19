const dropArea = document.getElementById("drop-area");
const fileElem = document.getElementById("fileElem");
const preview = document.getElementById("preview");

// 드래그 이벤트 처리
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, e => e.preventDefault(), false);
});

["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.add("highlight");
  }, false);
});

["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.remove("highlight");
  }, false);
});

// 파일 드롭 처리
dropArea.addEventListener("drop", handleDrop, false);
fileElem.addEventListener("change", handleFiles, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles({ target: { files } });
}

function handleFiles(e) {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img src="${reader.result}" alt="미리보기 이미지" />`;
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일을 업로드해 주세요.");
    }
  }
}
