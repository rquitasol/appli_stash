import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full h-full bg-slate-800 text-accent flex items-center justify-center px-8 text-center">
      <span>&copy; {new Date().getFullYear()} AppliStash. All rights reserved.</span>
    </footer>
  );
}
