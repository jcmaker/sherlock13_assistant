"use client";

import { Card } from "@/components/ui/card";
import { ICONS, ICON_COMPONENTS } from "@/lib/symbols";
import { useGameStore } from "@/store/useGameStore";
import { IconType } from "@/types";

interface QuestionSuggestion {
  type: "player" | "all"; // player: 특정 플레이어에게, all: 전원에게
  target: string; // player 타입일 때는 플레이어 이름, all 타입일 때는 아이콘
  icon?: IconType; // all 타입일 때 사용할 아이콘
  reason: string;
  priority: number;
}

export function QuestionSuggestion() {
  const { symbolBoard } = useGameStore();

  // 플레이어별 정보 완성도 계산 (0-1)
  const getPlayerInfoCompleteness = (playerName: string): number => {
    const playerMarks = symbolBoard[playerName] || {};
    const totalIcons = ICONS.length;
    const knownIcons = Object.values(playerMarks).filter(
      (mark) => mark !== "none" && mark !== "?" && mark !== "X"
    ).length;
    return knownIcons / totalIcons;
  };

  // 아이콘별 정보 완성도 계산 (0-1)
  const getIconInfoCompleteness = (icon: IconType): number => {
    const players = Object.keys(symbolBoard);
    const totalPlayers = players.length;
    const knownPlayers = players.filter(
      (player) =>
        symbolBoard[player]?.[icon] !== "none" &&
        symbolBoard[player]?.[icon] !== "?" &&
        symbolBoard[player]?.[icon] !== "X"
    ).length;
    return knownPlayers / totalPlayers;
  };

  // 전원 질문의 가치 계산
  const getAllQuestionValue = (icon: IconType): number => {
    const players = Object.keys(symbolBoard);
    const unknownPlayers = players.filter(
      (player) =>
        symbolBoard[player]?.[icon] === "none" ||
        symbolBoard[player]?.[icon] === "?"
    ).length;

    // 알려지지 않은 플레이어가 많을수록 가치가 높음
    return unknownPlayers / players.length;
  };

  // 플레이어의 체크된 아이콘 수 계산
  const getCheckedIconsCount = (player: string): number => {
    const playerMarks = symbolBoard[player] || {};
    return Object.values(playerMarks).filter((mark) => mark === "✔").length;
  };

  const getQuestionSuggestions = (): QuestionSuggestion[] => {
    const suggestions: QuestionSuggestion[] = [];
    const players = Object.keys(symbolBoard);

    // 1. 특정 플레이어에게 질문하는 경우
    players.forEach((player) => {
      if (player === "me") return; // me는 제외

      const playerCompleteness = getPlayerInfoCompleteness(player);
      if (playerCompleteness < 1) {
        // 가장 먼저 발견된 미확인 아이콘 선택
        const leastKnownIcon = ICONS.find(
          (icon) =>
            symbolBoard[player]?.[icon] === "none" ||
            symbolBoard[player]?.[icon] === "?"
        );

        if (leastKnownIcon) {
          const currentMark = symbolBoard[player]?.[leastKnownIcon];
          const isChecked = currentMark === "✔";
          const checkedIconsCount = getCheckedIconsCount(player);

          // 체크된 아이콘이 2개 이상이면 우선순위를 낮춤
          const priorityMultiplier =
            isChecked && checkedIconsCount >= 2 ? 1.1 : 1.2;

          suggestions.push({
            type: "player",
            target: player,
            icon: leastKnownIcon,
            reason: isChecked
              ? `${player}의 ${leastKnownIcon}이(가) 적어도 1개 이상 있으니 정확한 개수를 확인하세요`
              : `${player}의 ${leastKnownIcon} 정보가 부족합니다`,
            priority: isChecked
              ? priorityMultiplier - playerCompleteness
              : 1 - playerCompleteness,
          });
        }
      }
    });

    // 2. 전원에게 질문하는 경우
    ICONS.forEach((icon) => {
      const iconCompleteness = getIconInfoCompleteness(icon);
      const allQuestionValue = getAllQuestionValue(icon);

      if (iconCompleteness < 1 && allQuestionValue > 0.3) {
        // 30% 이상의 플레이어가 모르는 경우에만 추천
        suggestions.push({
          type: "all",
          target: icon,
          icon: icon,
          reason: `${icon}을 가진 플레이어를 한 번에 파악할 수 있습니다`,
          priority: allQuestionValue,
        });
      }
    });

    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 3);
  };

  const suggestions = getQuestionSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">질문 추천</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const IconComponent = ICON_COMPONENTS[suggestion.icon!];
          return (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {suggestion.type === "player" ? (
                  <>
                    <span className="font-medium">{suggestion.target}</span>
                    <span>에게</span>
                    <IconComponent className="w-4 h-4" />
                    <span>아이콘 개수 물어보기</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">전원에게</span>
                    <IconComponent className="w-4 h-4" />
                    <span>아이콘 보유 여부 물어보기</span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {suggestion.reason}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
