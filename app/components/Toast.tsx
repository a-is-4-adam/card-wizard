import { useToastQueue, ToastQueue } from "@react-stately/toast";
import ReactDOM from "react-dom";

import type { AriaToastProps, AriaToastRegionProps } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";
import { useToast, useToastRegion } from "@react-aria/toast";
import React from "react";
import { Button } from "react-aria-components";
import clsx from "clsx";

type Toast = {
  id: string;
  title: string;
};

type ToastProps = AriaToastProps<Toast> & {
  state: ToastState<Toast>;
};

function Toast({ state, ...props }: ToastProps) {
  let ref = React.useRef(null);
  let { toastProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref
  );

  return (
    <div
      {...toastProps}
      ref={ref}
      className="flex items-center justify-between gap-4 bg-blue-500 text-white px-3 py-2 rounded-lg"
    >
      <div {...titleProps}>{props.toast.content.title}</div>
      <Button
        {...closeButtonProps}
        className={({ isFocusVisible, isHovered, isPressed }) =>
          clsx("rounded-full w-8 h-8 border border-solid border-white", {
            "bg-blue-300": isFocusVisible || isHovered,
            "bg-blue-900": isPressed,
          })
        }
      >
        x
      </Button>
    </div>
  );
}

type ToastRegionProps = AriaToastRegionProps & {
  state: ToastState<Toast>;
};

function ToastRegion({ state, ...props }: ToastRegionProps) {
  let ref = React.useRef(null);
  let { regionProps } = useToastRegion(props, state, ref);

  return (
    <div
      {...regionProps}
      ref={ref}
      className="fixed bottom-4 right-4 flex flex-col gap-4"
    >
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
}

export const toastQueue = new ToastQueue<Toast>({
  maxVisibleToasts: 5,
});

export function GlobalToastRegion(props: Omit<ToastRegionProps, "state">) {
  // Subscribe to it.
  let state = useToastQueue(toastQueue);

  // Render toast region.
  return state.visibleToasts.length > 0
    ? ReactDOM.createPortal(
        <ToastRegion {...props} state={state} />,
        document.body
      )
    : null;
}
