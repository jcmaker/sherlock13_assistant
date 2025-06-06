export type IconType =
  | "Cigarette"
  | "Lightbulb"
  | "Hand"
  | "Medal"
  | "Book"
  | "Gem"
  | "Eye"
  | "Skull";

export interface Character {
  name: string;
  icons: IconType[];
}

export type IconMark = "none" | "?" | "✔" | 1 | 2 | 3 | 4 | 5;

export interface SymbolBoard {
  [playerName: string]: {
    [iconName: string]: IconMark;
  };
}

export interface QuestionRecord {
  from: string; // 질문한 플레이어
  symbol: IconType; // 질문한 아이콘
  answer: number; // 답변된 개수
  timestamp: number; // 질문 시간
}

export interface GameState {
  myCards: Character[]; // 내 손패
  symbolBoard: SymbolBoard; // 아이콘 보유 기록 테이블
  questionLog: QuestionRecord[]; // 질문 기록
  candidates: Character[]; // 남은 후보 캐릭터들
  notes: string; // 메모
}

export interface CellState {
  name: string;
  icons: IconType[];
  isDisabled: boolean;
}
