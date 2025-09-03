# Product In-Situ Placer

A comprehensive React-based web application that uses Google's Gemini AI to place products in realistic environments. Features complete user management, image galleries, social features, and admin capabilities.

## 🚀 Features

### Core Features
- **AI-Powered Image Generation**: Uses Google Gemini Pro Vision to intelligently place products in environments
- **Multiple Image Upload**: Support for up to 4 product images simultaneously
- **Customizable Prompts**: Choose from predefined environments or create custom placement scenarios
- **Real-time Processing**: Live feedback during image generation

### User Management
- **Appwrite Authentication**: Complete auth system with Google OAuth integration
- **User Profiles**: Customizable profiles with avatars, bio, and preferences
- **User Dashboard**: Comprehensive dashboard with stats and quick actions
- **Password Recovery**: Built-in forgot password functionality

### Social Features
- **Image Gallery**: Browse and manage your generated images
- **Favorites System**: Like and save favorite images
- **Sharing**: Share images with custom URLs and view tracking
- **Public Discovery**: Explore public images from the community
- **Search**: Advanced search through images, prompts, and tags

### Admin Features
- **Admin Dashboard**: System overview with user and image management
- **User Management**: View and manage all users
- **Content Moderation**: Manage public images and content
- **System Analytics**: Track usage statistics and performance

### Performance & UX
- **Responsive Design**: Works seamlessly across all devices
- **Performance Optimized**: Image compression, lazy loading, caching
- **Error Handling**: Comprehensive error management
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Progressive Enhancement**: Works without JavaScript for basic features

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (Authentication, Database, Storage)
- **AI Integration**: Google Gemini Pro Vision API
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key
- Appwrite project setup

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/vchaitanyachowdari/Product-Image.git
cd Product-Image
npm install --legacy-peer-deps
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Configure your `.env.local`:

```env
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=main
VITE_APPWRITE_USER_COLLECTION_ID=users
VITE_APPWRITE_IMAGES_COLLECTION_ID=generated_images
VITE_APPWRITE_FAVORITES_COLLECTION_ID=favorites
VITE_APPWRITE_SHARES_COLLECTION_ID=shares
VITE_APPWRITE_STORAGE_ID=images
VITE_APPWRITE_AVATARS_STORAGE_ID=avatars

# Application Configuration
VITE_APP_NAME="Product In-Situ Placer"
VITE_APP_VERSION="2.0.0"
```

### 3. Appwrite Setup

Create the following collections in your Appwrite database:

#### Users Collection (`users`)
```json
{
  "userId": "string",
  "email": "string", 
  "name": "string",
  "avatar": "string",
  "bio": "string",
  "preferences": "object",
  "stats": "object"
}
```

#### Generated Images Collection (`generated_images`)
```json
{
  "userId": "string",
  "title": "string",
  "description": "string", 
  "prompt": "string",
  "imageUrl": "string",
  "thumbnailUrl": "string",
  "settings": "object",
  "metadata": "object",
  "isPublic": "boolean",
  "tags": "array",
  "favoriteCount": "integer",
  "shareCount": "integer"
}
```

#### Favorites Collection (`favorites`)
```json
{
  "userId": "string",
  "imageId": "string"
}
```

#### Shares Collection (`shares`)
```json
{
  "userId": "string",
  "imageId": "string",
  "shareUrl": "string",
  "expiresAt": "string",
  "viewCount": "integer",
  "isActive": "boolean"
}
```

### 4. Start Development

```bash
npm run dev
```

## 📖 Usage Guide

### For Users

1. **Sign Up/Login**: Create account or login with Google OAuth
2. **Generate Images**: Upload products and generate AI placements
3. **Manage Gallery**: View, favorite, and organize your images
4. **Share Images**: Create shareable links for your creations
5. **Discover**: Explore public images from other users
6. **Profile**: Customize your profile and preferences

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **Monitor System**: View user statistics and system health
3. **Manage Users**: View and manage user accounts
4. **Content Moderation**: Review and manage public content
5. **Analytics**: Track usage patterns and performance

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🏗 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── dashboard/       # User dashboard
│   ├── features/        # Feature-specific components
│   ├── gallery/         # Image gallery components
│   ├── layout/          # Layout components
│   ├── profile/         # User profile components
│   ├── routing/         # Client-side routing
│   ├── search/          # Search and discovery
│   └── ui/              # UI components
├── hooks/               # Custom React hooks
├── services/
│   ├── appwrite/        # Appwrite integration
│   └── gemini/          # Gemini AI integration
├── utils/               # Utility functions
├── config/              # Configuration files
├── styles/              # Global styles
├── test/                # Test files
└── types/               # TypeScript definitions
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

## 🌐 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment.

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Appwrite Cloud or self-hosted
- **CDN**: Cloudflare for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful image generation
- Appwrite for backend infrastructure
- React team for the excellent framework
- Tailwind CSS for utility-first styling
- The open-source community for inspiration and tools

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**