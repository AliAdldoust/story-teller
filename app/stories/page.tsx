"use client";


import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

import {useState, useEffect} from 'react'




type Story = {
  id: number | string;
  title: string;
  content: string;
  image_url: string | null;
};

     
export default function Stories(){
  const [stories, setStories] = useState<Story[]>([]);

  

useEffect(() => {

  async function fetchStories(){

    try{
      const response = await fetch("/api/stories")

      if (!response.ok){
            throw new Error("Failed to fetch stories");
      }

      const data:Story[] = await response.json()
      setStories(data);


    }catch(error){
        console.error(error);
    }


  }

  fetchStories()

}, [])





    return (
        <section className={styles.section2}>
   
              <p> «اینجا قصهها زنده اند؛ فقط کافی است چشمهایت را ببندی و گوش کنی.»</p>
   
              <div className={styles.cardsContainer}>
                {stories.map((story) => (
                  <div key={story.id} className={styles.card}>
                    {story.image_url && (
                      <Image
                        src={story.image_url}
                        alt={story.title}
                        width={300}
                        height={200}
                        className={styles.cardImage}
                      />
                    )}

                    <h3 className={styles.cardTitle}>{story.title}</h3>
                  </div>
                ))}
              </div>

              <Link href="/" className={styles.allStories}>
                بازگشت به خانه
              </Link>
                
   
         </section>


    )
}   