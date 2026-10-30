# Mosebrugsudstilling – Proof of Concept

Interaktiv skærmapplikation (PWA / Kiosk) udviklet til **Stenvad Mosebrugscenter** til formidling af historiske lokationer på Djursland.

Applikationen præsenterer et historisk Geodætisk Institut-kort over Djursland, hvor publikum kan trykke på markerede lokationer for at åbne en lightbox og se tilhørende videoer.

---

## 🌟 Nøglefunktioner

- **Skræddersyet Kiosk UI:** Ingen scrollbars af nogen art, 100% fullscreen-visning, tilpasset touchskærme uden uønskede browser-menuer.
- **Interaktive Hotspots:** 3 præcist placerede, pulserende markører oven på kortets røde punkter (Norddjurs, Stenvad Mosebrug og Kolind Sund).
- **Video Lightbox:** Stor, brugervenlig visning af video med tydelig touch-lukkeknap og automatisk stop af lyd ved lukning.
- **PWA & Offline-parat:** Udstyret med Service Worker og Web Manifest (`manifest.webmanifest`). Kan installeres som lokal app på udstillingsmaskinen.
- **Forberedt til lokale videofiler:** I denne Proof of Concept afspilles video via YouTube, men konfigurationen er forberedt til, at videoerne kan lægges som lokale MP4-filer i `assets/videos/`, så udstillingen kan køre 100% offline uden internet.
- **Inaktivitets-timer:** Hvis en gæst forlader skærmen med en åben video, nulstiller visningen automatisk efter 3 minutter (konfigurerbart), så kortet er klar til næste gæst.

---

## 📂 Filstruktur

```text
stenvad-poc/
├── assets/
│   ├── icon-192.png       # PWA ikon (192x192)
│   ├── icon-512.png       # PWA ikon (512x512)
│   ├── logo.png           # Stenvad Mosebrug logo
│   ├── map.jpg            # Originalkort over Djursland
│   └── videos/            # Mappe til fremtidige lokale MP4/WebM videofiler
├── app.js                 # Applikationslogik, hotspots, lightbox og fuldskærm
├── config.js              # Punkter, koordinater, videotitler og kiosk-indstillinger
├── index.html             # Kiosk markup og layout
├── manifest.webmanifest   # PWA manifest
├── styles.css             # Æstetisk museumsstil, responsive layout uden scrollbars
└── sw.js                  # Service Worker til offline caching
```

---

## 🚀 Kør lokalt

Da applikationen benytter PWA Service Worker og moderne browser-APIs, bør den åbnes via en lokal webserver:

### Mulighed 1: Python (indbygget på Mac/Linux/Windows)
Kør i terminalen fra projektmappen:
```bash
python3 -m http.server 8080
```
Åbn derefter din browser på: [http://localhost:8080](http://localhost:8080)

### Mulighed 2: Node.js (npx serve)
```bash
npx serve .
```

---

## 📺 Udstillingsopsætning (Kiosk-mode på berøringsskærm)

For at sikre, at publikum ikke kan lukke browseren, åbne adresselinjen eller forlade fuld skærm under udstillingen, anbefales det at starte browseren i dedikeret **Kiosk-mode**:

### Google Chrome (Mac)
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --check-for-update-interval=31536000 \
  "http://localhost:8080"
```

### Google Chrome (Windows)
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --kiosk ^
  --noerrdialogs ^
  --disable-infobars ^
  "http://localhost:8080"
```

### Som installeret PWA
Du kan også blot trykke på installationsikonet i browserens adresselinje for at installere "Mosebrug POC" direkte på skrivebordet. Den vil derefter åbne i sit eget selvstændige vindue uden browserknapper.

---

## ⚙️ Sådan tilpasses videoer og lokationer

Alle punkter og videoer styres centralt i `config.js`:

```javascript
// config.js
locations: [
  {
    id: "point-2",
    number: 2,
    title: "Stenvad Mosebrug",
    description: "Centrum for mosebruget og tørveproduktionen på Djursland.",
    x: 55.40, // X-position i procent på kortet
    y: 19.91, // Y-position i procent på kortet
    video: {
      type: "youtube", // Skift til "local" for offline fil
      youtubeId: "DLzxrzFCyOs",
      localSrc: "assets/videos/stenvad.mp4"
    }
  }
]
```

### Skift til 100% offline video:
1. Læg dine MP4- eller WebM-videofiler i mappen `assets/videos/`
2. I `config.js`, ret `type: "youtube"` til `type: "local"`
3. Angiv filstien i `localSrc` (fx `"assets/videos/stenvad.mp4"`)
4. Udstillingsskærmen kører nu helt uafhængigt af internetforbindelse!

---

## 🌐 Git & GitHub Repository

Dette projekt er forbundet til:
[https://github.com/AdamBindslev/stenvad-poc](https://github.com/AdamBindslev/stenvad-poc)

### Push til GitHub:
```bash
git add .
git commit -m "Initial Proof of Concept: Mosebrugsudstilling interaktiv skærm"
git push -u origin main
```
