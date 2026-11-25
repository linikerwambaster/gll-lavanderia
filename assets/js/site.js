// GLL Lavanderia SP — interações do site
(function () {
  "use strict";
  var ZAP = "5511986071100";
  var MSG = {
    orcamento: "Olá! Vim pelo site da GLL e quero um orçamento pra lavar meu tênis.",
    garimpo: "Olá! Vim pelo site da GLL e quero ajuda pra garimpar um tênis."
  };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (/[?&]captura/.test(location.search)) document.documentElement.classList.add("captura");

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

  // Máquina: visor e etiqueta acompanham o vídeo (ANTES / DEPOIS + modelo)
  var LINHA = [[0, "A", "New Balance 9060"], [1.55, "D", "New Balance 9060"], [3.45, "A", "Gucci Re-Web"], [4.75, "D", "Gucci Re-Web"],
    [6.65, "A", "Nike Air Max 270"], [7.95, "D", "Nike Air Max 270"], [9.85, "A", "Nike Shox TL"], [11.15, "D", "Nike Shox TL"],
    [13.05, "A", "Adidas Forum Mid"], [14.35, "D", "Adidas Forum Mid"], [16.25, "A", "On Running"], [17.55, "D", "On Running"], [19.45, "A", "New Balance 9060"]];
  var video = document.getElementById("videoAbertura"), maq = document.getElementById("maquina");
  var visorModelo = document.getElementById("visorModelo"), visorStatus = document.querySelector("#visorStatus em");
  var etiqueta = document.getElementById("etiqueta"), porta = maq ? maq.querySelector(".porta") : null, ultimo = -1;
  function sincroniza() {
    if (video && !video.paused) {
      var t = video.currentTime, i = 0;
      for (var j = 0; j < LINHA.length; j++) if (t >= LINHA[j][0]) i = j;
      if (i !== ultimo) {
        ultimo = i;
        var limpo = LINHA[i][1] === "D";
        visorModelo.textContent = LINHA[i][2];
        visorStatus.textContent = limpo ? "LIMPO" : "ANTES";
        etiqueta.textContent = limpo ? "DEPOIS" : "ANTES";
        maq.classList.toggle("limpo", limpo);
        if (limpo && porta) { porta.classList.remove("flash"); void porta.offsetWidth; porta.classList.add("flash"); }
      }
    }
    requestAnimationFrame(sincroniza);
  }
  if (video) {
    var tenta = video.play && video.play();
    if (tenta && tenta.catch) tenta.catch(function () {});
    requestAnimationFrame(sincroniza);
  }

  // Comparador antes/depois
  var PARES = [
    { k: "nb9060", nome: "New Balance 9060", feito: ["Limpeza", "Higienização interna e externa", "Solados", "Palmilhas", "Cadarços", "Revitalização de camurça", "Neutralização de odores"] },
    { k: "gucci", nome: "Gucci Re-Web", feito: ["Limpeza premium", "Higienização interna e externa", "Solados", "Palmilhas", "Cadarços", "Hidratação do couro", "Revitalização da camurça"] },
    { k: "am270", nome: "Nike Air Max 270", feito: ["Pacote Eco Clean", "Higienização interna e externa", "Cadarços", "Palmilhas", "Solado", "Colagem"] },
    { k: "shox", nome: "Nike Shox TL", feito: ["Limpeza", "Higienização interna e externa", "Cadarços", "Solados", "Palmilhas"] },
    { k: "forum", nome: "Adidas Forum Mid", feito: ["Limpeza", "Higienização interna e externa", "Cadarços", "Palmilhas", "Solado", "Clareamento de entressola"] },
    { k: "aj1mid", nome: "Air Jordan 1 Mid", feito: ["Limpeza", "Higienização interna e externa", "Cadarços", "Palmilhas", "Solados", "Colagem"] },
    { k: "on", nome: "On Running", feito: ["Limpeza", "Higienização interna e externa", "Cadarços", "Palmilhas", "Solados", "Neutralização de odores"] },
    { k: "aj1low", nome: "Air Jordan 1 Low", feito: ["Limpeza", "Higienização interna e externa", "Solados", "Palmilhas", "Cadarços", "Revitalização de camurça"] },
    { k: "lacoste", nome: "Lacoste", feito: ["Limpeza", "Higienização interna e externa", "Solados", "Palmilhas", "Cadarços", "Revitalização da camurça"] },
    { k: "courtvision", nome: "Nike Court Vision Alta", feito: ["Limpeza", "Higienização interna e externa", "Cadarços", "Solados", "Palmilhas"] }
  ];
  var comp = document.getElementById("comparador");
  if (comp) {
    var range = document.getElementById("compRange"), antes = document.getElementById("compAntes"), depois = document.getElementById("compDepois");
    var titulo = document.getElementById("compModelo"), feito = document.getElementById("compFeito"), lista = document.getElementById("compLista");
    var poe = function (v) { comp.style.setProperty("--pos", v + "%"); range.value = v; };
    range.addEventListener("input", function () { poe(range.value); });
    var arrasta = function (e) {
      var r = comp.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      poe(Math.max(0, Math.min(100, (x / r.width) * 100)).toFixed(1));
    };
    // Arrastar: horizontal move a barra; vertical continua rolando a página (touch-action: pan-y)
    var segurando = false;
    comp.addEventListener("pointerdown", function (e) { segurando = true; arrasta(e); });
    comp.addEventListener("pointermove", function (e) { if (segurando) arrasta(e); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { comp.addEventListener(ev, function () { segurando = false; }); });

    var escolhe = function (i, botao) {
      var p = PARES[i];
      antes.src = "assets/img/pares/" + p.k + "_antes.jpg"; antes.alt = p.nome + " antes da lavagem";
      depois.src = "assets/img/pares/" + p.k + "_depois.jpg"; depois.alt = p.nome + " depois da lavagem";
      titulo.textContent = p.nome;
      feito.innerHTML = p.feito.map(function (f) { return "<li>" + f + "</li>"; }).join("");
      lista.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-selected", b === botao ? "true" : "false"); });
      if (!reduz) varre();
    };
    PARES.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", p.nome);
      b.innerHTML = '<img src="assets/img/pares/' + p.k + '_depois.jpg" alt="" loading="lazy" width="960" height="1200">';
      b.addEventListener("click", function () { escolhe(i, b); });
      lista.appendChild(b);
      if (i === 0) { b.setAttribute("aria-selected", "true"); feito.innerHTML = p.feito.map(function (f) { return "<li>" + f + "</li>"; }).join(""); }
    });
    // Varredura inicial: mostra o antes e "lava" até a metade
    var varrendo = false;
    function varre() {
      if (varrendo) return; varrendo = true;
      var ini = performance.now(), de = 100, ate = 50, dur = 1400;
      (function passo(t) {
        var p = Math.min(1, (t - ini) / dur), e = 1 - Math.pow(1 - p, 3);
        poe((de + (ate - de) * e).toFixed(1));
        if (p < 1) requestAnimationFrame(passo); else varrendo = false;
      })(ini);
    }
    if ("IntersectionObserver" in window && !reduz) {
      var viu = false;
      new IntersectionObserver(function (ents, ob) {
        ents.forEach(function (en) { if (en.isIntersecting && !viu) { viu = true; varre(); ob.disconnect(); } });
      }, { threshold: 0.45 }).observe(comp);
    }
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
