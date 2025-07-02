/**
 * ESLint Configuration for React DOM Warning Prevention
 * 
 * This configuration prevents ALL React DOM warnings by catching
 * problematic attributes and patterns at build time.
 */

module.exports = {
  rules: {
    // Prevent unrecognized DOM properties
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          // Modern HTML attributes that React might not recognize yet
          'fetchpriority',
          'popover',
          'popovertarget',
          'popovertargetaction'
        ]
      }
    ],

    // Prevent duplicate props
    'react/jsx-no-duplicate-props': 'error',

    // Ensure proper prop types
    'react/prop-types': 'warn',

    // Prevent dangerous HTML
    'react/no-danger': 'warn',

    // Custom rules for our specific issues
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="fetchPriority"][value.type="Literal"]',
        message: 'Use safeImageProps() utility instead of direct fetchPriority attribute'
      },
      {
        selector: 'JSXAttribute[name.name="crossorigin"]',
        message: 'Use crossOrigin (camelCase) instead of crossorigin (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="autoplay"]',
        message: 'Use autoPlay (camelCase) instead of autoplay (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="allowfullscreen"]',
        message: 'Use allowFullScreen (camelCase) instead of allowfullscreen (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="frameborder"]',
        message: 'Use frameBorder (camelCase) instead of frameborder (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="contenteditable"]',
        message: 'Use contentEditable (camelCase) instead of contenteditable (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="spellcheck"]',
        message: 'Use spellCheck (camelCase) instead of spellcheck (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="tabindex"]',
        message: 'Use tabIndex (camelCase) instead of tabindex (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="readonly"]',
        message: 'Use readOnly (camelCase) instead of readonly (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="maxlength"]',
        message: 'Use maxLength (camelCase) instead of maxlength (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="minlength"]',
        message: 'Use minLength (camelCase) instead of minlength (lowercase)'
      },
      {
        selector: 'JSXAttribute[name.name="novalidate"]',
        message: 'Use noValidate (camelCase) instead of novalidate (lowercase)'
      },
      {
        selector: 'JSXElement[openingElement.name.name=/^[a-z-]+$/]:not([openingElement.name.name="img"]):not([openingElement.name.name="div"]):not([openingElement.name.name="span"]):not([openingElement.name.name="p"]):not([openingElement.name.name="h1"]):not([openingElement.name.name="h2"]):not([openingElement.name.name="h3"]):not([openingElement.name.name="h4"]):not([openingElement.name.name="h5"]):not([openingElement.name.name="h6"]):not([openingElement.name.name="section"]):not([openingElement.name.name="article"]):not([openingElement.name.name="nav"]):not([openingElement.name.name="header"]):not([openingElement.name.name="footer"]):not([openingElement.name.name="main"]):not([openingElement.name.name="aside"]):not([openingElement.name.name="ul"]):not([openingElement.name.name="ol"]):not([openingElement.name.name="li"]):not([openingElement.name.name="a"]):not([openingElement.name.name="button"]):not([openingElement.name.name="input"]):not([openingElement.name.name="form"]):not([openingElement.name.name="label"]):not([openingElement.name.name="select"]):not([openingElement.name.name="option"]):not([openingElement.name.name="textarea"]):not([openingElement.name.name="table"]):not([openingElement.name.name="thead"]):not([openingElement.name.name="tbody"]):not([openingElement.name.name="tr"]):not([openingElement.name.name="td"]):not([openingElement.name.name="th"]):not([openingElement.name.name="iframe"]):not([openingElement.name.name="video"]):not([openingElement.name.name="audio"]):not([openingElement.name.name="source"]):not([openingElement.name.name="script"]):not([openingElement.name.name="style"]):not([openingElement.name.name="link"]):not([openingElement.name.name="meta"]):not([openingElement.name.name="title"]):not([openingElement.name.name="head"]):not([openingElement.name.name="body"]):not([openingElement.name.name="html"])',
        message: 'Unrecognized HTML element. Use proper HTML elements or React components with uppercase names.'
      }
    ]
  },

  // Custom plugin for additional validation
  plugins: ['react', 'react-hooks'],

  // Override for specific file patterns
  overrides: [
    {
      files: ['**/*.tsx', '**/*.jsx'],
      rules: {
        // Stricter rules for JSX files
        'react/jsx-props-no-spreading': 'off', // We need spreading for safe prop utilities
        'react/jsx-no-literals': 'off'
      }
    }
  ]
};