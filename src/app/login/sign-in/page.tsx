
import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF5FF]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#FAF5FF] rounded shadow border border-[#8B5CF6]">
        <h2 className="text-2xl font-bold text-center text-[#581C87]">Sign In</h2>
        <form className="space-y-4">
          <Input
            label="Username"
            type="text"
            id="username"
            name="username"
            required
            className="border-[#8B5CF6] text-[#8B5CF6]"
          />
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            required
            className="border-[#8B5CF6] text-[#8B5CF6]"
          />
          <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#581C87] text-white">Login</Button>
        </form>
        <div className="text-center text-sm text-[#8B5CF6]">
          Not signed in?{' '}
          <Link href="/login/sign-up" className="text-[#581C87] hover:underline font-bold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
