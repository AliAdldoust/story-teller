"use client";

import styles from "./page.module.css";
import Link from "next/link";
import {useState} from "react"

 

export default function Profile() {

    const [isRegister, setIsRegister] = useState(true);
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [username, setUsername] = useState("")





    return(
        <main className={styles.container}>

                <section className={styles.loginSection}>

                    <Link href="/" className={styles.backLink}>بازگشت به صفحه اصلی</Link>

                    <div>
                                <h1 className={styles.title}>خوش آمدید👋</h1>



                                {isRegister ? 
                                (
                                <>
                                        <p>برای ورود به حساب کاربری خود اطلاعاتتان را وارد کنید</p>


                                        <form className={styles.form}>
                                            
                                            <label htmlFor="email">ایمیل</label>

                                            <input id="email" type="email" required placeholder="ایمیل خود را وارد کنید"></input>


                                            <label htmlFor="password">رمز عبور</label>

                                            <input id="password" type="password" required placeholder="رمز عبور خود را وارد کنید"></input>
            
                                            <button type="button" className={styles.button}> ورود به حساب کاربری</button>

                                            <p>
                                                هنوز حساب کاربری ندارید؟
                                                <button type="button" className={styles.button2}
                                                 onClick={() => 
                                                    setIsRegister(false)}>ثبت‌نام کنید</button>
                                            </p>

                                        </form>
                                </>

                                ) : (
                                <>
                                    <button type="button" className={styles.backButton}
                                         onClick={() => setIsRegister(true)}>  بازگشت ←</button>


                                    <form className={styles.form}>

                                        <label htmlFor="username">نام</label>

                                        <input id="username"
                                            required placeholder="برای خود نام انتخاب کنید"
                                            onChange={(e) => setUsername(e.target.value)}>

                                        </input>




                                        <label htmlFor="email">ایمیل</label>

                                        <input id="email" type="email"
                                            required placeholder="ایمیل خود را وارد کنید"
                                            onChange={(e) => setEmail(e.target.value)}></input>


                                        <label htmlFor="password">رمز عبور</label>



                                        <input id="password" type="password" 
                                            required placeholder="رمز عبور خود را تعیین کنید"
                                            onChange={(e) => setPass(e.target.value)}></input>
        

                                        <button type="button" className={styles.button} 
                                            onClick={() => (setIsRegister(true), createUser(username, email, pass))}>ثبت‌نام</button>

                                    </form>
                                
                                </>
                                )}

                    </div>
                    
                </section>




                <section className={styles.imageSection}>

                    <img src="/register.jpg" alt="register cover image" 
                                className={styles.image}/>

                </section>

        </main>




    )
}



async function createUser(userName: string, userEmail:string, userPass:string){

    try{

        const response = await fetch("/api/auth/signup", {
    
                method:"POST",
                headers:{
                            "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    username: userName,
                    email:userEmail,
                    password:userPass
                })
    
    
        })
    
              const result =   await response.json()
                console.log(result);

    }catch(error){
        console.error("Signup error:", error);
    }



}