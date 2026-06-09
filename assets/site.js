/* site.js – Navigation, Accordion, Reveal, Formular.
   Progressive Enhancement: ohne JS bleibt die Seite bedienbar. */
(function () {
  "use strict";

  var pageLang = (document.documentElement.getAttribute("lang") || "de").toLowerCase();
  var english = pageLang.indexOf("en") === 0;
  var text = english ? {
    dark: "Turn on dark design",
    light: "Turn on light design",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    invalidForm: "Please check the fields marked in red.",
    mailStatus: "Your email program opens with a prefilled message. Please send it yourself.",
    subjectPrefix: "BFSG enquiry from ",
    noWebsite: "(not provided)",
    messageLabel: "Message:\n"
  } : {
    dark: "Dunkles Design einschalten",
    light: "Helles Design einschalten",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    invalidForm: "Bitte prüfen Sie die rot markierten Felder.",
    mailStatus: "Ihr E-Mail-Programm öffnet sich mit einer vorausgefüllten Nachricht. Bitte einmal selbst abschicken.",
    subjectPrefix: "BFSG-Anfrage von ",
    noWebsite: "(keine Angabe)",
    messageLabel: "Anliegen:\n"
  };

  /* ---- Dark-Mode-Umschalter (folgt System, merkt sich die Wahl) ---- */
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    var root = document.documentElement;
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

    var effectiveDark = function () {
      var set = root.getAttribute("data-theme");
      if (set === "dark") return true;
      if (set === "light") return false;
      return mq ? mq.matches : false;
    };
    var syncButton = function () {
      var dark = effectiveDark();
      themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
      themeBtn.setAttribute("aria-label", dark ? text.light : text.dark);
    };
    syncButton();

    themeBtn.addEventListener("click", function () {
      var dark = !effectiveDark();
      root.setAttribute("data-theme", dark ? "dark" : "light");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
      syncButton();
    });

    if (mq && mq.addEventListener) {
      mq.addEventListener("change", function () {
        var stored = null;
        try { stored = localStorage.getItem("theme"); } catch (e) {}
        if (stored !== "light" && stored !== "dark") syncButton();
      });
    }
  }

  /* ---- Schriftgröße: Zusatzkomfort, Browser-Zoom bleibt voll erhalten ---- */
  var textSizeButtons = document.querySelectorAll("[data-text-size-option]");
  if (textSizeButtons.length) {
    var rootForText = document.documentElement;

    function textSizeAllowed(size) {
      return size === "normal" || size === "large" || size === "xlarge";
    }

    function applyTextSize(size, persist) {
      if (!textSizeAllowed(size)) size = "normal";
      if (size === "normal") {
        rootForText.removeAttribute("data-text-size");
      } else {
        rootForText.setAttribute("data-text-size", size);
      }
      Array.prototype.forEach.call(textSizeButtons, function (btn) {
        var selected = btn.getAttribute("data-text-size-option") === size;
        btn.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      if (persist) {
        try { localStorage.setItem("text-size", size); } catch (e) {}
      }
    }

    var storedTextSize = "normal";
    try {
      var storedValue = localStorage.getItem("text-size");
      if (textSizeAllowed(storedValue)) storedTextSize = storedValue;
    } catch (e) {}
    applyTextSize(storedTextSize, false);

    Array.prototype.forEach.call(textSizeButtons, function (btn) {
      btn.addEventListener("click", function () {
        applyTextSize(btn.getAttribute("data-text-size-option"), true);
      });
    });
  }

  /* ---- Mobile-Navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? text.closeMenu : text.openMenu);
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
    var initialPanel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    if (initialPanel) initialPanel.hidden = true;

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
    form.setAttribute("novalidate", "novalidate");

    function field(input) { return input.closest(".field"); }

    function invalid(input, bad) {
      var f = field(input);
      if (!f) return;
      f.dataset.invalid = bad ? "true" : "false";
      input.setAttribute("aria-invalid", bad ? "true" : "false");
    }

    Array.prototype.forEach.call(form.elements, function (input) {
      if (!input || !input.addEventListener || !input.validity) return;
      input.addEventListener("input", function () {
        var hasContent = input.type === "textarea" || input.type === "text" ? input.value.trim().length > 0 : true;
        if (input.validity.valid && hasContent) invalid(input, false);
      });
    });

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

      check(name, name.validity.valid && name.value.trim().length > 0);
      check(mail, mail.validity.valid);
      check(url, url.validity.valid);
      check(msg, msg.validity.valid && msg.value.trim().length > 0);

      if (firstBad) {
        status.textContent = text.invalidForm;
        firstBad.focus();
        return;
      }

      var betreff = text.subjectPrefix + name.value.trim();
      var koerper =
        "Name: " + name.value.trim() + "\n" +
        "E-Mail: " + mail.value.trim() + "\n" +
        "Website: " + (url.value.trim() || text.noWebsite) + "\n\n" +
        text.messageLabel + msg.value.trim() + "\n";

      var href = "mailto:mail@andersen-webworks.de" +
        "?subject=" + encodeURIComponent(betreff) +
        "&body=" + encodeURIComponent(koerper);

      status.textContent = text.mailStatus;
      window.location.href = href;
    });
  }
})();
