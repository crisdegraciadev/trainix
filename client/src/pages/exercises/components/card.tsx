import { DifficultyBadge } from "@/components/difficulty-badge";
import HybridView from "@/components/hybrid-view";
import { Button } from "@/components/ui/button";
import { useResolutionStore } from "@/core/state/resolution-store";
import { Exercise } from "@/core/types";
import { extractYoutubeVideoId } from "@/core/utils/url";
import { HeartIcon } from "lucide-react";
import { ComponentProps, forwardRef } from "react";
import { useExerciseHybridViewStore } from "../state/exercise-hybrid-view-store";
import ExerciseDetails from "./details";
import { MuscleList } from "@/components/muscle-list";

const ExerciseTrigger = forwardRef<HTMLDivElement, ComponentProps<"div"> & Exercise>(function (
  { name, description, muscles, difficulty, favourite, videoUrl, ...rest },
  ref,
) {
  return (
    <div ref={ref} {...rest}>
      <span className="sr-only">View Exercise</span>

      <div className="overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
        <div className="relative">
          <img
            src={
              videoUrl
                ? `https://i3.ytimg.com/vi/${extractYoutubeVideoId(videoUrl)}/maxresdefault.jpg`
                : `https://placehold.co/600x400/2463EB/FFF?font=montserrat&text=${name[0]}`
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
            <h3 className="text-xl font-bold truncate">{name}</h3>
            <DifficultyBadge difficulty={difficulty} />
          </div>
          <p className="text-sm text-muted-foreground h-10 line-clamp-2">{description}</p>
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

  const { detailsOpen, setDetailsOpen } = useExerciseHybridViewStore(({ detailsOpen, setDetailsOpen }) => ({
    detailsOpen,
    setDetailsOpen,
  }));

  const isOpen = detailsOpen[id];

  return (
    <HybridView
      isDesktop={isDesktop}
      open={isOpen}
      setOpen={(value) => setDetailsOpen({ ...detailsOpen, [id]: value })}
      title={exercise.name}
      description=""
      content={<ExerciseDetails {...exercise} />}
      trigger={<ExerciseTrigger {...exercise} />}
      hideFooterOnDrawer={true}
      hideHeaderOnDrawer={true}
    />
  );
}
