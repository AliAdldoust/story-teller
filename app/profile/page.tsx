"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Profile() {

    return(
        <main className={styles.container}>

                <section>

                    <Link href="/" className={styles.backLink}>بازگشت به صفحه اصلی</Link>

                    <div>
                                <h1>خوش آمدید👋</h1>
                                <p>برای ورود به حساب کاربری خود اطلاعاتتان را وارد کنید</p>


                            <form>
                                <label htmlFor="email"></label>

                                <input id="email" type="email" required placeholder="ایمیل خود را وارد کنید"></input>


                                <label htmlFor="password"></label>

                                <input id="password" type="password" required placeholder="رمز عبور خود را وارد کنید"></input>

                                <button type="submit"> ورود به حساب کاربری</button>

                                <p>
                                    هنوز حساب کاربری ندارید؟
                                    <Link href="/register"> ثبت‌نام کنید</Link>
                                </p>

                            </form>
                    </div>
                    


                </section>


                <section>

                    <img src="/register.jpg" alt="register cover image"/>


                    <h2>به دنیای قصه‌ها خوش آمدید</h2>


                </section>






        </main>




    )
}