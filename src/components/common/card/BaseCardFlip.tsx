import { type ReactNode } from "react";
import { CardFlip, CardFlipBack, CardFlipFront } from "../../ui/card-flip";
import { cn } from "@/lib/utils";

export default function BaseCardFlip({
  frontContent,
  backContent,
  isFlipped,
  onFlip,
  className,
}: {
  frontContent: ReactNode;
  backContent: ReactNode;
  isFlipped: boolean;
  onFlip: (value: boolean) => void;
  className?: string;
}) {
  return (
    <CardFlip
      isFlipped={isFlipped}
      onFlip={onFlip}
      className={cn("w-full", className)}
    >
      <CardFlipFront className="flex flex-col justify-between h-auto">
        {frontContent}
      </CardFlipFront>

      <CardFlipBack className="h-full flex flex-col">
        {backContent}
      </CardFlipBack>
    </CardFlip>
  );
}
