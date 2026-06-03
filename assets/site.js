/* site.js – Navigation, Accordion, Reveal, Formular.
   Progressive Enhancement: ohne JS bleibt die Seite bedienbar. */
(function () {
  "use strict";

  /* ---- Mobile-Navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }

  if (toggle && nav) {
    setNav(false);
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setNav(!open);
      if (!open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });

    // Escape schließt und gibt den Fokus zurück
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });

    // Klick außerhalb schließt
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });

    // Klick auf einen Navigationslink schließt (Sprungmarken)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
  }

  /* ---- Accordion (FAQ) ---- */
  var triggers = document.querySelectorAll(".accordion__trigger");
  Array.prototype.forEach.call(triggers, function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---- Reveal-Animation (nur ohne Reduced Motion) ---- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }

  /* ---- Kontaktformular: validieren, dann E-Mail-Entwurf vorbereiten ----
     Kein automatischer Versand. Das Formular baut einen mailto-Entwurf,
     den der Nutzer selbst abschickt. */
  var form = document.getElementById("kontakt-form");
  if (form) {
    var status = document.getElementById("form-status");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function field(input) { return input.closest(".field"); }

    function invalid(input, bad) {
      var f = field(input);
      if (!f) return;
      f.dataset.invalid = bad ? "true" : "false";
      input.setAttribute("aria-invalid", bad ? "true" : "false");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"];
      var mail = form.elements["email"];
      var url = form.elements["website"];
      var msg = form.elements["nachricht"];
      var firstBad = null;

      function check(input, ok) {
        invalid(input, !ok);
        if (!ok && !firstBad) firstBad = input;
        return ok;
      }

      check(name, name.value.trim().length > 0);
      check(mail, emailRe.test(mail.value.trim()));
      check(msg, msg.value.trim().length > 0);
      // Website optional: nur prüfen, wenn etwas eingetragen ist
      check(url, url.value.trim() === "" || /^https?:\/\/.+/i.test(url.value.trim()));

      if (firstBad) {
        status.textContent = "Bitte prüfen Sie die rot markierten Felder.";
        firstBad.focus();
        return;
      }

      var betreff = "BFSG-Anfrage von " + name.value.trim();
      var koerper =
        "Name: " + name.value.trim() + "\n" +
        "E-Mail: " + mail.value.trim() + "\n" +
        "Website: " + (url.value.trim() || "(keine Angabe)") + "\n\n" +
        "Anliegen:\n" + msg.value.trim() + "\n";

      var href = "mailto:mail@andersen-webworks.de" +
        "?subject=" + encodeURIComponent(betreff) +
        "&body=" + encodeURIComponent(koerper);

      status.textContent = "Ihr E-Mail-Programm öffnet sich mit einer vorausgefüllten Nachricht. Bitte einmal selbst abschicken.";
      window.location.href = href;
    });
  }
})();
