"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameStore } from "@/store/useGameStore";
import { ICONS, ICON_COMPONENTS } from "@/lib/symbols";
import { useEffect } from "react";
import { IconType } from "@/types";

const PLAYERS = ["ME", "player1", "player2", "player3"] as const;

export function QuestionLog() {
  const { questions, addQuestion, myCards } = useGameStore();

  // 내 카드의 문양 개수를 계산하는 함수
  const getMyIconCount = (icon: IconType) => {
    return myCards.reduce((count, card) => {
      return count + (card.icons.includes(icon) ? 1 : 0);
    }, 0);
  };

  // 컴포넌트 마운트 시 내 카드 정보를 자동으로 추가
  useEffect(() => {
    if (myCards.length > 0) {
      // 기존 'ME' 플레이어의 질문 제거
      const filteredQuestions = questions.filter((q) => q.from !== "ME");

      // 새로운 'ME' 플레이어의 질문 추가
      ICONS.forEach((icon) => {
        const count = getMyIconCount(icon);
        if (count > 0) {
          filteredQuestions.push({
            from: "ME",
            symbol: icon,
            answer: count,
            timestamp: Date.now(),
          });
        }
      });

      // 상태 업데이트
      useGameStore.setState({ questions: filteredQuestions });
    }
  }, [myCards]);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">질문 기록</h2>
      <div className="space-y-4">
        {questions.map((q, index) => {
          const IconComponent = ICON_COMPONENTS[q.symbol];
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="font-medium">{q.from}</span>
              <span>의</span>
              <div className="flex items-center gap-1">
                <IconComponent className="w-4 h-4" />
              </div>
              <span>개수:</span>
              <span className="font-medium">{q.answer}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Select
          onValueChange={(value) => {
            addQuestion({
              from: value,
              symbol: ICONS[0],
              answer: 0,
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="플레이어 선택" />
          </SelectTrigger>
          <SelectContent>
            {PLAYERS.filter((player) => player !== "ME").map((player) => (
              <SelectItem key={player} value={player}>
                {player}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            const lastQuestion = questions[questions.length - 1];
            if (lastQuestion) {
              addQuestion({
                ...lastQuestion,
                symbol: value as IconType,
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="아이콘 선택" />
          </SelectTrigger>
          <SelectContent>
            {ICONS.map((icon) => {
              const IconComponent = ICON_COMPONENTS[icon];
              return (
                <SelectItem key={icon} value={icon}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{icon}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            const lastQuestion = questions[questions.length - 1];
            if (lastQuestion) {
              addQuestion({
                ...lastQuestion,
                answer: parseInt(value),
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="개수 선택" />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}개
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
