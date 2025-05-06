import { router } from "expo-router";

export const logout = () => {
    router.canDismiss() && router.dismissAll();
    router.replace("/");
};

export const dateConfig: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
};

export const yearlyDateConfig: Intl.DateTimeFormatOptions = {
    year: "numeric"
}

export const monthlyDateConfig: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "2-digit"
}

export const massConfig: Intl.NumberFormatOptions = {
    style: "unit",
    unit: "kilogram",
    unitDisplay: "narrow",
};
