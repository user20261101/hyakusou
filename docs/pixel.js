/* ドット絵(16×16)を、コードの中で描く。画像ファイルは使わない。 */
(function (root) {
  const PAL = {
    o: "#1b1226", w: "#f6f1e6", g: "#f4c534", G: "#b9831c", h: "#9a6530", H: "#5f3c1c", r: "#d9423a", R: "#8c2431",
    l: "#58c26a", L: "#2c7a40", s: "#f2c496", S: "#c88f62", k: "#2b2236", e: "#a8abbb", E: "#666a7e", y: "#ffe27a",
    p: "#8c5ad9", P: "#5a3a9a", c: "#6fe0e8", C: "#2f9ab0", n: "#3b5ea8", N: "#243a74", t: "#e8a0b0",
  };
  const mk = () => Array.from({ length: 16 }, () => Array(16).fill("."));
  const set = (g, x, y, c) => { if (x >= 0 && x < 16 && y >= 0 && y < 16) g[y][x] = c; };
  const line = (g, x0, y0, x1, y1, c) => {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, x = x0, y = y0;
    for (;;) { set(g, x, y, c); if (x === x1 && y === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x += sx; } if (e2 <= dx) { err += dx; y += sy; } }
  };
  const rect = (g, x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(g, x, y, c); };
  const outline = (g) => {
    const cp = g.map((r) => r.slice());
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      if (cp[y][x] !== ".") continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < 16 && ny >= 0 && ny < 16 && cp[ny][nx] !== "." && cp[ny][nx] !== "o") { g[y][x] = "o"; break; }
      }
    }
    return g;
  };
  const fromRows = (rows) => { const g = mk(); rows.forEach((r, y) => { if (r.length !== 16) throw new Error("row length " + y + ": " + r.length); [...r].forEach((c, x) => (g[y][x] = c)); }); return g; };

  /* ===== 武器 ===== */
  const sword = (a = 0) => {
    const g = mk(), bx = 5 + a, by = 10 - a;
    for (let i = a; i <= 9; i++) { set(g, 5 + i, 10 - i, "b"); set(g, 6 + i, 10 - i, "d"); }
    for (let j = -2; j <= 2; j++) set(g, bx - 1 + j, by + 1 + j, "g");
    set(g, bx - 2, by + 2, "h"); set(g, bx - 3, by + 3, "h"); set(g, bx - 4, by + 4, "h"); set(g, bx - 5, by + 5, "g");
    return outline(g);
  };
  const axe = () => {
    const g = mk();
    for (let i = 0; i <= 10; i++) set(g, 2 + i, 13 - i, "h");
    [[11, 1, "b"], [12, 1, "b"], [13, 1, "d"], [10, 2, "b"], [11, 2, "b"], [12, 2, "b"], [13, 2, "b"], [14, 2, "d"], [10, 3, "b"], [11, 3, "b"], [13, 3, "b"], [14, 3, "b"], [15, 3, "d"],
      [12, 4, "b"], [13, 4, "b"], [14, 4, "d"], [13, 5, "b"], [14, 5, "d"]].forEach(([x, y, c]) => set(g, x, y, c));
    return outline(g);
  };
  const spear = () => {
    const g = mk();
    for (let i = 0; i <= 9; i++) set(g, 1 + i, 14 - i, "h");
    set(g, 10, 5, "a"); set(g, 9, 6, "a"); set(g, 11, 5, "a");
    [[11, 4, "b"], [12, 3, "b"], [12, 4, "d"], [13, 2, "b"], [13, 3, "d"], [14, 1, "b"], [14, 2, "d"], [12, 2, "b"], [13, 1, "b"]].forEach(([x, y, c]) => set(g, x, y, c));
    return outline(g);
  };
  const stick = () => { const g = mk(); line(g, 2, 13, 13, 2, "h"); line(g, 3, 13, 14, 2, "H"); return outline(g); };

  /* ===== 盾 ===== */
  const roundShield = () => {
    const g = mk();
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = Math.hypot(x - 7.5, y - 7.5);
      if (d <= 6.6) g[y][x] = d > 5.2 ? "d" : "b";
    }
    rect(g, 7, 7, 8, 8, "g"); set(g, 6, 7, "G"); set(g, 6, 8, "G"); set(g, 9, 7, "G"); set(g, 9, 8, "G"); set(g, 7, 6, "G"); set(g, 8, 6, "G"); set(g, 7, 9, "G"); set(g, 8, 9, "G");
    return outline(g);
  };
  const kiteShield = () => {
    const g = mk();
    const hw = { 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 5, 7: 5, 8: 4, 9: 3, 10: 2, 11: 1, 12: 1 };
    for (const [ys, w] of Object.entries(hw)) {
      const y = +ys;
      for (let x = 8 - w; x <= 7 + w; x++) g[y][x] = (x === 8 - w || x === 7 + w || y === 1) ? "d" : "b";
    }
    for (let y = 2; y <= 10; y++) { set(g, 7, y, "a"); set(g, 8, y, "a"); }
    for (let x = 4; x <= 11; x++) { set(g, x, 5, "a"); }
    return outline(g);
  };

  /* ===== 小物 ===== */
  const herb = () => outline(fromRows([
    "................", ".......ll.......", "......lLLl......", "...ll.lLll.ll...", "..lLLllLllLLl...", "..lLLLlLlLLLl...", "...llLLLLLll....", ".....llLLll.....",
    "......lLl.......", ".......Ll.......", ".......Hh.......", ".......hH.......", "......hhH.......", "................", "................", "................"]));
  const coin = () => {
    const g = mk();
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const d = Math.hypot(x - 7.5, y - 7.5); if (d <= 5.6) g[y][x] = d > 4.4 ? "G" : "g"; }
    rect(g, 7, 5, 8, 10, "G"); set(g, 5, 5, "y"); set(g, 5, 6, "y"); set(g, 6, 4, "y");
    return outline(g);
  };
  const chest = (open) => outline(fromRows(open ? [
    "................", "...y..y...y.....", "..y...y..y..y...", ".....yyyy.......", "..hhhhhhhhhhhh..", "..hHHHHHHHHHHh..", "..GGGGGGGGGGGG..", "..yyyyyyyyyyyy..",
    "..hhhhhggghhhh..", "..hHHHHggGHHHh..", "..hhhhhhGhhhhh..", "..hHHHHHHHHHHh..", "..hhhhhhhhhhhh..", "..GGGGGGGGGGGG..", "................", "................"] : [
    "................", "................", "................", "....hhhhhhhh....", "..hhhhhhhhhhhh..", "..hHHHHHHHHHHh..", "..hhhhhhhhhhhh..", "..GGGGGGGGGGGG..",
    "..hhhhhggghhhh..", "..hHHHHggGHHHh..", "..hhhhhhGhhhhh..", "..hHHHHHHHHHHh..", "..hhhhhhhhhhhh..", "..GGGGGGGGGGGG..", "................", "................"]));
  const door = () => {
    const g = mk();
    rect(g, 3, 4, 12, 15, "h");
    [[3, 4], [4, 4], [11, 4], [12, 4], [3, 5], [12, 5]].forEach(([x, y]) => set(g, x, y, "."));
    rect(g, 5, 3, 10, 3, "h"); rect(g, 6, 2, 9, 2, "h");
    for (let y = 3; y <= 15; y++) set(g, 7, y, "H");
    rect(g, 3, 9, 12, 9, "H"); rect(g, 3, 13, 12, 13, "H");
    set(g, 9, 11, "g"); set(g, 10, 11, "g");
    return outline(g);
  };
  const flag = () => { const g = mk(); rect(g, 3, 1, 3, 15, "h"); rect(g, 4, 2, 12, 7, "r"); rect(g, 4, 6, 12, 7, "R"); set(g, 12, 4, "."); set(g, 12, 5, "."); set(g, 11, 4, "y"); set(g, 8, 4, "y"); return outline(g); };
  const skull = () => {
    const g = mk();
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { if (Math.hypot(x - 7.5, y - 6.5) <= 5.3) g[y][x] = "w"; }
    rect(g, 5, 10, 10, 12, "w"); rect(g, 5, 6, 6, 8, "k"); rect(g, 9, 6, 10, 8, "k"); set(g, 7, 9, "k"); set(g, 8, 9, "k");
    set(g, 6, 12, "e"); set(g, 8, 12, "e"); set(g, 10, 12, "e");
    return outline(g);
  };
  const sparkle = () => { const g = mk(); line(g, 7, 2, 7, 13, "y"); line(g, 2, 7, 13, 7, "y"); rect(g, 6, 6, 8, 8, "w"); set(g, 4, 4, "y"); set(g, 10, 4, "y"); set(g, 4, 10, "y"); set(g, 10, 10, "y"); return g; };

  /* ===== キャラ ===== */
  const hero = () => {
    const g = mk();
    rect(g, 5, 1, 10, 2, "h"); set(g, 4, 2, "h"); set(g, 11, 2, "h"); set(g, 4, 3, "h"); set(g, 11, 3, "h");
    rect(g, 5, 3, 10, 6, "s"); set(g, 6, 4, "k"); set(g, 9, 4, "k"); set(g, 7, 6, "S"); set(g, 8, 6, "S");
    rect(g, 4, 7, 11, 11, "n"); rect(g, 4, 10, 11, 10, "g"); rect(g, 6, 7, 9, 7, "w");
    rect(g, 3, 7, 3, 10, "n"); rect(g, 12, 7, 12, 10, "n"); set(g, 3, 11, "s"); set(g, 12, 11, "s");
    rect(g, 5, 12, 6, 14, "N"); rect(g, 9, 12, 10, 14, "N"); rect(g, 5, 15, 6, 15, "H"); rect(g, 9, 15, 10, 15, "H"); set(g, 4, 15, "H"); set(g, 11, 15, "H");
    return outline(g);
  };
  const toma = () => {
    const g = mk();
    rect(g, 5, 1, 10, 2, "H"); rect(g, 4, 3, 11, 3, "H");
    rect(g, 5, 4, 10, 8, "s"); rect(g, 4, 5, 4, 7, "e"); rect(g, 11, 5, 11, 7, "e");
    set(g, 6, 5, "k"); set(g, 9, 5, "k"); rect(g, 6, 7, 9, 7, "e"); rect(g, 5, 8, 10, 8, "e"); rect(g, 6, 9, 9, 9, "e");
    rect(g, 4, 10, 11, 14, "h"); rect(g, 6, 10, 9, 14, "w"); rect(g, 3, 10, 3, 13, "h"); rect(g, 12, 10, 12, 13, "h"); set(g, 3, 14, "s"); set(g, 12, 14, "s");
    rect(g, 5, 15, 6, 15, "H"); rect(g, 9, 15, 10, 15, "H");
    return outline(g);
  };
  const dragon = () => {
    const g = mk();
    line(g, 3, 4, 2, 1, "w"); line(g, 12, 4, 13, 1, "w"); set(g, 3, 3, "w"); set(g, 12, 3, "w");
    rect(g, 4, 3, 11, 9, "r"); rect(g, 3, 5, 12, 8, "r"); rect(g, 5, 2, 10, 2, "R");
    rect(g, 5, 5, 6, 6, "y"); rect(g, 9, 5, 10, 6, "y"); set(g, 6, 6, "k"); set(g, 9, 6, "k");
    rect(g, 5, 9, 10, 12, "R"); rect(g, 6, 9, 9, 11, "r"); set(g, 7, 10, "k"); set(g, 8, 10, "k");
    [5, 7, 8, 10].forEach((x) => set(g, x, 12, "w"));
    rect(g, 3, 9, 4, 10, "R"); rect(g, 11, 9, 12, 10, "R"); set(g, 7, 13, "y"); set(g, 8, 13, "y"); set(g, 7, 14, "g"); set(g, 8, 14, "g");
    return outline(g);
  };

  /* ===== 装備の色(id → 形と色)===== */
  const W = (shape, b, d, extra) => ({ shape, pal: Object.assign({ b, d, a: "#d9423a" }, extra || {}) });
  const ITEMS = {
    w1: { shape: "stick", pal: {} },
    w2: W("dagger", "#ffe27a", "#d9a21a"), w3: W("sword", "#e8a068", "#b0612e"), w4: W("axe", "#cfd3e0", "#8c92a4"),
    w5: W("spear", "#dfe4f0", "#8c92a4"), w7: W("sword", "#9fdcff", "#4b8fd4"), w8: W("sword", "#f6f9ff", "#aab4d0"),
    w9: W("sword", "#ff8a58", "#c4301f"), w10: W("sword", "#fff3b0", "#e0b840"), w11: W("axe", "#a97ae8", "#5a3a9a"), w12: W("sword", "#c4fff2", "#4ad0c0"),
    s2: W("round", "#b8803f", "#7a4a22"), s3: W("round", "#e0a862", "#a0682e"), s4: W("kite", "#62c882", "#2f8a4e", { a: "#d9f5c0" }),
    s5: W("kite", "#9be59b", "#3f9a4f", { a: "#f6f1e6" }), s6: W("round", "#cfd3e0", "#8c92a4"), s7: W("kite", "#e8604f", "#8f2a2a", { a: "#ffe27a" }),
    s8: W("kite", "#f6f9ff", "#aab4d0", { a: "#6aa6d9" }), s9: W("kite", "#ff8a58", "#c4301f", { a: "#ffe27a" }), s10: W("kite", "#fff3b0", "#e0b840", { a: "#6aa6d9" }),
    s11: W("kite", "#a97ae8", "#5a3a9a", { a: "#6fe0e8" }), s12: W("kite", "#c4fff2", "#4ad0c0", { a: "#f6f1e6" }),
  };
  const SHAPES = { sword: () => sword(0), dagger: () => sword(4), axe, spear, stick, round: roundShield, kite: kiteShield };

  /* ===== 町 ===== */
  const watch = () => {
    const g = mk();
    rect(g, 5, 6, 10, 15, "e"); rect(g, 4, 4, 11, 5, "E");
    [4, 6, 9, 11].forEach((x) => set(g, x, 3, "E"));
    rect(g, 7, 0, 7, 3, "h"); rect(g, 8, 0, 10, 1, "r");
    rect(g, 7, 8, 8, 10, "k"); rect(g, 7, 12, 8, 15, "H");
    rect(g, 5, 11, 10, 11, "E"); set(g, 6, 7, "E"); set(g, 9, 7, "E");
    return outline(g);
  };
  const inn = () => {
    const g = mk();
    for (let y = 2; y <= 7; y++) for (let x = 7 - (y - 2) - (y > 6 ? 0 : 0); x <= 8 + (y - 2); x++) set(g, x, y, y === 7 ? "R" : "r");
    rect(g, 3, 8, 12, 15, "s"); rect(g, 3, 8, 12, 8, "S");
    rect(g, 7, 11, 8, 15, "H"); rect(g, 4, 10, 5, 11, "y"); rect(g, 10, 10, 11, 11, "y");
    rect(g, 13, 8, 13, 12, "h"); rect(g, 13, 9, 15, 10, "g");
    return outline(g);
  };
  const site = () => {
    const g = mk();
    rect(g, 3, 6, 3, 15, "h"); rect(g, 12, 6, 12, 15, "h"); rect(g, 3, 7, 12, 7, "h"); rect(g, 3, 11, 12, 11, "h");
    line(g, 3, 15, 12, 7, "H"); rect(g, 5, 13, 7, 15, "S"); rect(g, 9, 14, 11, 15, "S"); set(g, 6, 13, "e");
    rect(g, 12, 2, 12, 5, "h"); rect(g, 8, 2, 12, 2, "g");
    return outline(g);
  };
  const lock = () => {
    const g = mk();
    rect(g, 4, 7, 11, 14, "g"); rect(g, 4, 13, 11, 14, "G");
    rect(g, 5, 3, 5, 7, "e"); rect(g, 10, 3, 10, 7, "e"); rect(g, 5, 2, 10, 2, "e");
    rect(g, 7, 9, 8, 11, "k");
    return outline(g);
  };

  const cache = {};
  function render(grid, pal, px, cls) {
    let rects = "";
    for (let y = 0; y < 16; y++) {
      let x = 0;
      while (x < 16) {
        const c = grid[y][x];
        if (c === ".") { x++; continue; }
        let x2 = x; while (x2 + 1 < 16 && grid[y][x2 + 1] === c) x2++;
        rects += `<rect x="${x}" y="${y}" width="${x2 - x + 1}" height="1" fill="${pal[c] || PAL[c] || "#f0f"}"/>`;
        x = x2 + 1;
      }
    }
    return `<svg class="px ${cls || ""}" viewBox="0 0 16 16" width="${px}" height="${px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }
  const BASE = { herb, coin, chest_closed: () => chest(false), chest_open: () => chest(true), door, flag, skull, sparkle, hero, toma, dragon, watch, inn, site, lock };

  const PX = {
    PAL,
    /** 名前つきの絵。size は表示ピクセル数 */
    icon(name, size = 32, cls) {
      const key = name + ":" + size + ":" + (cls || "");
      if (cache[key]) return cache[key];
      if (!BASE[name]) return "";
      return (cache[key] = render(BASE[name](), PAL, size, cls));
    },
    /** 装備の絵(武器・盾)。id は w1, s3 など */
    item(id, size = 32, cls) {
      const key = "item:" + id + ":" + size + ":" + (cls || "");
      if (cache[key]) return cache[key];
      const d = ITEMS[id];
      if (!d) return (cache[key] = render(BASE.chest_closed(), PAL, size, cls));
      return (cache[key] = render(SHAPES[d.shape](), Object.assign({}, PAL, d.pal), size, cls));
    },
    /** 道具屋の背景(棚と瓶)。ドットを粗めに描く */
    shopScene() {
      const W = 64, H = 36; let r = "";
      const R = (x, y, w, h, c) => { r += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`; };
      R(0, 0, W, H, "#2a2034"); for (let x = 0; x < W; x += 8) R(x, 0, 1, H, "#251c2e");
      for (const y of [8, 19]) { R(2, y + 5, 60, 2, "#6b4426"); R(2, y + 7, 60, 1, "#3b2412");
        const cols = ["#d9423a", "#58c26a", "#6aa6d9", "#f4c534", "#8c5ad9", "#e8a0b0"];
        for (let i = 0; i < 9; i++) { const x = 5 + i * 6.4 | 0, c = cols[(i + y) % cols.length]; R(x, y + 1, 3, 4, c); R(x + 1, y, 1, 1, "#cfd3e0"); R(x, y + 1, 1, 4, "#ffffff22"); }
      }
      R(30, 0, 1, 5, "#5f3c1c"); R(28, 5, 5, 4, "#f4c534"); R(29, 6, 3, 2, "#fff3b0");
      R(0, 29, W, 7, "#7a4a22"); R(0, 29, W, 1, "#b8803f"); for (let x = 0; x < W; x += 6) R(x, 30, 1, 6, "#5f3c1c");
      return `<svg class="px" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" shape-rendering="crispEdges" style="width:100%;height:100%">${r}</svg>`;
    },
    /** 塔の外壁(石)の背景 */
    brickCss: "repeating-linear-gradient(0deg,#00000033 0 2px,transparent 2px 16px),repeating-linear-gradient(90deg,#00000022 0 2px,transparent 2px 24px)",
    _grids: { BASE, SHAPES, ITEMS },
  };
  root.PX = PX;
  if (typeof module !== "undefined") module.exports = PX;
})(typeof window !== "undefined" ? window : globalThis);
