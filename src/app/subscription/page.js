// src/app/subscription/page.js
// NEW Combined Plan Selection + Checkout Page
// Matches customer's actual design with urgency elements
// FIXED: Moved static data outside component, added proper memoization

'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// FIXED: Move static data OUTSIDE component to prevent recreation on every render
const PLANS = [
  {
    id: '1-week',
    name: '1-Week Trial',
    originalPrice: 39.98,
    salePrice: 4.99,
    perDay: 0.71,
    weeks: 1,
    popular: false
  },
  {
    id: '4-week',
    name: '4-Week Plan',
    originalPrice: 39.97,
    salePrice: 9.99,
    perDay: 0.33,
    weeks: 4,
    popular: true,
    hasBadge: true
  },
  {
    id: '12-week',
    name: '12-Week Plan',
    originalPrice: 69.98,
    salePrice: 18.99,
    perDay: 0.21,
    weeks: 12,
    popular: false
  }
];

const CURRENCIES = {
  IE: { symbol: '€', code: 'EUR' },
  GB: { symbol: '£', code: 'GBP' },
  US: { symbol: '$', code: 'USD' },
  BR: { symbol: 'R$', code: 'BRL' },
  AE: { symbol: 'د.إ', code: 'AED' }
};

const MARKETS = [
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' }
];

const ACCENT_COLOR = '#FF6B6B';
const ACCENT_COLOR_DARK = '#E55555';

export default function SubscriptionCheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('4-week');
  const [offersLeft, setOffersLeft] = useState(90);
  const [plansSold, setPlansSold] = useState(1698);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [market, setMarket] = useState('US');
  
  // Gr4vy state
  const [Embed, setEmbed] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const embedRef = useRef(null);
  
  // Track if SDK is already loaded
  const sdkLoadedRef = useRef(false);

  // FIXED: Memoize derived values
  const currency = useMemo(() => CURRENCIES[market], [market]);
  
  const selectedPlanData = useMemo(() => 
    PLANS.find(p => p.id === selectedPlan),
    [selectedPlan]
  );
  
  const priceCents = useMemo(() => 
    Math.round(selectedPlanData.salePrice * 100),
    [selectedPlanData.salePrice]
  );
  
  const savings = useMemo(() => 
    Math.round((1 - selectedPlanData.salePrice / selectedPlanData.originalPrice) * 100),
    [selectedPlanData.salePrice, selectedPlanData.originalPrice]
  );

  // Urgency: Decrement offers left slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setOffersLeft(prev => Math.max(prev - 1, 12));
    }, 45000); // every 45 seconds
    return () => clearInterval(interval);
  }, []);

  // Urgency: Increment plans sold
  useEffect(() => {
    const interval = setInterval(() => {
      setPlansSold(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // FIXED: Fetch Gr4vy token only when needed, with loading state to prevent double-fetch
  useEffect(() => {
    // Only fetch when payment methods are shown
    if (!showPaymentMethods) return;
    
    // Prevent double-fetch
    if (isLoadingToken || token) return;
    
    setIsLoadingToken(true);
    
    fetch(`/api/token-organic?amount=${priceCents}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data.token);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoadingToken(false));
  }, [showPaymentMethods, priceCents, isLoadingToken, token]);

  // FIXED: Load Gr4vy SDK only once
  useEffect(() => {
    if (!token || sdkLoadedRef.current) return;
    
    sdkLoadedRef.current = true;
    
    import('@gr4vy/embed-react')
      .then((mod) => {
        setEmbed(() => mod.default || mod.Embed);
      })
      .catch(err => {
        setError(err.message);
        sdkLoadedRef.current = false; // Allow retry on error
      });
  }, [token]);

  // Reset token when plan changes (so new amount is used)
  const handlePlanChange = useCallback((planId) => {
    setSelectedPlan(planId);
    // If payment is already showing, reset token to fetch new one
    if (showPaymentMethods) {
      setToken(null);
      setIsLoadingToken(false);
    }
  }, [showPaymentMethods]);

  // FIXED: Memoize event handlers to prevent Embed re-renders
  const handleEvent = useCallback((name, data) => {
    console.log(`EVENT [${name}]:`, data);
  }, []);

  const handleComplete = useCallback((transaction) => {
    console.log('Transaction:', transaction);
    const params = new URLSearchParams({
      txn: transaction.id,
      interval: selectedPlanData.weeks.toString(),
      amount: selectedPlanData.salePrice.toFixed(2),
      market
    });
    window.location.href = `/subscription/success?${params.toString()}`;
  }, [selectedPlanData.weeks, selectedPlanData.salePrice, market]);

  const handleError = useCallback((error) => {
    console.error('Payment error:', error);
  }, []);

  const handlePayment = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Country Selector */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 107, 107, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        flexWrap: 'wrap'
      }}>
        <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
          Demo Market:
        </span>
        {MARKETS.map(m => (
          <button
            key={m.code}
            onClick={() => setMarket(m.code)}
            style={{
              padding: '6px 12px',
              background: market === m.code ? 'white' : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: market === m.code ? ACCENT_COLOR : 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: market === m.code ? '700' : '500',
              transition: 'all 0.2s'
            }}
          >
            {m.flag} {m.code}
          </button>
        ))}
      </div>

      <div style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '70px 20px 40px'
      }}>
        {/* Close button */}
        <button style={{
          position: 'absolute',
          top: '60px',
          left: '16px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666'
        }}>
          ×
        </button>

        {/* Header */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          textAlign: 'center',
          color: '#1a1a1a',
          marginBottom: '24px'
        }}>
          Select a secure payment method
        </h1>

        {/* Plan Selection */}
        <div style={{ marginBottom: '24px' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => handlePlanChange(plan.id)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '12px',
                cursor: 'pointer',
                border: selectedPlan === plan.id 
                  ? `2px solid ${ACCENT_COLOR}`
                  : '2px solid #E8E8E8',
                position: 'relative',
                transition: 'all 0.2s'
              }}
            >
              {plan.hasBadge && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🚀 {offersLeft} offers left
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {/* Radio button */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: selectedPlan === plan.id 
                      ? `6px solid ${ACCENT_COLOR}`
                      : '2px solid #D1D5DB',
                    transition: 'all 0.2s'
                  }} />
                  
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '2px'
                    }}>
                      {plan.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#999'
                    }}>
                      <span style={{
                        textDecoration: 'line-through',
                        color: ACCENT_COLOR,
                        marginRight: '6px'
                      }}>
                        {currency.symbol}{plan.originalPrice.toFixed(2)}
                      </span>
                      <span>{currency.symbol}{plan.salePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    {currency.symbol}{plan.perDay.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999'
                  }}>
                    per day
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Sold Counter */}
        <div style={{
          background: '#F5F3FF',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '8px'
          }}>
            {plansSold.toString().split('').map((digit, i) => (
              <div key={i} style={{
                background: '#8B5CF6',
                color: 'white',
                width: '36px',
                height: '44px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                {digit}
              </div>
            ))}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            plans sold in the last hour
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '15px'
        }}>
          <span style={{ fontWeight: '600', color: '#1a1a1a' }}>30-day </span>
          <span style={{ color: '#14B8A6', fontWeight: '600' }}>money back guarantee</span>
        </div>

        {/* Terms Checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '20px',
          padding: '0 4px'
        }}>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              marginTop: '2px',
              accentColor: ACCENT_COLOR
            }}
          />
          <div style={{
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.5'
          }}>
            By purchasing, you agree to our{' '}
            <a href="#" style={{ color: ACCENT_COLOR }}>Privacy Policy</a>,{' '}
            <a href="#" style={{ color: ACCENT_COLOR }}>T&Cs</a>,{' '}
            <a href="#" style={{ color: ACCENT_COLOR }}>Money Back Policy</a>,{' '}
            <a href="#" style={{ color: ACCENT_COLOR }}>Cancelation Policy</a>
          </div>
        </div>

        {/* Payment Section */}
        {!showPaymentMethods ? (
          <>
            {/* Primary CTA - Show Payment Methods */}
            <button
              onClick={() => agreedToTerms && setShowPaymentMethods(true)}
              disabled={!agreedToTerms}
              style={{
                width: '100%',
                padding: '18px',
                background: agreedToTerms 
                  ? `linear-gradient(135deg, ${ACCENT_COLOR} 0%, ${ACCENT_COLOR_DARK} 100%)`
                  : '#E5E5E5',
                color: agreedToTerms ? 'white' : '#999',
                border: 'none',
                borderRadius: '30px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                marginBottom: '16px',
                transition: 'all 0.2s'
              }}
            >
              Continue to Payment
            </button>
          </>
        ) : (
          <>
            {/* Order Summary */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid #E8E8E8'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#666' }}>Personalized Workout Plan</span>
                <span style={{ color: '#666' }}>
                  {currency.symbol}{selectedPlanData.originalPrice.toFixed(2)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#666' }}>{savings}% Offer discount</span>
                <span style={{ color: ACCENT_COLOR, fontWeight: '600' }}>
                  -{currency.symbol}{(selectedPlanData.originalPrice - selectedPlanData.salePrice).toFixed(2)}
                </span>
              </div>
              <div style={{
                borderTop: '1px solid #E8E8E8',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    Total:
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999'
                  }}>
                    per {selectedPlanData.weeks} week{selectedPlanData.weeks > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: ACCENT_COLOR
                  }}>
                    {currency.symbol}{selectedPlanData.salePrice.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#14B8A6',
                    fontWeight: '600'
                  }}>
                    You just saved {currency.symbol}{(selectedPlanData.originalPrice - selectedPlanData.salePrice).toFixed(2)} ({savings}% off)
                  </div>
                </div>
              </div>
            </div>

            {/* Gr4vy Payment Embed */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid #E8E8E8'
            }}>
              {error ? (
                <div style={{ 
                  padding: '20px', 
                  background: '#FEE', 
                  color: '#C00', 
                  borderRadius: '8px' 
                }}>
                  {error}
                </div>
              ) : !token || !Embed ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#666' 
                }}>
                  Loading payment options...
                </div>
              ) : (
                <form id="organic-payment-form" onSubmit={handlePayment}>
                  <div style={{ minHeight: '350px' }}>
                    <Embed
                      ref={embedRef}
                      gr4vyId="partners"
                      environment="sandbox"
                      token={token}
                      amount={priceCents}
                      currency={currency.code}
                      country={market}
                      form="#organic-payment-form"
                      metadata={{
                        merchant_account_id: 'organic-apps',
                        subscription_interval: selectedPlanData.weeks.toString()
                      }}
                      onEvent={handleEvent}
                      onComplete={handleComplete}
                      onError={handleError}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '18px',
                      background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, ${ACCENT_COLOR_DARK} 100%)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      fontSize: '17px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '16px'
                    }}
                  >
                    Continue
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {/* Fine print */}
        <div style={{
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
          lineHeight: '1.6',
          padding: '0 10px'
        }}>
          By clicking <strong>Continue</strong>, I agree to start my trial period and if I do 
          not cancel before the end of the <strong>28 days introductory plan</strong>, 
          Organic Apps will automatically charge my payment method the regular price{' '}
          <strong>{currency.symbol}{selectedPlanData.originalPrice.toFixed(2)} every {selectedPlanData.weeks} week{selectedPlanData.weeks > 1 ? 's' : ''}</strong>{' '}
          thereafter until I cancel. The transaction will be converted into {currency.code} based on your bank's exchange rate.
        </div>

        {/* Footer Links */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          By purchasing, you agree to{' '}
          <a href="#" style={{ color: ACCENT_COLOR }}>T&Cs</a> and{' '}
          <a href="#" style={{ color: ACCENT_COLOR }}>Privacy Policy</a>,{' '}
          <a href="#" style={{ color: ACCENT_COLOR }}>Money Back and Cancelation Policy</a>
        </div>
      </div>
    </div>
  );
}