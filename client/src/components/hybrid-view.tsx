import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  isDesktop: boolean;
  title: ReactNode;
  description: ReactNode;
  trigger: ReactNode;
  content: ReactNode;
  hideFooterOnDrawer?: boolean;
  hideHeaderOnDrawer?: boolean;
};

export default function HybridView({
  title,
  description,
  trigger,
  content,
  setOpen,
  open,
  isDesktop,
  hideFooterOnDrawer,
  hideHeaderOnDrawer,
}: Props) {
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4 pt-0">
        <div className="grid gap-4 pt-4 pb-0">
          {!hideHeaderOnDrawer && (
            <DrawerHeader className="text-left p-0">
              <DrawerTitle className="text-xl">{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
          )}

          {content}
        </div>

        {!hideFooterOnDrawer && (
          <DrawerFooter className="p-0 pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
