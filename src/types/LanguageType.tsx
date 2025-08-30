export type LangCode = "vi" | "en";

export interface PopoverLanguageProps {
    currentLang: LangCode;
    onChangeLang: (code: LangCode) => void;
    className?: string;
}

export const LANGUAGES: Array<{ code: LangCode; label: string; icon: string }> = [
    { code: "vi", label: "Tiếng Việt", icon: "🇻🇳" },
    { code: "en", label: "English", icon: "🇬🇧" },
];
