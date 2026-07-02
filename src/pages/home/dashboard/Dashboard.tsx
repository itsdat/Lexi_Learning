import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CircularProgress from "@/components/ui/process-circle";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full grid grid-cols-[2fr_1fr] gap-5">
        <Card className="flex flex-row items-start justify-between w-full gap-3">
          <div className="flex flex-col gap-3">
            <Badge className="h-6 px-3">TIẾP TỤC HỌC</Badge>
            <h3>English B2</h3>
            <div className="flex items-center justify-start gap-2">
              <CircularProgress strokeWidth={18} progress={36} size={200} />
              <Button>Tiếp tục</Button>
            </div>
          </div>
          <div className="shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX9wk7etB5xX6EXnHlQV_JOcvaVDxPe79IijKwnei_YpEeVetv0pMppOxC-oAAAx_OyuY2hsbEZAEiib1zXjIelNOQFSb8ierDiljsIhNF6MSP7JQlNCYcouCywy9yXxqhZizsO5iTQxBIxmPnbNX4lfZrEhCcKRS-e4w1dfeJCTsHfnKE5vwvnUbInn0cxZ_cZRDRPGqEYN7aHB9HjoioMNPXgouSyRMkkwllJpHXuA2VA8y__NOkB01SZXqszatw2ePvcGC1Pp9"
              alt="image"
              className="w-96 aspect-square"
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="w-full aspect-square"></Card>
          <Card className="w-full aspect-square"></Card>
          <Card className="w-full aspect-2/1 col-span-2"></Card>
        </div>
      </div>
    </div>
  );
}
