"use client";

import storiesData from "@/data/stories";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { House, Phone, User, Menu } from "lucide-react";

export default function Home() {
  return (
    <main>
      
      <section className={styles.section1}>

        <img src='/main.png' className={styles.mainImage}/>

        <Link href="/profile" className={styles.user}>
                  <User  className={styles.icon}/>
                  <p> حساب کاربری </p>
        </Link>

        <h1 className={styles.title}>مادربزرگ قصه گو </h1>

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