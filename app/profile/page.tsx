"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Profile() {

    return(
        <main className={styles.container}>

                <section className={styles.loginSection}>

                    <Link href="/" className={styles.backLink}>بازگشت به صفحه اصلی</Link>

                    <div>
                                <h1>خوش آمدید👋</h1>
                                <p>برای ورود به حساب کاربری خود اطلاعاتتان را وارد کنید</p>


                            <form className={styles.form}>
                                <label htmlFor="email">ایمیل</label>

                                <input id="email" type="email" required placeholder="ایمیل خود را وارد کنید"></input>


                                <label htmlFor="password">رمز عبور</label>

                                <input id="password" type="password" required placeholder="رمز عبور خود را وارد کنید"></input>
  
                                <button type="submit" className={styles.button}> ورود به حساب کاربری</button>

                                <p>
                                    هنوز حساب کاربری ندارید؟
                                    <Link href="/register" className={styles.backLink}> ثبت‌نام کنید</Link>
                                </p>

                            </form>

                    </div>
                    
                </section>




                <section className={styles.imageSection}>

                    <img src="/register.jpg" alt="register cover image" 
                                className={styles.image}/>

                </section>

        </main>




    )
}