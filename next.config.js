const removeImports = require('next-remove-imports')();

// module.exports = removeImports({});

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};
