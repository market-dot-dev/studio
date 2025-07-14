"use client";

import { cn } from "@/lib/utils";
import { OTPInput, SlotProps } from "input-otp";
import { Spinner } from "../ui/spinner";

export default function OTPInputElement({ onComplete, onPaste, onInput, verifying }: any) {
  return (
    <OTPInput
      disabled={verifying}
      maxLength={6}
      containerClassName="group flex items-center has-[:disabled]:opacity-30"
      style={{ outline: "none" }}
      onComplete={onComplete}
      onPaste={onPaste}
      onInput={onInput}
      autoFocus
      render={({ slots }) => (
        <div className="flex w-full items-center justify-center">
          <div className="flex">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} index={idx} {...slot} />
            ))}
          </div>
          <div className="flex w-10 items-center justify-center">
            {verifying ? <Spinner /> : <FakeDash />}
          </div>
          <div className="flex">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} index={idx + 1} {...slot} />
            ))}
          </div>
        </div>
      )}
    />
  );
}

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps & { index: number }) {
  return (
    <div
      className={cn(
        "relative h-14 w-10 bg-white text-[2rem]",
        "flex items-center justify-center",
        "border-y border-r border-stone-200 first:rounded-l-md first:border-l last:rounded-r-md",
        "group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
        "transition-[border-color]",
        "ring-stone-800",
        {
          "z-[2] rounded !border-transparent outline-accent-foreground ring-2": props.isActive
        }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-px bg-white" />
    </div>
  );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return <div className="h-1 w-3 rounded border border-stone-200 bg-white" />;
}
