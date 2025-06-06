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
  const getSymbolCount = (symbol: string) => {
    // 내 카드에서 사용된 아이콘 개수
    const myCardCount = myCards.reduce(
      (count, card) =>
        count + card.icons.filter((icon) => icon === symbol).length,
      0
    );
    console.log(`My cards have ${symbol}: ${myCardCount}`);

    // 심볼 보드에서 사용된 아이콘 개수 (me 제외)
    const boardCount = Object.entries(symbolBoard).reduce(
      (count, [playerName, playerSymbols]) => {
        if (playerName === "me") return count; // me는 이미 myCardCount에 포함됨
        const mark = playerSymbols[symbol as IconType];
        const value = typeof mark === "number" ? mark : 0;
        console.log(`Player ${playerName} has ${symbol}: ${value}`);
        return count + value;
      },
      0
    );

    const total = myCardCount + boardCount;
    console.log(
      `${symbol} total count: ${total} (myCards: ${myCardCount}, other players: ${boardCount})`
    );
    return total;
  };

  // 아이콘이 모두 사용되었는지 확인
  const isSymbolComplete = (symbol: string) => {
    const currentCount = getSymbolCount(symbol);
    const totalCount = SYMBOL_TOTALS[symbol as keyof typeof SYMBOL_TOTALS];
    const isComplete = currentCount === totalCount;
    console.log(
      `${symbol} is ${
        isComplete ? "complete" : "not complete"
      } (${currentCount}/${totalCount})`
    );
    return isComplete;
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
              <h3 className="font-medium">{character.name}</h3>
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
