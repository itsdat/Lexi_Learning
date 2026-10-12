import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

export interface BaseSelectProps {
  label: string;
  value: string | number | any;
  labelDisplay?: ReactNode;
}

interface BaseSelectComponentProps {
  options: BaseSelectProps[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export default function BaseSelect({
  options,
  value: controlledValue,
  onValueChange,
  placeholder = "Select option",
}: BaseSelectComponentProps) {
  // Hỗ trợ cả controlled (cha truyền value/onValueChange) lẫn uncontrolled
  // (tự quản lý state nếu cha không truyền gì).
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    undefined,
  );

  const value = controlledValue ?? internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  const selectedOption = options.find((item) => item.value === value);

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full bg-[#F8F8F8] border-0 h-10! shadow-sm">
        {/* Truyền children tùy chỉnh cho SelectValue thay vì để nó tự
            mirror y hệt nội dung SelectItem — nhờ vậy trigger và item
            trong dropdown có thể hiện khác nhau. */}
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="border-0! ring-0 rounded-2xl shadow-sm"
      >
        <SelectGroup className="w-full!">
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.labelDisplay ?? item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
