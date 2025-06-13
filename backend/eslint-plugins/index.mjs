/**
 * HomeKeeper ESLint Plugin
 * Custom rules for backend API consistency
 */

import enforceApiResponse from './rules/enforce-api-response.mjs';

export default {
  rules: {
    'enforce-api-response': enforceApiResponse,
  },
};