# RUET Lost & Found

A community-driven web application designed to help students and staff at RUET (Rajshahi University of Engineering & Technology) find their lost belongings. This platform allows users to report lost or found items, browse through listed items, and connect with the item's finder or owner.

## Features

- **Authentication System:** Secure sign-up and login using Email/Password and Google OAuth (via Firebase).
- **Post Lost/Found Items:** Users can submit detailed reports of lost or found items, complete with titles, descriptions, categories, dates, and contact information.
- **Image Upload:** Integrated with Cloudinary for seamless image uploads when reporting an item.
- **Interactive Map:** Utilize an interactive map powered by React Leaflet to pin exactly where an item was lost or found on campus.
- **Advanced Search & Filtering:** Quickly search items by title/description or filter them by category (e.g., Electronics, Documents, Accessories) and type (Lost/Found).
- **Manage Posts:** Dedicated dashboard to view your posts, mark them as "Resolved," or delete them.
- **Comments System:** Users can interact and communicate directly on an item's detail page.
- **Admin Dashboard:** Admin view to track platform statistics, manage users, and update global site settings.

## Tech Stack

- **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Backend/Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Auth](https://firebase.google.com/docs/auth)
- **Map:** [Leaflet](https://leafletjs.com/) via [React Leaflet](https://react-leaflet.js.org/)
- **Data Visualization:** [Recharts](https://recharts.org/) (for home page stats graph)
- **Icons:** [Lucide React](https://lucide.dev/)

## Project Structure

```text
├── src/
│   ├── components/      # Reusable UI components (Navbar, Footer, AuthRoute, LocationSelector)
│   ├── contexts/        # React Context API providers (AuthContext)
│   ├── lib/             # Utility and configuration files (api, firebase, cloudinary, utils)
│   ├── pages/           # Main route components (Home, Explore, AddItem, ItemDetails, etc.)
│   ├── types.ts         # TypeScript interfaces and type definitions
│   ├── App.tsx          # Main application routing and wrapper
│   └── index.css        # Global stylesheet including Tailwind directives
├── .env.example         # Template for required environment variables
├── package.json         # Project dependencies and npm scripts
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) and an active [Firebase](https://firebase.google.com/) account.

### 1. Clone & Install

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure the required environment variables. Refer to `.env.example` (or use the following template):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=your_firestore_database_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

### 3. Firebase Setup

1. Create a Firebase Project.
2. Enable **Authentication** (Email/Password and Google providers).
3. Enable **Firestore Database** and update your Security Rules to allow authenticated users to read/write as appropriate. 

*Example Firestore Rules:*
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Cloudinary Setup

1. Create a free Cloudinary account.
2. Go to **Settings > Upload** and add an **Upload preset**.
3. Make sure the preset's "Signing Mode" is set to **Unsigned**.
4. Use the Cloud Name and Preset Name in your `.env` file.

### 5. Running the Application

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `ruetlf.vercel.app`.

### 6. Production Build

To create an optimized production build:

```bash
npm run build
```

## License

This project is licensed under the Apache-2.0 License.
