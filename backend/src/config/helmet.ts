import type { HelmetOptions } from 'helmet';

/**
 * Configuration for helmet -- headers protection.
 * Enhanced restrictions as we don't serve the front-end.
 */
export const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'none'"],
      'base-uri': ["'none'"],
      'font-src': ["'none'"],
      'form-action': ["'none'"],
      'frame-ancestors': ["'none'"],
      'img-src': ["'none'"],
      'object-src': ["'none'"],
      'script-src': ["'none'"],
      'script-src-attr': ["'none'"],
      'style-src': ["'none'"],
      'upgrade-insecure-requests': [],
    },
  },

  crossOriginResourcePolicy: {
    policy: 'same-origin',
  },

  xFrameOptions: {
    action: 'deny',
  },
};
