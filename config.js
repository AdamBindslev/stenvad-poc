/**
 * Konfiguration for Mosebrugsudstilling - Proof of Concept
 * 
 * Her kan du nemt tilføje/ændre punkter, ændre videoer fra YouTube til lokale videofiler,
 * og tilpasse tidsindstillinger for udstillingsskærmen.
 */
const EXHIBITION_CONFIG = {
  title: "Mosebrugsudstilling",
  subtitle: "Proof of Concept · Djursland",
  instruction: "Tryk på et markeret punkt på kortet for at afspille video",

  // Kiosk-indstillinger
  kiosk: {
    // Luk automatisk video efter inaktivitet (sekunder). Sæt til 0 for at deaktivere.
    idleTimeoutSeconds: 180,
    // Bloker højreklik på touchskærmen
    preventContextMenu: true,
  },

  // De 3 markerede punkter på kortet
  locations: [
    {
      id: "point-1",
      number: 1,
      title: "Norddjurs Moseområde",
      description: "Historisk tørveindvinding og natur i det nordøstlige Djursland.",
      // Koordinater i procent af kortets dimensioner (fundet via præcis billedanalyse)
      x: 72.60,
      y: 13.78,
      video: {
        type: "local",
        localSrc: "assets/videos/Stenvad.mp4"
      }
    },
    {
      id: "point-2",
      number: 2,
      title: "Stenvad Mosebrug",
      description: "Centrum for mosebruget og tørveproduktionen på Djursland.",
      x: 55.40,
      y: 19.91,
      video: {
        type: "local",
        localSrc: "assets/videos/Stenvad.mp4"
      }
    },
    {
      id: "point-3",
      number: 3,
      title: "Kolind Sund & Ryomgård Mose",
      description: "Afvandingen af sundet og udnyttelsen af de store tørvemoser.",
      x: 44.74,
      y: 37.19,
      video: {
        type: "local",
        localSrc: "assets/videos/Stenvad.mp4"
      }
    }
  ]
};
