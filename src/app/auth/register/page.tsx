import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-4">
          <Input
            label="Username"
            type="text"
            id="username"
            name="username"
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            required
          />
          <Button type="submit">Register</Button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
