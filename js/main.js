/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Il sito funziona anche senza JavaScript: qui c'è solo il movimento.
   Le regole del movimento sono in CLAUDE.md ("Sistema di movimento"):
   - si animano solo transform e opacità (l'anello dell'avatar usa stroke-dashoffset);
   - tutto parte da scroll, puntatore o tocco; niente scroll-jacking;
   - con "riduci movimento" attivo il sito è già nello stato finale e qui non si anima nulla.

   Indice:
   1. Preparazione
   2. Hero e comparse allo scroll
   3. Righe di "Per chi lavoro" al tocco, popup dei dettagli, bagliori sui tasti
   4. Luce della hero e cursore ad anello (solo mouse)
   5. Caso studio: prima e dopo del profilo, pagine degli approfondimenti
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

    // iOS Safari applica lo stato :active (la pressione dei pulsanti) solo se la pagina ascolta il tocco: un ascoltatore vuoto basta
    document.addEventListener('touchstart', function () {}, { passive: true });

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
      tutti('.num').forEach(preparaNumero);

      var bersagli = tutti('.rv, .tit, .num, .hl');
      var comparsa = function (elemento) {
        elemento.classList.add('in');
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
      var TASTI = '.btn-p, .btn-o, .apri-btn, .nav-cta, .menu-btn, .chiudi, .mailwrap, .commuta button, .sfoglia-tasto, a.tassello';
      // La luce deve vedersi sul fondo del tasto: beige su fondo scuro, blu su fondo chiaro.
      // I tasti vuoti (.btn-o) al passaggio si riempiono del colore opposto a quello che hanno intorno, e le tessere beige (.tassello-chiaro)
      // sono chiare dentro una scheda blu: per loro la regola si inverte.
      var luceBeige = function (tasto) {
        var scuro = !!tasto.closest(BLU);
        return tasto.matches('.btn-o, .tassello-chiaro') ? !scuro : scuro;
      };
      var coloreLuce = function (tasto) {
        if (tasto.matches('.nav-cta')) return '150, 178, 255';   // «Scrivimi» è vetro blu: la sua luce è azzurra (più chiara del vetro, ma meno del beige: il testo resta leggibile)
        return luceBeige(tasto) ? '234, 223, 200' : '70, 100, 215';
      };
      var lampo = function (tasto, x, y) {
        var r = tasto.getBoundingClientRect();
        var l = crea('span', 'lampo');
        l.setAttribute('aria-hidden', 'true');
        l.style.setProperty('--lc', coloreLuce(tasto));
        // clientLeft e clientTop sono lo spessore del bordo: le luci sono posizionate dal bordo interno, non da quello esterno
        l.style.setProperty('--lx', (x - r.left - tasto.clientLeft) + 'px');
        l.style.setProperty('--ly', (y - r.top - tasto.clientTop) + 'px');
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
          luce.style.setProperty('--mx', (e.clientX - r.left - t.clientLeft) + 'px');
          luce.style.setProperty('--my', (e.clientY - r.top - t.clientTop) + 'px');
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
        // Verso il basso la luce non va oltre il suo posto di riposo: più giù il bordo della hero la taglierebbe
        // e tra la hero e "Chi sono" si vedrebbe un gradino di colore (misurato: fino a 16 livelli su 255)
        if (meta.y > 0) meta.y = 0;
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
       5. CASO STUDIO: PRIMA E DOPO, PAGINE DEGLI APPROFONDIMENTI
       a) Un interruttore (Prima / Dopo) cambia l'attributo data-v del contenitore .prof.
          Il resto (quale stato si vede, le dissolvenze, l'anello dell'avatar) lo fa il CSS.
       b) Quattro tasti scelgono quale pagina degli approfondimenti si vede: JavaScript sposta
          la classe "on" (pagina che entra) e "esce" (pagina che se ne va) e dice al CSS da che
          parte scorre (--dir). L'animazione e lo spostamento sono tutti nel CSS.
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

    tutti('[data-sfoglia]').forEach(function (blocco) {
      var lista = blocco.querySelector('.sfoglia-tasti');
      var tasti = tutti('.sfoglia-tasto', blocco);
      var pagine = tasti.map(function (t) { return document.getElementById(t.getAttribute('data-pagina')); });
      var corrente = 0;

      // Per gli screen reader: una lista di schede (tab), ognuna collegata alla sua pagina (tabpanel)
      lista.setAttribute('role', 'tablist');
      lista.setAttribute('aria-label', 'Approfondimenti sul caso studio');
      tasti.forEach(function (t, i) {
        t.id = 'tab-' + pagine[i].id;
        t.setAttribute('role', 'tab');
        t.setAttribute('aria-controls', pagine[i].id);
        pagine[i].setAttribute('role', 'tabpanel');
        pagine[i].setAttribute('aria-labelledby', t.id);
      });

      // Mostra la pagina numero i. Il verso (+1 avanti, -1 indietro) decide da che parte entra e da che parte esce.
      function vai(i, conFocus) {
        if (i < 0 || i >= pagine.length) return;
        if (i !== corrente) {
          blocco.style.setProperty('--dir', i > corrente ? 1 : -1);
          pagine[corrente].classList.remove('on');
          pagine[corrente].classList.add('esce');
          pagine[i].classList.remove('esce');
          pagine[i].classList.add('on');
          corrente = i;
        }
        // aria-selected dice quale scheda è attiva; con tabindex solo quella attiva si raggiunge con Tab, le altre con le frecce
        tasti.forEach(function (t, k) {
          t.setAttribute('aria-selected', k === corrente ? 'true' : 'false');
          t.tabIndex = k === corrente ? 0 : -1;
        });
        // Il CSS sposta la "lente" di vetro sotto il tasto scelto leggendo questo numero (data-a)
        lista.setAttribute('data-a', corrente);
        if (conFocus) tasti[corrente].focus();
      }

      pagine[0].classList.add('on');
      vai(0, false);

      // Quando la pagina che esce ha finito di dissolversi le tolgo la classe "esce": sparisce del tutto dal layout
      pagine.forEach(function (pagina) {
        pagina.addEventListener('animationend', function (e) {
          if (e.target === pagina && e.animationName === 'pagina-esce') pagina.classList.remove('esce');
        });
      });

      tasti.forEach(function (t, i) {
        t.addEventListener('click', function () { vai(i, false); });
        // Tastiera: frecce, Home e Fine passano da una scheda all'altra
        t.addEventListener('keydown', function (e) {
          var k = e.key, n = tasti.length, dest = -1;
          if (k === 'ArrowRight' || k === 'ArrowDown') dest = (corrente + 1) % n;
          else if (k === 'ArrowLeft' || k === 'ArrowUp') dest = (corrente - 1 + n) % n;
          else if (k === 'Home') dest = 0;
          else if (k === 'End') dest = n - 1;
          if (dest < 0) return;
          e.preventDefault();
          vai(dest, true);
        });
      });

      // Al tocco: uno scorrimento orizzontale sulla pagina passa alla successiva o alla precedente
      var zona = blocco.querySelector('.sfoglia-pagine');
      var x0 = 0, y0 = 0;
      var tocco = false;
      zona.addEventListener('touchstart', function (e) {
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
        // se il dito parte da una striscia del calendario, lo scorrimento è suo (sposta i giorni): non cambio pagina
        tocco = !e.target.closest('.striscia-scorri');
      }, { passive: true });
      zona.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - x0;
        var dy = e.changedTouches[0].clientY - y0;
        // conta solo un gesto deciso e più orizzontale che verticale (altrimenti è uno scroll della pagina)
        if (tocco && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) vai(corrente + (dx < 0 ? 1 : -1), false);
      }, { passive: true });
    });

    /* ======================================================================
       6. MENU E SCROLL: BARRA "STORIE", VOCE ATTIVA, LENTE E VETRO CHE REAGISCE ALLO SCORRIMENTO
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

    // Lente di vetro sotto la voce attiva (da 860px: sotto, il CSS la nasconde): una sola lente che scivola da una voce all'altra.
    // Qui si calcolano solo posizione e scala (transform): la lente è larga quanto la media delle voci e la scala la adatta a ciascuna.
    var contenitoreVoci = document.querySelector('.nav-menu');
    var lente = null;
    var lenteSulPosto = false;
    if (contenitoreVoci) {
      lente = crea('i', 'nav-lente');
      lente.setAttribute('aria-hidden', 'true');
      contenitoreVoci.insertBefore(lente, contenitoreVoci.firstChild);
    }
    function posizionaLente(subito) {
      if (!lente) return;
      // Senza voce attiva, o sotto 860px (lì la lente è display: none e le misure valgono 0), la lente si dissolve
      if (!voceCorrente || !lente.offsetParent || !voceCorrente.offsetWidth) {
        lente.classList.remove('on');
        lenteSulPosto = false;
        return;
      }
      var voci = tutti('.nav-menu a');
      var media = Math.round(voci.reduce(function (somma, a) { return somma + a.offsetWidth; }, 0) / voci.length);
      lente.style.width = media + 'px';
      // La prima volta (o dopo un ridimensionamento) la lente compare già al suo posto: per un fotogramma senza transizione
      var salta = subito || !lenteSulPosto;
      if (salta) lente.classList.add('subito');
      lente.style.setProperty('--lx', voceCorrente.offsetLeft + 'px');
      lente.style.setProperty('--lk', (voceCorrente.offsetWidth / media).toFixed(4));
      if (salta) { void lente.offsetWidth; lente.classList.remove('subito'); }
      lente.classList.add('on');
      lenteSulPosto = true;
    }

    // Vetro della barra che reagisce allo scorrimento (non con «riduci movimento»).
    // La velocità dello scroll (px per fotogramma) è ammorbidita con un'interpolazione: sale in fretta e scende piano, così il vetro si tende
    // subito e poi si assesta. JavaScript scrive tre variabili sulla barra: --tensione (0-1: quanto si tende la capsula), --luce (0-1: quanto si
    // accende il riflesso) e --fase (0-1: la posizione nella pagina, che il riflesso della capsula segue); e una sul tasto «Scrivimi»: --fase-tasto
    // (lo stesso, con un giro più corto). Il CSS le usa solo per transform e opacità.
    // --fase-tasto sta sul tasto e non sulla barra di proposito: una variabile che cambia a ogni fotogramma sulla barra fa ricalcolare lo stile di
    // tutti i suoi elementi (misurato: i fotogrammi oltre 34ms salivano da 5% a 9,5%); sul tasto, che ha pochi elementi, il costo sparisce (5,9%).
    // Il ciclo parte con lo scroll e si ferma da solo quando la pagina è ferma e il vetro si è assestato.
    if (menu && !RIDOTTO) {
      var ombra = crea('div', 'nav-ombra');        // l'ombra che si solleva sotto la capsula
      ombra.setAttribute('aria-hidden', 'true');
      menu.appendChild(ombra);
      var vetro = crea('div', 'nav-vetro');        // il riflesso che attraversa la capsula e l'alone sul bordo
      vetro.setAttribute('aria-hidden', 'true');
      vetro.appendChild(crea('i'));
      menu.appendChild(vetro);
      var cta = menu.querySelector('.nav-cta');    // il tasto «Scrivimi»: la sua fase si scrive su di lui (vedi sopra)
      var velocita = 0;
      var yPrima = window.scrollY;
      var inCiclo = false;
      var ultimiValori = '';
      var cicloVetro = function () {
        var y = window.scrollY;
        var dy = y - yPrima;
        yPrima = y;
        if (Math.abs(dy) > 600) dy = 0;                       // un salto istantaneo (pagina ripristinata) non è uno scorrimento
        var bersaglio = Math.max(-1, Math.min(1, dy / 16));   // 16px per fotogramma (circa 1000px al secondo) = tensione massima
        velocita += (bersaglio - velocita) * (Math.abs(bersaglio) > Math.abs(velocita) ? 0.4 : 0.06);
        var t = Math.abs(velocita);
        if (t < 0.004 && dy === 0) { velocita = 0; t = 0; }
        var tensione = t.toFixed(3);
        var luce = Math.min(1, t * 3).toFixed(3);
        var fase = (((y / 700) % 1 + 1) % 1).toFixed(3);      // il riflesso attraversa la capsula ogni 700px di pagina
        var faseTasto = (((y / 300) % 1 + 1) % 1).toFixed(3); // e il tasto «Scrivimi», che è piccolo, ogni 300px
        var valori = tensione + '|' + luce + '|' + fase + '|' + faseTasto;
        if (valori !== ultimiValori) {
          ultimiValori = valori;
          menu.style.setProperty('--tensione', tensione);
          menu.style.setProperty('--luce', luce);
          menu.style.setProperty('--fase', fase);
          if (cta) cta.style.setProperty('--fase-tasto', faseTasto);
        }
        if (t > 0 || dy !== 0) requestAnimationFrame(cicloVetro); else inCiclo = false;
      };
      window.addEventListener('scroll', function () {
        if (!inCiclo) { inCiclo = true; requestAnimationFrame(cicloVetro); }
      }, { passive: true });
      window.addEventListener('load', function () { yPrima = window.scrollY; });
    }

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
    var fondoBlu = false;
    function aggiorna() {
      inAttesa = false;
      if (!misure.sezioni) return;
      var y = window.scrollY, vh = misure.vh;

      // Colore di html: crema di base, blu quando il bordo basso dello schermo è dentro contatti e piè di pagina (le ultime due parti, blu).
      // Si vede nel rimbalzo dello scroll su iPhone e iPad e, in Safari 26, nella tinta delle barre del browser.
      var ultima = misure.sezioni[misure.sezioni.length - 1];
      var blu = ultima ? (y + vh > ultima.top + 80) : false;
      if (blu !== fondoBlu) { fondoBlu = blu; radice.classList.toggle('fondo-scuro', blu); }

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
        posizionaLente(false);
      }
    }
    function pianifica() {
      if (inAttesa) return;
      inAttesa = true;
      requestAnimationFrame(aggiorna);
    }

    function rimisura() { misura(); posizionaLente(true); pianifica(); }
    window.addEventListener('scroll', pianifica, { passive: true });
    window.addEventListener('resize', rimisura);
    window.addEventListener('load', rimisura);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rimisura);
    if ('ResizeObserver' in window) new ResizeObserver(rimisura).observe(document.body);
    rimisura();
  }
})();
