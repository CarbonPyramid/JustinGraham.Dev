import React from "react";
import Lottie from "lottie-react";
import animationData from "./animations/42070-travel-is-fun.json";
import styles from './popover/lottiepop/app.module.scss';

const Hover = ({ onHover, children }) => (
  <div className={styles.hover}>
    <div className={styles.hover__no}>{children}</div>
    <div className={styles.hover__hover}>{onHover}</div>
  </div>
);

export default function LottieWrapper() {
  return (
    <div>
      <Hover onHover={<div className={styles.center}> </div>}>
        <a href="/Lottie">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ height: 400, width: 400 }}
          />
        </a>
      </Hover>
    </div>
  );
}
