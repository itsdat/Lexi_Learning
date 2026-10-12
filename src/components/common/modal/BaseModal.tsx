import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BaseModal({
  children,
  open,
  onClose,
  description,
  title,
  submitText = "Save changes",
  className,
  isLoading,
  onSubmit
}: {
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  submitText?: string;
  className?: string;
  isLoading?: boolean;
  onSubmit?: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form>
        <DialogContent className={cn("sm:max-w-sm", className)}>
          <DialogHeader>
            <DialogTitle>{title ?? ""}</DialogTitle>
            <DialogDescription>{description ?? ""}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={onSubmit} type="submit" disabled={isLoading}>
              <Spinner className={isLoading ? "block size-4" : "hidden"} />
              {submitText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
