/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";

import React from "react";
import { IconButtonProps } from "@/types/button";

function IconButton({ type = "primary", size = "medium", rounded = "medium", icon, onClick }: IconButtonProps) {
    let typeClass, sizeClass, roundedClass;

    switch (type) {
        case "primary":
            typeClass = "border border-primary text-primary";
            break;
        case "success":
            typeClass = " border border-bg-meta-3 text-bg-meta-3";
            break;
        case "danger":
            typeClass = " border border-danger text-danger";
            break;
        case "cancel":
            typeClass = "border border-black text-black";
            break;
    }

    switch (size) {
        case "small":
            sizeClass = "px-3 py-1";
            break;
        case "medium":
            sizeClass = "px-6 py-2";
            break;
        case "large":
            sizeClass = "px-10 py-4";
            break;
    }

    switch (rounded) {
        case "none":
            roundedClass = "rounded-none";
            break;
        case "medium":
            roundedClass = "rounded-md";
            break;
        case "full":
            roundedClass = "rounded-full";
            break;
        default:
            break;
    }

    return (
        <button
            className={`inline-flex items-center justify-center text-center font-medium hover:bg-opacity-90 ${typeClass} ${sizeClass} ${roundedClass}`}
            onClick={onClick}
        >
            {icon}
        </button>
    );
}

export default IconButton;
