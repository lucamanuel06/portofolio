// Importeer clsx voor het combineren van conditionele CSS-klassen
import { ClassValue, clsx } from "clsx";
// Importeer twMerge voor het samenvoegen van Tailwind CSS klassen zonder conflicten
import { twMerge } from "tailwind-merge";

// Hulpfunctie voor het combineren van Tailwind CSS klassen
// Combineert clsx (conditionele klassen) en tailwind-merge (conflictoplossing)
// Gebruik: cn("px-4 py-2", isActive && "bg-blue-500", className)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
