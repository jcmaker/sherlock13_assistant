"use client";

import { Card } from "@/components/ui/card";
import { CHARACTERS, ICON_COMPONENTS, SYMBOL_TOTALS } from "@/lib/symbols";
import { useGameStore } from "@/store/useGameStore";
import { Character, IconType } from "@/types";
import { usePathname } from "next/navigation";

interface CardTableProps {
  onCardClick?: (character: Character) => void;
  selectedCards?: Character[];
}

export function CardTable({ onCardClick, selectedCards }: CardTableProps) {
  const pathname = usePathname();
  const isPlayPage = pathname === "/play";
  const myCards = useGameStore((state) => state.myCards);
  const symbolBoard = useGameStore((state) => state.symbolBoard);

  // 현재 사용된 아이콘 개수 계산
  const getSymbolCount = (icon: IconType): number => {
    const players = Object.keys(symbolBoard);
    let totalCount = 0;
    let checkedCount = 0; // 체크 표시된 카운트

    players.forEach((player) => {
      const mark = symbolBoard[player]?.[icon];
      if (typeof mark === "number") {
        totalCount += mark;
      } else if (mark === "✔") {
        checkedCount += 1; // 체크 표시는 최소 1개로 계산
      }
    });

    return totalCount + checkedCount;
  };

  // 아이콘이 모두 사용되었는지 확인
  const isSymbolComplete = (icon: IconType): boolean => {
    const currentCount = getSymbolCount(icon);
    if (currentCount >= SYMBOL_TOTALS[icon]) {
      updateCheckToNumber(icon);
    }
    return currentCount >= SYMBOL_TOTALS[icon];
  };

  // 체크 표시를 정확한 숫자로 업데이트
  const updateCheckToNumber = (icon: IconType) => {
    const players = Object.keys(symbolBoard);
    let totalConfirmed = 0;
    const checkedPlayers: string[] = [];

    players.forEach((player) => {
      const mark = symbolBoard[player]?.[icon];
      if (typeof mark === "number") {
        totalConfirmed += mark;
      } else if (mark === "✔") {
        checkedPlayers.push(player);
      }
    });

    const remainingCount = SYMBOL_TOTALS[icon] - totalConfirmed;

    // 체크 표시된 플레이어가 1명일 경우에만 업데이트
    if (checkedPlayers.length === 1 && remainingCount > 0) {
      const checkedPlayer = checkedPlayers[0];
      const newSymbolBoard = { ...symbolBoard };
      newSymbolBoard[checkedPlayer] = {
        ...newSymbolBoard[checkedPlayer],
        [icon]: remainingCount,
      };
      useGameStore.getState().setSymbolBoard(newSymbolBoard);
    }
  };

  // 카드가 비활성화되어야 하는지 확인
  const isCardDisabled = (character: Character) => {
    if (!isPlayPage) return false;

    // 내 카드에 있는 캐릭터는 비활성화
    if (myCards.some((card) => card.name === character.name)) {
      return true;
    }

    // 아이콘이 모두 사용된 캐릭터는 비활성화
    return character.icons.some((icon) => isSymbolComplete(icon));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {CHARACTERS.map((character) => {
        const isDisabled = isCardDisabled(character);

        return (
          <Card
            key={character.name}
            className={`p-4 transition-colors ${
              selectedCards?.some((card) => card.name === character.name)
                ? "bg-primary text-primary-foreground"
                : isDisabled
                ? "opacity-50 cursor-not-allowed"
                : onCardClick
                ? "cursor-pointer hover:bg-muted"
                : ""
            }`}
            onClick={() => {
              if (onCardClick && !isDisabled) {
                onCardClick(character);
              }
            }}
          >
            <div className="flex justify-between items-start">
              <h3
                className={`font-medium ${
                  isDisabled ? "line-through text-red-500" : ""
                }`}
              >
                {character.name}
              </h3>
            </div>
            <div className="flex gap-2 mt-2">
              {character.icons.map((icon) => {
                const IconComponent = ICON_COMPONENTS[icon];
                const isComplete = isSymbolComplete(icon);
                return (
                  <div key={icon} className="flex items-center gap-1">
                    <IconComponent
                      className={`w-4 h-4 ${isComplete ? "opacity-50" : ""}`}
                    />
                    {isComplete && (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
