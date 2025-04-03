import { WepinLogin } from '@wepin/login-js';
import { WepinPin } from '@wepin/pin-js';
import { WepinSDK } from '@wepin/sdk-js';

export const wepinSdk = new WepinSDK({
  appId: import.meta.env.VITE_WEPIN_APP_ID,
  appKey: import.meta.env.VITE_WEPIN_APP_KEY,
});

export const wepinLogin = new WepinLogin({
  appId: import.meta.env.VITE_WEPIN_APP_ID,
  appKey: import.meta.env.VITE_WEPIN_APP_KEY,
});

export const wepinPin = new WepinPin({
  appKey: import.meta.env.VITE_WEPIN_APP_KEY,
  wepinLogin,
});

export const initializeWepin = async () => {
  await wepinSdk.init({
    defaultLanguage: 'en',
    defaultCurrency: 'KRW',
    loginProviders: ['google'],
  });

  await wepinPin.init({
    defaultLanguage: 'en',
    loginProviders: ['google'],
  });
};
