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