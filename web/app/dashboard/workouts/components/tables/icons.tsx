import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { WorkoutConsts } from "../../consts";

type Icons = Record<string, JSX.Element>;

const { STROKE_WIDTH: ICONS_STROKE_WIDTH } = WorkoutConsts.TableIcons;
export const DifficultyIcons: Icons = {
  easy: (
    <ArrowDownIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
  medium: (
    <ArrowRightIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
  hard: (
    <ArrowUpIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={ICONS_STROKE_WIDTH}
    />
  ),
};
