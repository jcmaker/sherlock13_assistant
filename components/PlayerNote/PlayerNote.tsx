import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGameStore } from "@/store/useGameStore";

export function PlayerNote() {
  const { notes, setNotes } = useGameStore();
  const [localNotes, setLocalNotes] = useState(notes);

  // Debounce note updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotes(localNotes);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localNotes, setNotes]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">메모</h2>

      <Textarea
        placeholder="게임 중 메모를 작성하세요..."
        value={localNotes}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setLocalNotes(e.target.value)
        }
        className="min-h-[200px]"
      />
    </Card>
  );
}
