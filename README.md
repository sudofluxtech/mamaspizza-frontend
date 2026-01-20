# 🍕 Mama's Pizza - Online Pizza Delivery Platform

A modern, full-featured pizza delivery web application built with Next.js. Order your favorite pizzas online, track your orders, and enjoy fast delivery - all in one beautiful, user-friendly interface.

## 📋 Overview

Mama's Pizza is an online food delivery platform that allows customers to browse our menu, customize their orders, and place orders for delivery. The app supports both registered users and guest checkout, making it easy for anyone to order their favorite pizzas.

### What This App Does

- **Browse Menu**: Explore our extensive menu with categories, sizes, and search functionality
- **Order Food**: Add items to cart, customize your order, and checkout securely
- **Track Orders**: Monitor your order status in real-time
- **Guest Checkout**: Order without creating an account
- **Special Offers**: Take advantage of Buy-One-Get-One (BOGO) deals and promotions
- **Secure Payments**: Process payments safely using Stripe
- **User Profiles**: Manage your account, view order history, and save delivery addresses

## ✨ Key Features

### 🛒 Shopping Experience
- Browse menu items by category and size
- Search for specific items
- View detailed item information with images
- Add items to cart with customizations
- Special instructions for each item

### 🎁 Offers & Promotions
- Buy-One-Get-One (BOGO) offers
- Special promotional deals
- Discount codes and coupons

### 👤 User Management
- User registration and authentication
- Guest checkout (no account required)
- User profiles with saved addresses
- Order history tracking

### 💳 Payment & Checkout
- Secure payment processing with Stripe
- Multiple payment methods
- Order summary and review
- Delivery address management

### 📦 Order Management
- Real-time order tracking
- Order status updates
- Order history for registered users
- Guest order tracking

### 📊 Analytics & Tracking
- Automatic visitor tracking
- Device and browser detection
- Referral source tracking
- Page visit analytics

## 🛠️ Technologies Used

This project is built with modern web technologies:

### Core Framework
- **[Next.js 15.5.2](https://nextjs.org/)** - React framework for production
- **[React 19.1.0](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
  - Alert Dialog, Dialog, Dropdown Menu, Navigation Menu, Select, Label, Slot
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Motion](https://motion.dev/)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Rich Text Editing
- **[Tiptap](https://tiptap.dev/)** - Rich text editor
  - Extensions: Color, Highlight, Image, Link, Placeholder, Text Align, Text Style, Underline

### State Management
- **[Zustand 5.0.8](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Utilities
- **[clsx](https://github.com/lukeed/clsx)** - Conditional class names
- **[class-variance-authority](https://cva.style/)** - Component variant management
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler (included with Next.js)

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed on your computer:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm**, **yarn**, **pnpm**, or **bun** (package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "mama's pizza"
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

   Or using pnpm:
   ```bash
   pnpm install
   ```

   Or using bun:
   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   # Add your API endpoints and keys here
   NEXT_PUBLIC_API_BASE_URL=your_api_url
   # Add other environment variables as needed
   ```

4. **Run the development server**

   Using npm:
   ```bash
   npm run dev
   ```

   Using yarn:
   ```bash
   yarn dev
   ```

   Using pnpm:
   ```bash
   pnpm dev
   ```

   Using bun:
   ```bash
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

   The page will automatically reload when you make changes to the code.

## 📁 Project Structure

```
mama's pizza/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and providers
│   └── ...
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

### React Resources
- [React Documentation](https://react.dev/) - Learn React
- [React GitHub Repository](https://github.com/facebook/react)

## 🚢 Deployment

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 Notes

- This project uses Turbopack for faster development builds
- The app supports both authenticated users and guest checkout
- All visitor interactions are automatically tracked for analytics
- Make sure to configure your API endpoints in the environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

---

Made with ❤️ for pizza lovers everywhere 🍕
