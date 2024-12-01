const { truncate } = require('fs/promises');

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['via.placeholder.com'],
    },

};
