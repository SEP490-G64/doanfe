import { ReactElement } from "react";

export type ButtonProps = {
    label: string;
    type?: "primary" | "success" | "cancel" | "outline";
    size?: "small" | "medium" | "large";
    rounded?: "none" | "medium" | "full";
    icon?: ReactElement;
    href?: string;
    onClick?: () => void;
};
