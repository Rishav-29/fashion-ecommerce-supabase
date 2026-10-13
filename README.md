# Fashion E-Commerce Platform

A modern, full-stack Luxury Fashion E-Commerce web application built with **React 19**, **Vite**, **Supabase** for backend services (PostgreSQL Database, Authentication, and Storage), and deployed live on **Vercel**.

**Live Demo:** [https://fashion-ecommerce-supabase.vercel.app](https://fashion-ecommerce-supabase.vercel.app)

---

## Tech Stack
- **Frontend:** React 19, Vite, React Router v7
- **Backend (BaaS):** Supabase (PostgreSQL Database, GoTrue Auth, Storage)
- **Deployment & Hosting:** Vercel
- **Email Service:** Custom Gmail SMTP (`lumierein54@gmail.com`) with automated 6-digit OTP email verification
- **Styling:** Custom CSS with luxury aesthetic principles (CSS Variables, Flexbox/Grid, Micro-animations)
- **Icons:** Phosphor Icons

---

## Key Features
1. **User Authentication:** 
   - Secure email sign-up with real 6-digit OTP verification codes sent from **Lumierein Store**.
   - Standard password sign-in and Google Sign-In integration.
2. **Product Catalog:** Dynamic product catalog fetched from Supabase PostgreSQL database with category filtering (Men, Women, Accessories) and sorting.
3. **Product Details:** Individual product view with size selection, image zoom, and expandable accordion sections (*Shipping & Returns*, *Materials & Care*).
4. **Shopping Cart:** Full cart management (add, remove, adjust quantity, real-time subtotal calculation).
5. **Wishlist:** Save favorite products for quick access.
6. **Checkout Flow:**
   - **Cash on Delivery (COD):** Seamless default checkout option.
   - **Bank Transfer:** Built-in receipt upload system stored directly in Supabase Storage (`payment-uploads` bucket).
7. **Responsive Design:** Mobile-first architecture optimized for desktop, tablet, and mobile viewports.

---

## Screenshots

### Home Page
![Home Page](./screenshots/1-home.png)

### Men's Collection
![Shop Men](./screenshots/2-shop-men.png)

### Shopping Cart
![Shopping Cart](./screenshots/3-cart.png)

### User Registration
![Sign Up](./screenshots/4-signup.png)

### About Page
![About Us](./screenshots/5-about.png)

---

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` or `.env.local` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://peupqrwptzdlxdvhyifw.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_E8iHtEk3NHqEpIcMrQ147A_rxTMaXLr
   ```

3. **Database Setup:**
   Run the SQL script provided in `supabase-setup.sql` in your Supabase SQL Editor to initialize the tables, RLS policies, and sample products.

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Author
**Rishav Ranjan**  
B.Tech — Electronics and Communication Engineering (ECE)  
Maharaja Agrasen Institute of Technology (MAIT), GGSIPU
