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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%'
      }}>
        {/* Success Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
          }}>
            ✓
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            Welcome to OrganicApps!
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Your subscription is now active. Get ready to transform your health journey!
          </p>

          {/* Order Details */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
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
              <span style={{ color: '#6b7280', fontSize: '15px' }}>Plan</span>
              <span style={{ color: '#1f2937', fontSize: '15px', fontWeight: '600' }}>
                Every {interval} Weeks
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6b7280', fontSize: '15px' }}>Amount</span>
              <span style={{ color: '#10B981', fontSize: '15px', fontWeight: '700' }}>
                {symbol}{amount}
              </span>
            </div>

            {txn && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  marginBottom: '4px'
                }}>
                  Transaction ID
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
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
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              What's next?
            </div>
            
            {[
              '📱 Download the OrganicApps mobile app',
              '🎯 Complete your personalized assessment',
              '💪 Start your first workout today',
              '🍎 Explore your meal plan recommendations'
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                fontSize: '14px',
                color: '#6b7280'
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
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started Now
          </button>

          {/* Support Link */}
          <div style={{
            fontSize: '13px',
            color: '#9ca3af'
          }}>
            Need help? <a href="mailto:support@myorganicapps.com" style={{
              color: '#10B981',
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
          color: '#9ca3af'
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