import styles from "./CoursePriceBox.module.scss";

type Props = {
  priceText: string;
  onBuy: () => void;
};

export default function CoursePriceBox({ priceText, onBuy }: Props) {
  return (
    <>
      <aside className={styles.sidebarBox} aria-label="Purchase box">
        <div className={styles.card}>
          <div className={styles.price}>{priceText}</div>
          <button className={styles.buyBtn} onClick={onBuy}>
            Buy now
          </button>
          <div className={styles.note}>30-day money-back guarantee</div>
        </div>
      </aside>

      <div className={styles.mobileBar}>
        <div className={styles.mobilePrice}>{priceText}</div>
        <button className={styles.mobileBuy} onClick={onBuy}>
          Buy now
        </button>
      </div>
    </>
  );
}
