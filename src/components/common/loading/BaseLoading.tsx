import { Spinner } from "@/components/ui/spinner";

export default function BaseLoading() {
  return (
    <div className="bg-white z-99 w-screen h-screen flex items-center justify-center fixed inset-0 top-0 left-0">
      <div className="absolute top-0 left-20 text-[200px] font-semibold text-zinc-200 select-none animate-pulse">
        LEARN
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-20 text-[200px] font-semibold text-zinc-200 select-none animate-pulse">
        WITH
      </div>
      <div className="absolute bottom-0 left-20 text-[200px] font-semibold text-zinc-200 select-none animate-pulse">
        LEXI
      </div>
      <Spinner />
    </div>
  );
}
