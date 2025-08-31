import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useSelector((state: RootState) => state.theme.type);

    useEffect(() => {
        const html = document.documentElement;

        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [theme]);

    return <>{children}</>;
};
