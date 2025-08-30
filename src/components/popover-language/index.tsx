import React from "react";
import clsx from "clsx";
import { CheckOutlined } from "@ant-design/icons";
import { LANGUAGES, PopoverLanguageProps } from "../../types/LanguageType";

const PopoverLanguage: React.FC<PopoverLanguageProps> = ({ currentLang, onChangeLang, className }) => {
    return (
        <ul className={clsx("popover-language__list", className)}>
            {LANGUAGES.map((lang) => {
                const active = currentLang === lang.code;
                return (
                    <li
                        key={lang.code}
                        role="menuitemradio"
                        aria-checked={active}
                        tabIndex={0}
                        className={clsx("popover-language__item", { active })}
                        onClick={() => onChangeLang(lang.code)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onChangeLang(lang.code);
                            }
                        }}
                    >
                        <span className="icon" aria-hidden>
                            {lang.icon}
                        </span>
                        <span className="label">{lang.label}</span>
                        {active && <CheckOutlined className="check icon" />}
                    </li>
                );
            })}
        </ul>
    );
};
export default PopoverLanguage;
