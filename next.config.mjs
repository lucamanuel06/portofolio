

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cloud.appwrite.io',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.supabase.co', // Supabase storage
          port: '',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;
  