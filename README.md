# SARATHI - Frontend Deployment Guide

## Vercel Deployment

This Next.js application is now configured for seamless deployment on Vercel.

### Prerequisites

- Node.js 18+ installed
- Vercel account
- Git repository

### Deployment Steps

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select the `Frontend` folder as the root directory

2. **Environment Variables:**
   Set these in your Vercel dashboard under Settings > Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   NEXT_PUBLIC_AUTH_URL=https://your-auth-service.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

3. **Build Configuration:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Local Development

```bash
cd Frontend
npm install
npm run dev
```

### Features Included

- ✅ Next.js 14 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Vercel Analytics
- ✅ Optimized images
- ✅ Environment variable configuration
- ✅ Security headers
- ✅ Static export compatibility

### Project Structure

```
Frontend/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── public/              # Static assets
├── styles/              # Global styles
├── next.config.mjs      # Next.js configuration
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```

### Notes

- All `.jsx` files in the app directory have been converted to `.tsx` for better TypeScript support
- Hardcoded localhost URLs have been replaced with environment variables
- The application is configured for both static and server-side rendering
- Authentication middleware is properly configured for production deployment
- **CRITICAL**: Removed conflicting `loginF` folder that contained a separate Vite React app
- Integrated authentication pages directly into the Next.js app structure
- Added Firebase authentication support with proper environment variable configuration

### Troubleshooting

If you encounter build issues:
1. Check that all environment variables are set
2. Ensure Node.js version is 18+
3. Clear `.next` folder and rebuild
4. Check Vercel build logs for specific errors
