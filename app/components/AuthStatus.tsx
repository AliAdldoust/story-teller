
import {useState, useEffect} from 'react'
import { User } from "lucide-react";
import styles from "./AuthStatus.module.css";
import Link from 'next/link'



type UserData = {
  id: string | number;
  username: string;
  email: string;
};

export default function AuthStatus(){


   const  [user, setUser]  = useState<UserData | null>(null);

    useEffect (() => {
        async function checkLogin(){
            
                try {
                    
                    const response = await fetch("/api/me", {
                          cache: "no-store",
                        });
                
                
                        if (response.ok){
                           const data = await response.json()
                           setUser(data.user);
                        } else {
                            setUser(null)
                        }
            
                }catch(error ){
                     console.error("Could not check login status:", error);
                    setUser(null);
                }
            }

            checkLogin();

        },[])


        return (

            <Link
                    href={user ? "/profile" : "/login"}
                    className={styles.authLink}>
                  {user? (
                                <span className={styles.avatar}>🧙‍♀️</span>
                            ) : (
                                <User size={28} />
                            )}

                            <span>
                                {user ? user.username : "ورود"}
                            </span>
                        
                                
            
            </Link>
        )

}