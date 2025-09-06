import useScrollDirection from "../../hooks/useScrollDirection";
import useStickyGate from "../../hooks/useStickyGate";
import { CourseType } from "../../types/CourseType";
import styles from "./CourseStickyHeader.module.scss";

// type Props = {
//     course: CourseType
// }

// Demo
type Props = {
  title: string;
  rating: number;
  ratingCount: number;
  priceText: string;
  onBuy: () => void;
};
export default function CourseStickyHeader({
  title,
  onBuy,
  priceText,
  rating,
  ratingCount,
}: Props) {
  const dir = useScrollDirection();
  const passedHero = useStickyGate("target-id");
  const visible = passedHero && dir === "down";
  return (
    <div
      className={`${styles.sticky} ${visible ? styles.show : ""}`}
      role="region"
      aria-label="Course quick header"
    >
      <div className={styles.inner}>
        <div className={styles.meta}>
          <h3 className={styles.title} title={title}>
            {title}
          </h3>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span>{rating.toFixed(1)}</span>
            <span className={styles.count}>({ratingCount})</span>
          </div>
        </div>
        <div className={styles.cta}>
          <span className={styles.price}>{priceText}</span>
          <button className={styles.buyBtn} onClick={onBuy}>
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
