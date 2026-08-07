window.renderInviteMarkup = function renderInviteMarkup(guestName, options = {}) {
  const mini = options.mini ? " is-mini" : "";
  const idAttr = options.id ? ` id="${options.id}"` : "";
  const safe = String(guestName || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `
    <article class="invite${mini}"${idAttr}>
      <div class="invite-glow" aria-hidden="true"></div>
      <div class="invite-deco planet" aria-hidden="true"><span></span></div>
      <div class="invite-deco rocket" aria-hidden="true"></div>

      <div class="invite-body">
        <header class="section section-hero">
          <p class="eyebrow">¡Un pequeño explorador</p>
          <h1 class="hero-title">ESTÁ POR <span>LLEGAR!</span></h1>
          <p class="hero-sub">Acompáñanos a celebrar un</p>
          <h2 class="hero-script">
            <span class="spark" aria-hidden="true"></span>
            Baby Shower
            <span class="spark" aria-hidden="true"></span>
          </h2>
        </header>

        <section class="section section-honor">
          <p class="section-label">★ En honor a ★</p>
          <div class="name-card name-card-honor">
            <p>Steven Saith Salazar Rodríguez</p>
          </div>
        </section>

        <section class="section section-guest">
          <p class="section-label section-label-guest">Para</p>
          <div class="name-card name-card-guest">
            <p data-guest-name title="${safe}">${safe}</p>
          </div>
        </section>

        <div class="divider" aria-hidden="true"></div>

        <section class="section section-info" aria-label="Información del evento">
          <div class="info-grid">
            <article class="info-card">
              <span class="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="info-text">
                <span>Fecha</span>
                <strong>Sábado 15 de agosto, 2026</strong>
              </div>
            </article>
            <article class="info-card">
              <span class="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="info-text">
                <span>Hora</span>
                <strong>5:00 p.m. – 11:00 p.m.</strong>
              </div>
            </article>
            <article class="info-card info-card-lugar">
              <span class="info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </span>
              <div class="info-text">
                <span>Lugar</span>
                <strong>Club Barranquilla, Salón N.º 5</strong>
                ${
                  options.showLocationLink
                    ? `<a class="lugar-link" href="https://maps.app.goo.gl/G1dfoQDGTQfq8CtK7" target="_blank" rel="noopener">Ver en el mapa</a>`
                    : ""
                }
              </div>
            </article>
          </div>
        </section>

        <div class="divider" aria-hidden="true"></div>

        <section class="section section-confirm">
          <div class="confirm-card">
            <div class="confirm-top">
              <span class="confirm-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="10" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 10v11M3 14h18M12 10c-2.5 0-4-1.5-4-3.2S9.5 4 12 6.2C14.5 4 16 5 16 6.8S14.5 10 12 10z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div>
                <h3>Confirma asistencia</h3>
                <p class="confirm-cupo">Cupo x persona: <strong>$100.000</strong></p>
              </div>
            </div>
            <p class="confirm-phone">305 365 9842</p>
            <p class="confirm-host">Nequi · Merys Vargas</p>
            ${
              options.showWhatsApp
                ? `<button type="button" class="btn-whatsapp" data-whatsapp>Confirmar cupos por WhatsApp</button>`
                : ""
            }
          </div>
        </section>
      </div>

      <img class="buzz" src="assets/bebe-buzz.png?v=4" alt="" draggable="false" />
    </article>
  `;
};

window.fitGuestNames = function fitGuestNames(root = document) {
  const phone = window.matchMedia("(max-width: 767px)").matches;

  root.querySelectorAll("[data-guest-name]").forEach((el) => {
    const mini = el.closest(".invite")?.classList.contains("is-mini");
    let size = mini ? 12 : phone ? 16 : 18;
    const min = mini ? 8 : phone ? 11 : 10;

    // En teléfono permite 2 líneas si el nombre es muy largo
    el.style.whiteSpace = phone && !mini ? "normal" : "nowrap";
    el.style.fontSize = `${size}px`;

    if (phone && !mini) {
      el.style.lineHeight = "1.25";
      while (el.scrollHeight > el.clientHeight + 4 && size > min) {
        // si no tiene altura fija, solo ajustamos si se desborda horizontal
        break;
      }
      while (el.scrollWidth > el.clientWidth && size > min) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
      return;
    }

    while (el.scrollWidth > el.clientWidth && size > min) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  });
};
