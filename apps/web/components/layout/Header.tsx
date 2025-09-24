"use client";

import React from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { user, loading } = useUser();

  function handleSignOut() {
    fetch("/api/signout", { method: "POST" })
      .then(() => {
        window.location.href = "/";
      });
  }

  return (
    <header className="w-full h-full bg-primary text-accent flex items-center justify-between px-4 py-3 shadow-md">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-36 h-12">
            <Image
              src="/images/logo.png"
              alt="AppliStash Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
      
      

      <nav className="flex items-center gap-2 md:gap-4 text-accent">
        {!loading && user && (
          <span className="hidden md:inline mr-2 md:mr-4 text-sm md:text-base">Hi, {user.name}</span>
        )}
        <button
          className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-base rounded bg-accent text-primary hover:bg-primary hover:text-accent border border-accent transition-colors"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}
