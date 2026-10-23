"use client";

import { useEffect, useState } from "react";
import styles from "./BackgroundSlider.module.css";

const images = [
  "/main.png",
  "/main2.jpg",
  "/main3.jpg",
  "/main7.jpg",
];

export default function BackgroundSlider() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      {images.map((image, index) => (
        <div
          key={image}
          className={`${styles.slide} ${
            index === currentImage ? styles.active : ""
          }`}
          style={{ backgroundImage: `url("${image}")` }}
        />
      ))}
    </div>
  );
}