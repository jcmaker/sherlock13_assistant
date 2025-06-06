import { Character, IconType } from "@/types";
import {
  Cigarette,
  Lightbulb,
  Hand,
  Medal,
  Book,
  Gem,
  Eye,
  Skull,
} from "lucide-react";

export const ICONS: IconType[] = [
  "Cigarette",
  "Lightbulb",
  "Hand",
  "Medal",
  "Book",
  "Necklace",
  "Eye",
  "Skull",
];

export const ICON_COMPONENTS = {
  Cigarette,
  Lightbulb,
  Hand,
  Medal,
  Book,
  Necklace: Gem,
  Eye,
  Skull,
} as const;

export const SYMBOL_TOTALS: Record<IconType, number> = {
  Cigarette: 5,
  Lightbulb: 5,
  Hand: 5,
  Medal: 5,
  Book: 4,
  Necklace: 3,
  Eye: 3,
  Skull: 3,
};

export const CHARACTERS: Character[] = [
  {
    name: "Sherlock Holmes",
    icons: ["Cigarette", "Lightbulb", "Hand"],
  },
  {
    name: "James Moriarty",
    icons: ["Skull", "Lightbulb"],
  },
  {
    name: "Irene Adler",
    icons: ["Skull", "Lightbulb", "Necklace"],
  },
  {
    name: "John Watson",
    icons: ["Cigarette", "Eye", "Hand"],
  },
  {
    name: "Mrs. Hudson",
    icons: ["Cigarette", "Necklace"],
  },
  {
    name: "Inspector Lestrade",
    icons: ["Medal", "Eye", "Book"],
  },
  {
    name: "Mycroft Holmes",
    icons: ["Cigarette", "Lightbulb", "Book"],
  },
  {
    name: "Mary Morstan",
    icons: ["Book", "Necklace"],
  },
  {
    name: "Sebastian Moran",
    icons: ["Skull", "Hand"],
  },
  {
    name: "Inspector Gregson",
    icons: ["Medal", "Hand", "Book"],
  },
  {
    name: "Inspector Baynes",
    icons: ["Medal", "Lightbulb"],
  },
  {
    name: "Inspector Bradstreet",
    icons: ["Medal", "Hand"],
  },
  {
    name: "Inspector Hopkins",
    icons: ["Medal", "Cigarette", "Eye"],
  },
];
