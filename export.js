(() => {
  const DATOS_BASE = {
    padres: "Ana & Carlos",
    fecha: "Sábado 30 de Agosto",
    hora: "4:00 p.m.",
    lugar: "Salón Estelar — Calle Luna 123",
    confirma:
      "Confirma asistencia • Cupo x persona $100.000\nNequi: 305 365 9842 (Merys Vargas)",
  };

  function readNombre() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("nombre")) return params.get("nombre");

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return "Invitado";

    const hashParams = new URLSearchParams(hash);
    if (hashParams.get("nombre")) return hashParams.get("nombre");

    // Permite #Nombre%20Completo
    try {
      return decodeURIComponent(hash);
    } catch {
      return hash;
    }
  }

  const dataName = document.getElementById("dataName");
  document.getElementById("dataParents").textContent = `De ${DATOS_BASE.padres}`;
  document.getElementById("dataFecha").textContent = DATOS_BASE.fecha;
  document.getElementById("dataHora").textContent = DATOS_BASE.hora;
  document.getElementById("dataLugar").textContent = DATOS_BASE.lugar;
  document.getElementById("dataConfirma").textContent = DATOS_BASE.confirma;

  window.setDestinatario = function setDestinatario(nombre) {
    dataName.textContent = nombre || "Invitado";
    fitNameToOneLine(dataName);
  };

  function fitNameToOneLine(el) {
    document.body.dataset.ready = "false";
    const minSize = 16;
    let size = 54;
    el.style.whiteSpace = "nowrap";
    el.style.fontSize = `${size}px`;

    const measure = () => {
      while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
      document.body.dataset.ready = "true";
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    } else {
      setTimeout(measure, 300);
    }
  }

  window.setDestinatario(readNombre());
})();
