// src/app/subscription/checkout/CheckoutContent.js
'use client';
import { useState, useEffect, useRef } from 'react';

export default function CheckoutContent({ market, interval, price, label }) {
  const [Embed, setEmbed] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const embedRef = useRef(null);

  const priceFloat = parseFloat(price) || 0;
  const priceCents = Math.round(priceFloat * 100);

  // Currency mapping
  const currencies = {
    IE: { symbol: '€', code: 'EUR' },
    GB: { symbol: '£', code: 'GBP' },
    US: { symbol: '$', code: 'USD' },
    BR: { symbol: 'R$', code: 'BRL' },
    AE: { symbol: 'د.إ', code: 'AED' }
  };

  // Country code mapping for Gr4vy
  const countryMapping = {
    IE: 'IE',
    GB: 'GB',
    US: 'US',
    BR: 'BR',
    AE: 'AE'
  };

  const currency = currencies[market];
  const countryCode = countryMapping[market];

  // Fetch token
  useEffect(() => {
    console.log('Fetching token for amount:', priceCents, 'cents, currency:', currency.code, 'country:', countryCode);
    
    fetch(`/api/token-organic?amount=${priceCents}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Token error:', data.error);
          setError(data.error);
        } else {
          console.log('Token received');
          setToken(data.token);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, [priceCents, currency.code, countryCode]);

  // Load SDK
  useEffect(() => {
    if (!token) return;
    
    import('@gr4vy/embed-react').then((mod) => {
      setEmbed(() => mod.default || mod.Embed);
    }).catch(err => setError(err.message));
  }, [token]);

  const handlePayment = (e) => {
    e.preventDefault();
    // Let Gr4vy handle via form prop
  };

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        background: '#fee', 
        color: '#c00', 
        borderRadius: '16px',
        margin: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        paddingTop: '20px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'white',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🌱
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              letterSpacing: '-0.5px'
            }}>
              OrganicApps
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            letterSpacing: '-0.3px'
          }}>
            Order Summary
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {label}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Subscription Plan
              </div>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#10B981',
              textAlign: 'right'
            }}>
              {currency.symbol}{priceFloat.toFixed(2)}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '8px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Total
            </span>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#10B981'
            }}>
              {currency.symbol}{priceFloat.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            letterSpacing: '-0.3px'
          }}>
            Payment Details
          </h2>

          {!token || !Embed ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Loading payment options...
            </div>
          ) : (
            <form id="organic-payment-form" onSubmit={handlePayment}>
              <div style={{ minHeight: '400px', marginBottom: '20px' }}>
                <Embed
                  ref={embedRef}
                  gr4vyId="partners"
                  environment="sandbox"
                  token={token}
                  amount={priceCents}
                  currency={currency.code}
                  country={countryCode}
                  form="#organic-payment-form"
                  metadata={{
                    merchant_account_id: 'organic-apps',
                    subscription_interval: interval
                  }}
                  onEvent={(name, data) => {
                    console.log(`EVENT [${name}]:`, data);
                  }}
                  onComplete={(transaction) => {
                    console.log('Transaction:', transaction);
                    const params = new URLSearchParams({
                      txn: transaction.id,
                      interval,
                      amount: priceFloat.toFixed(2),
                      market
                    });
                    window.location.href = `/subscription/success?${params.toString()}`;
                    return false;
                  }}
                  onError={(error) => {
                    console.error('Payment error:', error);
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
                }}
              >
                Start Subscription
              </button>
            </form>
          )}
        </div>

        {/* Security badge */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '16px',
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          <div style={{ marginBottom: '8px' }}>🔒 Secure payment powered by Gr4vy</div>
          <div>Your payment information is encrypted and secure</div>
        </div>
      </div>
    </main>
  );
}