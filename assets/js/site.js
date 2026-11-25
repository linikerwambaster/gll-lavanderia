// GLL Lavanderia SP — interações do site
(function () {
  "use strict";
  var ZAP = "5511986071100";
  var MSG = {
    orcamento: "Olá! Vim pelo site da GLL e quero um orçamento pra lavar meu tênis.",
    garimpo: "Olá! Vim pelo site da GLL e quero ajuda pra garimpar um tênis."
  };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (/[?&]captura/.test(location.search)) {
    document.documentElement.classList.add("captura");
    document.querySelectorAll("img[loading=lazy]").forEach(function (i) { i.loading = "eager"; });
  }

  // Links do WhatsApp com mensagem pronta
  document.querySelectorAll("[data-zap]").forEach(function (a) {
    var m = MSG[a.getAttribute("data-zap")] || MSG.orcamento;
    a.href = "https://wa.me/" + ZAP + "?text=" + encodeURIComponent(m);
  });

  // Topo muda ao rolar
  var topo = document.getElementById("topo");
  var aoRolar = function () { topo.classList.toggle("rolou", window.scrollY > 40); };
  window.addEventListener("scroll", aoRolar, { passive: true }); aoRolar();

  // Bolhas (posições fixas por semente, iguais em toda visita)
  function semente(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  document.querySelectorAll("[data-bolhas]").forEach(function (caixa, k) {
    if (reduz) return;
    var r = semente(97 + k * 31), n = +caixa.getAttribute("data-bolhas");
    for (var i = 0; i < n; i++) {
      var b = document.createElement("span"), t = 6 + r() * 34;
      b.style.width = b.style.height = t + "px";
      b.style.left = (r() * 100).toFixed(2) + "%";
      b.style.setProperty("--dx", ((r() - 0.5) * 80).toFixed(0) + "px");
      b.style.animationDuration = (9 + r() * 12).toFixed(1) + "s";
      b.style.animationDelay = (-r() * 20).toFixed(1) + "s";
      caixa.appendChild(b);
    }
  });

  // Vídeo da abertura: versão deitada (computador) ou em pé (celular)
  var video = document.getElementById("videoAbertura");
  if (video) {
    var emPe = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    video.poster = video.getAttribute(emPe ? "data-cel-poster" : "data-pc-poster");
    video.src = video.getAttribute(emPe ? "data-cel" : "data-pc");
    if (reduz) { video.removeAttribute("autoplay"); video.pause(); }
    else { var tenta = video.play && video.play(); if (tenta && tenta.catch) tenta.catch(function () {}); }
  }

  // Vitrine: cartazes com o tênis sujo que vira limpo (mouse em cima / toque)
  var CARTAZES = [
    { k: "nb9060", marca: "New Balance", titulo: ["New", "Balance", "9060"], servico: "Revitalização de camurça", fundo: "#D9DDE7", tinta: "#1B2131", acento: "#5B6680" },
    { k: "gucci", marca: "Gucci", titulo: ["Gucci", "Re-Web"], servico: "Limpeza premium", fundo: "#EFE3CC", tinta: "#1D2A4D", acento: "#B32638" },
    { k: "forum", marca: "Adidas", titulo: ["Forum", "Mid"], servico: "Clareamento da entressola", fundo: "#2342FF", tinta: "#FFFFFF", acento: "#9CE8FF" },
    { k: "am270", marca: "Nike", titulo: ["Air Max", "270"], servico: "Eco Clean + colagem", fundo: "#FF4F9A", tinta: "#FFFFFF", acento: "#2A0A1A" },
    { k: "aj1low", marca: "Jordan", titulo: ["Jordan 1", "Low"], servico: "Revitalização de camurça", fundo: "#CCD9C4", tinta: "#1F2B1C", acento: "#5E7A55" },
    { k: "lacoste", marca: "Lacoste", titulo: ["Lacoste"], servico: "Revitalização da camurça", fundo: "#12553C", tinta: "#F3F1EA", acento: "#9FE3B9" },
    { k: "shox", marca: "Nike", titulo: ["Shox", "TL"], servico: "Higienização completa", fundo: "#0E1424", tinta: "#E8EEF8", acento: "#47D7FF" }
  ];
  var vitrine = document.getElementById("vitrine");
  if (vitrine) {
    var r2 = semente(7), bolhasHTML = function () {
      var h = "";
      for (var i = 0; i < 9; i++) {
        var t = 10 + r2() * 26;
        h += '<b style="width:' + t.toFixed(0) + "px;height:" + t.toFixed(0) + "px;left:" + (20 + r2() * 60).toFixed(0) + "%;top:" + (35 + r2() * 35).toFixed(0) + "%;animation-delay:" + (r2() * 0.35).toFixed(2) + 's"></b>';
      }
      return h;
    };
    vitrine.innerHTML = CARTAZES.map(function (c) {
      return '<article class="cartaz" tabindex="0" role="button" aria-pressed="false" aria-label="' + c.marca + " " + c.titulo.join(" ") + ': ver antes e depois" style="--fundo:' + c.fundo + ";--tinta:" + c.tinta + ";--acento:" + c.acento + '">' +
        '<div class="cartaz-topo"><span>' + c.marca + '</span><span class="gll">GLL</span></div>' +
        '<h3 class="cartaz-titulo">' + c.titulo.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</h3>" +
        '<img class="c-antes" src="assets/img/vitrine/' + c.k + '_antes.webp" alt="' + c.marca + " " + c.titulo.join(" ") + ' antes da lavagem" loading="lazy" width="1000" height="1000">' +
        '<img class="c-depois" src="assets/img/vitrine/' + c.k + '_depois.webp" alt="' + c.marca + " " + c.titulo.join(" ") + ' depois da lavagem na GLL" loading="lazy" width="1000" height="1000">' +
        '<div class="espuma-b" aria-hidden="true">' + bolhasHTML() + "</div>" +
        '<div class="cartaz-base"><span class="estado"><i></i><em class="e1">ANTES</em><em class="e2">DEPOIS</em></span><span class="servico">' + c.servico + "</span></div>" +
        "</article>";
    }).join("") +
      '<a class="cartaz cartaz-convite" data-zap="orcamento" href="#" target="_blank" rel="noopener" style="--fundo:#04122B;--tinta:#FFFFFF;--acento:#FFD23F">' +
      '<div class="cartaz-topo"><span>Seu par</span><span class="gll">GLL</span></div>' +
      '<h3 class="cartaz-titulo"><span>Seu tênis</span><span>é o próximo</span></h3>' +
      '<div class="convite-base"><span class="btn btn-zap"><svg class="ic" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-zap"/></svg>Manda a foto no WhatsApp</span></div></a>';
    vitrine.querySelectorAll(".cartaz-convite").forEach(function (a) { a.href = "https://wa.me/" + ZAP + "?text=" + encodeURIComponent(MSG.orcamento); });

    // toque (celular) e teclado alternam o limpo; no computador o mouse já faz isso pelo CSS
    vitrine.querySelectorAll("article.cartaz").forEach(function (c) {
      var troca = function () { var on = c.classList.toggle("limpo"); c.setAttribute("aria-pressed", on ? "true" : "false"); };
      c.addEventListener("click", function () { if (window.matchMedia("(hover: none)").matches) troca(); });
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); troca(); } });
    });
    // no celular, cada cartaz "lava sozinho" quando aparece na tela
    if ("IntersectionObserver" in window && window.matchMedia("(hover: none)").matches && !reduz) {
      var obs = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { setTimeout(function () { en.target.classList.add("limpo"); en.target.setAttribute("aria-pressed", "true"); }, 700); obs.unobserve(en.target); }
        });
      }, { threshold: 0.7 });
      vitrine.querySelectorAll("article.cartaz").forEach(function (c) { obs.observe(c); });
    }
    // prévia: ?captura&limpo mostra metade dos cartazes já lavados
    if (/[?&]limpo/.test(location.search)) vitrine.querySelectorAll("article.cartaz").forEach(function (c, i) { if (i % 2 === 1) c.classList.add("limpo"); });
  }

  // Mural do depois: duas faixas em sentidos opostos
  var mural = document.getElementById("mural-fotos");
  if (mural) {
    var N = 29, fotos = [];
    for (var i = 1; i <= N; i++) fotos.push("assets/img/galeria/g" + (i < 10 ? "0" + i : i) + ".jpg");
    var linhas = [fotos.filter(function (_, i) { return i % 2 === 0; }), fotos.filter(function (_, i) { return i % 2 === 1; })];
    linhas.forEach(function (l, k) {
      var div = document.createElement("div");
      div.className = "mural-linha" + (k ? " inversa" : "");
      var html = l.map(function (s) { return '<img src="' + s + '" alt="Tênis depois da lavagem na GLL" loading="lazy" width="640" height="800">'; }).join("");
      div.innerHTML = html + html.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');
      mural.appendChild(div);
    });
  }

  // Faixa de marcas: duplica para o loop contínuo
  var trilho = document.querySelector(".faixa-trilho");
  if (trilho) trilho.innerHTML += trilho.innerHTML;

  // Revela ao rolar
  var revs = document.querySelectorAll(".revela");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revs.forEach(function (el) { io.observe(el); });
  } else revs.forEach(function (el) { el.classList.add("in"); });

  var ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();
})();
