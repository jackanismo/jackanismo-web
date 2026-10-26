/* ===== Ubah data di bawah ini untuk menyesuaikan halaman ===== */
const PROFILE = {
  name: "JackAnismo",
  bio: "Nebula Elang ✨",
  status: "ONLINE"
};
const LINKS = [
  { icon:"G", color:"#24292f", title:"GitHub", desc:"Lihat proyek dan kode saya", url:"https://github.com/jackanismo" }
];
const GAMES = [
  { title:"Game Rotate", sub:"since 2025", color:"#d9480f", url:"https://game-rotate.vercel.app" },
  { title:"Game Menagkap kepala", sub:"since 2026", color:"#c2255c", url:"https://game-menangkap-kepala.vercel.app" },
  { title:"Game Lompat", sub:"since 2026", color:"#2f8f3a", url:"#" },
  { title:"Game Nembak", sub:"soon", color:"#1971c2", url:"#" }
];
/* ============================================================ */

const $ = id => document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

$("name").textContent = PROFILE.name;
$("bio").textContent = PROFILE.bio;
$("status").textContent = PROFILE.status;
document.title = PROFILE.name + " – Link Game";

$("links").innerHTML = LINKS.map(l => `
  <li><a class="cart" style="--c:${esc(l.color)}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
    <span class="tag" aria-hidden="true">${esc(l.icon)}</span>
    <span class="txt"><span class="name">${esc(l.title)}</span><span class="desc">${esc(l.desc)}</span></span>
    <span class="go" aria-hidden="true">&gt;&gt;</span>
  </a></li>`).join("");

$("games").innerHTML = GAMES.map(g => {
  const inner = `
    <span class="tag" aria-hidden="true">${esc(g.icon || g.title.charAt(0))}</span>
    <span class="txt"><span class="name">${esc(g.title)}</span><span class="desc">${esc(g.sub)}</span></span>
    ${g.soon ? "" : '<span class="go" aria-hidden="true">&gt;&gt;</span>'}`;
  return g.soon
    ? `<li><div class="cart soon" style="--c:${esc(g.color)}" aria-disabled="true">${inner}</div></li>`
    : `<li><a class="cart" style="--c:${esc(g.color)}" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">${inner}</a></li>`;
}).join("");

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(()=>t.classList.remove("show"), 1800);
}
$("theme").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
});
/* Status online/offline.
   Offline: tombol game disembunyikan (GitHub tetap tampil). Online: tombol game tampil.
   Nilai awal ada di STATUS. Opsional: isi SHEET_CSV_URL dengan link CSV Google Sheets (sel A1 berisi online/offline). */
const STATUS = "online";
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vToo5Pkhz92qTtMm9TxbiC8pf7fO0o-Oia_no6DaVRy0PKSQj6g-IVDwB7U_BIOy53DD9zbPyVUKg2e/pub?gid=0&single=true&output=csv"; // tempel link CSV Google Sheets di antara tanda kutip
function applyStatus(v){
  const on = String(v).trim().toLowerCase() !== "offline";
  $("status").textContent = on ? "ONLINE" : "OFFLINE";
  $("games").hidden = !on;
  $("notice").hidden = on;
  document.querySelector(".dot").classList.toggle("off", !on);
}
applyStatus(STATUS);
async function loadSheet(){
  if (!SHEET_CSV_URL) return;
  try {
    const sep = SHEET_CSV_URL.includes("?") ? "&" : "?";
    const r = await fetch(SHEET_CSV_URL + sep + "t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return;
    const t = await r.text();
    applyStatus(t.split(/[\r\n,]/)[0].replace(/"/g, ""));
  } catch(e) {}
}
loadSheet();
setInterval(loadSheet, 30000);

/* Bintang berkelip di latar (terpisah dari gelombang) */
const starsEl = $("stars");
for (let i = 0; i < 110; i++) {
  const st = document.createElement("span");
  st.className = "star";
  const size = (Math.random() * 2.2 + 1).toFixed(1);
  st.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;top:" + (Math.random() * 100).toFixed(1) + "%;width:" + size + "px;height:" + size + "px;--d:" + (2.5 + Math.random() * 4).toFixed(1) + "s;--delay:-" + (Math.random() * 6).toFixed(1) + "s";
  starsEl.appendChild(st);
}
/* Bintang jatuh: muncul sesekali melintas di layar */
[[2,13,62,6],[7,17,85,22],[12,11,48,34],[17,15,95,12]].forEach(function(c){
  const sh = document.createElement("span");
  sh.className = "shoot";
  sh.style.cssText = "left:" + c[2] + "%;top:" + c[3] + "%;--sdelay:" + c[0] + "s;--sd:" + c[1] + "s";
  starsEl.appendChild(sh);
});

/* Jam digital waktu Jakarta (GMT+7), diperbarui setiap detik */
const clockEl = $("clock");
const clockFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
});
function tick(){
  clockEl.textContent = clockFmt.format(new Date()).replace(/\./g, ":");
}
tick();
setInterval(tick, 1000);
