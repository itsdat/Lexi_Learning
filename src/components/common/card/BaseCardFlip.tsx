import { type ReactNode } from "react";
import { CardFlip, CardFlipBack, CardFlipFront } from "../../ui/card-flip";

export default function BaseCardFlip({
  frontContent,
  backContent,
  isFlipped,
  onFlip,
}: {
  frontContent: ReactNode;
  backContent: ReactNode;
  isFlipped: boolean;
  onFlip: (value: boolean) => void;
}) {
  return (
    <CardFlip isFlipped={isFlipped} onFlip={onFlip} className="w-full">
      <CardFlipFront className="flex flex-col justify-between h-auto">
        {frontContent}
      </CardFlipFront>

      <CardFlipBack className="h-full flex flex-col">
        {backContent}
      </CardFlipBack>
    </CardFlip>
  );
}
