# AI Website Generator 🚀

A stunning web application that generates beautiful websites from text prompts using Google's Gemini AI and deploys them to Vercel with one click.

## Features ✨

- **AI-Powered Generation**: Uses Google Gemini AI to generate complete websites from text descriptions
- **Beautiful UI**: Modern, responsive interface with stunning animations and gradients
- **Live Preview**: Real-time preview of generated websites in an embedded iframe
- **One-Click Deploy**: Deploy generated websites to Vercel instantly
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Components**: Smooth animations and hover effects using Framer Motion
- **Multiple Templates**: Pre-built suggestions for different types of websites

## Tech Stack 🛠️

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI (Gemini)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started 🏃‍♂️

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd website-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```env
GEMINI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_google_ai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment 🚀

### Deploy to Vercel

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js.
4. Add your `GEMINI_API_KEY` in the Vercel Project Settings > Environment Variables.
5. Click **Deploy**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fwebsite-generator&env=GEMINI_API_KEY)

## How to Use 📖

1. **Describe Your Website**: Enter a detailed description of the website you want to create
2. **Generate**: Click the "Generate Website" button to let AI create your site
3. **Preview**: View the generated website in the live preview panel
4. **Deploy**: Click "Deploy to Vercel" to make your website live on the internet
5. **Share**: Get your unique URL and share your website with the world!

## Example Prompts 💡

- "A modern portfolio website for a photographer with dark theme and gallery"
- "An e-commerce landing page for organic skincare products with testimonials"
- "A restaurant website with menu, location, and online reservation system"
- "A SaaS landing page for a project management tool with pricing tiers"
- "A personal blog with minimalist design and newsletter signup"

## API Endpoints 🔌

### `/api/generate-website`
- **Method**: POST
- **Body**: `{ prompt: string }`
- **Response**: `{ code: string, prompt: string }`

### `/api/deploy-website`
- **Method**: POST
- **Body**: `{ code: string, prompt: string }`
- **Response**: `{ url: string, deploymentId: string, status: string }`

## Built with ❤️ using AI and modern web technologies
