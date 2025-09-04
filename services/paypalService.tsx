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
  const buttonRendered = useRef(false);

  useEffect(() => {
    const renderHostedButton = () => {
      if (!paypalRef.current || buttonRendered.current) {
        return;
      }

      // Clear previous button instance
      paypalRef.current.innerHTML = '';

      // Create unique container ID
      const containerId = `paypal-container-${Date.now()}`;
      paypalRef.current.innerHTML = `<div id="${containerId}"></div>`;

      try {
        window.paypal.HostedButtons({
          hostedButtonId: "GNWYAEX76TEB2",
          onApprove: (data: any, actions: any) => {
            console.log('PayPal payment approved:', data);
            onSuccess();
            return Promise.resolve();
          },
          onError: (err: any) => {
            console.error('PayPal Hosted Button Error:', err);
            onError('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
          },
          onCancel: (data: any) => {
            console.log('PayPal payment cancelled:', data);
          }
        }).render(`#${containerId}`);

        buttonRendered.current = true;
      } catch (error) {
        console.error('Error rendering PayPal hosted button:', error);
        onError('결제 버튼을 불러오는 중 오류가 발생했습니다.');
      }
    };

    // Check if PayPal SDK is loaded
    if (window.paypal && window.paypal.HostedButtons) {
      renderHostedButton();
    } else {
      // Wait for PayPal SDK to load
      const checkPayPal = setInterval(() => {
        if (window.paypal && window.paypal.HostedButtons) {
          clearInterval(checkPayPal);
          renderHostedButton();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkPayPal);
        if (!window.paypal) {
          onError('PayPal 결제 모듈을 불러올 수 없습니다. 페이지를 새로고침 해주세요.');
        }
      }, 10000);
    }

    return () => {
      buttonRendered.current = false;
    };
  }, [onSuccess, onError]);

  const wrapperClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const buttonText = `$${PRICE_USD.toFixed(2)} 결제하고 생성하기`;

  return (
    <div className={wrapperClass}>
      <div className="text-center mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
        {buttonText}
      </div>
      {disabled && (
        <div className="text-center mb-2 text-xs text-red-600">
          사진 사용에 동의해주세요
        </div>
      )}
      <div ref={paypalRef} className="paypal-button-container" />
    </div>
  );
};