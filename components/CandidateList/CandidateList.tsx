import { Card } from "@/components/ui/card";
import { ICON_COMPONENTS } from "@/lib/symbols";
import { CellState } from "@/types";

interface CandidateListProps {
  candidates: CellState[];
}

export function CandidateList({ candidates }: CandidateListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {candidates.map((candidate) => (
        <Card
          key={candidate.name}
          className={`p-4 transition-colors ${
            candidate.isDisabled ? "opacity-50 bg-muted" : ""
          }`}
        >
          <h3 className="font-medium mb-2">{candidate.name}</h3>
          <div className="flex gap-2">
            {candidate.icons.map((icon) => {
              const IconComponent = ICON_COMPONENTS[icon];
              return <IconComponent key={icon} className="w-4 h-4" />;
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
