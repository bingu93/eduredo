const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Projekt als Root setzen, damit keine andere lockfile (z. B. im Home) verwendet wird
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
