(() => {
  const INVITADOS = window.INVITADOS || [];
  const toast = document.getElementById("toast");
  const bgStars = document.getElementById("bgStars");
  const isPanel = document.body.classList.contains("mode-panel");
  const isCarta = document.body.classList.contains("mode-carta");

  const CONTACTO = {
    telefono: "3053659842",
    lugar: "Combarranquilla del Boston, Salón N.º 5",
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

  function enableTilt(scene, card) {
    if (!scene || !card) return;
    const max = 14;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      const rx = currentY * -1;
      const ry = currentX;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      const glareX = 50 + currentX * 2.2;
      const glareY = 50 + currentY * 2.2;
      card.style.setProperty("--glare-x", `${glareX}%`);
      card.style.setProperty("--glare-y", `${glareY}%`);
      raf = requestAnimationFrame(render);
    };

    const setFromPoint = (clientX, clientY) => {
      const rect = scene.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      targetX = (px - 0.5) * 2 * max;
      targetY = (py - 0.5) * 2 * max;
    };

    const onMove = (e) => {
      const point = e.touches ? e.touches[0] : e;
      if (!point) return;
      active = true;
      setFromPoint(point.clientX, point.clientY);
    };

    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
    };

    scene.addEventListener("pointermove", onMove, { passive: true });
    scene.addEventListener("pointerdown", onMove, { passive: true });
    scene.addEventListener("pointerleave", onLeave);
    scene.addEventListener("pointerup", onLeave);

    // Ligero movimiento idle cuando no se toca
    let t = 0;
    const idle = () => {
      if (!active) {
        t += 0.018;
        targetX = Math.sin(t) * 4.5;
        targetY = Math.cos(t * 0.8) * 3.2;
      }
    };
    setInterval(idle, 32);
    raf = requestAnimationFrame(render);
  }

  /* ——— Link personal: sello → carta 3D ——— */
  function initCarta() {
    const root = document.getElementById("cartaRoot");
    const locationBtn = document.getElementById("locationBtn");
    const sealCard = document.getElementById("sealCard");
    const openBtn = document.getElementById("openLetterBtn");
    const stage = document.getElementById("cartaStage");
    const tiltScene = document.getElementById("tiltScene");
    const tiltCard = document.getElementById("tiltCard");
    const sealGuest = document.getElementById("sealGuest");
    if (!root) return;

    const hashId = location.hash.replace(/^#/, "");
    const index = window.getGuestIndex(hashId);

    if (index === null) {
      if (sealCard) sealCard.hidden = true;
      root.innerHTML = `
        <div class="carta-error">
          <h1>Invitación no encontrada</h1>
          <p>Este link no es válido. Pide el link correcto a quien te invitó.</p>
        </div>
      `;
      stage?.classList.remove("is-hidden");
      if (locationBtn) locationBtn.hidden = true;
      return;
    }

    const lockedId = window.padId(index + 1);
    const nombre = INVITADOS[index];

    document.title = `Baby Shower — ${nombre}`;
    if (sealGuest) sealGuest.textContent = `Para: ${nombre}`;

    const lockHash = () => {
      if (location.hash.replace(/^#/, "") !== lockedId) {
        history.replaceState(null, "", `#${lockedId}`);
      }
    };
    lockHash();
    window.addEventListener("hashchange", lockHash);

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

    let opened = false;
    const revealInvite = () => {
      if (opened) return;
      opened = true;

      root.innerHTML = window.renderInviteMarkup(nombre, {
        id: "inviteCard",
        showWhatsApp: true,
        showLocationLink: true,
      });

      document.body.classList.remove("is-sealed");
      document.body.classList.add("is-open");
      sealCard?.classList.add("is-leaving");

      setTimeout(() => {
        if (sealCard) sealCard.hidden = true;
        stage?.classList.remove("is-hidden");
        stage?.classList.add("is-revealed");
        if (locationBtn) locationBtn.hidden = false;
        enableTilt(tiltScene, tiltCard);
        requestAnimationFrame(() => window.fitGuestNames(root));
        document.fonts?.ready?.then(() => window.fitGuestNames(root));
        showToast("Mueve la carta para ver el efecto 3D");
      }, 420);
    };

    openBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      revealInvite();
    });
    sealCard?.addEventListener("click", () => revealInvite());

    root.addEventListener("click", (e) => {
      if (!e.target.closest("[data-whatsapp]")) return;
      openWhatsApp(
        CONTACTO.telefono,
        `Hola Merys 👋\nQuiero confirmar cupos para el Baby Shower de Steven.\nInvitación: *${nombre}*\nCupo x persona: $100.000\n¿Cuántos cupos confirmo?`
      );
      showToast("Abriendo WhatsApp para confirmar…");
    });

    locationBtn?.addEventListener("click", () => {
      window.open(CONTACTO.maps, "_blank", "noopener,noreferrer");
      showToast("Abriendo ubicación…");
    });

    window.addEventListener("resize", () => window.fitGuestNames(root));
  }

  createDots(bgStars, isPanel ? 36 : 28);

  if (isPanel) initPanel();
  if (isCarta) initCarta();
})();
