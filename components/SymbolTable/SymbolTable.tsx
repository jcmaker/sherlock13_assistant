import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICONS, ICON_COMPONENTS } from "@/lib/symbols";
import { useGameStore } from "@/store/useGameStore";
import { IconMark, IconType } from "@/types";

const MARK_OPTIONS: { value: IconMark; label: string }[] = [
  { value: "none", label: "없음" },
  { value: "?", label: "?" },
  { value: "✔", label: "✔" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

export function SymbolTable() {
  const { symbolBoard, updateSymbolBoard, myCards } = useGameStore();
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({
    me: "me",
  });
  const [nextPlayerNumber, setNextPlayerNumber] = useState(1);

  // Initialize 'me' player
  useEffect(() => {
    if (myCards.length > 0) {
      ICONS.forEach((icon) => {
        const count = myCards.reduce(
          (acc, card) => acc + (card.icons.includes(icon) ? 1 : 0),
          0
        );
        updateSymbolBoard("me", icon, count as IconMark);
      });
    }
  }, [myCards, updateSymbolBoard]);

  const handleAddPlayer = () => {
    const newPlayerId = `player${nextPlayerNumber}`;
    setPlayerNames((prev) => ({
      ...prev,
      [newPlayerId]: newPlayerId,
    }));
    setNextPlayerNumber((prev) => prev + 1);

    // Initialize new player's marks
    ICONS.forEach((icon) => {
      updateSymbolBoard(newPlayerId, icon, "none");
    });
  };

  const handleMarkChange = (
    playerName: string,
    icon: IconType,
    value: string
  ) => {
    const markValue: IconMark =
      value === "none"
        ? "none"
        : value === "?"
        ? "?"
        : value === "✔"
        ? "✔"
        : (parseInt(value) as 1 | 2 | 3 | 4 | 5);

    updateSymbolBoard(playerName, icon, markValue);
  };

  const handleNameChange = (oldName: string, newName: string) => {
    if (oldName === "me") return; // me는 변경 불가
    setPlayerNames((prev) => ({
      ...prev,
      [oldName]: newName,
    }));
  };

  const getDisplayValue = (mark: IconMark | undefined): string => {
    if (!mark) return "none";
    return String(mark);
  };

  const safeSymbolBoard = symbolBoard || {};
  const players = Object.keys(playerNames);

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddPlayer}>플레이어 추가</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>플레이어</TableHead>
            {ICONS.map((icon) => {
              const IconComponent = ICON_COMPONENTS[icon];
              return (
                <TableHead key={icon} className="text-center">
                  <IconComponent className="w-5 h-5 mx-auto" />
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((playerName) => (
            <TableRow key={playerName}>
              <TableCell className="font-medium">
                {playerName === "me" ? (
                  "me"
                ) : (
                  <Input
                    value={playerNames[playerName]}
                    onChange={(e) =>
                      handleNameChange(playerName, e.target.value)
                    }
                    className="w-[100px]"
                  />
                )}
              </TableCell>
              {ICONS.map((icon) => (
                <TableCell key={icon} className="text-center">
                  <Select
                    value={getDisplayValue(
                      (
                        safeSymbolBoard[playerName] as Record<
                          IconType,
                          IconMark
                        >
                      )?.[icon]
                    )}
                    onValueChange={(value) =>
                      handleMarkChange(playerName, icon, value)
                    }
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="없음" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARK_OPTIONS.map((option) => (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
