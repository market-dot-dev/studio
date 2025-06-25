import styles from "./loading-spinner.module.css";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={className + " " + styles.container}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
