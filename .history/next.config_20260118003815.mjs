/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ]
    },
    env: {
    TEST_GEMINI: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
