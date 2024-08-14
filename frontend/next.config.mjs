/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    ppr: 'incremental',
    // staleTimes:{
    //   dynamic: 30,
    // }
  },
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'images.pixels.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      
    ]
  },
};

export default nextConfig;
