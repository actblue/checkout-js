import { BrowserOptions } from '@sentry/browser';

import { loadFiles } from './loader';

export interface CustomCheckoutWindow extends Window {
    checkoutConfig: {
        containerId: string;
        orderId?: number;
        checkoutId?: string;
        publicPath?: string;
        sentryConfig?: BrowserOptions;
    };
}

function isCustomCheckoutWindow(window: Window): window is CustomCheckoutWindow {
    const customCheckoutWindow: CustomCheckoutWindow = window as CustomCheckoutWindow;

    return !!customCheckoutWindow.checkoutConfig;
}

(async function autoLoad() {
    alert('custom confirm code has loaded')
    if (!isCustomCheckoutWindow(window)) {
        throw new Error('Checkout config is missing.');
    }

    const { renderOrderConfirmation, renderCheckout } = await loadFiles();

    const getCookieValue = (name: string) => {
      const regex = new RegExp(`(^| )${name}=([^;]+)`)
      const match = document.cookie.match(regex)
      if (match) return match[2];
      return '000';
    }

    const { checkoutId, ...appProps } = window.checkoutConfig;
    const orderId = Number(getCookieValue('orderId'));
    console.log('orderId....', orderId)
    if (orderId) {
        renderOrderConfirmation({ ...appProps, orderId });
    } else if (checkoutId) {
        renderCheckout({ ...appProps, checkoutId });
    }
})();
