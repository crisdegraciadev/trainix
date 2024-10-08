import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/core/types';
import { extractYoutubeVideoId, formatString, StrFormat } from '@/core/utils';
import { HeartIcon, Play } from 'lucide-react';
import { ExerciseDifficultyBadge } from './difficulty-badge';

export default function ExerciseDetails({
  name,
  video,
  favourite,
  description,
  difficulty,
  muscles,
}: Exercise) {
  return (
    <div className="flex flex-col space-y-4">
      {
        <div
          className="relative w-full cursor-pointer border rounded-lg border-gray-200"
          onClick={() => video && window.open(video, '_blank')}
        >
          {video && (
            <div className="absolute inset-0 w-fit h-fit bg-black opacity-70 hover:opacity-90 rounded-lg px-4 py-2 m-auto">
              <Play className=" text-white" size={48} strokeWidth={1} />
            </div>
          )}
          <img
            src={
              video
                ? `https://i3.ytimg.com/vi/${extractYoutubeVideoId(video)}/maxresdefault.jpg`
                : '/placeholder.svg'
            }
            alt="Project Image"
            className={`aspect-video object-cover rounded-lg`}
          />
        </div>
      }

      <div className="lex flex-col space-y-4 min-h-[200px]">
        <div>
          <div className="flex items-center gap-2">
            {favourite && (
              <HeartIcon color="red" fill="red" className="w-5 h-5" />
            )}
            <h3 className="text-2xl font-bold">{name}</h3>
            <ExerciseDifficultyBadge difficulty={difficulty} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Muscles</h3>
          <div className="flex gap-1">
            {muscles.map((muscle, idx) => (
              <Badge
                key={muscle}
                className="h-fit"
                variant={idx === 0 ? 'default' : 'secondary'}
              >
                {formatString(muscle, StrFormat.TITLE_CASE)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="w-full" variant="destructive">
          Delete
        </Button>

        <Button className="w-full" variant="outline">
          Edit
        </Button>
      </div>
    </div>
  );
}
