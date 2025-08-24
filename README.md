
# CrowdAid

## Why CrowdAid?

During a visit to Connaught Place in New Delhi, I encountered a lost child who approached me for help. In that moment, I realized that while India is full of kind-hearted people willing to help, there is no centralized platform to connect those in need with volunteers nearby. This experience inspired me to create CrowdAid—a platform where anyone can offer or seek help, making it easier for communities to support each other and make the world a better place.

## What is CrowdAid?

CrowdAid is a modern web application designed to facilitate community support and volunteering. Built with Next.js, TypeScript, and Tailwind CSS, it provides a platform for users to connect, offer, and request help efficiently. Whether it's a medical emergency, fire, accident, or any crisis, CrowdAid connects people with verified volunteers and emergency services quickly and reliably.

## Project Structure

```
CrowdAid/
├── app/                  # Main application pages and layouts
│   ├── about/            # About page
│   ├── components/       # App-specific React components
│   ├── contact/          # Contact page
│   ├── how-it-works/     # How it works page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── support/          # Support page (with loading state)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Shared and UI components
│   ├── theme-provider.tsx
│   └── ui/               # Reusable UI components (buttons, dialogs, forms, etc.)
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                  # Utility functions
│   └── utils.ts
├── public/               # Static assets (images, logos)
├── styles/               # Global CSS
│   └── globals.css
├── package.json          # Project metadata and dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
├── next.config.mjs       # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── ...                   # Other config and lock files
```


## Key Features
- Modern, intuitive UI with reusable components
- Page-based routing (Next.js)
- TypeScript for type safety
- Tailwind CSS for styling
- Custom hooks for state and UI logic
- PWA support (PWABanner component)
- Real-time volunteer dispatch and location detection
- Multiple emergency types supported (medical, fire, accident, safety, disaster, etc.)


## Screenshots

### Home Page
![CrowdAid Home](./screenshots/homepage.png)

### Login Page
![CrowdAid Login](./screenshots/login.png)

### How It Works
![CrowdAid How It Works](./screenshots/how-it-works.png)

> _Note: Place your screenshots in a `screenshots/` folder in the root of your project for these images to render correctly._

## Getting Started

1. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```
2. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**


## Folder Details

- **app/**: Contains all main pages and layouts. Each subfolder is a route.
- **components/**: Shared and UI components for building the interface.
- **hooks/**: Custom React hooks for logic reuse.
- **lib/**: Utility functions and helpers.
- **public/**: Static files and images.
- **styles/**: Global CSS files.


## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

CrowdAid is more than just an app—it's a movement to empower communities and make help accessible to everyone, everywhere.

## License
[MIT](LICENSE)
