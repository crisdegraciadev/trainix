import { Badge } from '@/components/ui/badge';
import { Difficulty, Exercise } from '@/core/types';
import { formatString, StrFormat } from '@/core/utils';

export function ExerciseDifficultyBadge({
  difficulty,
}: Pick<Exercise, 'difficulty'>) {
  const label = formatString(difficulty, StrFormat.TITLE_CASE);

  if (difficulty === Difficulty.HARD) {
    return <Badge className="text-white bg-hard">{label}</Badge>;
  }

  if (difficulty === Difficulty.MEDIUM) {
    return <Badge className="text-white bg-medium">{label}</Badge>;
  }

  if (difficulty === Difficulty.EASY) {
    return <Badge className="text-white bg-easy">{label}</Badge>;
  }
}
