"use client";

import { useEffect, useState } from "react";

type User = {
  username: string;
  email: string;
  bio?: string | null;
};



export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}