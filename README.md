# Product In-Situ Placer

A production-ready AI-powered application for placing products in realistic environments using Google's Gemini API.

## 🚀 Features

- **AI-Powered Placement**: Intelligent product placement using Google Gemini
- **Multiple Environments**: Choose from preset environments or create custom scenes
- **Drag & Drop Upload**: Easy image uploading with validation
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Production Ready**: Optimized build, Docker support, CI/CD pipeline
- **Type Safe**: Full TypeScript implementation
- **Accessible**: WCAG compliant with proper ARIA labels
- **Error Handling**: Comprehensive error boundaries and validation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **Build Tool**: Vite
- **Validation**: Zod
- **Linting**: ESLint, Prettier
- **Testing**: Vitest (ready to implement)
- **Deployment**: Docker, Nginx
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
src/
├── app/                    # Main application component
├── components/             # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── common/            # Common components (ErrorBoundary)
│   ├── features/          # Feature-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Basic UI components
├── config/                # Configuration and constants
├── hooks/                 # Custom React hooks
├── services/              # API services
├── styles/                # Global styles
├── utils/                 # Utility functions
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-in-situ-placer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 🐳 Docker Deployment

### Development
```bash
docker-compose --profile dev up
```

### Production
```bash
docker-compose up
```

### Manual Docker Build
```bash
docker build -t product-placer .
docker run -p 80:80 product-placer
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Required |
| `VITE_APP_NAME` | Application name | "Product In-Situ Placer" |
| `VITE_MAX_FILE_SIZE` | Max file size in bytes | 10485760 (10MB) |
| `VITE_MAX_FILES_COUNT` | Max number of files | 4 |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | false |

## 🔒 Security Features

- Content Security Policy (CSP) headers
- XSS protection
- CSRF protection
- Input validation and sanitization
- File type and size validation
- Environment variable validation

## 📊 Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Bundle analysis
- Gzip compression
- Static asset caching
- Web Vitals monitoring

## 🧪 Testing

The project is set up with Vitest for testing. Run tests with:

```bash
npm run test
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### AWS/GCP/Azure
Use the provided Docker configuration for container-based deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.

## 🔄 Changelog

### v1.0.0
- Initial production release
- AI-powered product placement
- Responsive design
- Docker support
- CI/CD pipeline