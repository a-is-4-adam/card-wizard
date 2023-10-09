import { clsx } from "clsx";
import React from "react";
import {
  Button,
  ComboBox as RacCombobox,
  Input,
  Label,
  ListBox,
  Popover,
  Item,
} from "react-aria-components";
import type { ComboBoxProps as RacComboBoxProps } from "react-aria-components";

type ComboBoxLayoutProps<T extends object> = Omit<
  RacComboBoxProps<T>,
  "children"
> & {
  label?: string;
  description?: string | null;
  errorMessage?: string | null;
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

function ComboBoxLayout<T extends object>({
  label,
  children,
  ...props
}: ComboBoxLayoutProps<T>) {
  return (
    <RacCombobox shouldFocusWrap {...props} className="w-full">
      <Label className="font-medium">{label}</Label>
      <div className="relative">
        <Input
          className={({ isFocusVisible }) =>
            clsx(
              "w-full border-2 py-1 pl-3 pr-[20px] rounded-lg outline-none",
              {
                "border-gray-300": !isFocusVisible,
                "border-blue-800": isFocusVisible,
              }
            )
          }
        />
        <Button
          className={({ isDisabled }) =>
            clsx(
              "absolute w-[40px] right-0 h-full 700 text-white rounded-tr-lg rounded-br-lg",
              {
                "bg-blue-700": !isDisabled,
                "bg-gray-500": isDisabled,
              }
            )
          }
        >
          ▼
        </Button>
      </div>
      <Popover className="w-[--trigger-width] bg-white pt-2 pb-4 shadow-md rounded-lg border border-solid border-gray-100 overflow-y-auto">
        <ListBox
          className="divide-y border-gray-100"
          renderEmptyState={() => <div>I am empty</div>}
        >
          {children}
        </ListBox>
      </Popover>
    </RacCombobox>
  );
}

type Option = { name: string; slug: string };

type ComboBoxProps = Omit<ComboBoxLayoutProps<Option>, "children"> & {
  onItemFocus?: (slug: string) => void;
};

export function ComboBox({ onItemFocus, ...props }: ComboBoxProps) {
  return (
    <ComboBoxLayout {...props}>
      {(item) => {
        return (
          <Item
            id={item.slug}
            textValue={item.name}
            className={({ isHovered, isFocusVisible, isDisabled }) =>
              clsx("px-4 py-1", {
                "bg-slate-200": isHovered || isFocusVisible,
                "bg-slate-300": isDisabled,
              })
            }
          >
            {(args) => {
              if (args.isFocused) {
                onItemFocus?.(item.slug);
              }
              return item.name;
            }}
          </Item>
        );
      }}
    </ComboBoxLayout>
  );
}
