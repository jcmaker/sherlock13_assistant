"use client";

import { Card } from "@/components/ui/card";
import { CHARACTERS, SYMBOL_TOTALS } from "@/lib/symbols";
import { useGameStore } from "@/store/useGameStore";

interface EliminationReason {
  character: string;
  reason: string;
  timestamp: number;
}

export function EliminationReport() {
  const myCards = useGameStore((state) => state.myCards);
  const symbolBoard = useGameStore((state) => state.symbolBoard);

  const getEliminationReasons = (): EliminationReason[] => {
    const reasons: EliminationReason[] = [];

    // 내 카드에 있는 캐릭터 제거
    myCards.forEach((card) => {
      reasons.push({
        character: card.name,
        reason: "내 카드에 있음",
        timestamp: Date.now(),
      });
    });

    // 각 캐릭터의 아이콘 사용량 검사
    CHARACTERS.forEach((character) => {
      // 내 카드에 있는 캐릭터는 이미 처리됨
      if (myCards.some((card) => card.name === character.name)) {
        return;
      }

      // 각 아이콘에 대해 검사
      character.icons.forEach((icon) => {
        // 현재 사용된 아이콘 개수 계산
        const currentCount = Object.entries(symbolBoard).reduce(
          (count, [playerName, playerSymbols]) => {
            if (playerName === "me") return count;
            const mark = playerSymbols[icon];
            return count + (typeof mark === "number" ? mark : 0);
          },
          0
        );

        // 내 카드의 아이콘 개수 추가
        const myCardCount = myCards.reduce(
          (count, card) => count + card.icons.filter((i) => i === icon).length,
          0
        );

        const totalCount = currentCount + myCardCount;
        const iconCount = character.icons.filter((i) => i === icon).length;

        // 아이콘이 모두 사용되었는데, 이 캐릭터가 더 많은 아이콘을 필요로 하는 경우
        if (totalCount === SYMBOL_TOTALS[icon] && iconCount > 0) {
          reasons.push({
            character: character.name,
            reason: `${icon} 아이콘이 모두 사용됨`,
            timestamp: Date.now(),
          });
        }
      });
    });

    return reasons;
  };

  const reasons = getEliminationReasons();

  if (reasons.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">자동 소거 리포트</h3>
      <div className="space-y-3">
        {reasons.map((reason, index) => (
          <div
            key={`${reason.character}-${index}`}
            className="p-3 bg-muted rounded-lg"
          >
            <div className="font-medium text-red-500">{reason.character}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {reason.reason}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
