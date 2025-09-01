import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import styles from "./CourseSlider.module.scss";
import { CourseListGetType, CourseType } from "../../types/CourseType";
import Card from "../card";

type Props = {
    courses: CourseListGetType[];
    /** Giá trị mặc định cho desktop lớn; sẽ bị override theo breakpoint */
    perView?: number; // số item hiển thị (desktop default)
    gap?: number; // px giữa item (desktop default)
    duration?: number; // ms transition
    step?: number; // số item trượt mỗi lần
    className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** Desktop-first settings theo width container (khớp breakpoints SCSS) */
const getResponsiveSettings = (w: number, desktopDefaults: { perView: number; gap: number }) => {
    // breakpoints: sm 576, md 768, lg 992, xl 1200, xxl 1400
    if (w >= 1400) return { perView: Math.max(1, desktopDefaults.perView + 1), gap: desktopDefaults.gap + 2 };
    if (w >= 1200) return { perView: desktopDefaults.perView, gap: desktopDefaults.gap };
    if (w >= 992) return { perView: Math.max(1, desktopDefaults.perView - 1), gap: Math.max(4, desktopDefaults.gap - 2) };
    if (w >= 768) return { perView: Math.max(1, desktopDefaults.perView - 2), gap: Math.max(4, desktopDefaults.gap - 2) };
    return { perView: 2, gap: 10 }; // mobile nhỏ
};

type CSSVarProps = React.CSSProperties & { [key: `--${string}`]: string | number };

export default function CourseSlider({
    courses,
    perView: perViewDesktop = 5,
    gap: gapDesktop = 12,
    duration = 300,
    step = 1,
    className,
}: Props) {
    const total = courses.length;
    const [index, setIndex] = useState(0);

    const maskRef = useRef<HTMLDivElement>(null);

    // đo width container + theo dõi thay đổi
    const [viewportWidth, setViewportWidth] = useState(0);
    const [{ perView, gap }, setResp] = useState(() => getResponsiveSettings(1440, { perView: perViewDesktop, gap: gapDesktop }));

    useLayoutEffect(() => {
        if (!maskRef.current) return;

        const measure = () => {
            const w = maskRef.current?.clientWidth ?? 0;
            setViewportWidth(w);
            setResp((prev) => {
                const next = getResponsiveSettings(w, { perView: perViewDesktop, gap: gapDesktop });
                // nếu perView đổi, clamp lại index để không vượt biên
                if (next.perView !== prev.perView) {
                    setIndex((i) => clamp(i, 0, Math.max(0, total - next.perView)));
                }
                return next;
            });
        };

        // đo lần đầu
        measure();

        // theo dõi resize của container
        const ro = new ResizeObserver(() => measure());
        ro.observe(maskRef.current);

        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perViewDesktop, gapDesktop, total]);

    // mỗi bước (px) = width 1 slide + 1 gap = (V + g) / k
    const perStepPx = useMemo(() => (viewportWidth + gap) / Math.max(1, perView), [viewportWidth, gap, perView]);

    // width thực tế của 1 slide (không gồm gap) để gán cho item
    const slideWidth = useMemo(() => Math.max(0, perStepPx - gap), [perStepPx, gap]);

    // tổng dịch chuyển
    const translatePx = useMemo(() => -(index * perStepPx), [index, perStepPx]);

    // max index hợp lệ (cho phép dừng ở frame cuối vừa khít)
    const maxIndex = useMemo(() => Math.max(0, total - perView), [total, perView]);

    const slideTo = (i: number) => setIndex(clamp(i, 0, maxIndex));
    const prev = () => slideTo(index - step);
    const next = () => slideTo(index + step);

    const viewportStyle: CSSVarProps = {
        "--gap": `${gap}px`,
        "--duration": `${duration}ms`,
    };

    return (
        <section className={clsx(styles.slider, className)} aria-roledescription="carousel" aria-label="Sản phẩm">
            <div className={styles.viewport} style={viewportStyle}>
                {/* Arrow trái */}
                <button className={clsx(styles.arrow, styles.left)} onClick={prev} disabled={index === 0} aria-label="Previous">
                    ‹
                </button>

                {/* Mask + Track */}
                <div className={styles.mask} ref={maskRef}>
                    <div
                        className={styles.track}
                        style={{ transform: `translate3d(${translatePx}px, 0, 0)`, transitionDuration: `var(--duration)` }}
                    >
                        {courses.length > 0 &&
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className={styles.slide}
                                    style={{ minWidth: `${slideWidth}px`, width: `${slideWidth}px` }}
                                >
                                    <Card course={course} />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Arrow phải */}
                <button
                    className={clsx(styles.arrow, styles.right)}
                    onClick={next}
                    disabled={index >= maxIndex}
                    aria-label="Next"
                >
                    ›
                </button>
            </div>
        </section>
    );
}
