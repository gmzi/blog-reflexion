import styles from './logo.module.css'

const Logo = () => (
  <div className={"logoContainer"}>
    <span className={"logoTitle"}>
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

/*
<div className="logoContainer">
  <span className="logoTitle">
    <span className="logoName">{data.site_name}</span>
  </span>
</div >
*/
