import { useHref, type LinkProps as RemixLinkProps } from "@remix-run/react";
import { Link as RacLink } from "react-aria-components";
import type { LinkProps as RacLinkProps } from "react-aria-components";
import { useLinkClickHandler } from "react-router-dom";

type InternalKeys = "replace" | "state" | "relative" | "to";

type ExternalLink = {
  external: true;
  to: string;
} & Omit<{ [K in InternalKeys]?: never }, "to">;

type InternalLink = Pick<RemixLinkProps, InternalKeys> & {
  external?: never;
};

export type LinkProps = Omit<RacLinkProps, "href"> &
  Pick<RemixLinkProps, "target" | "to"> &
  (ExternalLink | InternalLink);

export function Link({
  to,
  replace,
  state,
  target,
  onPress,
  relative,
  external,
  ...props
}: LinkProps) {
  let href = useHref(to);
  let handleClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    relative,
  });

  return (
    <RacLink
      {...props}
      href={external ? to : href}
      onPress={(e) => {
        onPress?.(e);
        if (!external) {
          handleClick({
            ...e,
            button: 0,
            preventDefault: () => {},
          } as unknown as React.MouseEvent<HTMLAnchorElement>);
        }
      }}
    />
  );
}
