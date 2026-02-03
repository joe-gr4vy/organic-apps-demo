// src/app/subscription/checkout/page.js
'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CheckoutContent from './CheckoutContent';

function CheckoutWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const market = searchParams.get('market') || 'US';
  const interval = searchParams.get('interval');
  const price = searchParams.get('price');
  const label = searchParams.get('label');

  const handleMarketChange = (newMarket) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('market', newMarket);
    router.push(`/subscription/checkout?${params.toString()}`);
  };

  const markets = [
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: 'EUR', symbol: '€' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', symbol: 'R$' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' }
  ];

  return (
    <>
      {/* Country Selector Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(16, 185, 129, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          color: 'white', 
          fontSize: '14px', 
          fontWeight: '600',
          marginRight: '8px'
        }}>
          Country:
        </span>
        {markets.map(m => (
          <button
            key={m.code}
            onClick={() => handleMarketChange(m.code)}
            style={{
              padding: '8px 16px',
              background: market === m.code 
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '12px',
              color: market === m.code ? '#10B981' : 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: market === m.code ? '700' : '500',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (market !== m.code) {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (market !== m.code) {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            <span>{m.flag}</span>
            <span>{m.code}</span>
          </button>
        ))}
      </div>

      {/* Add padding to account for fixed header */}
      <div style={{ paddingTop: '70px' }}>
        <CheckoutContent
          market={market}
          interval={interval}
          price={price}
          label={label}
        />
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        Loading checkout...
      </div>
    }>
      <CheckoutWrapper />
    </Suspense>
  );
}