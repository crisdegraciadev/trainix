import { Badge } from '@/components/ui/badge';
import { DifficultyLabels, Exercise } from '@/core/types';
import { formatString, StrFormat } from '@/core/utils';

export function ExerciseDifficultyBadge({
  difficulty,
}: Pick<Exercise, 'difficulty'>) {
  const label = formatString(difficulty.label, StrFormat.TITLE_CASE);

  if (difficulty.label === DifficultyLabels.HARD) {
    return <Badge className="text-white bg-red">{label}</Badge>;
  }

  if (difficulty.label === DifficultyLabels.MEDIUM) {
    return <Badge className="text-white bg-medium">{label}</Badge>;
  }

  if (difficulty.label === DifficultyLabels.EASY) {
    return <Badge className="text-white bg-easy">{label}</Badge>;
  }
}
