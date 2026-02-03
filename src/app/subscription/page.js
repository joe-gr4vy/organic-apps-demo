// src/app/subscription/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedInterval, setSelectedInterval] = useState('12');

  const plans = [
    { 
      weeks: '4', 
      label: 'Every 4 Weeks',
      price: 29.99,
      savings: null,
      popular: false
    },
    { 
      weeks: '12', 
      label: 'Every 12 Weeks',
      price: 79.99,
      savings: '10%',
      popular: true
    },
    { 
      weeks: '28', 
      label: 'Every 28 Weeks',
      price: 169.99,
      savings: '20%',
      popular: false
    }
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.weeks === selectedInterval);
    const params = new URLSearchParams({
      interval: plan.weeks,
      price: plan.price,
      label: plan.label,
      market: 'US'
    });
    router.push(`/subscription/checkout?${params.toString()}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'white',
            padding: '16px 32px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🌱
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              letterSpacing: '-0.5px'
            }}>
              OrganicApps
            </span>
          </div>
        </div>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Choose Your Plan
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Get personalized fitness and nutrition guidance
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {plans.map(plan => (
            <div
              key={plan.weeks}
              onClick={() => setSelectedInterval(plan.weeks)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                border: selectedInterval === plan.weeks 
                  ? '3px solid #10B981' 
                  : '3px solid transparent',
                boxShadow: selectedInterval === plan.weeks
                  ? '0 8px 24px rgba(16, 185, 129, 0.15)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {plan.label}
                  </div>
                  {plan.savings && (
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#10B981'
                    }}>
                      Save {plan.savings}
                    </div>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}>
                      ${plan.price}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#9ca3af'
                    }}>
                      per delivery
                    </div>
                  </div>
                  
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: selectedInterval === plan.weeks
                      ? '7px solid #10B981'
                      : '2px solid #d1d5db',
                    transition: 'all 0.2s'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            ✨ What's included:
          </div>
          {[
            'Personalized workout plans',
            'Custom meal recommendations',
            'Progress tracking & analytics',
            'Expert guidance & tips',
            'Cancel anytime'
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 0',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#D1FAE5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                ✓
              </div>
              {feature}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
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
          Continue to Checkout
        </button>

        {/* Fine print */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#9ca3af',
          lineHeight: '1.5'
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Cancel anytime in your account settings.
        </div>
      </div>
    </div>
  );
}