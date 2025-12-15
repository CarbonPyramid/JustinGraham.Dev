import React from "react";
import Lottie from "lottie-react";
import animationData from "./animations/42070-travel-is-fun.json";
import styles from './popover/lottiepop/app.module.scss';

export default function LottieWrapper() {
  return (
    <div className={styles.center}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ height: 400, width: 400 }}
        />
    </div>
  );
}
