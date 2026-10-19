import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { App as CapApp } from "@capacitor/app";
import { firebaseConfig } from "./firebase-config.js";

/* ───────────── Icone a incisione ───────────── */
const ICO = {
cesto:'<path d="M8 20h32l-4 20H12z"/><path d="M6 20h36"/><path d="M15 20c0-10 18-10 18 0"/><path class="h" d="M14 26l2 10M21 26v10M27 26v10M34 26l-2 10M11 24h26M13 32h22"/>',
mela:'<path d="M24 14c-8-5-16 1-14 12 2 10 9 15 14 12 5 3 12-2 14-12 2-11-6-17-14-12z"/><path d="M24 14c0-4 2-7 5-8"/><path d="M30 8c3 0 5 2 5 4-3 0-5-1-5-4z"/><path class="h" d="M30 22l-2 12M33 24l-2 10M36 27l-2 8M14 22l1 6"/>',
carota:'<path d="M17 18h14l-7 26z"/><path d="M24 18c-3-5-7-8-9-9M24 18v-12M24 18c3-5 7-8 9-9"/><path class="h" d="M20 24h6M21 30h4M22 36h2M27 22l-2 10"/>',
foglia:'<path d="M10 38C8 18 22 8 40 8c0 20-10 32-30 30z"/><path d="M10 38L32 16"/><path class="h" d="M18 30l6 2M22 24l6 2M28 18l5 2M16 34l-1 4M20 20l-2 6"/>',
prosciutto:'<path d="M10 16c6-8 22-8 28 2 4 7 1 14-5 18l-6 3c-5 2-9 0-11-5-4-5-9-12-6-18z"/><path d="M34 36l8 8"/><circle cx="44" cy="44" r="2.5"/><path class="h" d="M15 20c4 6 8 10 15 12M18 16c5 4 10 8 18 10M14 26c3 4 6 6 10 8"/>',
pesce:'<path d="M6 24c8-10 22-10 28 0-6 10-20 10-28 0z"/><path d="M34 24l8-8v16z"/><circle cx="13" cy="22" r="1.5"/><path class="h" d="M20 18c2 4 2 8 0 12M25 17c2 4 2 10 0 14M30 19c1 3 1 7 0 10M15 26c3 3 6 3 8 2"/>',
formaggio:'<path d="M6 32l36-8v14H6z"/><path d="M6 32l16-14 20 6"/><circle cx="16" cy="36" r="2"/><circle cx="30" cy="33" r="2.5"/><circle cx="24" cy="25" r="1.5"/><path class="h" d="M36 27v9M40 26v10M10 33l8-1"/>',
pane:'<path d="M6 30c0-10 8-16 18-16s18 6 18 16c0 4-4 6-8 6H14c-4 0-8-2-8-6z"/><path d="M16 20l-3 8M24 18l-2 9M32 20l-2 8"/><path class="h" d="M12 33h24M10 30l30 0M30 22l7 5"/>',
sacco:'<path d="M16 10h16l-3 6c6 4 10 12 8 22-1 4-4 6-8 6H19c-4 0-7-2-8-6-2-10 2-18 8-22z"/><path d="M16 14c4 3 12 3 16 0"/><path class="h" d="M18 30h12M17 35h14M19 25h10M20 40h8"/>',
fiocco:'<path d="M24 6v36M8 15l32 18M8 33l32-18"/><path d="M20 9l4 4 4-4M20 39l4-4 4 4M9 20l5 1-1 5M39 28l-5-1 1-5M9 28l5-1-1-5M39 20l-5 1 1 5"/>',
vino:'<path d="M21 6h6v10c0 4 6 6 6 12v14H15V28c0-6 6-8 6-12z"/><path d="M15 30h18M15 38h18"/><path class="h" d="M18 32h12M18 34h12M18 36h12M22 8v8"/>',
sapone:'<rect x="6" y="22" width="26" height="16" rx="5"/><path class="h" d="M11 28h16M11 32h12M11 35h8"/><circle cx="38" cy="14" r="5"/><circle cx="28" cy="10" r="3"/><circle cx="42" cy="28" r="2.5"/>',
scopa:'<path d="M36 5L25 29"/><path d="M13 30l17-4 9 15H10z"/><path class="h" d="M16 34l-2 7M21 33l-1 8M26 32l0 9M31 32l2 9"/>',
casa:'<path d="M6 24L24 8l18 16"/><path d="M11 22v20h26V22"/><path d="M20 42V30h8v12"/><path class="h" d="M14 28v10M17 28v10M31 28v10M34 28v10"/>',
torta:'<path d="M8 28h32v14H8z"/><path d="M8 34c4 3 8-3 12 0s8-3 12 0 6-1 8 0"/><path d="M24 28v-8M24 13c-3 3-3 5 0 7 3-2 3-4 0-7z"/><path class="h" d="M12 38h24M12 40h24"/>',
caffe:'<path d="M16 8h16l4 10-4 4 3 20H13l3-20-4-4z"/><path d="M36 20c6 0 6 14 0 14"/><path class="h" d="M18 28h12M17 32h14M16 36h16"/>',
limone:'<path d="M6 24c4-10 12-14 20-12 4-3 8-3 10-2-1 3-1 6-2 8 4 8-2 18-12 18C14 36 8 32 6 24z"/><path class="h" d="M16 22c4 0 8 2 10 8M14 28c4 0 6 2 8 6M24 18c4 1 6 4 7 8"/>',
pomodoro:'<path d="M8 28c0-10 8-14 16-14s16 4 16 14-8 14-16 14S8 38 8 28z"/><path d="M24 14l-6-6 6 2 6-2zM24 14v-5"/><path class="h" d="M32 25c2 4 1 9-3 12M12 30c1 3 3 5 5 6"/>',
uva:'<circle cx="17" cy="22" r="5"/><circle cx="29" cy="22" r="5"/><circle cx="23" cy="30" r="5"/><circle cx="23" cy="40" r="4"/><circle cx="35" cy="31" r="4"/><path d="M23 17c0-6 3-9 9-10"/><path class="h" d="M26 20l2 3M14 20l2 3M21 28l2 3"/>',
olio:'<path d="M18 6h12M20 6v8c-8 2-12 8-12 16 0 6 6 12 16 12s16-6 16-12c0-8-4-14-12-16V6"/><path d="M8 24c-4 0-4 8 0 8M40 24c4 0 4 8 0 8"/><path class="h" d="M12 34h24M14 38h20"/>',
stella:'<path d="M24 6l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z"/><path class="h" d="M24 14v10M18 24h12"/>'};
const ICONS = Object.keys(ICO);
const COLORS = ["#8b2e1f", "#5b6b2f", "#a8741a", "#3d4f6b", "#6b3a5a", "#4a3a2a"];
const CATS = [["Frutta","mela","mela mele banana aranc limon pera pere fragol uva kiwi pesca"],["Verdura","carota","insalata pomodor zucchin carot patat cipoll aglio spinac peperon melanzan finocch"],["Vegetariano","foglia","tofu seitan tempeh hummus veg lenticch ceci"],["Carne","prosciutto","pollo manzo maiale salsicc prosciutt salame bistecc macinato tacchino"],["Pesce","pesce","salmone tonno merluzz gamber pesce"],["Latticini e uova","formaggio","latte yogurt formaggio mozzarell burro uova parmigian ricotta"],["Panetteria","pane","pane focaccia grissin cornett"],["Dispensa","sacco","pasta riso farina zucchero olio sale biscott caff passata"],["Surgelati","fiocco","surgelat gelato piselli"],["Bevande","vino","acqua birra vino succo coca"],["Igiene personale","sapone","shampoo dentifric sapone carta igienica"],["Pulizia casa","scopa","detersiv spugn ammorbident candeggin"],["Altro","cesto",""]];

/* ───────────── Utilità ───────────── */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rid = () => Math.random().toString(36).slice(2, 9);
const clamp = v => Math.max(1, Math.min(99, v));
const col = c => (/^#[0-9a-f]{6}$/i.test(c) ? c : COLORS[0]);
function guess(n) { n = n.toLowerCase(); for (const [c, , w] of CATS) if (w && w.split(" ").some(k => n.includes(k))) return c; return "Altro"; }
function ic(n, s, c) {
  return ICO[n]
    ? `<svg viewBox="0 0 48 48" width="${s}" height="${s}" fill="none" stroke="${c ? col(c) : "currentColor"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]}</svg>`
    : `<span style="font-size:${Math.round(s * 0.75)}px;line-height:1">${esc(n)}</span>`;
}
function merge(a, b) {
  for (const k in b) {
    const v = b[k];
    if (v && typeof v === "object" && !Array.isArray(v)) a[k] = merge(a[k] && typeof a[k] === "object" ? a[k] : {}, v);
    else a[k] = v;
  }
  return a;
}
function toast(t) {
  const d = document.createElement("div");
  d.textContent = t;
  d.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#3a2814;color:#f8edcf;padding:10px 18px;border-radius:4px;z-index:30;max-width:90%;text-align:center";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3200);
}

/* ───────────── Stato ───────────── */
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
let L = {}, cur = null, draft = "", dcat = "", dq = 1, ed = null;
let fam = "", fs = null, auth = null, authed = false, unsub = null, online = false;
try { fam = localStorage.getItem("spesa_family") || ""; } catch (e) { fam = ""; }

function newCode() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = "";
  for (let i = 0; i < 16; i++) { s += ALPHA[a[i] % ALPHA.length]; if (i % 4 === 3 && i < 15) s += "-"; }
  return s;
}
const normCode = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/(.{4})(?=.)/g, "$1-");
// Ordine stabile: prima per momento di inserimento (o); i prodotti vecchi, senza o, vanno in ordine alfabetico.
const byOrder = (a, b) => (a.o || 0) - (b.o || 0)
  || String(a.n || "").localeCompare(String(b.n || ""), "it", { sensitivity: "base" })
  || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const items = l => Object.entries(l.items || {}).filter(([, i]) => !i.x).map(([id, i]) => ({ id, ...i })).sort(byOrder);

/* ───────────── Firebase ───────────── */
function listRef(id) { return doc(fs, "families", fam, "lists", id); }

function write(id, p, create) {
  merge(L[id] || (L[id] = {}), p);
  render();
  if (!fs || !fam) return;
  (create ? setDoc(listRef(id), p) : setDoc(listRef(id), p, { merge: true }))
    .catch(e => toast("Errore di sincronizzazione (" + (e.code || "?") + ")"));
}
function delList(id) {
  delete L[id]; cur = null; render();
  if (fs && fam) deleteDoc(listRef(id)).catch(() => toast("Errore nell'eliminazione"));
}
function startSync() {
  if (unsub) { unsub(); unsub = null; }
  if (!fam || !fs || !authed) return;
  unsub = onSnapshot(collection(fs, "families", fam, "lists"), { includeMetadataChanges: true }, snap => {
    const n = {};
    snap.forEach(d => { n[d.id] = d.data(); });
    L = n;
    online = !snap.metadata.fromCache;
    render();
  }, err => {
    online = false;
    toast(err.code === "permission-denied" ? "Accesso negato: controlla le regole di Firestore" : "Errore di connessione");
    render();
  });
}
function signInLoop() {
  signInAnonymously(auth).then(() => { authed = true; startSync(); }).catch(e => {
    if (e.code === "auth/operation-not-allowed" || e.code === "auth/admin-restricted-operation") {
      fatal("L'accesso anonimo non è attivo", "In Firebase vai su Authentication → Metodo di accesso e abilita «Anonimo» (vedi GUIDA.md, passo 3).");
    } else {
      setTimeout(signInLoop, 6000);
    }
  });
}

/* ───────────── Schermate ───────────── */
function fatal(t, m) {
  const a = $("#app");
  a.dataset.view = "fatal";
  a.innerHTML = `<h1>La Spesa</h1><div class="orn">☙ ✦ ❦ ✦ ❧</div><div class="err"><b>${esc(t)}</b><p>${esc(m)}</p></div>`;
}
function setStatus() {
  const s = $("#st");
  if (s) s.textContent = online ? "● Sincronizzata in tempo reale" : "○ Offline: le modifiche si sincronizzeranno al ritorno della rete";
}
function render() {
  const a = $("#app");
  if (!a || a.dataset.view === "fatal") return;
  if (!fam) renderSetup();
  else if (cur && L[cur]) renderList();
  else { cur = null; renderHome(); }
}
function renderSetup() {
  const a = $("#app");
  if (a.dataset.view === "setup") return;
  a.dataset.view = "setup";
  a.innerHTML = `<h1>La Spesa</h1><div class="orn">☙ ✦ ❦ ✦ ❧</div><div class="sub">Prima di cominciare</div>
  <div class="setup"><p>Per condividere le liste serve un <b>codice famiglia</b>: lo stesso codice su entrambi i telefoni.</p>
  <button class="big" data-a="create">Crea una nuova famiglia</button>
  <div class="or">oppure</div>
  <input id="jc" placeholder="Codice dell'altro telefono" autocapitalize="characters" autocomplete="off" spellcheck="false">
  <button class="big sec" data-a="join">Entra con il codice</button></div>`;
}
function renderHome() {
  const a = $("#app");
  a.dataset.view = "home";
  let h = `<div class="hero"><div class="homebar"><button class="ib corner" data-a="code">Codice</button></div><h1>La Spesa</h1><div class="orn">☙ ✦ ❦ ✦ ❧</div><div class="sub">liste di famiglia, dal mercato alla bottega</div><div class="pill" id="st"></div></div><div class="cards">`;
  const ids = Object.keys(L).sort((x, y) => (L[x].t || 0) - (L[y].t || 0));
  if (!ids.length) h += `<div class="empty">Nessuna lista ancora.<br>Creane una con il pulsante qui sotto.</div>`;
  for (const id of ids) {
    const l = L[id], n = items(l).filter(i => !i.d).length;
    h += `<button class="card" data-a="open" data-id="${id}"><div class="ico" style="border-color:${col(l.color)}">${ic(l.icon, 38, l.color)}</div><div><b>${esc(l.name || "Lista")}</b><small>${n ? n + " da prendere" : "Tutto in casa ✓"}</small></div></button>`;
  }
  h += `</div><button class="fab" data-a="newlist">+ Nuova lista</button>`;
  a.innerHTML = h;
  setStatus();
}
function catOpts() {
  return CATS.map(c => `<option ${c[0] === (dcat || guess(draft)) ? "selected" : ""}>${c[0]}</option>`).join("");
}
function row(i) {
  const q = i.q || 1;
  const mid = i.d
    ? (q > 1 ? `<em class="qb">×${q}</em>` : "")
    : `<div class="qs"><button data-a="qty" data-id="${i.id}" data-v="-1" aria-label="Meno">−</button><b>×${q}</b><button data-a="qty" data-id="${i.id}" data-v="1" aria-label="Più">+</button></div>`;
  return `<div class="it ${i.d ? "d" : ""}"><button class="ck" data-a="tog" data-id="${i.id}" aria-label="Spunta">${i.d ? "✓" : ""}</button><span>${esc(i.n)}</span>${mid}<button class="x" data-a="rm" data-id="${i.id}" aria-label="Elimina">×</button></div>`;
}
function renderList() {
  const a = $("#app"), l = L[cur];
  if (a.dataset.view !== "list:" + cur) {
    a.dataset.view = "list:" + cur;
    a.innerHTML = `<div class="top" id="hd"></div><div class="orn">☙ ❦ ❧</div><div class="pill" id="st"></div>
    <div class="add">
      <div class="r1"><input id="ni" placeholder="Aggiungi un prodotto…" autocomplete="off" value="${esc(draft)}"><button class="pbtn" data-a="add" aria-label="Aggiungi">+</button></div>
      <div class="r2"><select id="nc" aria-label="Categoria">${catOpts()}</select><div class="qs"><button data-a="dq" data-v="-1" aria-label="Meno">−</button><b id="dq">×${dq}</b><button data-a="dq" data-v="1" aria-label="Più">+</button></div></div>
    </div>
    <div id="lst"></div>`;
  }
  $("#hd").innerHTML = `<button class="ib" data-a="back" aria-label="Indietro">←</button><h1>${ic(l.icon, 34, l.color)}<span>${esc(l.name || "Lista")}</span></h1><button class="ib" data-a="editlist" aria-label="Modifica">✎</button>`;
  const all = items(l), todo = all.filter(i => !i.d), done = all.filter(i => i.d);
  let h = "";
  if (!all.length) h += `<div class="empty">La dispensa è vuota.<br>Annota il primo prodotto!</div>`;
  for (const [c, e] of CATS) { const g = todo.filter(i => i.c === c); if (g.length) h += `<h3>${ic(e, 24)} ${c}</h3>` + g.map(row).join(""); }
  if (done.length) {
    h += `<div class="homeh">${ic("casa", 30)}<span>In casa (${done.length})</span></div><div class="hint">Prodotti già presi, presenti in casa.<br>Tocca il cerchio per rimetterli da prendere.</div>`;
    for (const [c, e] of CATS) { const g = done.filter(i => i.c === c); if (g.length) h += `<div class="csub">${ic(e, 22)} ${c}</div>` + g.map(row).join(""); }
  }
  $("#lst").innerHTML = h;
  setStatus();
}

/* ───────────── Finestre (modal) ───────────── */
function openModal(html) { $("#m").innerHTML = html; $("#m").classList.add("o"); }
function closeModal() { $("#m").classList.remove("o"); $("#m").innerHTML = ""; ed = null; }
function edr() {
  openModal(`<div class="sheet"><h2>${ed.id ? "Modifica lista" : "Nuova lista"}</h2>
  <input id="en" placeholder="Nome (es. Supermercato, Mercato…)" value="${esc(ed.name)}">
  <div class="grid">${ICONS.map(i => `<button class="${i === ed.icon ? "s" : ""}" data-a="icon" data-v="${i}" aria-label="${i}">${ic(i, 34, ed.color)}</button>`).join("")}</div>
  <div class="grid cols">${COLORS.map(c => `<button class="${c === ed.color ? "s" : ""}" style="background:${c}" data-a="color" data-v="${c}" aria-label="Colore"></button>`).join("")}</div>
  <div class="row"><button data-a="cancel">Annulla</button><button class="pr" data-a="save">Salva</button></div>
  ${ed.id ? `<div class="row" style="margin-top:8px"><button class="dg" data-a="dellist">Elimina lista</button></div>` : ""}</div>`);
}
function openEd(id) {
  ed = id ? { id, name: L[id].name || "", icon: L[id].icon, color: col(L[id].color) } : { id: null, name: "", icon: "cesto", color: COLORS[0] };
  edr();
}
function saveEd() {
  const name = ed.name.trim() || "Lista";
  const p = { name, icon: ed.icon, color: ed.color };
  if (ed.id) { const id = ed.id; closeModal(); write(id, p); }
  else { const id = rid(); p.t = Date.now(); p.items = {}; closeModal(); cur = id; L[id] = p; write(id, p, true); }
}
function showCode() {
  openModal(`<div class="sheet"><h2>Codice famiglia</h2>
  <p class="mid">Inseriscilo sull'altro telefono per condividere le liste.</p>
  <div class="code" id="cd">${esc(fam)}</div>
  <div class="row"><button data-a="copy">Copia</button><button class="pr" data-a="closem">Chiudi</button></div>
  <div class="row" style="margin-top:8px"><button class="dg" data-a="leave">Scollega questo telefono</button></div></div>`);
}
function setFamily(code, show) {
  fam = code;
  try { localStorage.setItem("spesa_family", fam); } catch (e) { /* ignora */ }
  cur = null; L = {}; online = false;
  $("#app").dataset.view = "";
  render();
  startSync();
  if (show) showCode();
}
function addIt() {
  const n = draft.trim();
  if (!n || !cur) return;
  const c = dcat || guess(n), q = dq;
  draft = ""; dcat = ""; dq = 1;
  const ni = $("#ni");
  if (ni) { ni.value = ""; ni.focus(); }
  const nc = $("#nc"); if (nc) nc.value = "Altro";
  const dqEl = $("#dq"); if (dqEl) dqEl.textContent = "×1";
  write(cur, { items: { [rid()]: { n, c, q, o: Date.now(), d: false, x: false } } });
}

const ACT = {
  back() { cur = null; render(); },
  open(id) { cur = id; draft = ""; dcat = ""; dq = 1; render(); },
  newlist() { openEd(); },
  editlist() { openEd(cur); },
  tog(id) { const it = L[cur].items[id]; write(cur, { items: { [id]: { d: !it.d } } }); },
  rm(id) { write(cur, { items: { [id]: { x: true } } }); },
  qty(id, v) { write(cur, { items: { [id]: { q: clamp((L[cur].items[id].q || 1) + Number(v)) } } }); },
  dq(id, v) { dq = clamp(dq + Number(v)); $("#dq").textContent = "×" + dq; },
  add() { addIt(); },
  icon(id, v) { ed.icon = v; edr(); },
  color(id, v) { ed.color = v; edr(); },
  cancel() { closeModal(); },
  save() { saveEd(); },
  dellist() { if (confirm("Eliminare la lista?")) { const id = ed.id; closeModal(); delList(id); } },
  code() { showCode(); },
  copy() {
    const done = () => toast("Codice copiato");
    try { navigator.clipboard.writeText(fam).then(done, () => toast("Tieni premuto sul codice per copiarlo")); }
    catch (e) { toast("Tieni premuto sul codice per copiarlo"); }
  },
  closem() { closeModal(); },
  create() { setFamily(newCode(), true); },
  join() {
    const c = normCode($("#jc").value);
    if (c.replace(/-/g, "").length !== 16) { toast("Il codice deve avere 16 caratteri"); return; }
    setFamily(c, false);
  },
  leave() {
    if (!confirm("Scollegare questo telefono? Le liste restano salvate online e puoi rientrare con il codice.")) return;
    if (unsub) { unsub(); unsub = null; }
    try { localStorage.removeItem("spesa_family"); } catch (e) { /* ignora */ }
    fam = ""; L = {}; cur = null; closeModal();
    $("#app").dataset.view = "";
    render();
  }
};

document.addEventListener("click", e => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const f = ACT[b.dataset.a];
  if (f) f(b.dataset.id, b.dataset.v);
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "ni") { draft = t.value; dcat = ""; const nc = $("#nc"); if (nc) nc.value = guess(draft); }
  else if (t.id === "en" && ed) ed.name = t.value;
});
document.addEventListener("change", e => { if (e.target.id === "nc") dcat = e.target.value; });
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  if (e.target.id === "ni") addIt();
  else if (e.target.id === "jc") ACT.join();
});

try {
  CapApp.addListener("backButton", () => {
    if ($("#m").classList.contains("o")) closeModal();
    else if (cur) { cur = null; render(); }
    else CapApp.exitApp();
  });
} catch (e) { /* in un browser normale il tasto indietro non serve */ }

/* ───────────── Avvio ───────────── */
function boot() {
  if (String(firebaseConfig.apiKey).startsWith("INCOLLA")) {
    fatal("Configurazione Firebase mancante", "Apri src/firebase-config.js e incolla i valori del tuo progetto Firebase (vedi GUIDA.md, passo 4), poi ricompila.");
    return;
  }
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  fs = initializeFirestore(app, { localCache: persistentLocalCache() });
  render();
  signInLoop();
}
boot();
