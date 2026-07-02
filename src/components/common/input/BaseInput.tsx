import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import { useState, type HTMLInputTypeAttribute, type ReactNode } from "react";

export interface ClassInputProps {
  lableClass?: string;
  inputClass?: string;
}

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  classProps?: ClassInputProps;
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  addon?: ReactNode;
}

export default function BaseInput({
  className,
  classProps,
  label,
  type = "text",
  error,
  placeholder,
  addon,
  ...props
}: BaseInputProps) {
  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <div className={"grid w-full items-center gap-2"}>
      {label && (
        <Label htmlFor="email" className={cn("", classProps?.lableClass)}>
          {label} {props.required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <InputGroup className={cn("", classProps?.inputClass)}>
        <InputGroupInput
          {...props}
          type={type === "password" && showPass ? "text" : type}
          className={cn("", className)}
          placeholder={placeholder}
        />
        {/* <InputGroupAddon>
          <CreditCardIcon />
        </InputGroupAddon> */}
        {type === "password" ? (
          <InputGroupAddon align="inline-end" className="pr-5">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <EyeClosed className="" size={22} />
              ) : (
                <Eye className="" size={22} />
              )}
            </button>
          </InputGroupAddon>
        ) : (
          addon && (
            <InputGroupAddon align="inline-end" className="pr-5">
              {addon}
            </InputGroupAddon>
          )
        )}
      </InputGroup>
    </div>
  );
}
