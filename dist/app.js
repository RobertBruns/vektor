const $ = (id) => document.getElementById(id),
  canvas = $("source"),
  ctx = canvas.getContext("2d", { willReadFrequently: true });
let svg = "",
  name = "beispiel-pflanze",
  timer,
  loops = [];
function simplify(p, e) {
  if (p.length < 3) return p;
  let a = p[0],
    b = p[p.length - 1],
    max = 0,
    idx = 0,
    dx = b[0] - a[0],
    dy = b[1] - a[1],
    den = dx * dx + dy * dy;
  for (let i = 1; i < p.length - 1; i++) {
    let t = den ? Math.max(0, Math.min(1, ((p[i][0] - a[0]) * dx + (p[i][1] - a[1]) * dy) / den)) : 0,
      d = Math.hypot(p[i][0] - a[0] - t * dx, p[i][1] - a[1] - t * dy);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  return max > e ? [...simplify(p.slice(0, idx + 1), e).slice(0, -1), ...simplify(p.slice(idx), e)] : [a, b];
}
// Divides each pixel by its local background brightness (box mean via an integral image),
// so shadows and uneven light on photographed paper become white before thresholding.
function flatten(gray, w, h) {
  let r = Math.max(8, Math.round(Math.max(w, h) / 16)),
    W = w + 1,
    sum = new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y++)
    for (let x = 0, row = 0; x < w; x++) {
      row += gray[y * w + x];
      sum[(y + 1) * W + x + 1] = sum[y * W + x + 1] + row;
    }
  for (let y = 0; y < h; y++) {
    let y0 = Math.max(0, y - r),
      y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      let x0 = Math.max(0, x - r),
        x1 = Math.min(w, x + r + 1),
        mean = (sum[y1 * W + x1] - sum[y0 * W + x1] - sum[y1 * W + x0] + sum[y0 * W + x0]) / ((y1 - y0) * (x1 - x0));
      gray[y * w + x] = Math.min(255, (255 * gray[y * w + x]) / Math.max(mean, 1));
    }
  }
}
function trace() {
  let w = canvas.width,
    h = canvas.height,
    pixels = ctx.getImageData(0, 0, w, h).data,
    mask = new Uint8Array(w * h),
    threshold = +$("threshold").value,
    inv = $("invert").checked,
    gray = new Float32Array(w * h);
  for (let i = 0; i < gray.length; i++) {
    let a = pixels[i * 4 + 3] / 255;
    gray[i] = (0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2]) * a + 255 * (1 - a);
  }
  if ($("flatten").checked) flatten(gray, w, h);
  for (let i = 0; i < mask.length; i++) mask[i] = inv ? gray[i] > threshold : gray[i] < threshold;
  let seen = new Uint8Array(w * h),
    min = +$("speckle").value;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i] || seen[i]) continue;
    let q = [i];
    seen[i] = 1;
    for (let k = 0; k < q.length; k++) {
      let j = q[k],
        x = j % w;
      for (let n of [x > 0 ? j - 1 : -1, x < w - 1 ? j + 1 : -1, j - w, j + w])
        if (n >= 0 && n < mask.length && mask[n] && !seen[n]) {
          seen[n] = 1;
          q.push(n);
        }
    }
    if (q.length < min) q.forEach((j) => (mask[j] = 0));
  }
  let edges = new Map(),
    stride = w + 1;
  function edge(x, y, u, v) {
    let key = y * stride + x,
      end = v * stride + u;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push(end);
  }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      if (!y || !mask[(y - 1) * w + x]) edge(x, y, x + 1, y);
      if (x === w - 1 || !mask[y * w + x + 1]) edge(x + 1, y, x + 1, y + 1);
      if (y === h - 1 || !mask[(y + 1) * w + x]) edge(x + 1, y + 1, x, y + 1);
      if (!x || !mask[y * w + x - 1]) edge(x, y + 1, x, y);
    }
  loops = [];
  while (edges.size) {
    let start = edges.keys().next().value,
      key = start,
      points = [];
    do {
      points.push([key % stride, Math.floor(key / stride)]);
      let list = edges.get(key);
      if (!list) break;
      let end = list.pop();
      if (!list.length) edges.delete(key);
      key = end;
    } while (key !== start);
    if (points.length >= 3) {
      points.push(points[0]);
      loops.push(points);
    }
  }
  render();
}
function render() {
  let e = +$("smooth").value,
    paths = loops
      .map((p) => {
        let mid = Math.floor(p.length / 2);
        let s = [...simplify(p.slice(0, mid + 1), e).slice(0, -1), ...simplify(p.slice(mid), e)];
        return "M" + s.map((v) => v.join(",")).join("L") + "Z";
      })
      .join("");
  let bg = $("transparent").checked ? "" : `<rect width="100%" height="100%" fill="white"/>`;
  svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">${bg}<path fill="${$("ink").value}" fill-rule="evenodd" d="${paths}"/></svg>`;
  $("vector").innerHTML = svg;
  $("pathCount").textContent = loops.length + " Konturen";
  $("status").textContent = loops.length
    ? "✓ Fertig · bearbeitbare Vektorpfade"
    : "Keine Linien gefunden. Schwellenwert ändern oder Bild invertieren.";
  $("download").disabled = $("share").disabled = !loops.length;
}
function update() {
  ["threshold", "smooth", "speckle"].forEach((id) => ($(id + "Value").value = $(id).value));
  $("status").textContent = "Skizze wird vektorisiert…";
  clearTimeout(timer);
  timer = setTimeout(trace, 100);
}
["threshold", "smooth", "speckle", "invert", "flatten"].forEach((id) => $(id).addEventListener("input", update));
["ink", "transparent"].forEach((id) => $(id).addEventListener("input", render));
function sample() {
  canvas.width = 660;
  canvas.height = 800;
  ctx.fillStyle = "#fcfcfa";
  ctx.fillRect(0, 0, 660, 800);
  ctx.strokeStyle = "#3d493b";
  ctx.lineWidth = 3.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(314, 700);
  ctx.bezierCurveTo(321, 540, 350, 340, 337, 118);
  ctx.stroke();
  function leaf(x, y, tx, ty, bend) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + bend, y - 80, tx - 35, ty - 15, tx, ty);
    ctx.bezierCurveTo(tx + 30, ty + 55, x + bend / 2, y + 15, x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + bend / 2, y - 30, tx, ty);
    ctx.stroke();
  }
  leaf(321, 626, 180, 484, -105);
  leaf(329, 554, 475, 397, 105);
  leaf(336, 466, 196, 332, -110);
  leaf(341, 381, 455, 226, 95);
  leaf(341, 296, 252, 173, -78);
  leaf(339, 218, 364, 91, 40);
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 130; i++) {
    let x = (i * 137) % 660,
      y = (i * 251) % 800;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
  $("filename").textContent = "beispiel-pflanze.png";
  name = "beispiel-pflanze";
  update();
}
async function load(file, fromCamera) {
  if (!file) return;
  if ((file.type && !file.type.startsWith("image/")) || file.size > 20 * 1024 * 1024) {
    $("status").textContent = "Bitte ein Bild (JPG, PNG, WebP, HEIC) unter 20 MB wählen.";
    return;
  }
  $("status").textContent = "Bild wird geladen…";
  let url = URL.createObjectURL(file),
    img = new Image();
  img.onload = () => {
    let scale = Math.min(1, 900 / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    if (fromCamera) {
      let d = new Date(),
        pad = (n) => String(n).padStart(2, "0");
      name = `skizze-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
      $("flatten").checked = true;
    } else name = file.name.replace(/\.[^.]+$/, "");
    $("filename").textContent = fromCamera ? "Kamerafoto" : file.name;
    update();
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    $("status").textContent = "Dieses Bild konnte nicht gelesen werden. Versuch eine andere Datei.";
  };
  img.src = url;
}
$("upload").onclick = () => $("file").click();
$("camera").onclick = () => $("cameraFile").click();
document.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => $(b.dataset.pick).click()));
$("file").onchange = (e) => {
  load(e.target.files[0]);
  e.target.value = "";
};
$("cameraFile").onchange = (e) => {
  load(e.target.files[0], true);
  e.target.value = "";
};
$("sample").onclick = sample;
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  document.querySelector(".workspace").classList.add("dragging");
});
document.addEventListener("dragleave", () =>
  document.querySelector(".workspace").classList.remove("dragging"),
);
document.addEventListener("drop", (e) => {
  e.preventDefault();
  document.querySelector(".workspace").classList.remove("dragging");
  load(e.dataTransfer.files[0]);
});
function setView(view) {
  document.querySelectorAll("[data-view]").forEach((c) => c.classList.toggle("active", c.dataset.view === view));
  $("panels").className = "panels view-" + view;
}
document.querySelectorAll("[data-view]").forEach((b) => (b.onclick = () => setView(b.dataset.view)));
// Narrow screens have room for one panel only; split view falls back to the vector
let narrow = matchMedia("(max-width: 850px)");
if (narrow.matches) setView("vector");
narrow.addEventListener?.("change", (e) => setView(e.matches ? "vector" : "split"));
$("reset").onclick = () => {
  $("threshold").value = 160;
  $("smooth").value = 1.2;
  $("speckle").value = 8;
  $("invert").checked = false;
  $("flatten").checked = false;
  $("ink").value = "#263d35";
  $("transparent").checked = true;
  update();
};
$("download").onclick = () => {
  let blob = new Blob([svg], { type: "image/svg+xml" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name + ".svg";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
function svgFile() {
  return new File([svg], name + ".svg", { type: "image/svg+xml" });
}
if (navigator.canShare && navigator.canShare({ files: [new File([""], "x.svg", { type: "image/svg+xml" })] })) {
  $("share").hidden = false;
  $("share").onclick = () => navigator.share({ files: [svgFile()], title: name + ".svg" }).catch(() => {});
}
$("help").onclick = () => $("guide").showModal();
$("closeGuide").onclick = () => $("guide").close();
fetch("version.txt", { cache: "no-cache" })
  .then((r) => (r.ok ? r.text() : ""))
  .then((v) => v && ($("version").textContent = "· Stand " + v.trim()))
  .catch(() => {});
sample();
