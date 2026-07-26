// Nico Privé – Reiseführer Barcelona & Sitges 2026
// Gemeinsames Script für alle Seiten: mobile Navigation, Countdown, Service Worker.

(function () {
  "use strict";

  // --- Mobile Navigation Toggle ---
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("nav.main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    // Mark active nav link based on current page
    var links = document.querySelectorAll("nav.main-nav a");
    var currentPath = window.location.pathname.split("/").pop() || "index.html";
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href.endsWith(currentPath)) {
        link.classList.add("active");
      }
    });

    initCountdown();
  });

  // --- Countdown zum Reisestart ---
  function initCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;

    var tripStart = new Date("2026-08-29T00:00:00");
    var tripEnd = new Date("2026-09-08T23:59:59");

    function render() {
      var now = new Date();
      var target = tripStart;
      var label = "Bis Abflug";

      if (now >= tripStart && now <= tripEnd) {
        target = tripEnd;
        label = "Noch unterwegs bis";
        el.querySelector(".countdown-label")?.remove();
      }

      var diffMs = target - now;
      if (diffMs <= 0 && now > tripEnd) {
        el.innerHTML = "<p style='font-family:\"Avenir Next\",sans-serif;color:var(--ink-soft)'>Die Reise ist vorbei – aber die Erinnerungen bleiben. 🌅</p>";
        return;
      }

      var totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);

      el.innerHTML =
        '<div class="box"><div class="num">' + days + '</div><div class="label">Tage</div></div>' +
        '<div class="box"><div class="num">' + hours + '</div><div class="label">Stunden</div></div>' +
        '<div class="box"><div class="num">' + minutes + '</div><div class="label">Minuten</div></div>';
    }

    render();
    setInterval(render, 60000);
  }

  // --- Service Worker (Offline-Fähigkeit) ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      // Nur registrieren, wenn über http(s) aufgerufen (nicht bei file://)
      if (window.location.protocol.startsWith("http")) {
        var base = document.body.getAttribute("data-base") || "./";
        navigator.serviceWorker.register(base + "service-worker.js", { scope: base }).catch(function (err) {
          console.log("Service Worker Registrierung fehlgeschlagen:", err);
        });
      }
    });
  }
})();
