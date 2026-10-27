"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import {Volume2} from 'lucide-react'



export default function CreateStory() {
    const [step, setStep] = useState(1);
    const [story, setStory] = useState("");
    
    const [wordCount, setWordCount] = useState(100);
    const [keywords, setKeywords] = useState("");
    const [activeCard, setActiveCard] = useState(1);


    const [audioUrl, setAudioUrl] = useState("");


    const handleNext = () => {
    setStep(step+1);
        };







    async function handleReadAloud() {
    try {

        console.log("Selected voice:", activeCard === 1 ? "grandfather" : "grandmother");
        const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: story,
            voice: activeCard === 1 ? "grandfather" : "grandmother"
        }),
        });
        
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || error.error || "TTS failed");
        }
        

        // Get the raw PCM bytes from the backend.
        const arrayBuffer = await response.arrayBuffer();

        // PCM settings — these must match the format returned by your API.
        const sampleRate = 24000;
        const audioContext = new AudioContext({ sampleRate });

        await audioContext.resume();

        // Convert signed 16-bit PCM samples to Float32 samples.
        const pcmData = new Int16Array(arrayBuffer);
        const audioBuffer = audioContext.createBuffer(
          1,
          pcmData.length,
          sampleRate
        );

        const channelData = audioBuffer.getChannelData(0);

        for (let i = 0; i < pcmData.length; i++) {
          channelData[i] = pcmData[i] / 32768;
        }

        // Play the audio.
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
          
        
    } catch (error) {
        console.error("Error reading story:", error);
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
                            onChange={(e) => setWordCount(Number(e.target.value))}
                            className={styles.input}
                            />

                            <button type="button" onClick={handleNext} className={styles.button}>
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
                                    keywords.split(",").map(words => words.trim()), wordCount
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


                                        <div
                                            className={activeCard === 1 ? styles.activeCard : styles.card}
                                            onClick={() => setActiveCard(1)}>
                                            <img src="/image1.jpeg" alt="Card 1" />
                                        </div>


                                        <div
                                            className={activeCard === 2 ? styles.activeCard : styles.card}
                                            onClick={() => setActiveCard(2)}>
                                            <img src="/image3.jpg" alt="Card 2" />
                                        </div>




                                        <button
                                        type="button"
                                        onClick={handleReadAloud}
                                        aria-label=" قصه را بخوان"
                                        className={styles.soundButton}
                                        >
                                        <Volume2 size={22} />
                                        </button>
                                    </div>
                                    {audioUrl && (
                                            <audio
                                                controls
                                                autoPlay
                                                src={audioUrl}
                                                style={{ width: "100%", marginTop: "16px" }}
                                            />
                                            )}
                            <button  className={styles.createStory} onClick={() => window.location.reload()}>دوباره</button>
                        </div>
                    )}



    </main>
  );
}



async function generateStory(words: string[], number:number) {

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

