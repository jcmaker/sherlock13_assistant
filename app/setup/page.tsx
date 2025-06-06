"use client";

import { CardTable } from "@/components/CardTable/CardTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Character } from "@/types";
import { useEffect } from "react";

export default function SetupPage() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<Character[]>([]);
  const setMyCards = useGameStore((state) => state.setMyCards);
  const resetGame = useGameStore((state) => state.resetGame);

  useEffect(() => {
    // 페이지 진입 시 게임 상태 초기화
    resetGame();
  }, [resetGame]);

  const handleCardClick = (character: Character) => {
    if (selectedCards.some((card) => card.name === character.name)) {
      setSelectedCards(
        selectedCards.filter((card) => card.name !== character.name)
      );
    } else if (selectedCards.length < 6) {
      setSelectedCards([...selectedCards, character]);
    }
  };

  const handleStart = () => {
    setMyCards(selectedCards);
    router.push("/play");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">게임 설정</h1>

      <h2 className="text-lg font-semibold mb-4">내 손패 선택 (3-6장)</h2>
      <CardTable onCardClick={handleCardClick} selectedCards={selectedCards} />

      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-muted-foreground">
          선택된 카드: {selectedCards.length}장
        </div>
        <Button
          onClick={handleStart}
          disabled={selectedCards.length < 3 || selectedCards.length > 6}
        >
          게임 시작
        </Button>
      </div>
    </div>
  );
}
