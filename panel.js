(() => {
  const grid = document.getElementById("panelGrid");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = "Link copiado";
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  (window.INVITADOS || []).forEach((nombre, index) => {
    const id = pad(index + 1);
    const link = window.guestLink(index);

    const card = document.createElement("section");
    card.className = "guest-card";
    card.innerHTML = `
      <div class="preview">
        ${window.renderInviteCard(nombre, { mini: true })}
      </div>
      <div class="meta">
        <span class="num">INVITACIÓN ${id}</span>
        <h2>${nombre}</h2>
      </div>
      <div class="link-box">
        <input type="text" readonly value="${link}" aria-label="Link de la invitación" />
      </div>
      <div class="actions">
        <button type="button" class="btn-copy" data-link="${link}">Copiar link</button>
        <a class="btn-open" href="carta#${id}" target="_blank" rel="noopener">Abrir carta</a>
      </div>
    `;

    grid.appendChild(card);
  });

  grid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-copy");
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.link);
      showToast("Link copiado");
    } catch {
      const input = btn.closest(".guest-card").querySelector("input");
      input.select();
      document.execCommand("copy");
      showToast("Link copiado");
    }
  });

  requestAnimationFrame(() => window.fitGuestName(grid));
  window.addEventListener("resize", () => window.fitGuestName(grid));
})();
