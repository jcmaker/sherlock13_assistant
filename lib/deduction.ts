import { Character, IconType, IconMark } from "@/types";
import { CHARACTERS } from "./symbols";

interface QuestionRecord {
  from: string;
  symbol: IconType;
  answer: number;
  timestamp: number;
}

interface SymbolBoard {
  [playerName: string]: {
    [icon in IconType]?: IconMark;
  };
}

/**
 * 주어진 손패와 심볼 보드, 질문 기록을 기반으로 가능한 후보 캐릭터들을 필터링합니다.
 */
export function filterPossibleCharacters(
  myCards: Character[],
  symbolBoard: SymbolBoard,
  questionLog: QuestionRecord[] = []
): Character[] {
  // 1. 내 카드에 있는 아이콘을 가진 캐릭터 제외
  const myIcons = new Set<IconType>();
  myCards.forEach((card) => {
    card.icons.forEach((icon) => myIcons.add(icon));
  });

  // 2. symbolBoard의 마크에 따라 필터링
  const isCharacterPossible = (character: Character): boolean => {
    // 내 카드에 있는 아이콘을 가진 캐릭터는 제외
    if (character.icons.some((icon) => myIcons.has(icon))) {
      return false;
    }

    // 각 플레이어의 마크에 따라 필터링
    for (const [playerName, marks] of Object.entries(symbolBoard)) {
      for (const [icon, mark] of Object.entries(marks)) {
        const iconType = icon as IconType;
        const characterIconCount = character.icons.filter(
          (i) => i === iconType
        ).length;

        switch (mark) {
          case "?":
            // 물음표는 필터링에 영향 없음
            break;
          case "✔":
            // 체크: 캐릭터가 해당 아이콘을 하나 이상 가져야 함
            if (characterIconCount === 0) {
              return false;
            }
            break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            // 숫자: 캐릭터가 정확히 그 수만큼의 아이콘을 가져야 함
            if (characterIconCount !== mark) {
              return false;
            }
            break;
          case "none":
            // 없음은 필터링에 영향 없음
            break;
        }
      }
    }

    // 3. 질문 기록에 따라 필터링
    for (const question of questionLog) {
      const characterIconCount = character.icons.filter(
        (icon) => icon === question.symbol
      ).length;
      if (characterIconCount !== question.answer) {
        return false;
      }
    }

    return true;
  };

  return CHARACTERS.filter(isCharacterPossible);
}

/**
 * 특정 아이콘의 개수를 계산합니다.
 */
export function countIcons(character: Character, icon: string): number {
  return character.icons.filter((i) => i === icon).length;
}
