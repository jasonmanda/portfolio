/* Simulateur d'estimation. Les tarifs viennent de tarifs.json (modifiable). */
(function () {
  const root = document.getElementById("est");
  if (!root) return;

  const cur = () => (document.documentElement.lang === "fr" ? "fr" : "en");
  const L = o => (typeof o === "string" ? o : (o && (o[cur()] || o.fr || o.en)) || "");
  const tx = {
    fr: { err: "Impossible de charger tarifs.json. Ouvrez le site via un serveur (ex. npx serve .).", pick: "Choisissez un niveau pour obtenir une estimation.", none: "aucune", noLevel: "Aucun",
          hello: "Bonjour, je souhaite un devis.", type: "Projet", cx: "Complexité", opt: "Options", est: "Estimation indicative" },
    en: { err: "Could not load tarifs.json. Open the site through a server (e.g. npx serve .).", pick: "Choose a level to get an estimate.", none: "none", noLevel: "None",
          hello: "Hello, I would like a quote.", type: "Project", cx: "Complexity", opt: "Options", est: "Indicative estimate" }
  };

  // Icônes (traits simples, fournies par le code, pas par le JSON)
  const ICONS = {
    design: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    auth: '<circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>',
    mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/>',
    outils: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    ajout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>',
    data: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    paiement: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    admin: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    seolocal: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    multilangue: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',
    ia: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/>'
  };

  const $types = document.getElementById("est-types");
  const $cx = document.getElementById("est-cx");
  const $opts = document.getElementById("est-opts");
  const $value = document.getElementById("est-value");
  const $note = document.getElementById("est-note");
  const $quote = document.getElementById("est-quote");

  let T = null;
  const refresh = [];      // fonctions qui re-écrivent les textes (changement de langue)
  const levelDescs = {};   // id option -> élément de description du niveau choisi
  const optEls = {};       // id option -> élément DOM (pour l'afficher / le masquer)

  function el(tag, cls, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }
  function bind(e, fn) { refresh.push(() => { e.textContent = fn(); }); }
  function tr(e, obj, field) { bind(e, () => L(obj[field])); }

  function num(n) { return n.toLocaleString(cur() === "fr" ? "fr-FR" : "en-US").replace(/[\u202f\u00a0]/g, "\u00a0"); }
  function amount(n, open) { return num(n) + (open ? "+" : "") + "\u00a0" + (T.devise || ""); }
  function plus(o) { return "+" + num(o.min) + " – " + amount(o.max, o.ouvert); }

  function input(parent, kind, name, value, checked, onChange) {
    const i = el("input", "", parent);
    i.type = kind; i.name = name; i.value = value; i.checked = checked;
    i.addEventListener("change", onChange || update);
    return i;
  }
  function icon(parent, name) {
    const s = el("span", "est-ico", parent);
    s.setAttribute("aria-hidden", "true");
    if (ICONS[name]) s.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[name] + "</svg>";
    return s;
  }

  function buildToggle(o, checked) {
    const l = el("label", "est-opt" + (o.large ? " wide" : ""), $opts);
    optEls[o.id] = l;
    input(l, "checkbox", "est-opt", o.id, checked);
    icon(l, o.icone);
    const b = el("span", "est-body", l);
    tr(el("span", "est-ot", b), o, "label");
    if (o.desc) tr(el("span", "est-od", b), o, "desc");
    if (T.afficherPrix !== false) bind(el("span", "est-op", b), () => plus(o));
    el("span", "est-box", l);
  }

  function buildLevels(o, current) {
    const multi = o.choix === "multiple";
    const sel = [].concat(current || []).filter(Boolean);
    const box = el("div", "est-lvl", $opts);
    optEls[o.id] = box;
    const onChange = () => {
      if (!multi && o.exclusif && (root.querySelector('input[name="est-lvl-' + o.id + '"]:checked') || {}).value) {
        o.exclusif.forEach(id => {
          const none = root.querySelector('input[name="est-lvl-' + id + '"][value=""]');
          if (none) none.checked = true;
        });
      }
      update();
    };
    const head = el("div", "est-lvl-head", box);
    icon(head, o.icone);
    const b = el("div", "est-body", head);
    tr(el("span", "est-ot", b), o, "label");
    if (o.desc) tr(el("span", "est-od", b), o, "desc");

    const segs = el("div", "est-segs", box);
    segs.style.setProperty("--n", o.niveaux.length + (multi ? 0 : 1));
    const name = "est-lvl-" + o.id;
    if (!multi) {
      const none = el("label", "est-seg", segs);
      input(none, "radio", name, "", !sel.length, onChange);
      bind(el("span", "est-sl", none), () => (o.aucun ? L(o.aucun) : tx[cur()].noLevel));
    }
    o.niveaux.forEach(n => {
      const s = el("label", "est-seg", segs);
      input(s, multi ? "checkbox" : "radio", name, n.id, sel.includes(n.id), onChange);
      tr(el("span", "est-sl", s), n, "label");
      if (T.afficherPrix !== false) bind(el("span", "est-sp", s), () => plus(n));
    });
    levelDescs[o.id] = el("p", "est-lvl-d", box);
    levelDescs[o.id].setAttribute("aria-live", "polite");
  }

  function build() {
    const d = T.defaut || {};
    T.types.forEach((t, i) => {
      const l = el("label", "est-card", $types);
      input(l, "radio", "est-type", t.id, t.id === d.type || (!d.type && i === 0));
      tr(el("span", "est-t", l), t, "label");
      tr(el("span", "est-d", l), t, "desc");
    });
    T.complexites.forEach((c, i) => {
      const l = el("label", "est-pill", $cx);
      input(l, "radio", "est-cx", c.id, c.id === d.complexite || (!d.complexite && i === 0));
      tr(el("span", "", l), c, "label");
    });
    T.options.forEach(o => {
      if (o.niveaux && o.niveaux.length) buildLevels(o, (d.niveaux || {})[o.id] || "");
      else buildToggle(o, (d.options || []).includes(o.id));
    });
  }

  function retext() {
    refresh.forEach(f => f());
    update();
  }

  function chosen(o) {
    const ids = [...root.querySelectorAll('input[name="est-lvl-' + o.id + '"]:checked')].map(i => i.value);
    return o.niveaux.filter(n => ids.includes(n.id));
  }

  function visible(o, t) {
    return (!t.options || t.options.includes(o.id)) && (!o.types || o.types.includes(t.id));
  }

  function selected() {
    const t = T.types.find(x => x.id === (root.querySelector("input[name=est-type]:checked") || {}).value);
    const c = t.sansComplexite ? null : T.complexites.find(x => x.id === (root.querySelector("input[name=est-cx]:checked") || {}).value);
    const picks = [];
    T.options.forEach(o => {
      if (!visible(o, t)) return;
      if (o.niveaux && o.niveaux.length) {
        chosen(o).forEach(n => picks.push({
          label: o.choix === "multiple" ? L(n.label) : L(o.label) + " (" + L(n.label) + ")",
          min: n.min, max: n.max, ouvert: !!n.ouvert }));
      } else {
        const i = root.querySelector('input[name="est-opt"][value="' + o.id + '"]');
        if (i && i.checked) picks.push({ label: L(o.label), min: o.min, max: o.max, ouvert: !!o.ouvert });
      }
    });
    return { t, c, picks };
  }

  function compute() {
    const { t, c, picks } = selected();
    const m = c ? c.multiplicateur : 1;
    let min = t.min * m, max = t.max * m;
    picks.forEach(p => { min += p.min; max += p.max; });
    const step = T.arrondi || 1;
    return { min: Math.round(min / step) * step, max: Math.round(max / step) * step,
             open: picks.some(p => p.ouvert), empty: max === 0 };
  }

  function range() { const r = compute(); return money(r.min) + " — " + amount(r.max, r.open); }
  function money(n) { return amount(n, false); }

  const legend = document.getElementById("est-opt-legend");
  const legendDefault = { en: legend ? legend.dataset.en : "", fr: (typeof fr !== "undefined" && fr.est_opt) || (legend ? legend.dataset.en : "") };

  function update() {
    const { t } = selected();
    T.options.forEach(o => { if (optEls[o.id]) optEls[o.id].hidden = !visible(o, t); });
    $cx.closest("fieldset").hidden = !!t.sansComplexite;
    if (legend) legend.textContent = t.titreOptions ? L(t.titreOptions) : legendDefault[cur()];

    const r = compute();
    $value.textContent = r.empty ? "—" : range();
    $note.textContent = r.empty ? tx[cur()].pick : (T.note ? L(T.note) : "");
    $quote.disabled = r.empty;

    T.options.forEach(o => {
      if (!(o.niveaux && o.niveaux.length)) return;
      levelDescs[o.id].textContent = chosen(o).map(n => (n.desc ? L(n.desc) : "")).filter(Boolean).join(" ");
    });
  }

  $quote.addEventListener("click", () => {
    const s = selected(), m = tx[cur()];
    const msg = [
      m.hello, "",
      m.type + " : " + L(s.t.label),
      ...(s.c ? [m.cx + " : " + L(s.c.label)] : []),
      m.opt + " : " + (s.picks.length ? s.picks.map(p => p.label).join(", ") : m.none),
      m.est + " : " + range(), ""
    ].join("\n");
    const ta = document.querySelector("#form textarea[name=message]");
    if (ta) ta.value = msg;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 400);
  });

  document.addEventListener("langchange", () => { if (T) retext(); });

  fetch("tarifs.json", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(j => { T = j; build(); retext(); })
    .catch(() => { $value.textContent = "—"; $note.textContent = tx[cur()].err; });
})();
