// Importeer React voor het gebruik van hooks
import * as React from "react";

// Breekpunt in pixels waaronder een scherm als mobiel wordt beschouwd
const MOBILE_BREAKPOINT = 768;

// Custom hook die detecteert of het huidige scherm een mobiel apparaat is
// Luistert naar venstergrootte-wijzigingen en werkt de state bij
export function useIsMobile() {
  // State voor de mobiele status — begint als undefined totdat de eerste meting is gedaan
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Maak een MediaQueryList aan die luistert naar schermbreedtewijzigingen
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Callback die wordt aangeroepen als de schermgrootte het breekpunt kruist
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Registreer de event listener voor schermgrootte-wijzigingen
    mql.addEventListener("change", onChange);

    // Stel de initiële waarde in op basis van de huidige schermgrootte
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Verwijder de event listener bij het opruimen van het component
    return () => mql.removeEventListener("change", onChange);
  }, []); // Lege dependency array: alleen uitvoeren bij eerste render

  // Converteer undefined naar false met de !! operator voor een stabiele booleaan waarde
  return !!isMobile;
}
