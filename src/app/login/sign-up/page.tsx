import React from 'react';
import Link from 'next/link';
import { SignUpForm } from '../../../components/forms/SignUpForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF5FF]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#FAF5FF] rounded shadow border border-[#8B5CF6]">
        <h2 className="text-2xl font-bold text-center text-[#581C87]">Register</h2>
  <SignUpForm />
        <div className="text-center text-sm text-[#8B5CF6]">
          Already have an account?{' '}
          <Link href="/login/sign-in" className="text-[#581C87] hover:underline font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
