# Nano Banana - AI Image Editor

A Next.js-powered landing page showcasing an AI image editor with Gemini 2.5 Flash Image integration.

## Features

- 🍌 **AI Image Generation** - Transform images with natural language prompts using Gemini 2.5 Flash Image (Nano Banana)
- 🎨 **Interactive Editor** - Upload reference images and describe your desired edits
- 📥 **Image Download** - Save generated images directly to your device
- ⚡ **Fast Performance** - Built with Next.js 16 and Turbopack
- 🎯 **Modern UI** - Responsive design with shadcn/ui components and Tailwind CSS v4

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, shadcn/ui (New York style)
- **AI Model**: Google Gemini 2.5 Flash Image via OpenRouter
- **Components**: 40+ Radix UI-based components
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xiaopenger1024/CloneNanobanana.git
cd CloneNanobanana
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
# Create .env.local file and add your OpenRouter API key
OPENROUTER_API_KEY=your_api_key_here
```

4. Start development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Troubleshooting

If you encounter port conflicts or lock file issues:

```bash
# Clean restart
rmdir /s /q .next  # Windows
# or
rm -rf .next       # macOS/Linux

pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── api/generate/     # AI image generation API route
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main landing page
│   └── globals.css       # Global styles and CSS variables
├── components/
│   ├── editor.tsx        # AI editor component
│   ├── hero.tsx          # Hero section
│   ├── features.tsx      # Features showcase
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## API Integration

This project uses the Gemini 2.5 Flash Image model through OpenRouter API:

- **Model**: `google/gemini-2.5-flash-image`
- **Endpoint**: `https://openrouter.ai/api/v1`
- **Features**: Image understanding, editing, and generation

Get your API key at [OpenRouter](https://openrouter.ai/).

## Deployment

This project can be deployed to Vercel, Netlify, or any platform supporting Next.js:

```bash
pnpm build
pnpm start
```

For Vercel deployment, simply connect your repository - the platform will auto-detect Next.js configuration.

## Important Notes

- **Environment Variables**: Never commit `.env.local` files to version control
- **API Costs**: Gemini 2.5 Flash Image costs $0.039 per generated image (1290 output tokens)
- **TypeScript**: Build errors are ignored in production (`ignoreBuildErrors: true`)
- **Images**: Unoptimized to reduce build complexity

## License

This is a demo project created for showcasing AI image editing capabilities.

## Acknowledgments

- UI components by [shadcn/ui](https://ui.shadcn.com/)
- AI model by [Google Gemini](https://ai.google.dev/)
- API access via [OpenRouter](https://openrouter.ai/)
