(() => {
  const INVITADOS = window.INVITADOS || [];
  const toast = document.getElementById("toast");
  const bgStars = document.getElementById("bgStars");
  const isPanel = document.body.classList.contains("mode-panel");
  const isCarta = document.body.classList.contains("mode-carta");

  const CONTACTO = {
    telefono: "3053659842",
    lugar: "Club Barranquilla, Salón N.º 5",
    maps: "https://maps.app.goo.gl/G1dfoQDGTQfq8CtK7",
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function createDots(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "dot";
      el.style.left = `${4 + Math.random() * 92}%`;
      el.style.top = `${4 + Math.random() * 92}%`;
      el.style.animationDelay = `${Math.random() * 2.8}s`;
      frag.appendChild(el);
    }
    container.appendChild(frag);
  }

  function openWhatsApp(phone, message) {
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* ——— Página normal: todas las cartas ——— */
  function initPanel() {
    const grid = document.getElementById("panelGrid");
    if (!grid) return;

    INVITADOS.forEach((nombre, index) => {
      const id = window.padId(index + 1);
      const link = window.guestLink(index);

      const item = document.createElement("section");
      item.className = "panel-card";
      item.innerHTML = `
        <div class="panel-preview">
          ${window.renderInviteMarkup(nombre, { mini: true })}
        </div>
        <div class="panel-meta">
          <span class="panel-num">INVITACIÓN ${id}</span>
          <h2>${nombre}</h2>
        </div>
        <div class="panel-link">
          <input type="text" readonly value="${link}" aria-label="Link de la invitación" />
        </div>
        <div class="panel-actions">
          <button type="button" class="btn btn-copy" data-copy="${link}">Copiar link</button>
          <a class="btn btn-open" href="carta#${id}" target="_blank" rel="noopener">Abrir carta</a>
        </div>
      `;
      grid.appendChild(item);
    });

    grid.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        const input = btn.closest(".panel-card").querySelector("input");
        input.select();
        document.execCommand("copy");
      }
      showToast("Link copiado");
    });

    requestAnimationFrame(() => window.fitGuestNames(grid));
    window.addEventListener("resize", () => window.fitGuestNames(grid));
  }

  /* ——— Link personal: solo su carta, sin pasar a otras ——— */
  function initCarta() {
    const root = document.getElementById("cartaRoot");
    const locationBtn = document.getElementById("locationBtn");
    if (!root) return;

    const hashId = location.hash.replace(/^#/, "");
    const index = window.getGuestIndex(hashId);

    if (index === null) {
      root.innerHTML = `
        <div class="carta-error">
          <h1>Invitación no encontrada</h1>
          <p>Este link no es válido. Pide el link correcto a quien te invitó.</p>
        </div>
      `;
      if (locationBtn) locationBtn.hidden = true;
      return;
    }

    // Bloquea cambiar el hash a otra invitación
    const lockedId = window.padId(index + 1);
    const nombre = INVITADOS[index];

    root.innerHTML = window.renderInviteMarkup(nombre, {
      id: "inviteCard",
      showWhatsApp: true,
      showLocationLink: true,
    });

    document.title = `Baby Shower — ${nombre}`;

    const lockHash = () => {
      if (location.hash.replace(/^#/, "") !== lockedId) {
        history.replaceState(null, "", `#${lockedId}`);
      }
    };
    lockHash();
    window.addEventListener("hashchange", lockHash);

    // Sin flechas ni teclado para cambiar de invitado
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    // WhatsApp = solo confirmar cupos / asistencia
    root.addEventListener("click", (e) => {
      if (!e.target.closest("[data-whatsapp]")) return;
      openWhatsApp(
        CONTACTO.telefono,
        `Hola Merys 👋\nQuiero confirmar cupos para el Baby Shower de Steven.\nInvitación: *${nombre}*\nCupo x persona: $100.000\n¿Cuántos cupos confirmo?`
      );
      showToast("Abriendo WhatsApp para confirmar…");
    });

    // Ubicación = solo abrir el mapa del lugar
    locationBtn?.addEventListener("click", () => {
      window.open(CONTACTO.maps, "_blank", "noopener,noreferrer");
      showToast("Abriendo ubicación…");
    });

    // Ocultar botón de compartir si existiera en HTML viejo
    const shareLocationBtn = document.getElementById("shareLocationBtn");
    if (shareLocationBtn) shareLocationBtn.hidden = true;

    requestAnimationFrame(() => window.fitGuestNames(root));
    document.fonts?.ready?.then(() => window.fitGuestNames(root));
    window.addEventListener("resize", () => window.fitGuestNames(root));
  }

  createDots(bgStars, isPanel ? 36 : 28);

  if (isPanel) initPanel();
  if (isCarta) initCarta();
})();
