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
- File: index.html, css/style.css, js/main.js, cartella assets/ per font (assets/fonts) e immagini (assets/img). L'anteprima di design usata come riferimento (riferimento-design.html) è stata rimossa dal repository: vale quanto scritto in questo file.
- Il sito deve funzionare aprendo la cartella su qualsiasi hosting statico gratuito (Cloudflare Pages, Netlify, GitHub Pages).
- Il sito deve restare leggibile anche senza JavaScript (JS solo come miglioramento).

## Design
Questa sezione sostituisce tutte le estetiche precedenti (nero caldo/avorio/oro, navy/champagne, nero e cobalto con reticolo a punti, Newsreader): non vanno più usate. In caso di dubbio su colori, tipografia e impaginazione vale quanto scritto qui.
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop. Nessun overflow orizzontale a 390px.
- Stile: editoriale, scuro e caldo. Tipografia protagonista, molto spazio verticale, linee sottili al posto di riquadri e ombre, un solo accento. Mai tutto centrato; gerarchia diversa in ogni sezione.
- Palette (variabili CSS, definite una sola volta in :root): --bg #0B0B0A, --surface #131311, --fg #F2EEE6, --muted #BEBAB2, --line rgba(242,238,230,.16), --accent #E3D6BF (beige), --accent-ink #0B0B0A (testo sopra l'accento). Un solo accento: il beige. Niente blu, niente arancio, niente gradienti colorati, niente reticolo, niente vetro né backdrop-filter. color-scheme: dark; theme-color #0B0B0A.
- Font: self-hosted in assets/fonts, solo sottoinsieme latin, un file .woff2 per ogni peso (nessun font variabile con asse optical size), font-display: swap. I testi delle licenze sono in assets/fonts/licenses. Nessun collegamento a servizi esterni, nessun font proprietario o senza licenza pubblica.
  - Inter Tight 600/700/800: titoli.
  - Inter 400/500: testo.
  - Instrument Serif 400 e 400 corsivo: parole chiave.
  - Geist Mono 400/500: etichette.
  - Rock Salt 400 (Apache 2.0): annotazioni a gesso (vedi Sistema di movimento).
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
- Telefono-mockup del caso studio: oggetto piatto con bordo beige sottile, senza vetro; il suo funzionamento è descritto in Sistema di movimento.
- Niente emoji, niente stock photo generiche. Non copiare grafica, icone o marchi di nessuna azienda reale.
- Le immagini mancanti si sostituiscono con segnaposto neutri e puliti, chiaramente sostituibili.
- Aree toccabili di almeno 44px.
- Prestazioni: Lighthouse mobile con prestazioni almeno 90 (obiettivo 95) e accessibilità almeno 95.

## Sistema di movimento
Il sito si muove, ma con poche regole uguali per tutto. Ogni nuovo effetto deve rispettarle; se non ci sta, non si fa.

### Regole di ogni animazione
- Un solo easing: cubic-bezier(0.22, 1, 0.36, 1), definito una sola volta come variabile CSS (--ease) e usato da ogni transizione e animazione CSS. Il JavaScript non ha curve proprie: usa solo l'interpolazione del puntatore (lerp) e la salita esponenziale dei numeri.
- Una sola luce: il beige (--accent). Nessun altro colore che si accende o si muove.
- Si animano solo transform e opacity. Unica eccezione: stroke-dashoffset, per le linee disegnate a mano (frecce, cerchio, anello dell'avatar). Mai blur, backdrop-filter, filtri animati, né dimensioni (width, height, margin, top, left...) o colori di sfondo/testo in transizione.
- Budget: al massimo due animazioni continue visibili insieme (in pratica una sola: la luce ambiente della hero, che si ferma fuori schermo e a scheda nascosta). Il carosello nel telefono parte una volta e non va in loop. Tutto il resto parte da scroll, puntatore o tocco, e si ferma da solo.
- Nessuno scroll-jacking: lo scroll resta quello del browser. Il telefono del caso studio è "sticky", non intercetta la rotella.
- Ogni effetto da puntatore ha un equivalente al tocco (le righe di "Per chi lavoro" si attivano al centro dello schermo; cursore ad anello e luce che segue il mouse esistono solo con mouse).
- prefers-reduced-motion: ogni cosa è già nello stato finale, nessuna animazione continua, le linee a mano sono già disegnate, il telefono mostra lo stato del passo che si sta leggendo senza transizioni.
- Senza JavaScript il sito resta leggibile e completo: gli stati iniziali nascosti (opacità 0, parole sotto la maschera, ecc.) esistono solo sotto la classe .js sull'elemento radice. Il paracadute nell'<head> toglie .js se main.js non parte.

### Elementi del sistema
- Hero: titolo parola per parola con maschera, barra in alto che scende, etichetta mono che si scrive con cursore lampeggiante (lampeggio finito, non infinito), evidenziatore beige sotto "non risultati inventati" che inverte il colore del testo.
- Luce unica dietro il titolo: respira da sola (26 s); con il mouse segue il puntatore con interpolazione, un solo aggiornamento per frame.
- Striscia 2 / 4 / 15: i numeri salgono da 0 con easing esponenziale, una sola volta. "Cosa risolvo" e le quattro colonne dei passi entrano a scalare (opacità + traslazione, 80 ms tra una colonna e l'altra).
- "Per chi lavoro": con il mouse la linea beige si disegna e il titolo scorre di 10px; al tocco la riga si attiva quando è al centro dello schermo.
- Barra "stories" fissa in alto: un segmento per sezione principale, si riempie con lo scroll (scaleX). Sostituisce ogni altra barra di avanzamento.
- Annotazioni a gesso (Rock Salt, minimo 20px, beige pieno): scritte lettera per lettera senza spezzare le parole, con frecce e cerchio disegnati via stroke-dashoffset. Solo dove previste: hero ("ciao, sono Matteo"), metodo ("metodo, non risultati"), contatti ("scrivimi qui", con cerchio attorno all'email) e sotto il telefono del caso studio. Ogni annotazione ha il testo completo in un elemento visivamente nascosto; le lettere animate sono aria-hidden.
- Caso studio con telefono sticky: un solo telefono che cambia stato mentre si legge (bio prima, bio dopo, i quattro post, calendario: massimo sette passi). Gli elementi di ogni stato entrano a scalare; l'anello dell'avatar si disegna nel "dopo"; le celle del calendario si accendono in sequenza; la luce dietro il telefono pulsa una volta a ogni cambio; la nota a gesso sotto il telefono cambia a ogni passo. Su schermi stretti il telefono resta fisso in alto, tagliato in basso con una sfumatura, e i passi scorrono sotto. I passi non attivi stanno al 70% di opacità, non meno. I post del caso studio hanno solo la copertina (non esistono testi di slide): il carosello che scorre una volta nel telefono si aggiunge quando quei testi esistono, senza inventarli. Scheda, strategia e approfondimenti restano sotto, nello stile attuale, con solo la comparsa allo scroll.
- Cursore ad anello (solo mouse): l'anello segue con ritardo e si allarga su link, pulsanti e righe; dietro c'è una luce beige (gradiente radiale accento 24% → trasparente 66%, circa 420px) che segue con ancora più ritardo, sotto il testo (z-index -1), più grande e intensa sugli elementi interattivi. Solo transform e opacità, un aggiornamento per frame. Il cursore di sistema non si nasconde. Nella hero il bagliore del cursore si spegne, perché lì c'è già la luce della hero (una sola luce alla volta).
- Ritratto "Chi sono": leggero parallasse (solo transform), per ora applicato al segnaposto.

### Accessibilità e prestazioni del movimento
- Le lettere animate sono aria-hidden e il testo intero sta in una copia visivamente nascosta; niente aria-live sulle note che cambiano.
- Nessun testo sotto 14px (le annotazioni a gesso partono da 20px); contrasto misurato sul rendering reale, con le opacità, anche per i passi non attivi (70%).
- Aree toccabili di almeno 44px; nessun overflow orizzontale a 390px.
- Lighthouse mobile con prestazioni almeno 90. A ogni passo di movimento si misura: Lighthouse, registrazione dello scroll in Chromium con CPU rallentata 4x (frame persi) e, se installabile, anche WebKit. Niente filtri SVG sulle scritte e sulle linee a mano: il filtro "gesso" (feTurbulence + feDisplacementMap) è stato provato e tolto, perché faceva perdere frame nell'ingresso della hero con CPU rallentata 4x e a occhio non cambiava il risultato.

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
