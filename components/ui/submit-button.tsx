"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

export type SubmitButtonProps = Omit<ButtonProps, "type">;

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, loadingText, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Button ref={ref} type="submit" loading={pending} loadingText={loadingText} {...props}>
        {children}
      </Button>
    );
  }
);
SubmitButton.displayName = "SubmitButton";
