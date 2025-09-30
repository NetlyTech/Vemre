import styles from './OverlayLoader.module.css';
export default function OverlayLoader() {
    return (
      <div className={styles.overlay}>
        {/* <div className={styles.spinner}></div> */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-800 border-t-transparent mb-4" />
      </div>
    );
  }