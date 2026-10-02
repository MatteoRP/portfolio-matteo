# Progetto: portfolio personale di Matteo Rapeso

## Chi è e a cosa serve
Matteo Rapeso è un social media manager alle prime armi che vuole posizionarsi nel settore hospitality di fascia alta (boutique hotel, ristoranti di livello). Il sito è una pagina unica che metterà nella bio di Instagram (@matteorapeso). Contatto: rapeso.matteo@gmail.com.
Obiettivo del sito: convincere il titolare di un'attività di fascia alta a scrivergli. Il sito deve dimostrare competenza di social media management (strategia, contenuti, metodo), non di sviluppo web.

## Lingua
Tutto il testo del sito è in italiano, tono sobrio, elegante, diretto. Niente enfasi da marketing ("rivoluzionario", "numero uno", "a 360 gradi").

## Regole di onestà (non negoziabili)
- Non inventare clienti, testimonianze, loghi, premi o risultati reali.
- Il caso studio è un PROGETTO DIMOSTRATIVO su un'attività FITTIZIA e deve essere dichiarato come tale in modo visibile ("Progetto dimostrativo: attività e dati fittizi").
- Eventuali numeri nel caso studio sono obiettivi o ipotesi di lavoro, mai presentati come risultati ottenuti.
- Non usare nomi di brand, hotel o ristoranti reali.

## Stack
- Solo HTML, CSS e JavaScript vanilla. Nessun framework, nessun build step.
- File: index.html, css/style.css, js/main.js, cartella assets/ per font e immagini.
- Il sito deve funzionare aprendo la cartella su qualsiasi hosting statico gratuito (Cloudflare Pages, Netlify, GitHub Pages).

## Design
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop.
- Stile: lusso discreto. Molto spazio vuoto, tipografia come protagonista, poche cose ma curate.
- Palette (variabili CSS): nero caldo #0E0E0E, avorio #F5F1E8, oro spento #B79B6B per gli accenti. Niente altri colori.
- Font: Cormorant Garamond per i titoli, Inter per il testo. Usali in locale (self-hosted in assets/fonts), senza collegamenti a Google Fonts.
- Niente emoji, niente gradienti appariscenti, niente ombre pesanti, niente stock photo generiche.
- Le immagini mancanti si sostituiscono con segnaposto neutri e puliti, chiaramente sostituibili.

## Animazioni
- Poche, lente, sobrie: comparsa graduale allo scroll (IntersectionObserver), hover discreti, transizioni di 400-700ms con easing morbido.
- Rispetta sempre prefers-reduced-motion (se attivo, nessuna animazione).
- Animare solo transform e opacity, per non rallentare i telefoni.

## Qualità richiesta
- Accessibilità: HTML semantico, contrasto sufficiente, focus visibile, testo alternativo alle immagini, navigabile da tastiera.
- Prestazioni: nessuna libreria esterna salvo necessità motivata, immagini ottimizzate e con loading="lazy", obiettivo Lighthouse 95+ su mobile.
- SEO e condivisione: title, meta description, Open Graph, favicon.
- Privacy: nessun cookie, nessun tracker, nessun form con backend. Il contatto avviene via link mailto e link a Instagram.

## Modo di lavorare
- Fai un passo alla volta, spiegami in 2-3 righe cosa hai fatto e come lo verifico nel browser.
- Se una mia richiesta peggiora il risultato (design, prestazioni, chiarezza), dimmelo subito e proponi l'alternativa migliore.
- Distingui ciò che sai da ciò che ipotizzi.
- Commenta il codice in italiano, in modo semplice: sono un principiante e voglio capirlo.
