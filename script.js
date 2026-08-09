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

  async function copyText(text, inputEl) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* fallback abajo */
      }
    }

    try {
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
        inputEl.setSelectionRange(0, text.length);
        if (document.execCommand("copy")) return true;
      }

      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function shareLink(link, nombre) {
    const title = "Baby Shower — Steven Saith";
    const text = `Invitación Baby Shower para ${nombre}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: link });
        return "shared";
      } catch (err) {
        if (err?.name === "AbortError") return "cancelled";
      }
    }

    const ok = await copyText(link);
    return ok ? "copied" : "failed";
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
      item.dataset.index = String(index);
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
          <button type="button" class="btn-link-copy" data-action="copy" title="Copiar link" aria-label="Copiar link">
            Copiar
          </button>
        </div>
        <div class="panel-actions">
          <button type="button" class="btn btn-copy" data-action="copy">Copiar link</button>
          <button type="button" class="btn btn-share" data-action="share">Compartir</button>
          <a class="btn btn-open" href="${link}" target="_blank" rel="noopener">Abrir carta</a>
        </div>
      `;
      grid.appendChild(item);
    });

    grid.addEventListener("focusin", (e) => {
      const input = e.target.closest(".panel-link input");
      if (!input) return;
      input.select();
    });

    grid.addEventListener("click", async (e) => {
      const input = e.target.closest(".panel-link input");
      if (input) {
        input.focus();
        input.select();
        return;
      }

      const actionBtn = e.target.closest("[data-action]");
      if (!actionBtn) return;

      const card = actionBtn.closest(".panel-card");
      if (!card) return;

      const index = Number(card.dataset.index);
      const nombre = INVITADOS[index];
      const link = window.guestLink(index);
      const linkInput = card.querySelector(".panel-link input");
      const action = actionBtn.dataset.action;

      if (action === "copy") {
        const ok = await copyText(link, linkInput);
        showToast(ok ? "Link copiado. Ya puedes pegarlo y enviarlo." : "No se pudo copiar. Selecciona el link y cópialo manualmente.");
        return;
      }

      if (action === "share") {
        const result = await shareLink(link, nombre);
        if (result === "shared") showToast("Listo para compartir");
        else if (result === "copied") showToast("Link copiado. Ya puedes pegarlo y enviarlo.");
        else if (result === "failed") showToast("No se pudo compartir. Copia el link manualmente.");
      }
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
