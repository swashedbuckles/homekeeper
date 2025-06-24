/**
 * ESLint rule to enforce consistent API responses using apiSuccess/apiError
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce use of apiSuccess/apiError for consistent API responses',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      useApiResponse: 'Consider using res.apiSuccess() or res.apiError() for consistent API responses instead of {{method}}',
    },
  },

  create(context) {
    /**
     * Check if a function appears to be an Express route handler
     * @param {import('estree').Function} node 
     * @returns {boolean}
     */
    function isRouteHandler(node) {
      const params = node.params;
      
      if (params.length < 2 || params.length > 3) {
        return false;
      }

      const firstParam = params[0];
      const secondParam = params[1];
      
      if (firstParam.type !== 'Identifier' || secondParam.type !== 'Identifier') {
        return false;
      }

      const firstParamName = firstParam.name.toLowerCase();
      const secondParamName = secondParam.name.toLowerCase();

      const reqPatterns = ['req', 'request', '_req', '_request'];
      const resPatterns = ['res', 'response', '_res', '_response'];

      return reqPatterns.includes(firstParamName) && resPatterns.includes(secondParamName);
    }

    /**
     * Check if we're inside a route handler function
     * @param {import('estree').Node} node 
     * @returns {boolean}
     */
    function isInsideRouteHandler(node) {
      let parent = node.parent;
      
      while (parent) {
        if (
          (parent.type === 'FunctionExpression' || 
           parent.type === 'ArrowFunctionExpression' ||
           parent.type === 'FunctionDeclaration') &&
          isRouteHandler(parent)
        ) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }

    /**
     * Check if a call expression is a problematic response method
     * @param {import('estree').CallExpression} node 
     * @returns {string|null} The method name if problematic, null otherwise
     */
    function getProblematicResponseMethod(node) {
      if (node.type !== 'CallExpression') return null;

      let current = node;
      let methodChain = [];

      while (current && current.type === 'CallExpression') {
        if (current.callee.type === 'MemberExpression') {
          methodChain.unshift(current.callee.property.name);
          current = current.callee.object;
        } else {
          break;
        }
      }

      if (current && current.type === 'MemberExpression' && current.object.type === 'Identifier') {
        const objectName = current.object.name.toLowerCase();
        const firstMethod = current.property.name;
        
        if (['res', 'response', '_res', '_response'].includes(objectName)) {
          methodChain.unshift(firstMethod);
          
          const problematicMethods = ['json', 'send', 'end'];
          const lastMethod = methodChain[methodChain.length - 1];
          
          if (problematicMethods.includes(lastMethod)) {
            return methodChain.join('.');
          }
        }
      } else if (current && current.type === 'Identifier') {
        const objectName = current.name.toLowerCase();
        
        if (['res', 'response', '_res', '_response'].includes(objectName)) {
          const problematicMethods = ['json', 'send', 'end'];
          const lastMethod = methodChain[methodChain.length - 1];
          
          if (problematicMethods.includes(lastMethod)) {
            return methodChain.join('.');
          }
        }
      }

      return null;
    }

    return {
      CallExpression(node) {
        if (!isInsideRouteHandler(node)) {
          return;
        }

        const problematicMethod = getProblematicResponseMethod(node);
        if (problematicMethod) {
          context.report({
            node,
            messageId: 'useApiResponse',
            data: {
              method: problematicMethod,
            },
          });
        }
      },
    };
  },
};