"use client";

import { CardTable } from "@/components/CardTable/CardTable";
import { SymbolTable } from "@/components/SymbolTable/SymbolTable";
import { IconDistribution } from "@/components/IconDistribution/IconDistribution";
import { EliminationReport } from "@/components/EliminationReport/EliminationReport";
import { QuestionSuggestion } from "@/components/QuestionSuggestion/QuestionSuggestion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Pause, RefreshCcw } from "lucide-react";

export default function PlayPage() {
  const router = useRouter();
  const resetGame = useGameStore((state) => state.resetGame);

  const handleNewGame = () => {
    resetGame();
    router.push("/setup");
  };

  const handleEndGame = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">셜록13 헬퍼</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewGame}>
            <RefreshCcw />
          </Button>
          <Button variant="destructive" onClick={handleEndGame}>
            <Pause />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">플레이어 목록</h2>
            <SymbolTable />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">캐릭터 목록</h2>
            <CardTable />
          </div>
        </div>

        <div className="space-y-8">
          <IconDistribution />
          <QuestionSuggestion />
          <EliminationReport />
        </div>
      </div>
    </div>
  );
}
