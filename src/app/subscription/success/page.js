// src/app/subscription/success/page.js
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  
  const txn = searchParams.get('txn');
  const interval = searchParams.get('interval');
  const amount = searchParams.get('amount');
  const market = searchParams.get('market');

  const currencies = {
    IE: '€',
    GB: '£',
    US: '$',
    BR: 'R$',
    AE: 'د.إ'
  };

  const symbol = currencies[market] || '$';
  const accentColor = '#FF6B6B';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%'
      }}>
        {/* Success Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px 28px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: '#F0FDF4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            ✓
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '12px'
          }}>
            Welcome to OrganicApps!
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '15px',
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Your subscription is now active. Get ready to transform your health journey!
          </p>

          {/* Order Details */}
          <div style={{
            background: '#F9FAFB',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#999',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Order Details
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Plan</span>
              <span style={{ color: '#1a1a1a', fontSize: '14px', fontWeight: '600' }}>
                {interval}-Week Plan
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Amount</span>
              <span style={{ color: accentColor, fontSize: '14px', fontWeight: '700' }}>
                {symbol}{amount}
              </span>
            </div>

            {txn && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #E5E7EB'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#999',
                  marginBottom: '4px'
                }}>
                  Transaction ID
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {txn}
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div style={{
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '16px'
            }}>
              What's next?
            </div>
            
            {[
              '📱 Download the OrganicApps mobile app',
              '🎯 Complete your personalized assessment',
              '💪 Start your first workout today',
              '🎁 Explore your meal plan recommendations'
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                fontSize: '14px',
                color: '#666'
              }}>
                {step}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = '/subscription'}
            style={{
              width: '100%',
              padding: '16px',
              background: `linear-gradient(135deg, ${accentColor} 0%, #E55555 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'transform 0.2s'
            }}
          >
            Get Started Now
          </button>

          {/* Support Link */}
          <div style={{
            fontSize: '13px',
            color: '#999'
          }}>
            Need help? <a href="mailto:support@myorganicapps.com" style={{
              color: accentColor,
              textDecoration: 'none',
              fontWeight: '600'
            }}>Contact Support</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#999'
        }}>
          A confirmation email has been sent to your inbox
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        Loading...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}