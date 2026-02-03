'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/subscription');
  }, [router]);
  
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      Redirecting to OrganicApps...
    </div>
  );
}