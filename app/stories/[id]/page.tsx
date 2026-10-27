'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css'
import {Volume2} from 'lucide-react'
import Link from "next/link";



type Story = {
  id: number;
  title: string;
  image_url: string | null;
  content: string;
};

function StoryContent() {
  const { id } = useParams<{ id: string }>();

  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await fetch(`/api/stories/${id}`);

        if (!response.ok) {
          throw new Error('Story not found');
        }

        const data: Story = await response.json();
        setStory(data);
      } catch {
        setError('قصه پیدا نشد.');
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [id]);

  if (loading) return <p>در حال بارگذاری قصه...</p>;
  if (error || !story) return <p>{error || 'قصه پیدا نشد.'}</p>;









    async function handleReadAloud() {
    try {

        const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: story?.content,
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
    <main className={styles.main}>
      <h1>{story.title}</h1>

      {story.image_url && (
        <Image
          src={story.image_url}
          alt={story.title}
          width={250}
          height={200}
        />
      )}

      <article className={styles.article}>{story.content}</article>

    
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

        {audioUrl && (
          <audio
            controls
            autoPlay
            src={audioUrl}
            style={{ width: "100%", marginTop: "16px" }}
          />
        )}

        <Link href="/stories" className={styles.backLink}>بازگشت</Link>



    </main>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<p>در حال بارگذاری قصه...</p>}>
      <StoryContent />
    </Suspense>
  );
}