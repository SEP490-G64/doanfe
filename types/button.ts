import { ReactElement } from "react";

export type ButtonProps = {
    label: string;
    type?: "primary" | "success" | "danger" | "cancel" | "outline";
    size?: "small" | "medium" | "large";
    rounded?: "none" | "medium" | "full";
    icon?: ReactElement;
    onClick: () => void;
};

export type IconButtonProps = {
    type?: "primary" | "success" | "danger" | "cancel";
    size?: "small" | "medium" | "large";
    rounded?: "none" | "medium" | "full";
    icon: ReactElement;
    onClick: (e?: React.MouseEvent) => void;
};
