/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Fa due sole cose, e il sito funziona anche senza:
   1. fa comparire gradualmente le sezioni quando si scorre la pagina;
   2. permette di scegliere quale post mostrare nel telefono del caso studio.
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


  /* ----- 2. Scelta del post nel telefono -----
     Il CSS mostra il post indicato dall'attributo data-attivo della vetrina.
     Qui basta cambiare quell'attributo e aggiornare lo stato dei pulsanti. */

  var vetrine = document.querySelectorAll('.vetrina');

  vetrine.forEach(function (vetrina) {
    var pulsanti = vetrina.querySelectorAll('[data-vai]');

    function attiva(numero) {
      vetrina.setAttribute('data-attivo', numero);
      pulsanti.forEach(function (pulsante) {
        pulsante.setAttribute('aria-pressed', String(pulsante.getAttribute('data-vai') === numero));
      });
    }

    pulsanti.forEach(function (pulsante) {
      pulsante.addEventListener('click', function () {
        attiva(pulsante.getAttribute('data-vai'));
      });
    });
  });
})();
