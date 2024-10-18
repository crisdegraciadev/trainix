import { Muscle } from "@/core/types";
import { PropsWithChildren } from "react";
import { Badge } from "./ui/badge";
import { formatString, StrFormat } from "@/core/utils/string";

export function MuscleList({ muscles }: { muscles: Muscle[] }) {
  const [primary, ...rest] = muscles;

  const musclesRemaining = rest.length;

  const BaseList = ({ children }: PropsWithChildren) => (
    <div className="flex gap-1">
      <Badge className="h-fit text-nowrap">{formatString(primary.label, StrFormat.TITLE_CASE)}</Badge>
      {children}
    </div>
  );

  if (musclesRemaining > 2) {
    return (
      <BaseList>
        <Badge className="h-fit text-nowrap" variant="secondary">
          {formatString(rest[0].label, StrFormat.TITLE_CASE)}
        </Badge>
        <Badge className="h-fit text-nowrap" variant="secondary">
          {`+ ${musclesRemaining - 1} more`}
        </Badge>
      </BaseList>
    );
  }

  return (
    <BaseList>
      {rest.map((muscle) => (
        <Badge key={muscle.label} className="h-fit text-nowrap" variant="secondary">
          {formatString(muscle.label, StrFormat.TITLE_CASE)}
        </Badge>
      ))}
    </BaseList>
  );
}
