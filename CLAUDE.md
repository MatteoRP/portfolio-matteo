# Progetto: portfolio personale di Matteo Rapeso

## Chi è e a cosa serve
Matteo Rapeso è un social media manager alle prime armi. Si occupa di strategia e contenuti per profili social e si rivolge a tre tipi di cliente: creator (es. YouTuber), attività locali (es. barbieri, ristoranti, hotel) e startup/brand digitali. Il sito è una pagina unica che metterà nella bio di Instagram (@matteorapeso). Contatto: rapeso.matteo@gmail.com.
Obiettivo del sito: convincere un creator, il titolare di un'attività locale o il fondatore di una startup a scrivergli. Il sito deve dimostrare competenza di social media management (strategia, contenuti, metodo), non di sviluppo web.

## Posizionamento (nessun target unico)
- Il posizionamento poggia sul tipo di problema che risolve, non sul settore: (1) rendere riconoscibile un profilo; (2) trasformare l'attenzione in contatti, prenotazioni o iscrizioni.
- Tre tipi di cliente, un solo metodo: cambiano canali e obiettivo, non il modo di ragionare.
- Il design è elegante e tecnico (vedi sezione Design), ma i contenuti non richiamano un solo settore.
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
Questa sezione sostituisce le estetiche precedenti (nero caldo/avorio/oro e navy/champagne): non vanno più usate.
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop. Nessun overflow orizzontale a 390px.
- Stile: sistema "nero e cobalto con reticolo a punti". Elegante, tipografia protagonista, molto spazio vuoto, una idea per schermata, bordi sottili, nessuna ombra pesante.
- Palette (variabili CSS): sfondo #06070B (nero); testo #F3F1EC; testo secondario = lo stesso colore a opacità 0.74; un solo accento cobalto #5C8DFF (contrasto 6,4:1 sullo sfondo). Nessun altro colore e nessuna luce di altro colore.
- Superfici piatte: rgba(255,255,255,0.03) con bordo 1px rgba(255,255,255,0.09). Valgono per scheda del caso studio, strategia, strisce del calendario e simili.
- Vetro ("liquid glass"): backdrop-filter con il prefisso -webkit-backdrop-filter, SOLO sul telefono-mockup e sulla navigazione a pillola. Fallback con sfondo semi-opaco dove backdrop-filter non è supportato; con prefers-reduced-transparency il vetro diventa nero pieno. Non animare mai blur o backdrop-filter.
- Reticolo di sfondo, solo CSS, nessuna immagine. Strato base (fisso, grande quanto lo schermo): celle da 28px, punti bianchi agli incroci (1,2px, bianco al 55%), linee quasi invisibili (4,5%), un punto più grande ogni 112px (2px, bianco al 95%), dissolto verso i bordi con una maschera radiale ellittica (anche con -webkit-mask-image). Il reticolo è forte solo nella hero e negli spazi tra le sezioni; dietro ai contenuti (paragrafi, schede, calendario, caso studio, contatti) un velo nero al 74% con bordi sfumati lo porta a punti al 14% e punti grandi al 25%, con linee quasi invisibili. Il velo sta sopra al reticolo e sotto alla lente.
- Lente cobalto, solo in hero e nel caso studio: lo stesso reticolo con punti cobalto (2,3px) e linee cobalto al 40%, visibile solo in un cerchio di 170px. Nella hero è ferma in alto a destra (variabili --mx e --my). Nel caso studio c'è solo con il mouse (la crea e la muove JavaScript). Sul touch esiste solo nella hero. Il testo piccolo in cobalto (etichette, cifre, giorni del calendario) ha sempre un fondo piatto pieno dietro (variabile --fondo-piatto), così né i punti né la lente gli passano sotto.
- Luce ambiente: una macchia radiale cobalto (300px) dietro al contenuto, più una luce fissa dietro a ciascun telefono, perché il vetro abbia qualcosa da sfocare.
- Hero: la parola chiave in corsivo ha una sfumatura dal bianco al cobalto (con fallback a colore pieno cobalto); si torna al colore pieno se la sfumatura riduce la leggibilità. Etichette in cobalto con un quadratino davanti. Pulsante principale con bordo cobalto; hover e focus: fondo cobalto al 16% e alone.
- Contrasto: il testo deve avere almeno 4.5:1 (3:1 se grande) su ogni sfondo, misurato sul rendering reale (testo nascosto, pagina scorsa a tratti, pixel dietro a ogni elemento). Il criterio di verifica è il pixel più chiaro dello sfondo dopo aver escluso il 3% di pixel più luminosi (i singoli punti del reticolo, 1-4px); il caso peggiore assoluto (un punto dietro una lettera) si riporta a parte. Obiettivo: nessun testo piccolo sotto 4.5:1 con questo criterio.
- Tipografia: titoli molto grandi in Cormorant Garamond (con clamp()), testo in Inter 17-18px, massimo 65 caratteri per riga.
- Font: Cormorant Garamond per i titoli, Inter per il testo. Usali in locale (self-hosted in assets/fonts), senza collegamenti a Google Fonts.
- Niente emoji, niente stock photo generiche. Non copiare grafica, icone o marchi di nessuna azienda reale.
- Le immagini mancanti si sostituiscono con segnaposto neutri e puliti, chiaramente sostituibili.
- Aree toccabili di almeno 44px.
- Prestazioni: pochi layer, mai animati; Lighthouse mobile con prestazioni almeno 90.

## Animazioni
- Poche, lente, sobrie: comparsa graduale allo scroll (IntersectionObserver), hover discreti, transizioni di 600-800ms con easing cubic-bezier(0.22, 1, 0.36, 1).
- Nulla che sposti il layout.
- Rispetta sempre prefers-reduced-motion (se attivo, nessuna animazione).
- Animare solo transform e opacity, per non rallentare i telefoni.

## Qualità richiesta
- Accessibilità: HTML semantico, contrasto sufficiente, focus visibile, testo alternativo alle immagini, navigabile da tastiera.
- Prestazioni: nessuna libreria esterna salvo necessità motivata, immagini ottimizzate e con loading="lazy", obiettivo Lighthouse 95+ su mobile.
- SEO e condivisione: title, meta description, Open Graph (compresi og:image e og:url), favicon, meta theme-color uguale al colore di sfondo.
- Indirizzo pubblico: https://matteorp.github.io/portfolio-matteo/ (pagina di progetto su GitHub Pages, quindi in una sottocartella). Tutti i percorsi nei file sono relativi; fanno eccezione og:image e og:url, che richiedono l'indirizzo assoluto.
- Privacy: nessun cookie, nessun tracker, nessun form con backend. Il contatto avviene via link mailto e link a Instagram.

## Modo di lavorare
- Fai un passo alla volta, spiegami in 2-3 righe cosa hai fatto e come lo verifico nel browser.
- Se una mia richiesta peggiora il risultato (design, prestazioni, chiarezza), dimmelo subito e proponi l'alternativa migliore.
- Distingui ciò che sai da ciò che ipotizzi.
- Commenta il codice in italiano, in modo semplice: sono un principiante e voglio capirlo.
