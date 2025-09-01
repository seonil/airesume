import React, { useEffect, useRef } from 'react';
import { PRICE_KRW } from '../constants';

declare const paypal: any;

if (!process.env.PAYPAL_CLIENT_ID) {
  console.warn("PAYPAL_CLIENT_ID environment variable not set. Payment will not work.");
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID_HERE';

interface PayPalButtonProps {
  amount: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled: boolean;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError, disabled }) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderButton = () => {
      if (!paypalRef.current) return;

      // Clear previous button instance
      paypalRef.current.innerHTML = '';

      // FIX: Cast window to `any` to access the `paypal` property, which is added by an external script.
      (window as any).paypal.Buttons({
        onClick: (_: any, actions: any) => {
          if (disabled) {
            // Prevent the PayPal modal from opening if disabled
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
                currency_code: 'KRW'
              }
            }]
          });
        },
        onApprove: async (_: any, actions: any) => {
          // No server-side capture needed for this use case
          // The payment is approved, trigger the success callback
          onSuccess();
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
    
    // FIX: Cast window to `any` to check for the `paypal` property.
    if ((window as any).paypal) {
      renderButton();
    } else {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=KRW&disable-funding=card`;
      script.async = true;
      script.onload = renderButton;
      script.onerror = () => onError('PayPal SDK 로딩에 실패했습니다.');
      document.body.appendChild(script);
    }
  }, [disabled, amount, onSuccess, onError]);
  
  const wrapperClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const buttonText = `₩${PRICE_KRW.toLocaleString()} 결제하고 생성하기`;

  // FIX: Converted JSX to React.createElement calls to be compatible with a .ts file extension.
  // JSX syntax is not allowed in .ts files, only in .tsx files.
  return React.createElement(
    'div',
    { className: wrapperClass },
    React.createElement(
      'div',
      { className: "text-center mb-2 text-sm font-bold text-gray-800 dark:text-gray-200" },
      buttonText
    ),
    React.createElement('div', { ref: paypalRef })
  );
};
