import clsx from "clsx";
import { Button as RacButton } from "react-aria-components";
import type { ButtonProps, ButtonRenderProps } from "react-aria-components";

type ButtonClassNameArgs = Pick<
  ButtonRenderProps,
  "isHovered" | "isFocusVisible" | "isPressed"
>;

export function getButtonClassName({
  isHovered,
  isFocusVisible,
  isPressed,
}: ButtonClassNameArgs) {
  return clsx("text-white px-4 py-1 rounded-md  outline-none", {
    "bg-blue-700": !isHovered && !isFocusVisible && !isPressed,
    "bg-blue-800": isHovered || isFocusVisible,
    "outline-2 outline outline-offset-2 outline-blue-800": isFocusVisible,
    "bg-blue-900": isPressed,
  });
}

export function Button(props: ButtonProps) {
  return (
    <RacButton {...props} form="card-wizard" className={getButtonClassName} />
  );
}
