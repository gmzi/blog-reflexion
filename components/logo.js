import styles from './logo.module.css'
import { data } from '../lib/data'

const Logo = () => (
  <div className={styles.container}>
    <span className={styles.title}>
      {/* <svg className={styles.svg} width="10" height="10" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h20v20H19z" fill="#000" fillRule="evenodd" />
      </svg> */}
      <div className={styles.charContainer}>
        <span className={styles.char}>
          R
        </span>
        <span className={styles.char}>
          &#x18E;
        </span>
        <span className={styles.char}>
          M
        </span>
      </div>
      <span>
        |
      </span>
      <span>
        reflexión en música
      </span>
    </span>
  </div >
);

export default Logo;
