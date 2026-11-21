const fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
const elements = {};
const el = (id) =>
  (elements[id] ??= {
    value: { threshold: 160, smooth: 0, speckle: 0, ink: "#263d35" }[id] || "",
    checked: id === "transparent",
    addEventListener() {},
    classList: { toggle() {} },
    getContext() {
      return {
        getImageData() {
          return { data: pixels };
        },
      };
    },
  });
let pixels;
const context = {
  document: {
    getElementById: el,
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
  },
  setTimeout() {},
  clearTimeout() {},
  Uint8Array,
  console,
  fetch: () => Promise.resolve({ ok: false }),
  matchMedia: () => ({ matches: false }),
  navigator: {},
};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(require("path").join(__dirname, "../dist/app.js"), "utf8").replace(/sample\(\);\s*$/, ""),
  context,
);
function test(mask, count) {
  el("source").width = 5;
  el("source").height = 5;
  pixels = new Uint8ClampedArray(100);
  mask.forEach((v, i) => {
    pixels.set([v ? 0 : 255, v ? 0 : 255, v ? 0 : 255, 255], i * 4);
  });
  vm.runInContext("trace()", context);
  assert.equal(vm.runInContext("loops.length", context), count);
  assert(vm.runInContext("svg", context).includes('fill-rule="evenodd"'));
}
test(Array(25).fill(1), 1);
test(
  Array.from({ length: 25 }, (_, i) => !(i === 12)),
  2,
);
test(Array(25).fill(0), 0);
test(
  Array.from({ length: 25 }, (_, i) => i === 0 || i === 24),
  2,
);
// Photo-like case: paper with a shadow over the right half, one pen line on each side.
// Without flattening the shadow itself becomes ink; with flattening only the lines remain.
function maxX(flat) {
  const w = 60,
    h = 60;
  el("source").width = w;
  el("source").height = h;
  el("flatten").checked = flat;
  pixels = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let paper = x < 30 ? 245 : 120,
        v = x === 10 || x === 11 || x === 45 || x === 46 ? paper * 0.3 : paper;
      pixels.set([v, v, v, 255], (y * w + x) * 4);
    }
  vm.runInContext("trace()", context);
  const d = vm.runInContext("svg", context).match(/ d="([^"]*)"/)[1];
  return Math.max(...[...d.matchAll(/(\d+),\d+/g)].map((m) => +m[1]));
}
assert.equal(maxX(false), 60, "shadow should be traced as ink without flattening");
const flat = maxX(true);
assert(flat >= 46 && flat <= 47, "flattening should keep the line in the shadow and drop the shadow");
el("flatten").checked = false;
console.log("Passed solid shape, hole, blank, disconnected shapes, SVG export and shadow flattening checks.");
