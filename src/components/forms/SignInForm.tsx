import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SignInForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        required
      />
      <Input
        label="Password"
        type="password"
        id="password"
        name="password"
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
