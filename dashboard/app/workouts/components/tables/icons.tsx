import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";

type Icons = Record<string, JSX.Element>;

export const DifficultyIcons: Icons = {
  easy: (
    <ArrowDownIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
  medium: (
    <ArrowRightIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
  hard: (
    <ArrowUpIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
};
