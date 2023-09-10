import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { WorkoutConsts } from "../../consts";

type Icons = Record<string, JSX.Element>;

const { STROKE_WIDTH: ICONS_STROKE_WIDTH } = WorkoutConsts.TableIcons;
export const DifficultyIcons: Icons = {
  EASY: (
    <ArrowDownIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
  MEDIUM: (
    <ArrowRightIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
  HARD: (
    <ArrowUpIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
};
