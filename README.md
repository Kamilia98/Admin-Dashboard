# Admin Dashboard

A modern, feature-rich Admin Dashboard built with **Vue 3**, **TypeScript**, and **Vite**. This project provides a comprehensive solution for managing products, orders, customers, categories, and store settings, with advanced analytics and a beautiful, responsive UI.

---

## ✨ Features

- **Dashboard Analytics**:
  - Sales growth, monthly sales, order analytics, customer demographics, recent orders, and featured entities (best product, category, customer).
- **Product Management**:
  - Add, edit, delete, and view products with support for variants (color, quantity, price, discount).
  - Product statistics: total products, low stock count, top selling product.
  - Filtering, searching, and sorting.
- **Order Management**:
  - View, filter, and manage orders.
  - Update order status, view order details, and analytics (total orders, sales, average order value).
- **Customer Management**:
  - View, search, and delete customers.
  - Customer analytics: total, new, and returning customers.
  - Purchase history charts and detailed customer profiles.
- **Category Management**:
  - Add, edit, delete, and view categories.
  - Category statistics: total categories, best/least selling category.
  - View products by category and sales analytics.
- **User Authentication & Authorization**:
  - Secure login, signup, password reset, and protected routes.
  - Role-based access control (OWNER, ADMIN) with granular permissions (manage products, orders, customers, categories, users, reports).
- **User Profile Management**:
  - Update personal info, address, bio, and profile image.
- **Store Settings & Customization**:
  - Configure store info, shipping methods, currencies, languages, and user roles.
  - Only OWNER can access and update store settings.
- **Modern UI/UX**:
  - Responsive design, dark mode, sidebar navigation, and interactive charts.

---

## 🖥️ Screenshots

> _Add screenshots here to showcase the dashboard, analytics, and management pages._

---

## 🛠️ Tech Stack

- **Vue 3** + **TypeScript** + **Vite**
- **Pinia** (state management)
- **Vue Router** (routing)
- **Element Plus** (UI components)
- **TailwindCSS** (utility-first styling)
- **ApexCharts** (data visualization)
- **Axios** (API requests)
- **Lodash**, **Dropzone**, **jsvectormap** (utilities)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
$ git clone <your-repo-url>
$ cd Admin-Dashboard

# Install dependencies
$ npm install
# or
yarn install
```

### Running the Project

```bash
# Start development server
$ npm run dev

# Build for production
$ npm run build

# Preview production build
$ npm run preview
```

---

## 📁 Project Structure

- `src/pages/` — Main pages (Dashboard, Products, Orders, Customers, Categories, Profile, Settings, Auth)
- `src/components/` — Reusable UI components and feature modules
- `src/stores/` — Pinia stores for state management
- `src/services/` — API service modules
- `src/router/` — Vue Router configuration
- `src/types/` — TypeScript type definitions
- `src/assets/` — Static assets (images, icons)

---

## 🔐 Authentication & Authorization

- **Authentication**: Secure login, signup, and password reset flows.
- **Authorization**: Role-based access (OWNER, ADMIN) with permissions for managing products, orders, customers, categories, users, and reports.
- **Protected Routes**: Only authenticated users can access admin features; only OWNER can access store settings.

---

## ⚙️ Customization & Settings

- **Basic Settings**: Store name, contact info, etc.
- **Shipping Methods**: Add, edit, activate/deactivate shipping options.
- **User Roles**: Invite admins, assign permissions, manage users.
- **Currencies & Languages**: Configure supported currencies and languages for the store.

---

## 👤 User Profile

- Update personal information, address, and bio.
- Change profile picture with image upload.

---

## 📊 Analytics & Reporting

- Dashboard with sales, orders, and customer analytics.
- Product, order, customer, and category statistics.
- Interactive charts and visualizations.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## 📄 License

> _Specify your license here (e.g., MIT, Apache 2.0, etc.)_

---

## 🙏 Acknowledgements

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ApexCharts](https://apexcharts.com/)
