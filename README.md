# Nehdo E-Commerce Platform

A modern, responsive, and high-performance e-commerce platform built with React, Vite, and Tailwind CSS. This project includes a beautifully designed customer-facing storefront and a comprehensive Admin Dashboard.

## Features

- **Modern UI/UX**: Designed with a focus on aesthetics, responsiveness, and premium user experience.
- **Mobile First**: Fully responsive design that looks great on mobile phones, tablets, and desktops.
- **Storefront**: Features an engaging hero section, product carousels, category shopping, and a seamless checkout process.
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, categories, customers, and more.
- **Order Management**: Professional Flipkart/E-Kart style printable shipping labels and dynamic order tracking.
- **Fast Performance**: Built with Vite for lightning-fast HMR and optimized production builds.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons (Ionicons 5)](https://react-icons.github.io/react-icons/)
- **QR Codes**: `react-qr-code` for shipping labels
- **Routing**: `react-router-dom`

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShvInfotech/nehdo.git
   ```

2. Navigate into the project directory:
   ```bash
   cd nehdo
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server, run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`. You can also access it on your local network (e.g., from your phone) using the Network IP provided in the terminal.

### Production Build

To create an optimized production build, run:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Project Structure
- `/src/components`: Reusable UI components (Navbar, Footers, Cards, etc.)
- `/src/pages`: Main application pages (Home, Shop, Cart)
- `/src/pages/admin`: Admin dashboard pages and layouts
- `/src/data`: Mock data for products, orders, and CMS.
- `/src/context`: React Context providers for global state management.

## License
Proprietary - ShvInfotech
