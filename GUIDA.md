# La Spesa: guida per ottenere l'APK

Questo progetto è l'app della spesa (liste, icone, categorie, quantità, sezione «In casa») pronta per diventare un file `LaSpesa.apk` da installare sui due telefoni Android. Le liste si sincronizzano in tempo reale tramite un tuo progetto Firebase gratuito. L'APK viene costruito da GitHub, quindi **non serve Android Studio**.

Tempo necessario: circa 30-40 minuti la prima volta. Serve un account Google e un account GitHub (entrambi gratuiti).

---

## 1. Crea il progetto Firebase

1. Vai su https://console.firebase.google.com e accedi con il tuo account Google.
2. **Crea un progetto** → nome `la-spesa` → Continua → **disattiva** Google Analytics → Crea progetto.

## 2. Crea il database (Firestore) e le regole

1. Nel menu a sinistra apri **Build → Firestore Database → Crea database**.
2. Posizione: scegli una località in **Europa** (es. `eur3`). Poi **Avvia in modalità produzione** → Crea.
3. Apri la scheda **Regole**, cancella tutto il testo e incolla il contenuto del file `firestore.rules` di questo progetto. Premi **Pubblica**.

## 3. Attiva l'accesso anonimo

1. Menu a sinistra: **Build → Authentication → Inizia**.
2. Scheda **Metodo di accesso** → **Anonimo** → attiva → **Salva**.

## 4. Copia i valori dell'app web

1. Clicca l'ingranaggio accanto a «Panoramica del progetto» → **Impostazioni progetto**.
2. In fondo, in «Le tue app», clicca l'icona **`</>`** (Web). Nickname: `spesa`. **Non** spuntare Firebase Hosting. Premi **Registra app**.
3. Comparirà un blocco `const firebaseConfig = { ... }`.
4. Sul tuo computer apri il file **`src/firebase-config.js`** con un editor di testo (Blocco note va bene) e sostituisci ogni `INCOLLA_QUI` con il valore corrispondente (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). Tieni le virgolette. Salva.

Questi valori non sono segreti: la protezione dei dati è data dalle regole di Firestore e dal codice famiglia.

## 5. Carica il progetto su GitHub

1. Su https://github.com crea un account (o accedi) → **New repository** → nome `spesa` → **Private** → Create repository.
2. Nella pagina del nuovo repository clicca **uploading an existing file**.
3. Trascina dentro **tutto il contenuto della cartella** del progetto (non la cartella stessa), comprese le cartelle `.github`, `keystore`, `icons`, `scripts`, `src` e i file `package.json`, `capacitor.config.json`, `firestore.rules`, `.gitignore`.
   - Su Mac le cartelle che iniziano col punto sono nascoste: premi `Cmd + Maiusc + .` nel Finder per vederle.
   - Se `.github` non risulta caricata (lo vedi dall'elenco dei file prima del commit), dopo il commit usa **Add file → Create new file**, scrivi come nome `.github/workflows/build-apk.yml` (digitando le `/` si creano le cartelle), incolla il contenuto del file corrispondente e conferma con **Commit changes**.
4. Premi **Commit changes**.

## 6. Scarica l'APK

1. Nel repository apri la scheda **Actions**: vedrai la lavorazione «Crea APK». Dura circa 6-10 minuti. Quando compare la spunta verde è pronta.
2. Torna alla pagina principale del repository: nella colonna destra, sotto **Releases**, clicca **La Spesa - build 1** e scarica **`LaSpesa.apk`** da «Assets». (Lo trovi anche nella pagina della lavorazione, sezione «Artifacts», dentro uno zip.)

Se compare una **X rossa**: apri la lavorazione, clicca il passaggio in rosso e copia l'errore che vedi. Se non sai come risolverlo, mandalo a Claude.

## 7. Installa sui due telefoni

1. Apri la pagina della release dal telefono (con Chrome, accedendo a GitHub) e tocca `LaSpesa.apk`. In alternativa scaricalo sul computer e passalo ai telefoni con cavo, Google Drive o WhatsApp.
2. Apri il file scaricato. Android chiederà di consentire l'installazione da questa fonte: attiva il permesso solo per quell'app (Chrome, File, WhatsApp...).
3. Se compare l'avviso di Play Protect (app non verificata), tocca **Installa comunque**: è normale per un'app che non viene dal Play Store.

## 8. Primo avvio e codice famiglia

- **Telefono 1:** tocca **Crea una nuova famiglia**. Compare un codice come `AB3K-9XMP-72QD-HNTR`: copialo e mandalo a tua moglie.
- **Telefono 2:** scrive lo stesso codice e tocca **Entra con il codice**.
- Da quel momento vedete le stesse liste. Il codice si rivede in ogni momento dal pulsante **Codice** in alto a destra nella schermata delle liste.
- Il codice è la chiave delle vostre liste: non pubblicarlo.

---

## Come aggiornare l'app in futuro

Ogni volta che modifichi un file su GitHub (matita ✎ → Commit changes) parte una nuova costruzione e compare un nuovo APK nelle Releases. Installalo sopra quello vecchio: la firma è sempre la stessa, quindi l'app si aggiorna senza perdere nulla. Le liste sono salvate online.

## Cose utili da sapere

- **Offline:** l'app funziona anche senza rete (per esempio nel supermercato). Le modifiche si sincronizzano appena torna il segnale. In alto compare «Sincronizzata» oppure «Offline».
- **Costi:** Firebase (piano gratuito) e GitHub Actions (cartelle private: 2000 minuti al mese gratis) bastano largamente per due persone.
- **Le liste della versione di prova su claude.ai** non vengono trasferite in questa app: i dati sono in un database diverso.
- **Caratteri calligrafici:** si scaricano da Google Fonts al primo avvio con la rete e restano nella memoria del telefono. Senza rete al primo avvio vedrai un corsivo di riserva.
- Questo APK è firmato con una chiave di debug, adatta all'uso privato ma non alla pubblicazione sul Play Store.
