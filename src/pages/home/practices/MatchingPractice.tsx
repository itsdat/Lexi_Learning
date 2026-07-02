import { Button } from "../../../components/ui/button";

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function MatchingPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Quay lại
      </Button>
      <div className="text-center p-6">
        <p className="text-2xl font-bold">🔗 Nối Câu</p>
        <p className="text-gray-600 mt-4">Chức năng sắp tới...</p>
        <Button onClick={onBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    </div>
  );
}
