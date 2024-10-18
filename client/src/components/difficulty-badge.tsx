import { useFindAllDifficulties } from "@/core/api/queries/use-find-all-difficulties";
import { Difficulty } from "@/core/types";
import { formatString, StrFormat } from "@/core/utils/string";
import { Badge } from "./ui/badge";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const label = formatString(difficulty.label, StrFormat.TITLE_CASE);
  const { data: difficulties } = useFindAllDifficulties();

  if (!difficulties) {
    return null;
  }

  if (difficulties.find((d: Difficulty) => d.value === 3)) {
    return <Badge className="text-white bg-hard">{label}</Badge>;
  }

  if (difficulties.find((d: Difficulty) => d.value === 2)) {
    return <Badge className="text-white bg-medium">{label}</Badge>;
  }

  if (difficulties.find((d: Difficulty) => d.value === 1)) {
    return <Badge className="text-white bg-easy">{label}</Badge>;
  }
}
