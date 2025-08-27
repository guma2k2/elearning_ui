import { Link } from "react-router-dom";
import { clsx } from "clsx";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "outline" | "text" | "circle";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", leftIcon, rightIcon, className, ...props }) => {
    return (
        <button className={clsx(styles.btn, styles[variant], className)} {...props}>
            {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            <span className={styles.content}>{children}</span>
            {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </button>
    );
};

export default Button;
