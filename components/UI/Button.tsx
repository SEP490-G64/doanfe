/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ButtonProps } from "@/types/button";

function Button({ label, type = "primary", size = "medium", rounded = "medium", icon, href, onClick }: ButtonProps) {
    let typeClass, sizeClass, roundedClass;

    switch (type) {
        case "primary":
            typeClass = "bg-primary text-white";
            break;
        case "success":
            typeClass = "bg-meta-3 text-white";
            break;
        case "cancel":
            typeClass = "bg-black text-white";
            break;
        case "outline":
            typeClass = "border border-primary text-primary";
            break;
    }

    switch (size) {
        case "small":
            sizeClass = "gap-1 px-3 py-1";
            break;
        case "medium":
            sizeClass = "gap-1.5 px-6 py-2";
            break;
        case "large":
            sizeClass = "gap-2.5 px-10 py-4";
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

    const router = useRouter();

    return (
        <button
            className={`inline-flex items-center justify-center text-center font-medium hover:bg-opacity-90 ${typeClass} ${sizeClass} ${roundedClass}`}
            onClick={() => (href ? router.push(href) : onClick)}
        >
            {icon && icon}
            {label}
        </button>
    );
}

export default Button;
