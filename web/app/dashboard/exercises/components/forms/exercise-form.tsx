import { PlusCircleIcon } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { Difficulty, Muscle } from "../../../../../types/enums";
import { capitalize } from "../../../../../utils";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { nanoid } from "nanoid";
import { Icons } from "../../../../../components/ui/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ExerciseSchema } from "./exercise-form-schema";

export type ExerciseFormDialogProps = {
  form: UseFormReturn<ExerciseSchema>;
  flags: {
    isLoading: boolean;
    isFormOpen: boolean;
    useInternalTrigger?: boolean;
  };
  text: {
    title: string;
    description: string;
    submit: string;
    internalTrigger?: string;
  };
  onSubmit: (values: ExerciseSchema) => void;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function _ExerciseFormDialog({
  form,
  flags,
  text,
  onSubmit,
  setIsFormOpen,
}: ExerciseFormDialogProps) {
  return (
    <Dialog open={flags.isFormOpen} onOpenChange={setIsFormOpen}>
      {flags.useInternalTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-8"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> {text.internalTrigger}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Muscle Up"
                      disabled={flags.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Pushing and pulling exercise where..."
                      disabled={flags.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className="w-full"
                        disabled={flags.isLoading}
                      >
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent id="difficulty">
                        <SelectGroup>
                          <SelectLabel>Medium</SelectLabel>
                          {Object.values(Difficulty).map((difficulty) => (
                            <SelectItem key={nanoid()} value={difficulty}>
                              {capitalize(difficulty)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="muscles"
              render={() => (
                <FormItem>
                  <FormLabel>Muscles</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Muscle).map((muscle) => (
                      <FormField
                        key={muscle}
                        control={form.control}
                        name="muscles"
                        render={({ field }) => (
                          <FormItem
                            key={muscle}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(muscle)}
                                onCheckedChange={(selected) => {
                                  selected
                                    ? field.onChange([...field.value, muscle])
                                    : field.onChange(
                                        field.value.reduce<Muscle[]>(
                                          (acc, currentMuscle) =>
                                            currentMuscle === muscle
                                              ? [...acc]
                                              : [...acc, currentMuscle],
                                          []
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {capitalize(muscle)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={flags.isLoading} type="submit">
                {flags.isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {text.submit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
