/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Il sito funziona e si legge anche senza questo file. Qui dentro c'è solo il movimento:

   1.  Preparazione e strumenti (movimento sì/no, scroll guidato sì/no)
   2.  "La cella si accende e svanisce" (il gesto ricorrente)
   3.  Titoli divisi in righe
   4.  Coreografia della hero (una volta sola, circa 1,6 secondi)
   5.  Ingressi allo scroll (mai solo dissolvenza)
   6.  La lente cobalto (segue il mouse; sul touch si muove da sola, solo nella hero)
   7.  Scroll: parallasse della hero, linea di "Come lavoro", luce delle schede
   8.  Navigazione: il punto che indica la sezione attiva
   9.  Telefoni del caso studio: stati, scorrimento a passi, luce che pulsa
   10. Pause (fuori schermo, scheda nascosta) e piccoli aiuti

   Regole (le stesse di CLAUDE.md): si animano solo transform e opacità, gli aggiornamenti
   per frame usano requestAnimationFrame, nessuno scroll-jacking.
   ========================================================================== */

(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.add('pronto'); /* main.js è partito: il paracadute nell'<head> non toglie più "js" */


  /* ----------------------------------------------------------------------
     1. PREPARAZIONE E STRUMENTI
     ---------------------------------------------------------------------- */

  /* L'utente ha chiesto meno movimento? Allora: ingressi istantanei, niente lente, niente celle, niente parallasse. */
  var movimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Il browser sa guidare le animazioni con lo scroll (animation-timeline)? Se sì lo fa il CSS; se no lo facciamo noi con requestAnimationFrame. */
  var SD = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  if (SD) html.classList.add('sd');

  var raf = window.requestAnimationFrame.bind(window);
  var CELLA = 28; /* lato di una cella del reticolo, in px (lo stesso del CSS) */

  function $(selettore, radice) { return (radice || document).querySelector(selettore); }
  function $$(selettore, radice) { return Array.prototype.slice.call((radice || document).querySelectorAll(selettore)); }
  function limita(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function modulo(n, m) { return ((n % m) + m) % m; }

  /* Di quanto si è spostato il reticolo di base per la parallasse (0,15x nella prima schermata).
     Serve a tenere allineate la lente e le celle ai punti. */
  function scostamentoReticolo() {
    if (!movimento || !SD) return 0; /* nella versione di riserva il reticolo resta fermo: spostarlo costerebbe troppo */
    return -0.15 * Math.min(window.scrollY, window.innerHeight);
  }


  /* ----------------------------------------------------------------------
     2. "LA CELLA SI ACCENDE E SVANISCE"
     Un quadrato del reticolo con bordo e fondo cobalto, 1300ms. Si usa come feedback ovunque.
     ---------------------------------------------------------------------- */

  var stratoCelle = document.createElement('div');
  stratoCelle.className = 'celle';
  stratoCelle.setAttribute('aria-hidden', 'true');
  document.body.appendChild(stratoCelle);

  function accendiCella(x, y, ritardo) {
    if (!movimento) return;
    if (stratoCelle.children.length > 14) return; /* un tetto, per non riempire la pagina se si tocca a raffica */
    var dy = scostamentoReticolo();
    var cx = Math.floor(x / CELLA) * CELLA;           /* la cella del reticolo che contiene il punto */
    var cy = Math.floor((y - dy) / CELLA) * CELLA + dy;
    var cella = document.createElement('div');
    cella.className = 'cella-accesa';
    cella.style.translate = cx + 'px ' + cy + 'px';
    if (ritardo) cella.style.setProperty('--ritardo', ritardo + 'ms');
    stratoCelle.appendChild(cella);
    var togli = function () { if (cella.parentNode) cella.parentNode.removeChild(cella); };
    cella.addEventListener('animationend', togli);
    setTimeout(togli, 2800 + (ritardo || 0)); /* sicurezza */
  }

  /* Pressione su pulsanti e link: una cella si accende sotto il dito o il mouse */
  var INTERATTIVI = '.pulsante, .link-testo, .link-testata, .voci a, .scelta, .marchio, summary';
  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest(INTERATTIVI)) accendiCella(e.clientX, e.clientY);
  }, { passive: true });
  /* Da tastiera (Invio o spazio) non c'è un puntatore: la cella si accende al centro dell'elemento */
  document.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var el = e.target.closest && e.target.closest(INTERATTIVI);
    if (!el) return;
    var r = el.getBoundingClientRect();
    accendiCella(r.left + r.width / 2, r.top + r.height / 2);
  });

  /* Sul touch, nella hero: un tocco (non uno scroll) accende solo la cella toccata */
  var tocco = null;
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    tocco = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, { passive: true });
  document.addEventListener('pointerup', function (e) {
    if (!tocco || e.pointerType === 'mouse') return;
    var breve = Date.now() - tocco.t < 600;
    var fermo = Math.abs(e.clientX - tocco.x) < 12 && Math.abs(e.clientY - tocco.y) < 12;
    if (breve && fermo && e.target.closest && e.target.closest('#inizio') && !e.target.closest(INTERATTIVI)) {
      accendiCella(e.clientX, e.clientY);
    }
    tocco = null;
  }, { passive: true });


  /* ----------------------------------------------------------------------
     3. TITOLI DIVISI IN RIGHE
     Ogni riga sta in un contenitore con overflow nascosto e la riga interna sale da 105% a 0.
     Le righe si calcolano guardando dove va a capo il testo: se la larghezza cambia si rifà.
     ---------------------------------------------------------------------- */

  var titoliDivisi = [];

  function dividiInRighe(titolo) {
    var originale = titolo.getAttribute('data-originale');
    if (originale === null) { originale = titolo.innerHTML; titolo.setAttribute('data-originale', originale); }
    titolo.innerHTML = originale;

    /* 1. Elenco delle parole, ricordando quali stanno dentro <em> (la parola chiave) */
    var parole = [];
    (function visita(nodo, enfasi) {
      Array.prototype.forEach.call(nodo.childNodes, function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/\s+/).forEach(function (w) { if (w) parole.push({ testo: w, enfasi: enfasi }); });
        } else if (n.nodeType === 1) {
          visita(n, enfasi || n.tagName === 'EM');
        }
      });
    })(titolo, false);

    /* 2. Una parola per volta in uno <span>, per misurare in quale riga finisce */
    titolo.textContent = '';
    parole.forEach(function (p, i) {
      var s = document.createElement('span');
      s.className = 'm' + (p.enfasi ? ' m-em' : '');
      s.textContent = p.testo;
      titolo.appendChild(s);
      if (i < parole.length - 1) titolo.appendChild(document.createTextNode(' '));
    });
    var righe = [];
    var ultimoTop = null;
    $$('.m', titolo).forEach(function (s, i) {
      var top = Math.round(s.getBoundingClientRect().top);
      if (ultimoTop === null || Math.abs(top - ultimoTop) > 6) { righe.push([]); ultimoTop = top; }
      righe[righe.length - 1].push(parole[i]);
    });

    /* 3. Ricostruzione: una riga = contenitore + riga interna; la parola chiave torna dentro <em>.
       Nella hero ogni parola della parola chiave sta in uno <span class="parola">: la "passata di luce" accende una parola dopo l'altra */
    titolo.textContent = '';
    var conta = 0;
    righe.forEach(function (r, i) {
      var riga = document.createElement('span');
      riga.className = 'riga';
      var interna = document.createElement('span');
      interna.className = 'riga-interna';
      interna.style.setProperty('--i', i);
      var contenitore = interna;
      var enfasiCorrente = false;
      var haEnfasi = false;
      r.forEach(function (p, k) {
        if (p.enfasi !== enfasiCorrente) {
          if (k > 0) interna.appendChild(document.createTextNode(' '));
          contenitore = p.enfasi ? document.createElement('em') : interna;
          if (p.enfasi) interna.appendChild(contenitore);
          enfasiCorrente = p.enfasi;
        } else if (k > 0) {
          contenitore.appendChild(document.createTextNode(' '));
        }
        if (p.enfasi && titolo.id === 'titolo-hero') {
          var parola = document.createElement('span');
          parola.className = 'parola';
          parola.setAttribute('data-k', conta++);
          parola.textContent = p.testo;
          contenitore.appendChild(parola);
        } else {
          contenitore.appendChild(document.createTextNode(p.testo));
        }
        if (p.enfasi) haEnfasi = true;
      });
      riga.appendChild(interna);
      titolo.appendChild(riga);
      if (i < righe.length - 1) titolo.appendChild(document.createTextNode(' '));
    });

    /* Passata di luce (solo nella hero): per ogni parola della parola chiave una copia bianca, posizionata sopra la parola.
       Sta nella riga, non dentro <em>: gli elementi posizionati dentro un testo con background-clip: text ne farebbero sparire le lettere. */
    if (titolo.id === 'titolo-hero') {
      $$('.riga', titolo).forEach(function (riga) {
        var interna = $('.riga-interna', riga);
        $$('.parola', riga).forEach(function (parola) {
          var copia = document.createElement('span');
          copia.className = 'luce-parola';
          copia.setAttribute('aria-hidden', 'true');
          /* offsetLeft/offsetTop misurano il layout vero: non risentono di scale o translate (a questo punto il titolo ha ancora la classe "rivela", che lo rimpicciolisce) */
          copia.style.left = parola.offsetLeft + 'px';
          copia.style.top = interna.offsetTop + 'px';
          copia.style.setProperty('--k', parola.getAttribute('data-k'));
          copia.textContent = parola.textContent;
          riga.appendChild(copia);
        });
      });
    }
    titolo.classList.remove('rivela');
    titolo.classList.add('titolo-righe');
  }

  function preparaTitoli() {
    if (!movimento) return;
    $$('main h2, #titolo-hero').forEach(function (t) {
      dividiInRighe(t);
      titoliDivisi.push(t);
    });
  }

  var larghezzaPrecedente = window.innerWidth;
  var timerRidimensiona = null;
  window.addEventListener('resize', function () {
    clearTimeout(timerRidimensiona);
    timerRidimensiona = setTimeout(function () {
      if (window.innerWidth !== larghezzaPrecedente) { /* la barra del browser su telefono cambia solo l'altezza: non conta */
        larghezzaPrecedente = window.innerWidth;
        titoliDivisi.forEach(dividiInRighe);
      }
      aggiornaStrisce();
      misuraPassi();
      posizionaPunto();
      adattaTelefoni();
    }, 220);
  });


  /* ----------------------------------------------------------------------
     4. COREOGRAFIA DELLA HERO (una volta sola, circa 1,6 secondi)
     1 anello di luce e reticolo  2 navigazione  3 titolo riga per riga
     4 passata di luce sulla parola chiave  5 pulsante  poi la lente
     Il tempo è nel CSS (classe "hero-pronta"): qui si prepara e si dà il via.
     ---------------------------------------------------------------------- */

  function avviaHero() {
    if (!movimento) return;
    var titolo = $('#titolo-hero');
    var partenza = function () {
      html.classList.add('lente-js');           /* da qui la lente la gestisce JavaScript */
      titolo.style.setProperty('--base', '200ms');
      html.classList.add('hero-pronta');         /* parte il reticolo, l'anello di luce, la navigazione */
      titolo.classList.add('visibile');          /* le righe salgono, sfalsate di 90ms */

      /* Gli altri elementi della hero entrano con i loro ritardi (il pulsante per ultimo) */
      var ritardi = { '.hero .eyebrow': 150, '.hero .azioni-hero': 1000, '.hero .nota-hero': 1100, '.hero .destinatari': 1200 };
      Object.keys(ritardi).forEach(function (sel) {
        var el = $(sel);
        if (!el) return;
        el.style.setProperty('--ritardo', ritardi[sel] + 'ms');
        el.classList.add('visibile');
      });
      setTimeout(attivaLenteHero, 1650);         /* 5. poi la lente si attiva */
    };
    var attesaFont = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var tetto = new Promise(function (ok) { setTimeout(ok, 1200); }); /* se i font tardano, si parte lo stesso */
    Promise.race([attesaFont, tetto]).then(partenza);
  }


  /* ----------------------------------------------------------------------
     5. INGRESSI ALLO SCROLL
     Paragrafi e schede salgono di 24px e ingrandiscono da 0,985 a 1 (mai solo dissolvenza),
     sfalsati di 60ms per indice. I titoli usano la tecnica a righe.
     ---------------------------------------------------------------------- */

  function fineIngresso(el) {
    var fine = function (e) {
      if (e.propertyName !== 'transform') return;
      el.classList.remove('pre'); /* will-change solo mentre serve */
      el.removeEventListener('transitionend', fine);
    };
    el.addEventListener('transitionend', fine);
  }

  function preparaIngressi() {
    var elementi = $$('.rivela').filter(function (el) { return !el.closest('#inizio'); }); /* la hero ha la sua coreografia */

    if (!movimento || !('IntersectionObserver' in window)) {
      elementi.forEach(function (el) { el.classList.add('visibile'); });
      $$('.titolo-righe').forEach(function (el) { el.classList.add('visibile'); });
      return;
    }

    /* will-change: si attiva poco prima che l'elemento entri nello schermo */
    var prima = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (v.isIntersecting) { v.target.classList.add('pre'); prima.unobserve(v.target); }
      });
    }, { rootMargin: '0px 0px 60% 0px' });

    var osservatore = new IntersectionObserver(function (voci) {
      var entrati = voci.filter(function (v) { return v.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      entrati.forEach(function (v, i) {
        var el = v.target;
        el.style.setProperty('--ritardo', Math.min(i, 5) * 60 + 'ms'); /* 60ms per indice, fino a 5 */
        el.classList.add('visibile');
        fineIngresso(el);
        osservatore.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    elementi.forEach(function (el) { prima.observe(el); osservatore.observe(el); });

    /* Titoli di sezione: salgono a righe, e all'ingresso si accendono 2-3 celle del reticolo accanto (una volta sola) */
    var osservaTitoli = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        var t = v.target;
        t.classList.add('visibile');
        osservaTitoli.unobserve(t);
        var r = t.getBoundingClientRect();
        if (r.top > 80) {
          for (var j = 0; j < 3; j++) accendiCella(r.left + j * CELLA + 2, r.top - 14, 250 + j * 150);
        }
      });
    }, { threshold: 0.35 });
    titoliDivisi.forEach(function (t) { if (t.id !== 'titolo-hero') osservaTitoli.observe(t); });
  }


  /* ----------------------------------------------------------------------
     6. LA LENTE COBALTO
     Un riquadro di 340px con il reticolo cobalto dentro, mosso solo con transform.
     Il reticolo interno si sposta in senso opposto, così coincide sempre con quello di base.
     Mouse: segue il puntatore in hero e nel caso studio (con una piccola inerzia).
     Touch: solo nella hero, si muove da sola finché la sezione è visibile; il tocco accende una cella.
     ---------------------------------------------------------------------- */

  var lenti = [];
  var soloTocco = window.matchMedia('(hover: none)').matches;

  function creaLente(sezione) {
    var el = document.createElement('div');
    el.className = 'lente';
    el.setAttribute('aria-hidden', 'true');
    var ret = document.createElement('div');
    ret.className = 'lente-reticolo';
    el.appendChild(ret);
    sezione.insertBefore(el, sezione.firstChild); /* dentro la sezione: sta sopra al velo e sotto al testo */
    /* abilitata = può essere vista; acceso = in questo momento è visibile (serve anche che il centro stia nella sua sezione) */
    var r = sezione.getBoundingClientRect();
    var l = { sez: sezione, el: el, ret: ret, x: 0, y: 0, bx: 0, by: 0, top: r.top, bottom: r.bottom, abilitata: false, acceso: false, segui: false };
    lenti.push(l);
    return l;
  }

  function posizionaLente(l, cx, cy) {
    var tx = cx - 170;
    var ty = cy - 170;
    var dy = scostamentoReticolo();
    l.el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    l.ret.style.transform = 'translate3d(' + (-modulo(tx, CELLA)) + 'px,' + (-modulo(ty - dy, CELLA)) + 'px,0)';
    l.x = cx;
    l.y = cy;
  }

  /* La lente è visibile solo se è abilitata e il suo centro cade dentro la propria sezione */
  function aggiornaVisibilita(l) {
    var si = l.abilitata && l.y >= l.top && l.y <= l.bottom; /* top e bottom si aggiornano a ogni scroll e al ridimensionamento */
    if (l.acceso === si) return;
    l.acceso = si;
    l.el.classList.toggle('attiva', si);
    l.el.style.willChange = si ? 'transform, opacity' : '';
  }

  var lenteHero = null;
  var lenteCaso = null;
  var cicloLente = false;
  var heroVisibile = true;

  function cicloMouse() {
    var ancora = false;
    lenti.forEach(function (l) {
      if (!l.segui) return;
      var dx = l.bx - l.x;
      var dy = l.by - l.y;
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) { posizionaLente(l, l.bx, l.by); return; }
      posizionaLente(l, l.x + dx * 0.2, l.y + dy * 0.2); /* inerzia */
      ancora = true;
    });
    lenti.forEach(aggiornaVisibilita);
    if (ancora) raf(cicloMouse); else cicloLente = false;
  }
  function avviaCicloMouse() {
    if (cicloLente) return;
    cicloLente = true;
    raf(cicloMouse);
  }

  /* Touch, solo nella hero: la lente percorre una traiettoria lenta finché la hero è visibile e la scheda è aperta */
  var autoInCorso = false;
  function cicloAuto(t) {
    if (!lenteHero || !lenteHero.abilitata || !heroVisibile || document.hidden) { autoInCorso = false; return; }
    var w = window.innerWidth;
    var h = window.innerHeight;
    var a = t / 5200;
    posizionaLente(lenteHero, w * (0.5 + 0.34 * Math.sin(a)), h * (0.3 + 0.16 * Math.sin(a * 1.37 + 1)));
    aggiornaVisibilita(lenteHero);
    raf(cicloAuto);
  }
  function avviaAuto() {
    if (autoInCorso || !soloTocco || !lenteHero || !lenteHero.abilitata || !heroVisibile || document.hidden) return;
    autoInCorso = true;
    raf(cicloAuto);
  }

  function attivaLenteHero() {
    if (!lenteHero) return;
    posizionaLente(lenteHero, window.innerWidth * 0.78, window.innerHeight * 0.2); /* posizione di partenza: in alto a destra */
    lenteHero.abilitata = true;
    aggiornaVisibilita(lenteHero);
    avviaAuto();
  }

  function preparaLenti() {
    if (!movimento) return;
    lenteHero = creaLente($('#inizio'));
    if (soloTocco) return; /* sul touch: nessuna lente nel caso studio */
    lenteCaso = creaLente($('#caso-studio'));

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var sez = e.target.closest ? e.target.closest('#inizio, #caso-studio') : null;
      lenti.forEach(function (l) {
        var qui = !!sez && l.sez === sez;
        if (qui) {
          if (!l.segui) {
            l.segui = true;
            if (!l.acceso) posizionaLente(l, e.clientX, e.clientY); /* se era spenta compare già sotto il mouse */
          }
          l.bx = e.clientX;
          l.by = e.clientY;
          if (l === lenteCaso) l.abilitata = true;
        } else if (l === lenteCaso) {
          l.segui = false;
          l.abilitata = false; /* nel caso studio la lente c'è solo mentre il mouse è lì */
        }
      });
      lenti.forEach(aggiornaVisibilita);
      avviaCicloMouse();
    }, { passive: true });

    html.addEventListener('mouseleave', function () { /* il mouse esce dalla finestra */
      if (lenteCaso) { lenteCaso.segui = false; lenteCaso.abilitata = false; aggiornaVisibilita(lenteCaso); }
    });
  }


  /* ----------------------------------------------------------------------
     7. SCROLL
     Se il browser sa guidare le animazioni con lo scroll (animation-timeline), lo fa il CSS.
     Altrimenti qui, una volta per frame (requestAnimationFrame): lo spostamento degli elementi della hero,
     --riempi (la linea di "Come lavoro") e --luce (il bordo delle schede al centro).
     ---------------------------------------------------------------------- */

  var passi = $('.passi');
  var schede = $$('.riga-cliente');
  var inAttesa = false;
  var ultimoHp = -1;

  /* Elementi della hero che escono a velocità diverse (la versione di riserva li sposta direttamente con "translate").
     Sono in ordine dall'alto in basso e la distanza cresce: 0,88x 0,85x 0,80x 0,75x 0,70x */
  var stratiHero = [
    ['.hero .eyebrow', 12], ['#titolo-hero', 15], ['.hero .azioni-hero', 20], ['.hero .nota-hero', 25], ['.hero .destinatari', 30]
  ].map(function (c) { return { el: $(c[0]), svh: c[1] }; }).filter(function (c) { return c.el; });

  /* L'altezza della lista dei passi serve al CSS guidato dallo scroll (la linea si riempie per un tratto lungo quanto la lista) */
  function misuraPassi() {
    if (passi) passi.style.setProperty('--h-lista', passi.offsetHeight + 'px');
  }

  function aggiornaScroll() {
    inAttesa = false;
    var h = window.innerHeight;

    /* Prima tutte le letture (rettangoli), poi tutte le scritture: così il browser non ricalcola il layout a ogni elemento */
    var rp = (movimento && !SD && passi) ? passi.getBoundingClientRect() : null;
    var rs = (movimento && !SD) ? schede.map(function (s) { return s.getBoundingClientRect(); }) : null;
    lenti.forEach(function (l) {
      var r = l.sez.getBoundingClientRect();
      l.top = r.top;
      l.bottom = r.bottom;
    });

    if (movimento && !SD) {
      var hp = limita(window.scrollY / h, 0, 1);
      if (hp !== ultimoHp) {
        ultimoHp = hp;
        stratiHero.forEach(function (c) { c.el.style.translate = '0 ' + (hp * c.svh * h / 100).toFixed(1) + 'px'; });
      }
      if (rp) passi.style.setProperty('--riempi', limita((h * 0.6 - rp.top) / rp.height, 0, 1).toFixed(4));
      schede.forEach(function (s, i) {
        var r = rs[i];
        var p = (h - r.top) / (h + r.height);              /* 0,5 = al centro dello schermo */
        s.style.setProperty('--luce', limita(1 - Math.abs(p - 0.5) / 0.12, 0, 1).toFixed(3));
      });
    }

    /* La lente resta agganciata al reticolo anche quando la parallasse lo sposta, e si spegne fuori dalla sua sezione */
    lenti.forEach(function (l) {
      if (!l.abilitata) return;
      posizionaLente(l, l.x, l.y);
      aggiornaVisibilita(l);
    });
  }

  function suScroll() {
    if (inAttesa) return;
    inAttesa = true;
    raf(aggiornaScroll);
  }
  window.addEventListener('scroll', suScroll, { passive: true });

  /* I passi di "Come lavoro" si accendono quando la linea (a 60% dello schermo) li raggiunge.
     Con le animazioni guidate dallo scroll lo fa il CSS in modo graduale; qui resta lo stato (acceso/spento)
     usato come riserva e dagli screen reader del movimento ridotto. */
  function preparaPassi() {
    var elementi = $$('.passo');
    if (!elementi.length || !('IntersectionObserver' in window)) { elementi.forEach(function (p) { p.classList.add('acceso'); }); return; }
    var oss = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        var radice = v.rootBounds ? v.rootBounds.top : 0;
        var acceso = v.isIntersecting || v.boundingClientRect.top < radice;
        var era = v.target.classList.contains('acceso');
        v.target.classList.toggle('acceso', acceso);
        if (acceso && !era && movimento && !SD && v.time > 800) {
          var numero = $('.passo-numero', v.target);
          if (numero) {
            numero.classList.remove('accendi');
            void numero.offsetWidth;
            numero.classList.add('accendi');           /* la cella-numero si accende */
            numero.addEventListener('animationend', function f() { numero.classList.remove('accendi'); numero.removeEventListener('animationend', f); });
          }
        }
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    elementi.forEach(function (p) { oss.observe(p); });
  }


  /* ----------------------------------------------------------------------
     8. NAVIGAZIONE: il punto cobalto che scorre fra le voci
     ---------------------------------------------------------------------- */

  var ordine = ['inizio', 'problemi', 'clienti', 'metodo', 'caso-studio', 'chi-sono', 'contatti'];
  var sezioneAttiva = null;
  var punto = $('.punto-nav');
  var voci = $('.voci');
  var traccia = $('.traccia');

  function posizionaPunto() {
    if (!punto || !sezioneAttiva) return;
    var vociVisibili = voci && window.getComputedStyle(voci).display !== 'none';
    var x;
    var y;
    if (vociVisibili) {
      var link = $('.voci a[href="#' + sezioneAttiva + '"]');
      if (!link && sezioneAttiva === 'inizio') link = $('.marchio');
      if (!link && sezioneAttiva === 'contatti') link = $('.link-testata');
      if (!link) { punto.classList.remove('attivo'); return; }
      x = link.offsetLeft + link.offsetWidth / 2;
      y = link.offsetTop + link.offsetHeight - 5;
    } else {
      var tacca = $$('i', traccia)[ordine.indexOf(sezioneAttiva)];
      if (!tacca) return;
      x = traccia.offsetLeft + tacca.offsetLeft + tacca.offsetWidth / 2;
      y = traccia.offsetTop + tacca.offsetTop + tacca.offsetHeight / 2;
    }
    punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    punto.classList.add('attivo');
  }

  function preparaNavigazione() {
    if (!punto || !('IntersectionObserver' in window)) return;
    var oss = new IntersectionObserver(function (voceOss) {
      voceOss.forEach(function (v) {
        if (!v.isIntersecting) return;
        sezioneAttiva = v.target.id;
        $$('.voci a').forEach(function (a) {
          if (a.getAttribute('href') === '#' + sezioneAttiva) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
        posizionaPunto();
      });
    }, { rootMargin: '-45% 0px -50% 0px' }); /* la sezione che attraversa la metà dello schermo */
    ordine.forEach(function (id) { var s = document.getElementById(id); if (s) oss.observe(s); });
  }


  /* ----------------------------------------------------------------------
     9. TELEFONI DEL CASO STUDIO
     - Cambio di stato (pulsanti, oppure scorrimento a passi sugli schermi larghi)
     - La luce dietro al telefono pulsa una volta a ogni cambio
     - Sugli schermi larghi e alti il telefono resta fisso (sticky) e i pannelli scorrono accanto
     ---------------------------------------------------------------------- */

  var mqLargo = window.matchMedia('(min-width: 960px) and (min-height: 600px)');

  function impostaStato(contenitore, valore) {
    if (contenitore.getAttribute('data-attivo') === valore) return;
    contenitore.setAttribute('data-attivo', valore);
    $$('[data-vai]', contenitore).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-vai') === valore));
    });
    var area = $('.telefono-area', contenitore);
    if (area && movimento) { /* la luce dietro al telefono pulsa una volta */
      area.classList.remove('pulsa');
      void area.offsetWidth;
      area.classList.add('pulsa');
      area.addEventListener('animationend', function f(e) {
        if (e.animationName !== 'pulsa-luce') return;
        area.classList.remove('pulsa');
        area.removeEventListener('animationend', f);
      });
    }
  }

  /* Il telefono ha un'altezza fissa (~900px): sugli schermi bassi lo rimpicciolisco un po' per farlo stare fermo nella finestra */
  function adattaTelefoni() {
    $$('.confronto .telefono-area, .vetrina .telefono-area').forEach(function (area) {
      if (!mqLargo.matches) { area.style.removeProperty('--k'); return; }
      var k = limita((window.innerHeight - 8.5 * 16) / area.offsetHeight, 0.7, 1);
      area.style.setProperty('--k', k.toFixed(3));
    });
  }

  function preparaTelefoni() {
    $$('[data-attivo]').forEach(function (contenitore) {
      /* Pulsanti: su schermi stretti cambiano subito lo stato; su schermi larghi portano al pannello (scroll normale, non forzato) */
      $$('[data-vai]', contenitore).forEach(function (b) {
        b.addEventListener('click', function () {
          var valore = b.getAttribute('data-vai');
          if (mqLargo.matches) {
            var pannello = $('.logica-pila > [data-post="' + valore + '"], .confronto-note > [data-stato="' + valore + '"]', contenitore);
            if (pannello) { pannello.scrollIntoView({ block: 'center', behavior: movimento ? 'smooth' : 'auto' }); return; }
          }
          impostaStato(contenitore, valore);
        });
      });

      /* Schermi larghi: il pannello che attraversa il centro dello schermo decide lo stato del telefono */
      if (!('IntersectionObserver' in window)) return;
      var pannelli = $$('.logica-pila > [data-post], .confronto-note > [data-stato]', contenitore);
      var oss = new IntersectionObserver(function (voceOss) {
        if (!mqLargo.matches) return;
        voceOss.forEach(function (v) {
          if (!v.isIntersecting) return;
          impostaStato(contenitore, v.target.getAttribute('data-post') || v.target.getAttribute('data-stato'));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      pannelli.forEach(function (p) { oss.observe(p); });
    });
    adattaTelefoni();
    if (mqLargo.addEventListener) mqLargo.addEventListener('change', adattaTelefoni);
  }


  /* ----------------------------------------------------------------------
     10. PAUSE E PICCOLI AIUTI
     Le animazioni continue (luce ambiente, lente automatica) si fermano fuori schermo e a scheda nascosta.
     ---------------------------------------------------------------------- */

  function preparaPause() {
    document.addEventListener('visibilitychange', function () {
      html.classList.toggle('scheda-nascosta', document.hidden);
      if (!document.hidden) avviaAuto();
    });
    if (!('IntersectionObserver' in window)) return;
    var oss = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        v.target.classList.toggle('fuori', !v.isIntersecting);
        if (v.target.id === 'inizio') { heroVisibile = v.isIntersecting; if (heroVisibile) avviaAuto(); }
      });
    }, { threshold: 0 });
    ['#inizio', '#caso-studio'].forEach(function (sel) { var s = $(sel); if (s) oss.observe(s); });
  }

  /* Strisce del calendario: sul telefono scorrono di lato e si raggiungono da tastiera (tabindex);
     sul desktop non scorrono e il tabindex si toglie. */
  var strisce = $$('.striscia-scorri');
  function aggiornaStrisce() {
    strisce.forEach(function (striscia) {
      if (striscia.scrollWidth > striscia.clientWidth + 1) striscia.setAttribute('tabindex', '0');
      else striscia.removeAttribute('tabindex');
    });
  }


  /* ----------------------------------------------------------------------
     AVVIO
     ---------------------------------------------------------------------- */

  function avvio() {
    var pronti = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var tetto = new Promise(function (ok) { setTimeout(ok, 1200); });
    Promise.race([pronti, tetto]).then(function () {
      preparaTitoli();     /* divide i titoli in righe con i font veri */
      preparaIngressi();
      preparaLenti();
      avviaHero();
      adattaTelefoni();
    });
    preparaPassi();
    preparaNavigazione();
    preparaPause();
    preparaTelefoni();
    aggiornaStrisce();
    misuraPassi();
    aggiornaScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { aggiornaStrisce(); misuraPassi(); posizionaPunto(); adattaTelefoni(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvio);
  else avvio();
})();
