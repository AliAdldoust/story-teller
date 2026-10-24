"use client";

import storiesData from "@/data/stories";

import BackgroundSlider from "./components/BackgroundSlider";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";



import AuthStatus from "@/app/components/AuthStatus";

export default function Home() {
  return (
    <main>
      
      <section className={styles.section1}>

            <BackgroundSlider />

            <div className={styles.authStatus}>
                <AuthStatus />
            </div>

      </section>

      <section className={styles.section2}>

            <p>جدیدترین ها</p>

            {storiesData.map((story) => (
                    <Link
                      href={story.href}
                      className={styles.card}
                      key={story.id}
                    >
                      <Image
                        src={story.image}
                        alt={story.title}
                        width={300}
                        height={200}
                        className={styles.cardImage}
                      />

                      <h3 className={styles.cardTitle}>{story.title}</h3>
                    </Link>
              ))}

            <Link href="/stories" className={styles.allStories}> همه قصه ها </Link>


      </section>



      
      <section className={styles.section3}>
          <img
            src="/main2.gif"
            alt=""
            className={styles.backgroundGif}
          />

          <Link href="/create-story" className={styles.createStory}>
            <h1>قصه بسازید</h1>
          </Link>      
          
      </section>


      
      
      <section className={styles.section4}>
            <h2>درباره ما</h2>
            <h2>تماس با ما</h2>
      </section>
    </main>
  );
}