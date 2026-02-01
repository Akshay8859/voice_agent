/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
<<<<<<< Updated upstream
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ]
    },
=======
        domains: ['lh3.googleusercontent.com']
    }
>>>>>>> Stashed changes
};

export default nextConfig;
