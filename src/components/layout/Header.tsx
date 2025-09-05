"use client";

import React from "react";
import { useUser } from "../context/UserContext";




export default function Header() {
  const { user, loading } = useUser();


  function handleSignOut() {
    fetch("/api/signout", { method: "POST" })
      .then(() => {
        window.location.href = "/";
      });
  }



  return (
    <header className="w-full h-full bg-primary text-accent flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold">AppliStash</h1>
      <nav className="flex items-center gap-4 text-accent">
        {!loading && user && (
          <span className="mr-4">Hi, {user.name}</span>
        )}
        <button
          className="ml-4 px-3 py-1 rounded bg-accent text-primary hover:bg-primary hover:text-accent border border-accent"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}
