/* eslint-disable @typescript-eslint/no-unused-vars */
// Markeer als client component — vereist voor React hooks
"use client"

// Geïnspireerd door de react-hot-toast bibliotheek
import * as React from "react"

// Importeer de types voor toast acties en props
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Maximum aantal gelijktijdig zichtbare toasts
const TOAST_LIMIT = 1
// Vertraging in milliseconden voordat een toast uit de state wordt verwijderd
// Hoge waarde zodat de uittrede animatie kan afspelen voordat de state wordt opgeruimd
const TOAST_REMOVE_DELAY = 1000000

// Type definitie voor een toast met alle mogelijke eigenschappen
type ToasterToast = ToastProps & {
  id: string                         // Unieke identifier voor de toast
  title?: React.ReactNode            // Optionele koptekst van de toast
  description?: React.ReactNode      // Optionele beschrijvende tekst
  action?: ToastActionElement        // Optionele actieknop in de toast
}

// Actietypes voor de toast reducer — beheert de toast state machine
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",        // Voeg een nieuwe toast toe
  UPDATE_TOAST: "UPDATE_TOAST",  // Update een bestaande toast
  DISMISS_TOAST: "DISMISS_TOAST", // Verberg een toast (met animatie)
  REMOVE_TOAST: "REMOVE_TOAST",  // Verwijder een toast uit de state
} as const

// Teller voor het genereren van unieke toast ID's
let count = 0

// Genereer een uniek incrementeel ID voor elke nieuwe toast
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Type alias voor de actietypes object
type ActionType = typeof actionTypes

// Union type voor alle mogelijke reducer acties
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>  // Gedeeltelijke update — niet alle velden vereist
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]  // Optioneel — als undefined, verberg alle toasts
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]  // Optioneel — als undefined, verwijder alle toasts
    }

// State type voor de toast reducer
interface State {
  toasts: ToasterToast[]  // Lijst van actieve toasts
}

// Map van toast ID's naar hun verwijder-timers
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Voeg een toast toe aan de verwijderwachtrij na een vertraging
// Voorkomt dubbele timers voor dezelfde toast
const addToRemoveQueue = (toastId: string) => {
  // Sla over als er al een timer loopt voor deze toast
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Stel een timer in om de toast na de vertraging te verwijderen
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  // Sla de timer op zodat we hem later kunnen annuleren indien nodig
  toastTimeouts.set(toastId, timeout)
}

// Pure reducer functie voor het beheren van de toast state
// Behandelt alle CRUD operaties op de toastslijst
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Voeg nieuwe toast toe aan het begin van de lijst en begrens het aantal
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      // Update de eigenschappen van een bestaande toast op basis van ID
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Neveneffecten ! - Dit kan worden uitgesplitst in een dismissToast() actie,
      // maar wordt hier gehouden voor de eenvoud
      if (toastId) {
        // Verberg één specifieke toast
        addToRemoveQueue(toastId)
      } else {
        // Verberg alle toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Markeer de toast(s) als gesloten voor de uittrede animatie
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,  // Triggert de sluit-animatie van de toast
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // Verwijder alle toasts als geen ID opgegeven
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      // Verwijder één specifieke toast op basis van ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Lijst van luisteraars die worden bijgewerkt bij state wijzigingen
const listeners: Array<(state: State) => void> = []

// Globale in-geheugen state voor toasts — gedeeld tussen alle useToast instanties
let memoryState: State = { toasts: [] }

// Dispatch een actie naar de reducer en informeer alle luisteraars
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Type voor het aanmaken van een nieuwe toast (zonder het auto-gegenereerde ID)
type Toast = Omit<ToasterToast, "id">

// Maak en toon een nieuwe toast notificatie
// Geeft object terug met id, dismiss en update functies
function toast({ ...props }: Toast) {
  // Genereer een uniek ID voor deze toast
  const id = genId()

  // Update functie — past de eigenschappen van deze specifieke toast aan
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  // Verberg functie — sluit deze specifieke toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Voeg de toast toe aan de state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Verberg de toast automatisch als de gebruiker hem sluit
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Geef controle-functies terug voor externe beheer van de toast
  return {
    id: id,
    dismiss,
    update,
  }
}

// React hook voor het abonneren op de toast state
// Registreert een luisteraar die de component bijwerkt bij state wijzigingen
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Registreer de setState als luisteraar voor state-updates
    listeners.push(setState)
    return () => {
      // Verwijder de luisteraar bij het opruimen van het component
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Geef de huidige state en controle-functies terug
  return {
    ...state,
    toast,
    // Dismiss helper — kan worden aangeroepen met een optioneel toast ID
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

// Exporteer de hook en de toast functie voor gebruik in componenten
export { useToast, toast }
