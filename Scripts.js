document.addEventListener("DOMContentLoaded", () => {
  const botonSorpresa = document.getElementById("botonSorpresa");
  const inicio = document.getElementById("inicio");
  const musica = document.getElementById("musica");
  const botonMusica = document.getElementById("botonMusica");
  const mensaje = document.getElementById("mensajeAmor");

  if (!botonSorpresa || !inicio || !musica || !botonMusica || !mensaje) {
    console.error("No se pudo iniciar la sorpresa: faltan elementos en el HTML.");
    return;
  }

  let musicaActiva = false;
  let sorpresaIniciada = false;
  let temporizadorMensaje;

  const actualizarBotonMusica = (activa) => {
    musicaActiva = activa;
    botonMusica.textContent = activa ? "🔊" : "🔇";
    botonMusica.setAttribute("aria-label", activa ? "Pausar música" : "Reproducir música");
    botonMusica.setAttribute("aria-pressed", String(activa));
  };

  botonSorpresa.addEventListener("click", () => {
    if (sorpresaIniciada) return;

    sorpresaIniciada = true;
    botonSorpresa.disabled = true;
    inicio.classList.add("inicio--oculto");
    document.body.classList.remove("not-loaded");
    botonMusica.classList.add("boton-musica--visible");

    musica.volume = 0.65;
    musica.play()
      .then(() => actualizarBotonMusica(true))
      .catch((error) => {
        console.warn("El navegador bloqueó la reproducción automática:", error);
        actualizarBotonMusica(false);
      });

    inicio.addEventListener("transitionend", () => inicio.remove(), { once: true });

    const espera = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 6200;
    temporizadorMensaje = window.setTimeout(() => {
      mensaje.classList.add("mensaje-amor--visible");
    }, espera);
  }, { once: true });

  botonMusica.addEventListener("click", () => {
    if (musicaActiva) {
      musica.pause();
      actualizarBotonMusica(false);
      return;
    }

    musica.play()
      .then(() => actualizarBotonMusica(true))
      .catch((error) => console.error("Error reproduciendo el audio:", error));
  });

  musica.addEventListener("error", () => {
    botonMusica.textContent = "⚠️";
    botonMusica.setAttribute("aria-label", "No se pudo cargar la música");
    botonMusica.disabled = true;
  });

  window.addEventListener("pagehide", () => window.clearTimeout(temporizadorMensaje), { once: true });
});
