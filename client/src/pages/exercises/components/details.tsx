import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteExerciseMutation } from "@/core/api/mutations/use-delete-exercise-mutation";
import { Exercise } from "@/core/types";
import { extractYoutubeVideoId, formatString, StrFormat } from "@/core/utils";
import { HeartIcon, LoaderCircle, Play } from "lucide-react";
import { ExerciseDifficultyBadge } from "./difficulty-badge";
import HybridView from "@/components/hybrid-view";
import { useResolutionStore } from "@/core/state/resolution-store";
import { useState } from "react";
import ExerciseForm from "./forms/form";
import { useExerciseHybridViewStore } from "../state/exercise-hybrid-view-store";

export default function ExerciseDetails({ id, name, videoUrl, favourite, description, difficulty, muscles }: Exercise) {
  const { isDesktop } = useResolutionStore(({ isDesktop }) => ({ isDesktop }));
  const { formOpen, setFormOpen } = useExerciseHybridViewStore(({ formOpen, setFormOpen }) => ({ formOpen, setFormOpen }));

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: deleteExercise, isPending } = useDeleteExerciseMutation();

  function handleDelete() {
    deleteExercise(id);
    setDeleteOpen(false);
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        {
          <div
            className="relative w-full cursor-pointer border rounded-lg border-gray-200"
            onClick={() => videoUrl && window.open(videoUrl, "_blank")}
          >
            {videoUrl && (
              <div className="absolute inset-0 w-fit h-fit bg-black opacity-70 hover:opacity-90 rounded-lg px-4 py-2 m-auto">
                <Play className=" text-white" size={48} strokeWidth={1} />
              </div>
            )}
            <img
              src={
                videoUrl
                  ? `https://i3.ytimg.com/vi/${extractYoutubeVideoId(videoUrl)}/maxresdefault.jpg`
                  : `https://placehold.co/600x400/2463EB/FFF?font=montserrat&text=${name[0]}`
              }
              alt="Project Image"
              className={`aspect-videoUrl object-cover rounded-lg`}
            />
          </div>
        }

        <div className="lex flex-col space-y-4 min-h-[200px]">
          <div>
            <div className="flex items-center gap-2">
              {favourite && <HeartIcon color="red" fill="red" className="w-5 h-5" />}
              <h3 className="text-2xl font-bold">{name}</h3>
              <ExerciseDifficultyBadge difficulty={difficulty} />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Muscles</h3>
            <div className="flex gap-1">
              {muscles.map((muscle, idx) => (
                <Badge key={muscle.label} className="h-fit" variant={idx === 0 ? "default" : "secondary"}>
                  {formatString(muscle.label, StrFormat.TITLE_CASE)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <HybridView
            isDesktop={isDesktop}
            open={deleteOpen}
            setOpen={setDeleteOpen}
            title="Delete exercise"
            description="This operation can't be undone, the exercise will be deleted permanently. Please confirm the operation."
            hideFooterOnDrawer={true}
            content={
              <div className="flex gap-2">
                <Button className="w-full" variant="destructive" onClick={() => handleDelete()} disabled={isPending}>
                  {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />} Confirm
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setDeleteOpen(false)} disabled={isPending}>
                  {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />} Cancel
                </Button>
              </div>
            }
            trigger={
              <Button className="w-full" variant="destructive" disabled={isPending}>
                {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />} Delete
              </Button>
            }
          />

          <HybridView
            isDesktop={isDesktop}
            open={formOpen}
            setOpen={setFormOpen}
            title="Update exercise"
            description="Update an exercise here. Click save when you're done."
            content={
              <ExerciseForm
                defaultValues={{
                  name,
                  description,
                  videoUrl,
                  difficultyId: difficulty.id,
                  muscleIds: muscles.map((m) => m.id),
                }}
                exerciseId={id}
              />
            }
            trigger={
              <Button className="w-full" variant="outline" disabled={isPending}>
                {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />} Edit
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
}
