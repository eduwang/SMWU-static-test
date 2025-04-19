function drawGrid(ctx, size = 25) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
  
    for (let x = 0; x <= width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  
    for (let y = 0; y <= height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  function snapToGrid(x, y, size = 25) {
    return [
      Math.round(x / size) * size,
      Math.round(y / size) * size
    ];
  }
  
  // 점 찍기 캔버스
  const pointCanvas = document.getElementById("pointCanvas");
  const pointCtx = pointCanvas.getContext("2d");
  drawGrid(pointCtx);
  
  pointCanvas.addEventListener("click", (e) => {
    const rect = pointCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const [snapX, snapY] = snapToGrid(x, y);
  
    pointCtx.fillStyle = "blue";
    pointCtx.beginPath();
    pointCtx.arc(snapX, snapY, 5, 0, Math.PI * 2);
    pointCtx.fill();
  });
  
// 점 저장 배열
const drawnPoints = [];

pointCanvas.addEventListener("click", (e) => {
  const rect = pointCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const [snapX, snapY] = snapToGrid(x, y);

  drawnPoints.push({ x: snapX, y: snapY });
  redrawAllPoints();
});


// 점 되돌리기
document.getElementById("undoPointBtn").addEventListener("click", () => {
  drawnPoints.pop(); // 마지막 점 삭제
  redrawAllPoints();
});

function redrawAllPoints() {
    drawGrid(pointCtx);
    for (const p of drawnPoints) {
      pointCtx.fillStyle = "blue";
      pointCtx.beginPath();
      pointCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      pointCtx.fill();
    }
    updatePointDebug();
  }
  
  function updatePointDebug() {
    const debugDiv = document.getElementById("pointDebug");
    if (drawnPoints.length === 0) {
      debugDiv.textContent = "(점 없음)";
      return;
    }
    debugDiv.textContent = drawnPoints
      .map((p, i) => `점 ${i + 1}: (${p.x}, ${p.y})`)
      .join("\n");
  }




// 선 그리기 캔버스
const lineCanvas = document.getElementById("lineCanvas");
const lineCtx = lineCanvas.getContext("2d");
drawGrid(lineCtx);

let isDrawing = false;
let startX, startY;

lineCanvas.addEventListener("mousedown", (e) => {
  const rect = lineCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  [startX, startY] = snapToGrid(x, y);
  isDrawing = true;
});

lineCanvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const rect = lineCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const [currentX, currentY] = snapToGrid(x, y);

  // 선 그리기 전에 격자와 기존 선을 다시 그림 (clear 후 redraw)
  drawGrid(lineCtx);
  redrawAllLines();

  lineCtx.strokeStyle = "red";
  lineCtx.lineWidth = 2;
  lineCtx.beginPath();
  lineCtx.moveTo(startX, startY);
  lineCtx.lineTo(currentX, currentY);
  lineCtx.stroke();
});

lineCanvas.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;
  isDrawing = false;

  const rect = lineCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const [endX, endY] = snapToGrid(x, y);

  // 선 저장 및 확정
  drawnLines.push({ x1: startX, y1: startY, x2: endX, y2: endY });
  drawGrid(lineCtx);
  redrawAllLines();
});

// 선 정보를 저장할 배열
const drawnLines = [];


document.getElementById("undoLineBtn").addEventListener("click", () => {
    drawnLines.pop(); // 마지막 선 삭제
    drawGrid(lineCtx);
    redrawAllLines();
  });


  function redrawAllLines() {
    drawGrid(lineCtx);
    for (const line of drawnLines) {
      lineCtx.strokeStyle = "red";
      lineCtx.lineWidth = 2;
      lineCtx.beginPath();
      lineCtx.moveTo(line.x1, line.y1);
      lineCtx.lineTo(line.x2, line.y2);
      lineCtx.stroke();
    }
    updateLineDebug();
  }
  
  function updateLineDebug() {
    const debugDiv = document.getElementById("lineDebug");
    if (drawnLines.length === 0) {
      debugDiv.textContent = "(선분 없음)";
      return;
    }
    debugDiv.textContent = drawnLines
      .map((l, i) => `선분 ${i + 1}: (${l.x1}, ${l.y1}) → (${l.x2}, ${l.y2})`)
      .join("\n");
  }
  