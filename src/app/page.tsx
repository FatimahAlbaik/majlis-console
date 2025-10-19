import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to feed page as default
  redirect('/feed');
}