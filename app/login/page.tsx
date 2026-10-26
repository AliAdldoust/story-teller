"use client";

import styles from "./page.module.css";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";




export default function Login() {

    const [isRegister, setIsRegister] = useState(true);
    const [verificationCode, setVerificationCode] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState<"register" | "verify">("register");
    const [error, setError] = useState("");



    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [username, setUsername] = useState("")
    
    const router = useRouter();
    



    return(
        <main className={styles.container}>

                <section className={styles.loginSection}>

                    <Link href="/" className={styles.backLink}> بازگشت به خانه </Link>

                    <div>
                                <h1 className={styles.title}>خوش آمدید👋</h1>



                                {isRegister ? 
                                (
                                <>
                                        <p>برای ورود به حساب کاربری خود اطلاعاتتان را وارد کنید</p>


                                        <form className={styles.form} 
                                                onSubmit={(e) => {e.preventDefault();  handleLogin();}}>
                                            
                                            <label htmlFor="email">ایمیل</label>

                                            <input id="email" type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                            required placeholder="ایمیل خود را وارد کنید"></input>


                                            <label htmlFor="password">رمز عبور</label>

                                            <input id="password" type="password" 
                                                onChange={(e) => setPass(e.target.value)}
                                            required placeholder="رمز عبور خود را وارد کنید"></input>
            
                        

                                            <button type="submit" className={styles.button}>
                                                ورود به حساب کاربر
                                            </button>



                                            <p>
                                                هنوز حساب کاربری ندارید؟
                                                <button type="button" className={styles.button2}
                                                 onClick={() => 
                                                    setIsRegister(false)}>ثبت ‌نام کنید </button>
                                            </p>

                                        </form>
                                </>

                                ) : (

                                <>
                                    <button type="button" className={styles.backButton}
                                         onClick={() => setIsRegister(true)}>  بازگشت ←</button>


                                    <form className={styles.form} onSubmit={(e) => {e.preventDefault(); handleSignup()}}>

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

                                        <button type="submit" className={styles.button}>
                                                ثبت نام
                                        </button>
        

                                    </form>
                                    {message && <p role="status">{message}</p>}
                                    {error && <p role="alert">{error}</p>}
                        
                                
                                    {step === "verify" && (
                                        <form
                                            className={styles.form}
                                            onSubmit={handleVerifyEmail}
                                        >
                                            <h2>Verify your email 📧</h2>

                                            <p>
                                            Enter the six-digit code sent to:
                                            <br />
                                            <strong>{email}</strong>
                                            </p>

                                            <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            pattern="[0-9]{6}"
                                            required
                                            value={verificationCode}
                                            onChange={(e) =>
                                                setVerificationCode(
                                                e.target.value.replace(/\D/g, "").slice(0, 6)
                                                )
                                            }
                                            placeholder="Enter verification code"
                                            />

                                            <button type="submit" className={styles.button}>
                                                Verify email
                                            </button>
                                        </form>
                                    )}
                                    {message && <p role="status">{message}</p>}
                                    {error && <p role="alert">{error}</p>}
                            
                                  
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




    async function handleSignup(){
    
        try{
    
            const response = await fetch("/api/auth/signup", {
        
                    method:"POST",
                    headers:{
                                "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        username,
                        email,
                        password: pass,
                    })
        
            })
    
        
            const data =   await response.json()
    
            if (!response.ok){
                 setError(data.error || "Registration failed.");
                 return;
            }

            setStep("verify")
            setMessage("A verification code has been sent to your email.");

    
        
        }catch(error){
            setError("Could not connect to the server.");
        }
    
    }

    async function handleVerifyEmail(e: React.FormEvent<HTMLFormElement>){
             e.preventDefault();

        try{

            const response = await fetch("/api/auth/verify-email", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({

                    email,
                    code: verificationCode, 
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Email verification failed.");
                return;
                
    }
                setMessage("Email verified successfully! You can now log in.");
                setStep("register");
                setIsRegister(true);
               setVerificationCode(""); 




        }catch{

            setError("Could not verify the email.");
        }
    }
    
    async function handleLogin() {
                    
    
                try {
                    const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password: pass,
                    }),
                    });
    
                    const data = await response.json();
    
                    if (!response.ok) {
                        setError(data.error || "Login failed.");
                    return;
                    }
    
                    // Login succeeded: navigate to the profile page.
                    router.push("/profile");
                } catch {
                    setError("Could not login to the server.");
                }
        }


}







