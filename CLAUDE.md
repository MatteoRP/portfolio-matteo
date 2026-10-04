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
- File: index.html, css/style.css, js/main.js, cartella assets/ per font (assets/fonts) e immagini (assets/img). Non ci sono anteprime di design nel repository: vale quanto scritto in questo file.
- Il sito deve funzionare aprendo la cartella su qualsiasi hosting statico gratuito (Cloudflare Pages, Netlify, GitHub Pages).
- Il sito deve restare leggibile anche senza JavaScript (JS solo come miglioramento).

## Design
Questa sezione sostituisce tutte le estetiche precedenti (nero caldo/avorio/oro, nero e cobalto con reticolo a punti, Geist Mono, Rock Salt in hero): non vanno più usate. In caso di dubbio su colori, tipografia e impaginazione vale quanto scritto qui. Riferimento d'umore (non da copiare): omney.io, cioè fondo crema chiaro con schede e popup scuri. Mai clonare grafica, testi o elementi di un'azienda reale.
- Mobile-first: quasi tutto il traffico arriverà da Instagram su telefono. Progetta prima per 390px di larghezza, poi adatta a tablet e desktop. Nessun overflow orizzontale a 390px.
- Stile: crema chiaro e blu navy, elegante, con molto spazio. Le sezioni alternano fondo crema e fondo blu. Il blu si usa anche per ciò che deve attirare l'attenzione: popup, schede, banner, pannelli, pillole attorno alla foto. Sfondi con sfumature molto delicate (mai gradienti netti), linee sottili, angoli arrotondati su schede e pulsanti.
- Colori (variabili CSS in :root, due "ruoli" che si alternano): scuro `--d-*` (bg #1A2A63, surface #223378, fg #F6F1E6, muted #CBD0E4, accent beige #EADFC8, accent-ink #1A2A63) e chiaro `--l-*` (bg #F7F2E8, fg/accent navy #1B2A5E / #1A2A63, muted #46527F, accent-ink crema). I nomi corti (--bg, --fg, --accent...) cambiano valore dentro `.sez-chiara` e `.nav` (chiaro) e dentro `.sez-scura`, `dialog`, `.pannello`, `.banner` (scuro). Il blu "Savoia" #3F57C4 è stato scartato: non usarlo come colore di testo. Luci: beige su sfondo scuro, blu (--glow-l) su sfondo chiaro.
- Gli sfondi sfumati stanno su `::before` (z-index -1) di ogni sezione, così la luce del cursore si vede sempre sopra di essi.
- Font: self-hosted in assets/fonts, solo sottoinsieme latin, un file .woff2 per ogni peso, font-display: swap, licenze in assets/fonts/licenses. Solo tre famiglie visibili: Inter Tight 600/700/800 (titoli), Inter 400/500 (testo, pulsanti, etichette in maiuscolo con spaziatura), Instrument Serif 400 e corsivo (solo parole chiave nei titoli). Rock Salt solo per le annotazioni a gesso di "Scrivimi" e della nota sotto il telefono. Nessun Geist Mono. Non usare Inter 600 (non c'è il file: verrebbe sintetizzato).
- Titoli: Inter Tight, 800 per h1 e 700 per h2, letter-spacing -0.035em, line-height circa 0.96-1, text-wrap: balance. Una o due parole per titolo (o la frase finale della hero) in Instrument Serif corsivo, colore --key (`.it`).
- Hero: pillola "Ciao, sono Matteo" separata dal titolo, titolo breve (circa 54px su desktop), un solo evidenziatore morbido sotto la frase chiave del titolo e uno sotto "non risultati inventati" (tratto blu tenue, il testo non cambia colore), pulsante "Scrivimi per la call gratuita" e link al caso studio. Il ritratto (4:5, bianco e nero, angoli arrotondati) ha tre pillole blu attorno (Audit, Strategia, Calendario: decorative). Se assets/img/ritratto.webp manca la figura sparisce (onerror) e la hero resta solo testo; senza JavaScript, in assenza del file, resta l'alt: pubblicare solo con la foto presente o togliere la figura.
- Pop-up: i dettagli (Come lavoro per ogni cliente, calendario, scheda, strategia, obiettivi, altri clienti, e "Scrivimi per la call gratuita") stanno in `<dialog>` blu con alone, aperti da pulsanti `[data-apri]`; si chiudono con X, Esc o clic fuori. Il pulsante della hero apre `#p-call` (primo passo in tre punti, email con mailto, pulsante Copia, link a Instagram); senza JavaScript il link porta a #contatti. Ogni popup ha un bagliore beige interno (`.pop-luce`) che segue il mouse; lo scorrimento sta in `.popup-in` (il dialog ha overflow hidden). I popup "Come lavoro" hanno la stessa lingua del sito: numero serif corsivo, parola chiave in serif corsivo, lead con filetto, due blocchi, filo dei 4 passi, pulsante finale. Senza JavaScript compaiono in chiaro dentro la pagina.
- Impaginazione: Chi sono è la seconda sezione. "Cosa risolvo": due schede blu. "Il metodo, in numeri": quattro passi, striscia 2 / 4 / 15 in un riquadro arrotondato e banner blu "Sono numeri del metodo, non risultati". "Per chi lavoro": tre schede animate (una per tipo di cliente) con un percorso di tre tappe che si disegna e un pulsante che apre il popup; sotto, il filo del metodo comune (4 passi). Caso studio: testata in scheda blu con etichetta "Progetto dimostrativo" e tre fatti, poi telefono sticky + pannello blu degli approfondimenti. Contatti: l'email è un link mailto con accanto un pulsante Copia (mailto non è affidabile ovunque, quindi l'indirizzo resta sempre visibile come testo).
- Navigazione: barra crema fissa in alto (con JavaScript), nome a sinistra, voci di menu, "Scrivimi" pieno blu a destra; su telefono menu a tendina. Dentro la barra, i segmenti "stories" che si riempiono con lo scroll.
- Testo: corpo 18px con interlinea 1.6 in Inter. Lead (`.lead`) in Instrument Serif corsivo, 22-29px, massimo 34em, con un sottile filetto verticale a sinistra, come nota discorsiva (stile letto in Omney, senza copiarlo). Il serif tondo per i testi di apertura è stato scartato: la distinzione è corsivo + filetto. Numeri grandi (`.n`, `.num`) in serif corsivo.
- Leggibilità: nessun testo da leggere sotto 14px, etichette comprese (eccezione: testo dentro il telefono-mockup). Contrasto almeno 4.5:1 (3:1 se grande), misurato sul rendering reale con le opacità, anche dentro popup, banner e pannelli (nel caso peggiore, cioè dove l'alone blu è al massimo).
- Telefono-mockup del caso studio: oggetto piatto con schermo chiaro (crema, testo navy) dentro una cornice blu navy, uguale in ogni sezione. Su telefono la cornice è chiusa anche in basso (nessuna sfumatura). Su desktop sta al centro verticale dello schermo; la didascalia esce dallo stage sotto i 900px di altezza. Su desktop il telefono si inclina leggermente a ogni stato (`data-tilt`, variabili `--ry/--rx/--k`, solo transform), mostra chip di annotazione ai lati (`.callouts`, solo da 1100px) e ha sette tacche di avanzamento (`.avanzamento`); griglia della storia 5fr/6fr da 1100px.
- Niente emoji, niente stock photo generiche. Le immagini mancanti si sostituiscono con segnaposto neutri e puliti.
- Aree toccabili di almeno 44px.
- Prestazioni: Lighthouse mobile con prestazioni almeno 90 (obiettivo 95) e accessibilità almeno 95.

## Sistema di movimento
Il sito si muove, ma con poche regole uguali per tutto. Ogni nuovo effetto deve rispettarle; se non ci sta, non si fa.

### Regole di ogni animazione
- Un solo easing: cubic-bezier(0.22, 1, 0.36, 1), variabile CSS --ease, usato da ogni transizione. Il JavaScript non ha curve proprie: usa solo l'interpolazione del puntatore (lerp) e la salita esponenziale dei numeri.
- Si animano solo transform e opacity. Unica eccezione: stroke-dashoffset per le linee a mano. Mai blur, backdrop-filter, filtri animati, né dimensioni o colori in transizione. Il cambio del colore del bagliore si fa con due strati sovrapposti che cambiano opacità.
- Budget: al massimo due animazioni continue visibili insieme (in pratica una: la luce della hero, che si ferma fuori schermo e a scheda nascosta). Tutto il resto parte da scroll, puntatore o tocco e si ferma da solo.
- Nessuno scroll-jacking. Il telefono del caso studio è "sticky".
- Ogni effetto da puntatore ha un equivalente al tocco (le righe di "Per chi lavoro" si attivano al centro dello schermo; cursore e bagliore esistono solo con mouse).
- prefers-reduced-motion: tutto è già nello stato finale, nessuna animazione continua, linee a mano già disegnate.
- Senza JavaScript il sito resta leggibile e completo: gli stati iniziali nascosti esistono solo sotto la classe .js sull'elemento radice. Il paracadute nell'<head> toglie .js se main.js non parte.

### Elementi del sistema
- Hero: menu che scende, titolo parola per parola con maschera, pillole attorno alla foto che compaiono una volta, evidenziatore che si stende da sinistra (un tratto per parola).
- Numeri 2 / 4 / 15: salgono da 0 con easing esponenziale, una sola volta. Schede, passi e banner entrano a scalare (opacità + traslazione).
- "Per chi lavoro": con il mouse la linea si disegna e il titolo scorre di 10px; al tocco la riga si attiva quando è al centro.
- Barra "stories" dentro il menu: un segmento per sezione principale (scaleX).
- Annotazioni a gesso (Rock Salt, minimo 20px): solo in "Scrivimi" (con freccia e cerchio attorno all'email) e sotto il telefono del caso studio. Testo completo in un elemento nascosto, lettere animate aria-hidden.
- Caso studio con telefono sticky: un solo telefono che cambia stato mentre si legge (massimo sette passi); elementi di ogni stato a scalare; l'anello dell'avatar si disegna nel "dopo"; la luce dietro il telefono pulsa a ogni cambio; la nota a gesso cambia a ogni passo. I passi non attivi sono al 70% (85% su fondo crema), non meno. Sugli schermi bassi (altezza sotto 900px) la didascalia "Mockup in CSS…" scorre col testo del primo passo; dentro il telefono restano "Esempio" (o "Profilo fittizio") e, in ogni post, l'avviso "Contenuto educativo, non consulenza finanziaria.". "Progetto dimostrativo: attività e dati fittizi" resta nella testata della sezione.
- Cursore ad anello e bagliore (solo mouse): l'anello segue con ritardo e si allarga su link, pulsanti e righe; dietro c'è una luce (circa 420px, z-index -1) che segue con ancora più ritardo. Il colore dipende dallo sfondo reale sotto il puntatore: beige su sfondo scuro (sezioni blu, popup), blu su sfondo chiaro (sezioni crema, menu). L'anello segue l'elemento sotto il puntatore (un riquadro blu dentro una sezione crema lo rende beige, un pulsante beige nel banner blu lo rende navy); il bagliore, che sta sotto tutto, segue lo sfondo della sezione. Si aggiorna anche scorrendo con il mouse fermo. Nella hero il bagliore del cursore si spegne perché c'è già la luce della hero. La decisione del colore è presa per elemento sotto il puntatore (classe, poi sfondo opaco calcolato) sia per l'anello sia per il bagliore, a ogni movimento e a ogni scroll; i riquadri blu hanno lo sfondo su `::before` così il bagliore si vede sopra di essi. Dentro i popup c'è in più il bagliore interno `.pop-luce`.
- Il ritratto non ha parallasse.

### Accessibilità e prestazioni del movimento
- Le lettere animate sono aria-hidden e il testo intero sta in una copia nascosta; niente aria-live sulle note che cambiano.
- Nessun testo sotto 14px (le annotazioni a gesso partono da 20px); contrasto misurato sul rendering reale, anche per i passi non attivi.
- Aree toccabili di almeno 44px; nessun overflow orizzontale a 390px.
- Lighthouse mobile con prestazioni almeno 90. A ogni passo di movimento si misura: Lighthouse, registrazione dello scroll in Chromium con CPU rallentata 4x e, se installabile, anche WebKit. Niente filtri SVG sulle scritte e sulle linee a mano.

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
