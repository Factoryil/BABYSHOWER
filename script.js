(() => {
  // ——— EDITA AQUÍ LOS DATOS DE LA INVITACIÓN ———
  const DATOS = {
    nombreBebe: "Mateo Alejandro",
    padres: "Ana & Carlos",
    fecha: "Sábado 30 de Agosto",
    hora: "4:00 p.m.",
    lugar: "Salón Estelar — Calle Luna 123",
    confirma: "WhatsApp 300 123 4567",
  };

  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");
  const cardInner = document.getElementById("cardInner");
  const cardTilt = document.getElementById("cardTilt");
  const scene = document.getElementById("scene");
  const saveBtn = document.getElementById("saveBtn");

  let opened = false;

  function fillData() {
    const map = {
      dataName: DATOS.nombreBebe,
      dataParents: `De ${DATOS.padres}`,
      dataFecha: DATOS.fecha,
      dataHora: DATOS.hora,
      dataLugar: DATOS.lugar,
      dataConfirma: DATOS.confirma,
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  function openInvitation() {
    if (opened) return;
    opened = true;

    document.body.classList.add("is-open");
    envelope.classList.add("opened");
    envelope.setAttribute("aria-disabled", "true");

    card.setAttribute("aria-hidden", "false");
    card.classList.add("emerging");

    const onEnd = (event) => {
      if (event.animationName !== "cardEmerge") return;
      card.classList.remove("emerging");
      card.classList.add("revealed");
      saveBtn.hidden = false;
      requestAnimationFrame(() => saveBtn.classList.add("visible"));
      card.removeEventListener("animationend", onEnd);
    };

    card.addEventListener("animationend", onEnd);
  }

  async function saveCard() {
    if (!window.html2canvas || !card.classList.contains("revealed")) return;

    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";
    card.classList.add("saving");
    resetTilt();

    try {
      const canvas = await html2canvas(cardInner, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      const safeName = DATOS.nombreBebe.replace(/\s+/g, "-").toLowerCase();
      link.download = `baby-shower-${safeName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la imagen. Intenta de nuevo.");
    } finally {
      card.classList.remove("saving");
      saveBtn.disabled = false;
      saveBtn.textContent = "Guardar invitación";
    }
  }

  function onPointerMove(clientX, clientY) {
    if (!card.classList.contains("revealed") || card.classList.contains("saving")) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    cardTilt.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 18}deg)`;
  }

  function resetTilt() {
    cardTilt.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  scene.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
  scene.addEventListener("mouseleave", resetTilt);
  scene.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches[0]) return;
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  scene.addEventListener("touchend", resetTilt);

  envelope.addEventListener("click", openInvitation);
  saveBtn.addEventListener("click", saveCard);

  fillData();

  window.addEventListener("load", () => {
    setTimeout(openInvitation, 900);
  });
})();
