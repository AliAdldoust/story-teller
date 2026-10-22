"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function CreateStory() {
    const [step, setStep] = useState(1);
    const [wordCount, setWordCount] = useState(100);
    const [keywords, setKeywords] = useState("");

    const [story, setStory] = useState("");

    const handleNext = () => {
    setStep(step+1);
        };



  return (


    <main className={styles.container}>

        <section>
            <Link href="/" className={styles.backLink}>
                        بازگشت به صفحه اصلی
            </Link>

        </section>

    {step === 1 && (
        <div>

                    <form className={`${styles.form} ${step === 1 ? styles.visible : styles.hidden}`}>
                            <h1 className={styles.title}>قصه‌ات چند کلمه باشد؟ 📚</h1>

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

                        <h1>چه کلماتی در داستان باشند؟</h1>

                        <p>
                        کلمات دلخواه خود را وارد کنید تا در داستان استفاده شوند
                        </p>

                        <label htmlFor="keywords">
                       : کلمات موردنظر
                        </label>

                        <textarea
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="مثلاً: جنگل، اژدها، دوستی..."
                        className={styles.input}
                        />

                        <button
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
                            <h1>داستان شما آماده است! 📚</h1>

                            <p>{story}</p>
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

