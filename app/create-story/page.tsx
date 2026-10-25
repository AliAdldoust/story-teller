"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import {Volume2} from 'lucide-react'





export default function CreateStory() {
    const [step, setStep] = useState(1);
    const [wordCount, setWordCount] = useState(100);
    const [keywords, setKeywords] = useState("");

    const [story, setStory] = useState("");

    const handleNext = () => {
    setStep(step+1);
        };








   async function handleReadAloud() {
    try {

        const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: story,
        }),
        });

        if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not generate audio.");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);

        audio.onended = () => URL.revokeObjectURL(audioUrl);

        await audio.play();
    } catch (error) {
        console.error("Audio error:", error);
        alert(
        error instanceof Error
            ? error.message
            : "Could not play the story."
        );
    }
    }











  return (


    <main className={styles.container}>

        <section>
                <Link href="/" className={styles.backLink}>
                      برگشت به خانه 
                </Link>

        </section>

    {step === 1 && (
        <div>

                    <form className={`${styles.form} ${step === 1 ? styles.visible : styles.hidden}`}>
                            <h1 className={styles.title}>قصت چند کلمه باشه؟ 📚</h1>

                            <p className={styles.description}>
                            ! تعداد کلمات قصه‌ات را انتخاب کن
                            </p>

                            <label htmlFor="wordCount" className={styles.label}>
                            تعداد کلمات
                            </label>

                            <input
                            id="wordCount"
                            type="number"
                            min="10"
                            max="2000"
                            step="10"
                            value={wordCount}
                            onChange={(e) => setWordCount(e.target.value)}
                            className={styles.input}
                            />

                            <button onClick={handleNext} className={styles.button}>
                            ادامه ✨
                            </button>
                    </form>


        </div>)}


    




            {/* Second form */}
    {step === 2 && (
        <div>                 
                <form className={`${styles.form} ${step === 2 ? styles.visible : styles.hidden}`}>

                        <h1>چه کلماتی تو داستانت باشن؟</h1>

                        <p>
                        کلماتتو وارد کن تا داستانت با اونا باشن  
                        </p>

                        <label htmlFor="keywords">
                       :کلمات 
                        </label>

                        <textarea
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="مثلاً: جنگل، اژدها، دوستی..."
                        className={styles.input}
                        />

                        <button
                            className={styles.createStory}
                            type="button"
                            onClick={async () => {
                                const generatedStory = await generateStory(
                                    keywords.split(",").map(word => word.trim()), wordCount
                                );
                                setStory(generatedStory);
                                handleNext();
                            }}
                        >
                            ساخت داستان
                        </button>

                </form>
        </div>)}


    {step === 3 && (
                        <div className={styles.form}>
                            <h1> از داستانت لذت ببر </h1>
                            <p>{story}</p>
                                    <div className={styles.readAloud}>
                                        <p className={styles.readStory}>قصه را بخوان</p>

                                        <button
                                        type="button"
                                        onClick={handleReadAloud}
                                        aria-label=" قصه را بخوان"
                                        className={styles.soundButton}
                                        >
                                        <Volume2 size={22} />
                                        </button>
                                    </div>
                            <button  className={styles.createStory} onClick={() => window.location.reload()}>دوباره</button>
                        </div>
                    )}






    </main>
  );
}



async function generateStory(words, number) {

    const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ words, number }),
    });

    const text = await response.text();

    console.log("Server status:", response.status);
    console.log("Server response:", text);

    if (!response.ok) {
        throw new Error(text || "Backend request failed");
    }

    const data = JSON.parse(text);
    return data.story;
}

