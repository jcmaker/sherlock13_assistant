"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ICONS, ICON_COMPONENTS, SYMBOL_TOTALS } from "@/lib/symbols";
import { useGameStore } from "@/store/useGameStore";
import { IconType } from "@/types";

export function IconDistribution() {
  const { symbolBoard } = useGameStore();

  const getIconCount = (icon: IconType) => {
    const players = Object.keys(symbolBoard);
    let confirmedCount = 0; // 정확한 개수가 확인된 수
    let checkedCount = 0; // 체크 표시된 수

    players.forEach((player) => {
      const mark = symbolBoard[player]?.[icon];
      if (typeof mark === "number") {
        confirmedCount += mark;
      } else if (mark === "✔") {
        checkedCount += 1;
      }
    });

    return {
      confirmed: confirmedCount,
      checked: checkedCount,
      total: SYMBOL_TOTALS[icon],
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>아이콘 분포 현황</CardTitle>
        <CardDescription>
          현재 사용된 아이콘과 남은 아이콘의 수를 보여줍니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {ICONS.map((icon) => {
            const IconComponent = ICON_COMPONENTS[icon];
            const { confirmed, checked, total } = getIconCount(icon);

            return (
              <div key={icon} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{icon}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {confirmed + checked}/{total}개 사용됨
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: total }).map((_, index) => {
                    let circleClass =
                      "w-3 h-3 rounded-full border border-primary";

                    if (index < confirmed) {
                      // 확인된 개수
                      circleClass += " bg-primary";
                    } else if (index < confirmed + checked) {
                      // 체크 표시된 개수
                      circleClass += " bg-primary/30";
                    } else {
                      // 미확인
                      circleClass += " bg-transparent";
                    }

                    return <div key={index} className={circleClass} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
