/* ==========================================================================
   Portfolio di Matteo Rapeso: JavaScript
   Il sito funziona anche senza JavaScript: qui c'è solo un miglioramento.
   Questa versione è statica (nessuna animazione): serve solo ai pulsanti del
   caso studio, che mostrano un profilo o un post alla volta.
   Senza JavaScript tutti i profili e i post restano visibili, uno sotto l'altro.
   ========================================================================== */

(function () {
  'use strict';

  // Dico al paracadute nell'<head> che questo file è partito: non deve togliere la classe "js"
  document.documentElement.classList.add('pronto');

  // Scorciatoia: trova tutti gli elementi che corrispondono a un selettore e li mette in una lista
  function trovaTutti(selettore, dentro) {
    return Array.prototype.slice.call((dentro || document).querySelectorAll(selettore));
  }

  // Cambia lo stato di un blocco (prima/dopo oppure post 1-4): aggiorna "data-attivo" e i pulsanti
  function impostaStato(blocco, valore) {
    if (blocco.getAttribute('data-attivo') === valore) return;
    blocco.setAttribute('data-attivo', valore);
    trovaTutti('[data-vai]', blocco).forEach(function (pulsante) {
      pulsante.setAttribute('aria-pressed', String(pulsante.getAttribute('data-vai') === valore));
    });
  }

  // Ogni blocco con "data-attivo" ha dei pulsanti con "data-vai": al clic mostro lo stato scelto
  trovaTutti('[data-attivo]').forEach(function (blocco) {
    trovaTutti('[data-vai]', blocco).forEach(function (pulsante) {
      pulsante.addEventListener('click', function () {
        impostaStato(blocco, pulsante.getAttribute('data-vai'));
      });
    });
  });
})();
