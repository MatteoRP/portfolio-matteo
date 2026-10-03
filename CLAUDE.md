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
- File: index.html, css/style.css, js/main.js, cartella assets/ per font (assets/fonts) e immagini (assets/img). riferimento-design.html è l'anteprima di design approvata: non fa parte del sito.
- Il sito deve funzionare aprendo la cartella su qualsiasi hosting statico gratuito (Cloudflare Pages, Netlify, GitHub Pages).
- Il sito deve restare leggibile anche senza JavaScript (JS solo come miglioramento).

## Design
Questa sezione sostituisce tutte le estetiche precedenti (nero caldo/avorio/oro, navy/champagne, nero e cobalto con reticolo a punti, Newsreader): non vanno più usate. L'anteprima approvata è riferimento-design.html: in caso di dubbio su colori, tipografia e impaginazione vale quella.
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop. Nessun overflow orizzontale a 390px.
- Stile: editoriale, scuro e caldo. Tipografia protagonista, molto spazio verticale, linee sottili al posto di riquadri e ombre, un solo accento. Mai tutto centrato; gerarchia diversa in ogni sezione.
- Palette (variabili CSS, definite una sola volta in :root): --bg #0B0B0A, --surface #131311, --fg #F2EEE6, --muted #BEBAB2, --line rgba(242,238,230,.16), --accent #E3D6BF (beige), --accent-ink #0B0B0A (testo sopra l'accento). Un solo accento: il beige. Niente blu, niente arancio, niente gradienti colorati, niente reticolo, niente vetro né backdrop-filter. color-scheme: dark; theme-color #0B0B0A.
- Font: self-hosted in assets/fonts, solo sottoinsieme latin, un file .woff2 per ogni peso (nessun font variabile con asse optical size), font-display: swap. I testi delle licenze sono in assets/fonts/licenses. Nessun collegamento a servizi esterni, nessun font proprietario o senza licenza pubblica.
  - Inter Tight 600/700/800: titoli.
  - Inter 400/500: testo.
  - Instrument Serif 400 e 400 corsivo: parole chiave.
  - Geist Mono 400/500: etichette.
  - Rock Salt 400 (Apache 2.0): annotazioni a gesso, previste nel passo del movimento. Dichiarato nel CSS ma ancora non usato.
  - Si precaricano solo tre file: Inter Tight 800, Inter 400, Instrument Serif corsivo. Ogni famiglia ha un fallback con size-adjust (Arial, Times New Roman, Courier New) per evitare salti di layout.
- Titoli: Inter Tight, 800 per h1 e 700 per h2, letter-spacing -0.035em, line-height circa 0.96, text-wrap: balance. Le parole chiave in Instrument Serif corsivo, colore accento, 1.08em: una o due parole per titolo, mai mezza frase. Nella hero e in "Scrivimi." il corsivo resta com'è.
- Etichette: Geist Mono maiuscolo, letter-spacing .12em, con una linea sottile davanti.
- Impaginazione: griglia asimmetrica. L'etichetta mono sta nella colonna stretta a sinistra, il contenuto è spostato a destra. Ogni sezione ha uno schema diverso dalle vicine:
  - "Cosa risolvo": un blocco unico senza filetti, con una frase grande in Inter Tight 700 e, di lato, il testo breve in colonna stretta.
  - "Il metodo, in numeri": i quattro passi in colonne affiancate (due per due su telefono), numeri 01-04 in Geist Mono, senza filetti a righe; la striscia 2 / 4 / 15 (settimane di calendario, pilastri, minuti della prima call), più piccola, subito sotto i passi, così le due cose si leggono come una sola sezione.
  - "Per chi lavoro": l'unica sezione costruita a righe con filetti.
- Navigazione: barra semplice e non fissa, nome a sinistra e "Scrivimi ↗" a destra (porta a #contatti).
- Hero: nessun pulsante. L'azione è la riga "Primo passo: call conoscitiva gratuita di 15 minuti", un link a #contatti con freccia SVG.
- Testo: corpo 18px con interlinea 1.6. Il testo di apertura di una sezione (lead) 19-24px, massimo 34em di larghezza.
- Leggibilità: nessun testo da leggere sotto 14px, etichette comprese. Eccezione: il testo dentro il telefono-mockup, che è interfaccia disegnata. Contrasto almeno 4.5:1 (3:1 se grande), misurato sul rendering reale e comprese le opacità degli elementi.
- Ritratto: contenitore 4:5 in bianco e nero (grayscale), sfumato verso il fondo con una mask, con assets/img/ritratto.webp. Finché il file non esiste si vede un segnaposto neutro (nessuna immagine rotta). width/height, loading lazy e alt descrittivo ("Matteo Rapeso, ritratto in bianco e nero").
- Telefono-mockup del caso studio: oggetto piatto con bordo beige sottile, senza vetro. Verrà rifatto nel passo del movimento.
- Niente emoji, niente stock photo generiche. Non copiare grafica, icone o marchi di nessuna azienda reale.
- Le immagini mancanti si sostituiscono con segnaposto neutri e puliti, chiaramente sostituibili.
- Aree toccabili di almeno 44px.
- Prestazioni: Lighthouse mobile con prestazioni almeno 90 (obiettivo 95) e accessibilità almeno 95.

## Movimento
Stato attuale: la pagina è statica. Ogni sezione compare nel suo stato finale: nessun reveal allo scroll, nessuna etichetta che si scrive, nessun numero che sale, nessuna luce o cursore animati. Il movimento è un passo successivo, definito in un prompt a parte; il riferimento-design.html ne mostra l'intenzione (ingresso dei titoli per parole, annotazioni a gesso, evidenziatore, luce beige, barra a segmenti, telefono fisso con passi).
- Sono ammessi solo i cambi di stato dell'interfaccia: hover, focus, pulsante attivo, cambio del post o del profilo nel telefono. Brevi (250-500ms), solo colore, opacità e transform; mai il layout.
- Rispetta sempre prefers-reduced-motion: se attivo, nessuna transizione.
- Con JavaScript disattivato il sito resta leggibile e completo.

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
