/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow images from Cloudinary domain
  },
};

module.exports = nextConfig;
