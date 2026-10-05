/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Il sito funziona anche senza JavaScript: qui c'è solo il movimento.
   Le regole del movimento sono in CLAUDE.md ("Sistema di movimento"):
   - si animano solo transform e opacità (le linee a mano usano stroke-dashoffset);
   - tutto parte da scroll, puntatore o tocco; niente scroll-jacking;
   - con "riduci movimento" attivo il sito è già nello stato finale e qui non si anima nulla.

   Indice:
   1. Preparazione
   2. Hero e comparse allo scroll
   3. Righe di "Per chi lavoro" al tocco, popup dei dettagli, bagliori sui tasti
   4. Luce della hero e cursore ad anello (solo mouse)
   5. Prima e dopo del caso studio (interruttore del profilo)
   6. Menu in alto e scroll: barra "storie" e voce attiva
   ========================================================================== */

(function () {
  'use strict';

  var radice = document.documentElement;

  // Dico al paracadute nell'<head> che questo file è partito: non deve togliere la classe "js"
  radice.classList.add('pronto');

  try {
    avvia();
  } catch (errore) {
    // Se qualcosa va storto tolgo "js": così nessun contenuto resta nascosto in attesa di un'animazione
    radice.classList.remove('js');
    if (window.console) console.error(errore);
  }

  function avvia() {

    /* ======================================================================
       1. PREPARAZIONE
       ====================================================================== */

    // Chi ha chiesto di ridurre il movimento: niente animazioni (il CSS è già nello stato finale)
    var RIDOTTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Mouse vero (con hover e puntatore preciso): solo qui hanno senso luce e cursore che inseguono il puntatore
    var MOUSE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Scorciatoie
    function tutti(selettore, dentro) {
      return Array.prototype.slice.call((dentro || document).querySelectorAll(selettore));
    }
    function crea(tag, classe) {
      var e = document.createElement(tag);
      if (classe) e.className = classe;
      return e;
    }
    // Testo da leggere per chi usa lo screen reader (nascosto alla vista)
    function testoNascosto(testo) {
      var e = crea('span', 'sr');
      e.textContent = testo;
      return e;
    }

    // Tutti i riquadri e le sezioni con fondo blu: lì luce e cursore sono beige (altrove sono blu)
    var BLU = '.sez-scura, dialog, .pannello, .banner, .card-blu, .commuta, .scheda-b, .cliente';

    var hero = document.querySelector('.hero');
    var luceInterna = document.querySelector('.luce-in');

    /* ======================================================================
       2. HERO E COMPARSE ALLO SCROLL
       ====================================================================== */

    // --- Titolo: ogni parola in una "maschera" da cui sale ---
    function dividiTitolo(titolo) {
      var numero = 0;
      // Lo screen reader legge il titolo intero; le parole divise sono nascoste
      titolo.setAttribute('aria-label', titolo.textContent.replace(/\s+/g, ' ').trim());
      (function visita(nodo) {
        Array.prototype.slice.call(nodo.childNodes).forEach(function (figlio) {
          if (figlio.nodeType === 3) {
            var testo = figlio.textContent;
            // La punteggiatura attaccata alla parola precedente (es. "problema" + ", non") resta unita a lei, senza andare a capo da sola
            var precedente = figlio.previousSibling;
            var attaccato = /^[^\s]+/.exec(testo);
            if (attaccato && precedente && precedente.nodeType === 1) {
              var parole = precedente.querySelectorAll('.wi');
              if (parole.length) {
                parole[parole.length - 1].textContent += attaccato[0];
                testo = testo.slice(attaccato[0].length);
              }
            }
            var pezzi = document.createDocumentFragment();
            testo.split(/(\s+)/).forEach(function (parte) {
              if (!parte) return;
              if (/^\s+$/.test(parte)) { pezzi.appendChild(document.createTextNode(' ')); return; }
              var maschera = crea('span', 'w');
              maschera.setAttribute('aria-hidden', 'true');
              var parola = crea('span', 'wi');
              maschera.style.setProperty('--i', numero);
              parola.style.setProperty('--i', numero++);
              parola.textContent = parte;
              maschera.appendChild(parola);
              pezzi.appendChild(maschera);
            });
            nodo.replaceChild(pezzi, figlio);
          } else if (figlio.nodeType === 1) {
            visita(figlio);
          }
        });
      })(titolo);
      titolo.classList.add('diviso');
    }

    // --- Evidenziatore: ogni parola ha il suo tratto di colore che si stende da sinistra (il testo non cambia) ---
    function dividiEvidenziatore(evidenziato) {
      var parole = evidenziato.textContent.replace(/\s+/g, ' ').trim().split(' ');
      evidenziato.textContent = '';
      parole.forEach(function (parola, i) {
        if (i) evidenziato.appendChild(document.createTextNode(' '));
        var contenitore = crea('span', 'hw');
        contenitore.style.setProperty('--w', i);
        contenitore.textContent = parola;
        evidenziato.appendChild(contenitore);
      });
    }

    // --- Etichetta della hero: si scrive lettera per lettera, con un cursore che lampeggia poche volte ---
    function preparaEtichetta(etichetta) {
      var testo = etichetta.textContent.replace(/\s+/g, ' ').trim();
      etichetta.textContent = '';
      etichetta.appendChild(testoNascosto(testo));
      var animato = crea('span');
      animato.setAttribute('aria-hidden', 'true');
      var lettere = [];
      testo.split(' ').forEach(function (parola, i) {
        if (i) animato.appendChild(document.createTextNode(' '));
        var gruppo = crea('span', 'pw');
        parola.split('').forEach(function (carattere) {
          var c = crea('span', 'c');
          c.textContent = carattere;
          gruppo.appendChild(c);
          lettere.push(c);
        });
        animato.appendChild(gruppo);
      });
      etichetta.appendChild(animato);
      etichetta._lettere = lettere;
    }

    var inScrittura = [];
    function scrivi(etichetta) {
      if (!etichetta._lettere) return;
      var cursore = crea('i', 'caret');
      inScrittura.push({ lettere: etichetta._lettere, partenza: performance.now(), fatte: 0, cursore: cursore });
      if (inScrittura.length === 1) requestAnimationFrame(passoScrittura);
    }
    // Un solo ciclo per tutte le etichette che si stanno scrivendo: una lettera ogni 26 ms
    function passoScrittura(ora) {
      inScrittura = inScrittura.filter(function (q) {
        var totale = q.lettere.length;
        var quante = Math.min(totale, Math.max(1, Math.floor((ora - q.partenza) / 26) + 1));
        if (quante !== q.fatte) {
          for (; q.fatte < quante; q.fatte++) q.lettere[q.fatte].classList.add('v');
          q.lettere[quante - 1].after(q.cursore);        // il cursore sta dopo l'ultima lettera scritta
        }
        if (quante >= totale) {
          setTimeout(function () { q.cursore.remove(); }, 1100);
          return false;
        }
        return true;
      });
      if (inScrittura.length) requestAnimationFrame(passoScrittura);
    }

    // --- Numeri: salgono da 0 con andamento esponenziale, una volta sola ---
    // Il numero vero resta nel testo (lo legge lo screen reader); quello che sale è una copia sovrapposta
    function preparaNumero(numero) {
      var finale = numero.textContent.trim();
      numero.setAttribute('data-a', finale);
      numero.textContent = '';
      var vero = crea('span', 'num-fin');
      vero.textContent = finale;
      var animato = crea('span', 'num-an');
      animato.setAttribute('aria-hidden', 'true');
      animato.textContent = '0';
      numero.appendChild(vero);
      numero.appendChild(animato);
    }
    function conta(numero) {
      var animato = numero.querySelector('.num-an');
      var finale = parseInt(numero.getAttribute('data-a'), 10);
      var partenza = performance.now();
      var durata = 1100;
      (function passo(ora) {
        var p = Math.min(1, (ora - partenza) / durata);
        animato.textContent = p >= 1 ? finale : Math.round(finale * (1 - Math.pow(2, -10 * p)));
        if (p < 1) requestAnimationFrame(passo);
      })(partenza);
    }

    // --- Prepara tutto e osserva: quando un elemento entra nello schermo prende la classe "in" ---
    if (!RIDOTTO) {
      var titolo = document.querySelector('.hero h1');
      if (titolo) dividiTitolo(titolo);
      // Anche i titoli di sezione salgono parola per parola quando entrano nello schermo
      tutti('main h2').forEach(function (t) {
        if (t.closest('dialog')) return;
        t.classList.remove('rv');
        t.classList.add('tit');
        dividiTitolo(t);
      });
      // Scalino: gli elementi fratelli che compaiono insieme entrano uno dopo l'altro (max 4 passi)
      var gruppi = new Map();
      tutti('.rv').forEach(function (el) {
        var lista = gruppi.get(el.parentNode) || [];
        lista.push(el);
        gruppi.set(el.parentNode, lista);
      });
      gruppi.forEach(function (lista) {
        var n = lista.length;
        lista.forEach(function (el, i) {
          if (n > 1 && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i, 3) * 110 + 'ms');   // chi ha già un ritardo suo lo tiene
          if (/\ba-/.test(el.className)) return;
          var v = '';
          if (el.classList.contains('lead')) v = 'a-dolce';
          else if (el.classList.contains('card-blu') || el.classList.contains('banner') || el.classList.contains('pannello')) v = 'a-zoom';
          else if (/\b(scheda-b|cliente|passo)\b/.test(el.className)) {
            // schede in fila: la prima arriva da sinistra, l'ultima da destra, quelle in mezzo salgono ingrandendosi
            if (n === 2) v = i ? 'a-dx' : 'a-sx';
            else if (n === 3) v = ['a-sx', 'a-zoom', 'a-dx'][i];
            else if (n > 3) v = i % 2 ? 'a-zoom' : '';
          } else if (el.classList.contains('label')) v = 'a-alto';
          if (v) el.classList.add(v);
        });
      });
      tutti('.hl').forEach(dividiEvidenziatore);
      // Solo l'etichetta della hero si scrive lettera per lettera; le altre compaiono con il normale reveal (classe "rv")
      tutti('.hero .label').forEach(preparaEtichetta);
      tutti('.num').forEach(preparaNumero);

      var bersagli = tutti('.rv, .tit, .label, .num, .hl');
      var comparsa = function (elemento) {
        elemento.classList.add('in');
        if (elemento.classList.contains('label')) scrivi(elemento);
        if (elemento.classList.contains('num')) conta(elemento);
      };

      if ('IntersectionObserver' in window) {
        var osservatore = new IntersectionObserver(function (voci) {
          voci.forEach(function (voce) {
            if (!voce.isIntersecting) return;
            osservatore.unobserve(voce.target);
            comparsa(voce.target);
          });
        }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
        bersagli.forEach(function (b) { osservatore.observe(b); });
      } else {
        // Browser molto vecchio: tutto subito al suo posto
        bersagli.forEach(function (b) { b.classList.add('in'); });
        tutti('.num-an').forEach(function (a) { a.textContent = a.parentNode.getAttribute('data-a'); });
      }

      // Ingresso della hero: forzo un ricalcolo così lo stato nascosto è già stato disegnato, poi lascio partire
      if (titolo) void titolo.offsetWidth;
      radice.classList.add('go');
    }

    /* ======================================================================
       3. RIGHE DI "PER CHI LAVORO" AL TOCCO
       Con il mouse basta il passaggio (CSS). Sul telefono la riga si attiva quando è al centro dello schermo.
       ====================================================================== */

    if (!MOUSE && 'IntersectionObserver' in window) {
      var righe = new IntersectionObserver(function (voci) {
        voci.forEach(function (voce) { voce.target.classList.toggle('on', voce.isIntersecting); });
      }, { rootMargin: '-42% 0px -42% 0px' });
      tutti('.cliente').forEach(function (r) { righe.observe(r); });
    }

    /* ======================================================================
       3b. POPUP
       I dettagli si aprono in un <dialog>. Senza JavaScript (o dove <dialog> non esiste) restano contenuti normali nella pagina.
       ====================================================================== */

    if (typeof HTMLDialogElement === 'undefined' || !document.createElement('dialog').showModal) {
      radice.classList.add('no-popup');
    } else {
      tutti('[data-apri]').forEach(function (bottone) {
        bottone.addEventListener('click', function (e) {
          var finestra = document.getElementById(bottone.getAttribute('data-apri'));
          if (!finestra) return;
          e.preventDefault();                                   // il link a #contatti serve solo senza JavaScript
          var aperta = bottone.closest('dialog');
          if (aperta && aperta !== finestra) aperta.close();    // da un popup a un altro
          finestra.showModal();
          finestra.scrollTop = 0;
          var dentro = finestra.querySelector('.popup-in');
          if (dentro) dentro.scrollTop = 0;
          radice.classList.add('blocca');     // la pagina sotto non scorre
        });
      });
      tutti('dialog').forEach(function (finestra) {
        // Si chiude con la X, con Esc (lo fa il browser) o con un tocco fuori dalla carta
        finestra.addEventListener('click', function (e) {
          if (e.target === finestra || (e.target.closest && e.target.closest('[data-chiudi]'))) finestra.close();
        });
        finestra.addEventListener('close', function () {
          finestra.classList.remove('luce-on');
          if (!document.querySelector('dialog[open]')) radice.classList.remove('blocca');
        });
        // Con il mouse, una luce beige segue il puntatore dentro il popup
        var luceDentro = finestra.querySelector('.pop-luce');
        if (luceDentro && MOUSE && !RIDOTTO) {
          finestra.addEventListener('pointermove', function (e) {
            var r = finestra.getBoundingClientRect();
            luceDentro.style.transform = 'translate3d(' + (e.clientX - r.left).toFixed(0) + 'px,' + (e.clientY - r.top).toFixed(0) + 'px,0)';
            finestra.classList.add('luce-on');
          }, { passive: true });
          finestra.addEventListener('pointerleave', function () { finestra.classList.remove('luce-on'); });
        }
      });
    }

    /* ======================================================================
       3c. BAGLIORI SUI TASTI
       Luce che segue il mouse dentro il tasto e lampo dal punto premuto (anche tocco e tastiera).
       ====================================================================== */

    if (!RIDOTTO) {
      var TASTI = '.btn-p, .btn-o, .apri-btn, .nav-cta, .menu-btn, .chiudi, .mailwrap, .commuta button, a.tassello';
      // La luce deve vedersi sul fondo del tasto: beige su fondo scuro, blu su fondo chiaro.
      // I tasti vuoti (.btn-o) al passaggio si riempiono del colore opposto a quello che hanno intorno, e le tessere beige (.tassello-chiaro)
      // sono chiare dentro una scheda blu: per loro la regola si inverte.
      var luceBeige = function (tasto) {
        var scuro = !!tasto.closest(BLU);
        return tasto.matches('.btn-o, .tassello-chiaro') ? !scuro : scuro;
      };
      var coloreLuce = function (tasto) {
        return luceBeige(tasto) ? '234, 223, 200' : '70, 100, 215';
      };
      var lampo = function (tasto, x, y) {
        var r = tasto.getBoundingClientRect();
        var l = crea('span', 'lampo');
        l.setAttribute('aria-hidden', 'true');
        l.style.setProperty('--lc', coloreLuce(tasto));
        l.style.setProperty('--lx', (x - r.left) + 'px');
        l.style.setProperty('--ly', (y - r.top) + 'px');
        // Ogni lampo è un po' diverso: durata e grandezza variano a caso
        l.style.setProperty('--ld', (0.65 + Math.random() * 0.45).toFixed(2) + 's');
        l.style.setProperty('--le', (2 + Math.random() * 1.2).toFixed(2));
        tasto.appendChild(l);
        l.addEventListener('animationend', function () { l.remove(); });
      };
      document.addEventListener('pointerdown', function (e) {
        var t = e.target.closest && e.target.closest(TASTI);
        if (t) lampo(t, e.clientX, e.clientY);
      }, { passive: true });
      // Tastiera (Invio o Spazio): il lampo parte dal centro del tasto
      document.addEventListener('click', function (e) {
        if (e.detail !== 0) return;
        var t = e.target.closest && e.target.closest(TASTI);
        if (!t) return;
        var r = t.getBoundingClientRect();
        lampo(t, r.left + r.width / 2, r.top + r.height / 2);
      });
      if (MOUSE) {
        document.addEventListener('pointermove', function (e) {
          var t = e.target.closest && e.target.closest(TASTI);
          if (!t) return;
          var luce = t.querySelector(':scope > .luce-b');
          if (!luce) {
            luce = crea('span', 'luce-b');
            luce.setAttribute('aria-hidden', 'true');
            luce.style.setProperty('--lc', coloreLuce(t));
            luce.style.setProperty('--la', luceBeige(t) ? '0.3' : '0.36');   // un po' meno forte la luce beige, perché il testo sopra è beige
            t.appendChild(luce);
          }
          var r = t.getBoundingClientRect();
          luce.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          luce.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
      }
    }

    /* ======================================================================
       4. LUCE DELLA HERO E CURSORE AD ANELLO (SOLO MOUSE)
       Tutto si muove con un'interpolazione: un solo aggiornamento per frame.
       ====================================================================== */

    // --- Luce della hero: respira da sola (CSS); con il mouse segue il puntatore ---
    var luce = document.querySelector('.luce');
    var heroVisibile = true;
    if ('IntersectionObserver' in window && hero && luceInterna) {
      new IntersectionObserver(function (voci) {
        heroVisibile = voci[0].isIntersecting;
        pausaLuce();
      }).observe(hero);
    }
    // Fuori schermo o con la scheda nascosta l'animazione continua si ferma
    function pausaLuce() {
      if (luceInterna) luceInterna.classList.toggle('pausa', document.hidden || !heroVisibile);
    }
    document.addEventListener('visibilitychange', pausaLuce);

    var misure = {};   // posizioni calcolate una volta sola (sezione 6): evitano di leggere il layout a ogni movimento

    if (MOUSE && !RIDOTTO && luce && hero) {
      var meta = { x: 0, y: 0 }, qui = { x: 0, y: 0 }, luceInCorsa = false;
      var giraLuce = function () {
        qui.x += (meta.x - qui.x) * 0.06;
        qui.y += (meta.y - qui.y) * 0.06;
        luce.style.transform = 'translate3d(' + qui.x.toFixed(1) + 'px,' + qui.y.toFixed(1) + 'px,0)';
        if (Math.abs(meta.x - qui.x) > 0.3 || Math.abs(meta.y - qui.y) > 0.3) requestAnimationFrame(giraLuce);
        else luceInCorsa = false;
      };
      hero.addEventListener('pointermove', function (e) {
        var cima = (misure.heroTop || 0) - window.scrollY;
        meta.x = (e.clientX - window.innerWidth / 2) * 0.55;
        meta.y = (e.clientY - cima - (misure.heroH || 0) * 0.4) * 0.45;
        if (!luceInCorsa) { luceInCorsa = true; requestAnimationFrame(giraLuce); }
      }, { passive: true });
    }

    // --- Cursore: anello che segue con ritardo e, dietro, una luce beige che segue con ancora più ritardo ---
    if (MOUSE && !RIDOTTO) {
      var anello = crea('div', 'cur');
      anello.setAttribute('aria-hidden', 'true');
      anello.appendChild(crea('i'));
      var bagliore = crea('div', 'cur-glow');
      bagliore.setAttribute('aria-hidden', 'true');
      bagliore.appendChild(crea('i', 'd'));   // strato beige (sfondo scuro)
      bagliore.appendChild(crea('i', 'l'));   // strato blu (sfondo chiaro)
      document.body.appendChild(bagliore);
      document.body.appendChild(anello);

      var mouse = { x: 0, y: 0 }, a = { x: 0, y: 0 }, b = { x: 0, y: 0 }, cursoreInCorsa = false;
      var giraCursore = function () {
        a.x += (mouse.x - a.x) * 0.22; a.y += (mouse.y - a.y) * 0.22;     // anello: ritardo corto
        b.x += (mouse.x - b.x) * 0.09; b.y += (mouse.y - b.y) * 0.09;     // luce: ritardo più lungo
        anello.style.transform = 'translate3d(' + a.x.toFixed(1) + 'px,' + a.y.toFixed(1) + 'px,0)';
        bagliore.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0)';
        var lontano = Math.abs(mouse.x - a.x) > 0.4 || Math.abs(mouse.y - a.y) > 0.4 ||
                      Math.abs(mouse.x - b.x) > 0.4 || Math.abs(mouse.y - b.y) > 0.4;
        if (lontano) requestAnimationFrame(giraCursore); else cursoreInCorsa = false;
      };
      // Il fondo sotto il puntatore è chiaro o scuro? Si risale dall'elemento: il primo antenato con uno sfondo pieno decide
      // (un pulsante blu in una sezione crema è scuro; un pulsante beige dentro il banner blu è chiaro).
      // Le sfumature stanno su ::before e sulle classi blu: per quelle si guarda la classe.
      function fondoScuro(el) {
        for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
          if (e.matches(BLU)) return true;
          if (e.matches('.sez-chiara, .nav')) return false;
          var m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);
          if (m) {
            var c = m[1].split(/[ ,\/]+/).map(Number);
            var alfa = c.length > 3 ? c[3] : 1;
            if (alfa >= 0.6) return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) < 120;   // luminosità approssimata
          }
        }
        return false;
      }
      function aggiornaCursore(sopra) {
        if (!sopra || !sopra.closest) return;
        var grande = !!sopra.closest('a, button, summary, .cliente');
        var nellaHero = !!sopra.closest('.hero');
        // Anello: segue l'elemento sotto il puntatore (anche un riquadro blu dentro una sezione crema)
        var anelloChiaro = !fondoScuro(sopra);
        // Bagliore: sta sopra gli sfondi (anche quelli dei riquadri blu) e sotto il testo; stesso criterio dell'anello
        // (sfondo chiaro = luce blu, sfondo scuro = luce beige)
        anello.classList.add('vis');
        bagliore.classList.add('vis');
        anello.classList.toggle('big', grande);
        anello.classList.toggle('su-chiaro', anelloChiaro);
        bagliore.classList.toggle('big', grande);
        bagliore.classList.toggle('su-chiaro', anelloChiaro);
        bagliore.classList.toggle('fuori', nellaHero);   // nella hero c'è già la sua luce
        if (!cursoreInCorsa) { cursoreInCorsa = true; requestAnimationFrame(giraCursore); }
      }
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (!anello.classList.contains('vis')) { a.x = b.x = e.clientX; a.y = b.y = e.clientY; }
        mouse.x = e.clientX; mouse.y = e.clientY;
        aggiornaCursore(e.target);
      }, { passive: true });
      // Anche quando il mouse sta fermo e scorre la pagina, sotto il puntatore arriva un altro sfondo
      var scrollInCorsa = false;
      window.addEventListener('scroll', function () {
        if (scrollInCorsa || !anello.classList.contains('vis')) return;
        scrollInCorsa = true;
        requestAnimationFrame(function () {
          scrollInCorsa = false;
          var el = document.elementFromPoint(mouse.x, mouse.y);
          if (el) aggiornaCursore(el);
        });
      }, { passive: true });
      radice.addEventListener('mouseleave', function () {
        anello.classList.remove('vis');
        bagliore.classList.remove('vis');
      });
    }

    /* ======================================================================
       5. PRIMA E DOPO DEL CASO STUDIO
       Un interruttore (Prima / Dopo) cambia l'attributo data-v del contenitore .prof.
       Il resto (quale stato si vede, le dissolvenze, l'anello dell'avatar) lo fa il CSS.
       ====================================================================== */

    tutti('[data-prof]').forEach(function (blocco) {
      var tasti = tutti('.commuta button', blocco);
      function impostaStato(stato) {
        blocco.setAttribute('data-v', stato);
        // aria-pressed dice allo screen reader quale dei due tasti è attivo
        tasti.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-v') === stato ? 'true' : 'false'); });
      }
      tasti.forEach(function (t) {
        t.addEventListener('click', function () { impostaStato(t.getAttribute('data-v')); });
      });
    });

    /* ======================================================================
       6. MENU E SCROLL: BARRA "STORIE" E VOCE ATTIVA
       Un solo gestore, al massimo una volta per frame. Le posizioni sono misurate una volta
       (e rimisurate se la pagina cambia dimensione), così a ogni scroll non si legge il layout.
       ====================================================================== */

    var sezioni = tutti('main > section');
    var menu = document.getElementById('nav');
    var riempimenti = [];
    var barra = crea('div', 'story-bar');
    barra.setAttribute('aria-hidden', 'true');
    sezioni.forEach(function () {
      var segmento = crea('div', 'seg');
      var riempimento = crea('i');
      segmento.appendChild(riempimento);
      barra.appendChild(segmento);
      riempimenti.push(riempimento);
    });
    (menu || document.body).appendChild(barra);

    // Voce del menu della sezione in lettura (una per id di sezione)
    var vociMenu = {};
    tutti('.nav-menu a').forEach(function (a) { vociMenu[a.getAttribute('href').slice(1)] = a; });
    var voceCorrente = null;

    // Pulsante "menu" sul telefono: apre e chiude l'elenco. Si chiude con Esc, con un tocco su una voce o sul resto della pagina
    var pulsante = document.querySelector('.menu-btn');
    function apriMenu(si) {
      if (!menu || !pulsante) return;
      menu.classList.toggle('aperto', si);
      pulsante.setAttribute('aria-expanded', si ? 'true' : 'false');
      pulsante.setAttribute('aria-label', si ? 'Chiudi il menu' : 'Apri il menu');
    }
    if (pulsante && menu) {
      pulsante.addEventListener('click', function () { apriMenu(!menu.classList.contains('aperto')); });
      menu.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.nav-menu a')) apriMenu(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') apriMenu(false); });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target)) apriMenu(false); });
    }

    function misura() {
      var y = window.scrollY;
      misure.vh = window.innerHeight;
      misure.massimo = Math.max(0, document.documentElement.scrollHeight - misure.vh);
      misure.sezioni = sezioni.map(function (s) {
        var r = s.getBoundingClientRect();
        return { top: r.top + y, h: r.height };
      });
      if (hero) {
        var rh = hero.getBoundingClientRect();
        misure.heroTop = rh.top + y;
        misure.heroH = rh.height;
      }
    }

    var inAttesa = false;
    var ultimaBarra = [];
    function aggiorna() {
      inAttesa = false;
      if (!misure.sezioni) return;
      var y = window.scrollY, vh = misure.vh;

      // Barra "storie": un segmento per sezione, si riempie mentre quella sezione passa a metà schermo
      misure.sezioni.forEach(function (s, i) {
        var inizio = s.top - vh * 0.55;
        var fine = s.top + s.h - vh * 0.55;
        if (i === misure.sezioni.length - 1) fine = Math.min(fine, misure.massimo);   // l'ultimo si riempie in fondo alla pagina
        var p = fine > inizio ? (y - inizio) / (fine - inizio) : 1;
        var valore = 'scaleX(' + Math.max(0, Math.min(1, p)).toFixed(3) + ')';
        if (valore !== ultimaBarra[i]) { riempimenti[i].style.transform = valore; ultimaBarra[i] = valore; }
      });

      // Voce del menu: l'ultima sezione la cui cima ha superato il 40% dello schermo
      var attiva = 0;
      misure.sezioni.forEach(function (s, i) { if (s.top <= y + vh * 0.4) attiva = i; });
      var voce = vociMenu[sezioni[attiva].id] || null;
      if (voce !== voceCorrente) {
        if (voceCorrente) voceCorrente.removeAttribute('aria-current');
        if (voce) voce.setAttribute('aria-current', 'location');
        voceCorrente = voce;
      }
    }
    function pianifica() {
      if (inAttesa) return;
      inAttesa = true;
      requestAnimationFrame(aggiorna);
    }

    function rimisura() { misura(); pianifica(); }
    window.addEventListener('scroll', pianifica, { passive: true });
    window.addEventListener('resize', rimisura);
    window.addEventListener('load', rimisura);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rimisura);
    if ('ResizeObserver' in window) new ResizeObserver(rimisura).observe(document.body);
    rimisura();
  }
})();
