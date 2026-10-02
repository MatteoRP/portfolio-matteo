# Progetto: portfolio personale di Matteo Rapeso

## Chi è e a cosa serve
Matteo Rapeso è un social media manager alle prime armi. Si occupa di strategia e contenuti per profili social e si rivolge a tre tipi di cliente: creator (es. YouTuber), attività locali (es. barbieri, ristoranti, hotel) e startup/brand digitali. Il sito è una pagina unica che metterà nella bio di Instagram (@matteorapeso). Contatto: rapeso.matteo@gmail.com.
Obiettivo del sito: convincere un creator, il titolare di un'attività locale o il fondatore di una startup a scrivergli. Il sito deve dimostrare competenza di social media management (strategia, contenuti, metodo), non di sviluppo web.

## Posizionamento (nessun target unico)
- Il posizionamento poggia sul tipo di problema che risolve, non sul settore: (1) rendere riconoscibile un profilo; (2) trasformare l'attenzione in contatti, prenotazioni o iscrizioni.
- Tre tipi di cliente, un solo metodo: cambiano canali e obiettivo, non il modo di ragionare.
- Il design resta elegante e sobrio ma non deve parlare solo di lusso né richiamare un solo settore.
- Il primo passo offerto è una breve call conoscitiva gratuita di 15 minuti. Il contatto avviene via email o messaggio su Instagram, senza calendario di prenotazione.

## Lingua
Tutto il testo del sito è in italiano, tono sobrio, elegante, diretto. Niente enfasi da marketing ("rivoluzionario", "numero uno", "a 360 gradi"). Nessuna promessa di risultati garantiti: si usa il condizionale e il linguaggio dell'obiettivo ("possa diventare", "ipotesi").

## Regole di onestà (non negoziabili)
- Matteo non ha clienti né risultati reali: il portfolio stesso è il suo primo progetto. Non inventare clienti, testimonianze, loghi, premi, anni di attività o risultati. Nel testo usare formule come "mi rivolgo a", non "lavoro con" o "ho seguito".
- I problemi dei tre tipi di cliente sono descritti come "tipici", mai come esperienze vissute.
- Il caso studio è UNO SOLO, è un PROGETTO DIMOSTRATIVO su un'attività FITTIZIA e deve essere dichiarato come tale in modo visibile ("Progetto dimostrativo: attività e dati fittizi").
- Eventuali numeri nel caso studio sono obiettivi o ipotesi di lavoro, mai presentati come risultati ottenuti. Nessun utente, fondo raccolto, follower o testimonianza inventati e presentati come reali.
- Non usare nomi di brand, hotel, ristoranti o aziende reali.

## Caso studio: Numerella (fittizio)
- Startup FITTIZIA di educazione finanziaria che vuole ridurre l'analfabetismo finanziario in Italia. Nome, offerta e slogan sono inventati; i fondatori sono descritti solo per ruolo (nessun nome, nessun volto).
- Fa SOLO divulgazione educativa: nessun consiglio su cosa comprare, nessuna promessa di rendimento, nessuna consulenza personalizzata, nessun link di affiliazione, nessun nome di prodotto o piattaforma reale.
- Ogni esempio di contenuto riporta l'avviso "Contenuto educativo, non consulenza finanziaria". Le definizioni vanno controllate su fonti ufficiali (Istat, Banca d'Italia) prima di pubblicare; i numeri di esempio sono dichiarati tali.
- Non creare alcun profilo Instagram reale per Numerella. Il feed è un mockup in CSS, marcato come esempio.
- Contenuto: breve audit di un profilo ipotetico, strategia (pilastri, tono, canali giustificati), calendario di 2 settimane, 4 esempi di post con caption e logica, obiettivi dichiarati come ipotesi, box "come cambierebbe" per creator e attività locali.

## Stack
- Solo HTML, CSS e JavaScript vanilla. Nessun framework, nessun build step.
- File: index.html, css/style.css, js/main.js, cartella assets/ per font e immagini.
- Il sito deve funzionare aprendo la cartella su qualsiasi hosting statico gratuito (Cloudflare Pages, Netlify, GitHub Pages).
- Il sito deve restare leggibile anche senza JavaScript (JS solo come miglioramento).

## Design
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop. Nessun overflow orizzontale a 390px.
- Stile: eleganza sobria. Molto spazio vuoto, tipografia come protagonista, poche cose ma curate. Una idea per schermata, sezioni alternate nero caldo e avorio, bordi sottili, niente ombre pesanti.
- Tipografia: titoli molto grandi in Cormorant Garamond (con clamp()), testo in Inter 17-18px, massimo 65 caratteri per riga.
- Palette (variabili CSS): nero caldo #0E0E0E, avorio #F5F1E8, oro spento #B79B6B per gli accenti. Niente altri colori. Sono ammesse solo varianti derivate dalla palette (trasparenze, oro scurito mescolandolo al nero) quando serve il contrasto: l'oro puro su avorio non è leggibile come testo.
- Font: Cormorant Garamond per i titoli, Inter per il testo. Usali in locale (self-hosted in assets/fonts), senza collegamenti a Google Fonts.
- Niente emoji, niente gradienti appariscenti, niente ombre pesanti, niente stock photo generiche.
- Le immagini mancanti si sostituiscono con segnaposto neutri e puliti, chiaramente sostituibili.
- Aree toccabili di almeno 44px.

## Animazioni
- Poche, lente, sobrie: comparsa graduale allo scroll (IntersectionObserver), hover discreti, transizioni di 600-800ms con easing cubic-bezier(0.22, 1, 0.36, 1).
- Nulla che sposti il layout.
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
