import { Link } from "react-router-dom";
import { clsx } from "clsx";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "outline" | "text" | "circle";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    leftIcon,
    rightIcon,
    className,
    disabled,
    onClick,
    loading,
    ...props
}) => {
    return (
        <button
            className={clsx(
                styles.btn,
                styles[variant],
                { [styles.disabled]: disabled || loading },
                { [styles.loading]: loading },
                className
            )}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {loading ? (
                <i className={styles.spinner} aria-hidden="true" />
            ) : (
                <>
                    {" "}
                    {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
                    <span className={styles.content}>{children}</span>
                    {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
