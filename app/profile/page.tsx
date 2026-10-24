"use client";

import { useEffect, useState } from "react";
import styles from './page.module.css'

import { useRouter } from "next/navigation";

import Link from 'next/link'

type User = {
  username: string;
  email: string;
  bio?: string | null;
};



export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/me");

        if (response.status === 401) {
          setError("Please log in to view your profile.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load profile.");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

        loadProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>No user profile found.</p>;
    }





    


    async function handleLogout(){

        try{

            const response = await fetch("/api/auth/logout", {
                method: "POST"
            })

            if (!response.ok) {
            throw new Error("Failed to log out.");
        }

        setUser(null);
        router.push("/");
        router.refresh();


        }catch(error){

            console.error("Logout error:", error);
        }


    }







    return (
    <main className={styles.profilePage} dir="rtl">

        {/* Welcome section */}
        <section className={styles.welcome}>
            <div>
                <span className={styles.eyebrow}>✨ دنیای قصه‌های تو ✨</span>
                <h1>سلام {user.username}! 👋</h1>
            </div>

            <div className={styles.avatar}>
                🧙‍♀️
            </div>
        </section>

        {/* Account information */}
        <section className={styles.accountSection}>
            <h2>👤 اطلاعات حساب کاربری</h2>

            <div className={styles.accountCard}>
                <div className={styles.infoRow}>
                    <span className={styles.infoIcon}>😊</span>
                    <div>
                        <span className={styles.infoLabel}>نام کاربری</span>
                        <p>{user.username}</p>
                    </div>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.infoIcon}>📧</span>
                    <div>
                        <span className={styles.infoLabel}>ایمیل</span>
                        <p dir="ltr">{user.email}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Favorite stories */}
        <section className={styles.favoritesSection}>
            <div className={styles.sectionHeading}>
                <div>
                    <h2>💖 قصه‌های محبوب من</h2>
                </div>


            </div>

            <div className={styles.emptyFavorites}>
                <span className={styles.emptyIcon}>📖</span>
                <h3>هنوز قصه‌ای اضافه نکردی!</h3>
                <p>
                    قصه‌های موردعلاقه‌ات را پیدا کن و آن‌ها را اینجا نگه دار
                    تا همیشه در دسترست باشند.
                </p>
                <Link href="/stories" className={styles.favoriteButton}>
                    کشف قصه‌های تازه 📚
                </Link>
            </div>
        </section>


        <section className={styles.logoutSection}>
            <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
            >
            " خروج از حساب کاربری"
            </button>
        </section>
    </main>
);
}