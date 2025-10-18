# Driver Staffing Solutions (DSS)

## Project Overview

Professional driver training and staffing solutions across Britain. This is the official website for DSS - Training the Drivers Who Keep Britain Moving.

## Tech Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)
- Framer Motion (Animations)

## Development Setup

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Getting Started

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd britain-drives-pro-main

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components (shadcn-ui)
│   ├── Navbar.tsx    # Navigation component
│   ├── Hero.tsx      # Hero section
│   ├── WhyChoose.tsx # Features section
│   ├── About.tsx     # About section
│   ├── Testimonials.tsx # Testimonials section
│   └── ContactForm.tsx  # Contact form with Supabase integration
├── lib/              # Utilities and configurations
├── pages/            # Page components
└── styles/           # Global styles and CSS
```

## Features

- Responsive design for all devices
- Contact form with Supabase integration
- Duplicate submission prevention
- Professional animations with Framer Motion
- SEO optimized
- Accessible UI components

## Deployment

Build the project for production:

```sh
npm run build
```

The build output will be in the `dist/` directory.

## License

Copyright © Driver Staffing Solutions
