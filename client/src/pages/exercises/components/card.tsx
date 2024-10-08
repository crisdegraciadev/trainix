import HybridView from '@/components/hybrid-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useResolutionStore } from '@/core/state/resolution-store';
import { Exercise } from '@/core/types';
import { extractYoutubeVideoId, formatString, StrFormat } from '@/core/utils';
import { HeartIcon } from 'lucide-react';
import { ComponentProps, forwardRef, PropsWithChildren } from 'react';
import { useExerciseHybridViewStore } from '../state/exercise-hybrid-view-store';
import { ExerciseDifficultyBadge } from './difficulty-badge';
import ExerciseDetails from './details';

function MuscleList({ muscles }: Pick<Exercise, 'muscles'>) {
  const [primary, ...rest] = muscles;

  console.log({ muscles });

  const musclesRemaining = rest.length;

  const BaseList = ({ children }: PropsWithChildren) => (
    <div className="flex gap-1">
      <Badge className="h-fit">
        {formatString(primary.label, StrFormat.TITLE_CASE)}
      </Badge>
      {children}
    </div>
  );

  if (musclesRemaining > 2) {
    return (
      <BaseList>
        <Badge className="h-fit" variant="secondary">
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
        <Badge key={muscle.label} className="h-fit" variant="secondary">
          {formatString(muscle.label, StrFormat.TITLE_CASE)}
        </Badge>
      ))}
    </BaseList>
  );
}

const ExerciseTrigger = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & Exercise
>(function (
  { name, description, muscles, difficulty, favourite, video, ...rest },
  ref,
) {
  return (
    <div ref={ref} {...rest}>
      <span className="sr-only">View Exercise</span>

      <div className="overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
        <div className="relative">
          <img
            src={
              video
                ? `https://i3.ytimg.com/vi/${extractYoutubeVideoId(video)}/maxresdefault.jpg`
                : '/placeholder.svg'
            }
            alt="Project Image"
            className={`aspect-video object-cover rounded-t-lg`}
          />
          {favourite && (
            <Button size="icon" className="absolute bg-red-600 top-4 right-4">
              <HeartIcon color="white" fill="white" className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="p-4 bg-background flex flex-col space-y-2 min-h-[120px]">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{name}</h3>
            <ExerciseDifficultyBadge difficulty={difficulty} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <MuscleList muscles={muscles} />
        </div>
      </div>
    </div>
  );
});

export default function ExerciseCard(exercise: Exercise) {
  const { id } = exercise;

  const { isDesktop } = useResolutionStore(({ isDesktop }) => ({
    isDesktop,
  }));

  const { detailsOpen, setDetailsOpen } = useExerciseHybridViewStore(
    ({ detailsOpen, setDetailsOpen }) => ({
      detailsOpen,
      setDetailsOpen,
    }),
  );

  const isOpen = detailsOpen[id];

  return (
    <HybridView
      isDesktop={isDesktop}
      open={isOpen}
      setOpen={(value) => setDetailsOpen({ ...detailsOpen, [id]: value })}
      title=""
      description=""
      content={<ExerciseDetails {...exercise} />}
      trigger={<ExerciseTrigger {...exercise} />}
      hideFooterOnDrawer={true}
      hideHeaderOnDrawer={true}
    />
  );
}
