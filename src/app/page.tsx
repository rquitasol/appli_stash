import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login/sign-in');
  return null;
}
