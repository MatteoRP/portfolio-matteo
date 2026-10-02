/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Fa tre sole cose, e il sito funziona anche senza:
   1. fa comparire gradualmente le sezioni quando si scorre la pagina;
   2. permette di scegliere cosa mostrare nei telefoni del caso studio
      (quale post, oppure il profilo prima/dopo);
   3. rende raggiungibili da tastiera le strisce del calendario, ma solo se scorrono.
   ========================================================================== */

(function () {
  'use strict';

  /* L'utente ha chiesto meno movimento? In quel caso non animiamo nulla. */
  var menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ----- 1. Comparsa graduale allo scroll -----
     Gli elementi con classe "rivela" partono nascosti (lo decide il CSS).
     IntersectionObserver ci avvisa quando entrano nello schermo:
     a quel punto aggiungiamo la classe "visibile" e il CSS fa la dissolvenza. */

  var elementi = document.querySelectorAll('.rivela');

  if (menoMovimento || !('IntersectionObserver' in window)) {
    /* Nessuna animazione: mostriamo tutto subito */
    elementi.forEach(function (el) {
      el.classList.add('visibile');
    });
  } else {
    var osservatore = new IntersectionObserver(function (voci, oss) {
      voci.forEach(function (voce) {
        if (voce.isIntersecting) {
          voce.target.classList.add('visibile');
          oss.unobserve(voce.target); /* una volta comparso, non serve più osservarlo */
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    elementi.forEach(function (el) {
      osservatore.observe(el);
    });
  }


  /* ----- 2. Scelta di cosa mostrare nel telefono -----
     Ogni contenitore con l'attributo data-attivo (la vetrina dei post e il
     confronto prima/dopo) mostra ciò che indica quell'attributo: lo decide il CSS.
     Qui basta cambiare l'attributo e aggiornare lo stato dei pulsanti. */

  var contenitori = document.querySelectorAll('[data-attivo]');

  contenitori.forEach(function (contenitore) {
    var pulsanti = contenitore.querySelectorAll('[data-vai]');

    function attiva(valore) {
      contenitore.setAttribute('data-attivo', valore);
      pulsanti.forEach(function (pulsante) {
        pulsante.setAttribute('aria-pressed', String(pulsante.getAttribute('data-vai') === valore));
      });
    }

    pulsanti.forEach(function (pulsante) {
      pulsante.addEventListener('click', function () {
        attiva(pulsante.getAttribute('data-vai'));
      });
    });
  });


  /* ----- 3. Strisce del calendario -----
     Sul telefono la striscia scorre di lato e deve poter essere raggiunta da tastiera
     (tabindex="0"). Sul desktop i sette giorni stanno affiancati e non c'è nulla da
     scorrere: in quel caso togliamo il tabindex per non lasciare una tappa inutile. */

  var strisce = document.querySelectorAll('.striscia-scorri');

  function aggiornaStrisce() {
    strisce.forEach(function (striscia) {
      if (striscia.scrollWidth > striscia.clientWidth + 1) {
        striscia.setAttribute('tabindex', '0');
      } else {
        striscia.removeAttribute('tabindex');
      }
    });
  }

  aggiornaStrisce();
  window.addEventListener('resize', aggiornaStrisce);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(aggiornaStrisce); /* i font cambiano le larghezze: ricontrolliamo */
  }
})();
