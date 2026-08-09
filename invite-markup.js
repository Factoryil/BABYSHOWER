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
      <div class="invite-space" aria-hidden="true">
        <span class="soft-planet soft-planet-a"></span>
        <span class="soft-planet soft-planet-b"></span>
        <span class="invite-star s1"></span>
        <span class="invite-star s2"></span>
        <span class="invite-star s3"></span>
        <span class="invite-star s4"></span>
        <span class="invite-star s5"></span>
      </div>
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

        <div class="divider" role="separator" aria-hidden="true">
          <span class="divider-gem">✦</span>
        </div>

        <section class="section section-info" aria-label="Información del evento">
          <p class="section-label section-label-info">Información</p>
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
                <strong>Combarranquilla del Boston, Salón N.º 5</strong>
                ${
                  options.showLocationLink
                    ? `<a class="lugar-link" href="https://maps.app.goo.gl/G1dfoQDGTQfq8CtK7" target="_blank" rel="noopener">Ver en el mapa</a>`
                    : ""
                }
              </div>
            </article>
          </div>
        </section>

        <div class="divider" role="separator" aria-hidden="true">
          <span class="divider-gem">✦</span>
        </div>

        <section class="section section-confirm">
          <div class="confirm-card">
            <div class="confirm-top">
              <span class="confirm-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="10" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 10v11M3 14h18M12 10c-2.5 0-4-1.5-4-3.2S9.5 4 12 6.2C14.5 4 16 5 16 6.8S14.5 10 12 10z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="confirm-copy">
                <h3>Confirma asistencia</h3>
                <p class="confirm-cupo">Cupo x persona: <strong>$100.000</strong></p>
              </div>
            </div>
            <div class="confirm-phone-block">
              <p class="confirm-phone">305 365 9842</p>
              <p class="confirm-host">Nequi · Merys Vargas</p>
            </div>
            ${
              options.showWhatsApp
                ? `<button type="button" class="btn-whatsapp" data-whatsapp>
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.93.52 3.73 1.43 5.3L2 22l5.05-1.52a9.9 9.9 0 0 0 4.99 1.35h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.74 13.9c-.24.68-1.4 1.25-1.93 1.33-.49.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.15.12.32.02.51-.09.19-.14.32-.27.49-.14.17-.29.38-.41.51-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.22 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.09 1.66.78 1.95.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/>
                    </svg>
                    Confirmar cupos por WhatsApp
                  </button>`
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
    let size = mini ? 12 : phone ? 16 : 19;
    const min = mini ? 8 : phone ? 11 : 11;

    el.style.whiteSpace = phone && !mini ? "normal" : "nowrap";
    el.style.fontSize = `${size}px`;

    if (phone && !mini) {
      el.style.lineHeight = "1.25";
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
