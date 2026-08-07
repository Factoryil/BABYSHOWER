(() => {
  const fromHash = location.hash.replace(/^#/, "");
  const fromQuery = new URLSearchParams(location.search).get("id");
  const guest = window.getGuestById(fromHash || fromQuery || "01");

  const envelope = document.getElementById("envelope");
  const cardWrap = document.getElementById("cardWrap");
  const guestLabel = document.getElementById("guestLabel");

  if (!guest) {
    guestLabel.textContent = "Invitación no encontrada";
    envelope.hidden = true;
    return;
  }

  document.title = `Invitación para ${guest.nombre}`;
  guestLabel.textContent = `Para: ${guest.nombre}`;
  cardWrap.innerHTML = window.renderInviteCard(guest.nombre, { idAttr: "inviteCard" });

  let opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;
    envelope.classList.add("opened");
    cardWrap.setAttribute("aria-hidden", "false");
    cardWrap.classList.add("emerging");

    const onEnd = (e) => {
      if (e.animationName !== "cardEmerge") return;
      cardWrap.classList.remove("emerging");
      cardWrap.classList.add("revealed");
      window.fitGuestName(cardWrap);
      cardWrap.removeEventListener("animationend", onEnd);
    };

    cardWrap.addEventListener("animationend", onEnd);
  }

  envelope.addEventListener("click", openInvitation);

  window.addEventListener("load", () => {
    document.fonts?.ready?.then(() => window.fitGuestName(cardWrap));
    setTimeout(openInvitation, 900);
  });
})();
