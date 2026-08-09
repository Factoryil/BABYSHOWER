window.INVITE_DATA = {
  honor: "Steven Saith Salazar Rodríguez",
  fecha: "Sábado 15 de agosto, 2026",
  hora: "5:00 p.m. – 11:00 p.m.",
  lugar: "Combarranquilla del Boston, Salón N.º 5",
  confirmaTitulo: "CONFIRMA ASISTENCIA",
  cupo: "Cupo x persona: $100.000 · Confirmar antes del 12 de agosto de 2026",
  nequi: "Nequi: 305 365 9842 (Merys Vargas)",
};

window.renderInviteCard = function renderInviteCard(guestName, options = {}) {
  const mini = options.mini ? " mini" : "";
  const id = options.idAttr ? ` id="${options.idAttr}"` : "";
  const d = window.INVITE_DATA;
  const safeName = String(guestName || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `
    <article class="invite${mini}"${id}>
      <div class="invite-stars" aria-hidden="true"></div>
      <div class="invite-inner">
        <div class="invite-copy">
          <p class="invite-kicker">¡Un pequeño explorador</p>
          <h2 class="invite-title">ESTÁ POR LLEGAR!</h2>
          <p class="invite-sub">Acompáñanos a celebrar un</p>
          <p class="invite-script">Baby Shower</p>
          <p class="invite-honor-label">EN HONOR A</p>
          <p class="invite-honor">${d.honor}</p>
          <p class="invite-para-label">Para:</p>
          <p class="invite-para" data-guest-name title="${safeName}">${safeName}</p>
          <div class="invite-meta">
            <div><span class="ico">📅</span><span><strong>Fecha:</strong> ${d.fecha}</span></div>
            <div><span class="ico">⏰</span><span><strong>Hora:</strong> ${d.hora}</span></div>
            <div><span class="ico">📍</span><span><strong>Lugar:</strong> ${d.lugar}</span></div>
          </div>
          <div class="invite-confirma">
            <div class="head"><span>🎁</span><span>${d.confirmaTitulo}</span></div>
            <div class="money">${d.cupo}</div>
            <div>${d.nequi}</div>
          </div>
        </div>
        <div class="invite-side" aria-hidden="true">
          <img class="invite-baby" src="assets/bebe-buzz.png" alt="" draggable="false" />
        </div>
      </div>
    </article>
  `;
};

window.fitGuestName = function fitGuestName(root = document) {
  root.querySelectorAll("[data-guest-name]").forEach((el) => {
    el.style.whiteSpace = "nowrap";
    const isMini = el.closest(".invite")?.classList.contains("mini");
    let size = isMini ? 11 : 18;
    const min = isMini ? 7 : 10;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.clientWidth && size > min) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  });
};

window.guestLink = function guestLink(index) {
  const id = String(index + 1).padStart(2, "0");
  const base = window.SITE_BASE || "https://factoryil.github.io/BABYSHOWER";
  return `${base}/carta#${id}`;
};

window.getGuestById = function getGuestById(id) {
  const n = parseInt(String(id || "").replace(/\D/g, ""), 10);
  if (!n || n < 1 || n > (window.INVITADOS || []).length) return null;
  return {
    index: n - 1,
    id: String(n).padStart(2, "0"),
    nombre: window.INVITADOS[n - 1],
  };
};
