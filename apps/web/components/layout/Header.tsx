"use client";

import React from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, loading } = useUser();
  const pathname = usePathname();

  function handleSignOut() {
    fetch("/api/signout", { method: "POST" })
      .then(() => {
        window.location.href = "/";
      });
  }

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/contacts", label: "Contacts" },
  ];

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
      
      {/* Navigation Links */}
      {!loading && user && (
        <nav className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                pathname === link.href
                  ? "text-secondary border-b-2 border-secondary pb-1"
                  : "text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

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
