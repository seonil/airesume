import React, { useEffect, useRef } from 'react';
import { PRICE_USD } from '../constants.tsx';

// The PayPal SDK is loaded via a script, so we need to inform TypeScript
// that `window.paypal` will exist at runtime.
declare global {
    interface Window {
        paypal: any;
    }
}

interface PayPalButtonProps {
  amount: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled: boolean;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError, disabled }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  // Use a ref to track if the script has already been added to the page
  const scriptAdded = useRef(false);

  useEffect(() => {
    // Function to render the PayPal button once the SDK is loaded
    const renderButton = () => {
      // Ensure the container ref is available before rendering.
      if (!paypalRef.current) {
        console.warn("PayPal container not ready, button rendering aborted.");
        return;
      }
      
      // Clear previous button instance to prevent duplicates on re-render
      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        onClick: (_: any, actions: any) => {
          if (disabled) {
            onError('사진 사용에 동의해야 합니다.');
            return actions.reject();
          }
          return actions.resolve();
        },
        createOrder: (_: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: 'AI 증명사진 생성',
              amount: {
                value: amount,
                currency_code: 'USD'
              }
            }]
          });
        },
        onApprove: async (_: any, actions: any) => {
          return actions.order.capture().then(function() {
            onSuccess();
          }).catch(function(err: any) {
            console.error('PayPal Checkout onApprove capture error', err);
            onError('결제를 완료하는 중 오류가 발생했습니다. 다시 시도해주세요.');
          });
        },
        onError: (err: any) => {
          console.error('PayPal Checkout onError', err);
          onError('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'checkout',
            tagline: false
        }
      }).render(paypalRef.current);
    };
    
    // Check if PayPal SDK is already loaded
    if (window.paypal) {
        renderButton();
        return;
    }
    
    // If script has not been added yet, add it
    if (!scriptAdded.current) {
        scriptAdded.current = true; // Mark as added immediately
        const script = document.createElement('script');
        // Switched to 'test' client-id for sandbox environment to debug permission issues.
        script.src = `https://www.paypal.com/sdk/js?client-id=test&disable-funding=venmo&currency=USD`;
        script.async = true;
        // This attribute is crucial for running in sandboxed environments
        script.setAttribute('data-sdk-integration-source', 'integrationbuilder');
        script.onload = () => {
          console.log("PayPal SDK script loaded.");
          renderButton();
        };
        script.onerror = () => {
            console.error("Failed to load PayPal SDK script.");
            onError("결제 모듈을 불러오지 못했습니다. 페이지를 새로고침 해주세요.");
        };
        document.body.appendChild(script);
    }
    
  }, [disabled, amount, onSuccess, onError]);
  
  const wrapperClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const buttonText = `$${PRICE_USD.toFixed(2)} 결제하고 생성하기`;

  return (
    <div className={wrapperClass}>
      <div className="text-center mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
        {buttonText}
      </div>
      <div ref={paypalRef} />
    </div>
  );
};