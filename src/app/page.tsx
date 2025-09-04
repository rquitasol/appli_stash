import { redirect } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { LoginForm } from '../components/forms/LoginForm';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF5FF]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#FAF5FF] rounded shadow border border-[#8B5CF6]">
        <h2 className="text-2xl font-bold text-center text-[#581C87]">Sign In</h2>
  <LoginForm />
        <div className="text-center text-sm text-[#8B5CF6]">
          Not signed in?{' '}
          <Link href="/register" className="text-[#581C87] hover:underline font-bold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
