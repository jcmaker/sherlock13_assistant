import { create } from "zustand";
import { Character, QuestionRecord, IconType, IconMark } from "@/types";

interface GameState {
  myCards: Character[];
  questions: QuestionRecord[];
  playerCount: 2 | 3 | 4;
  candidates: Character[];
  notes: string;
  symbolBoard: Record<string, Record<IconType, IconMark>>;
}

interface GameStore extends GameState {
  setMyCards: (cards: Character[]) => void;
  addQuestion: (question: Omit<QuestionRecord, "timestamp">) => void;
  setPlayerCount: (count: 2 | 3 | 4) => void;
  setCandidates: (candidates: Character[]) => void;
  setNotes: (notes: string) => void;
  updateSymbolBoard: (
    playerName: string,
    icon: IconType,
    mark: IconMark
  ) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  myCards: [],
  questions: [],
  playerCount: 2,
  candidates: [],
  notes: "",
  symbolBoard: {},
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setMyCards: (cards) => set((state) => ({ ...state, myCards: cards })),
  addQuestion: (question) =>
    set((state) => ({
      ...state,
      questions: [...state.questions, { ...question, timestamp: Date.now() }],
    })),
  setPlayerCount: (count) => set((state) => ({ ...state, playerCount: count })),
  setCandidates: (candidates) => set((state) => ({ ...state, candidates })),
  setNotes: (notes) => set((state) => ({ ...state, notes })),
  updateSymbolBoard: (playerName, icon, mark) =>
    set((state) => ({
      ...state,
      symbolBoard: {
        ...state.symbolBoard,
        [playerName]: {
          ...state.symbolBoard[playerName],
          [icon]: mark,
        },
      },
    })),
  resetGame: () => set(initialState),
}));
