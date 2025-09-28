Forgotten Tech Museum

Forgotten Tech Museum is a web-based interactive 3D experience where users can explore old and forgotten technologies and machines in a virtual museum environment. Built with Next.js and powered by Three.js for immersive 3D visuals.

Features

First-Person Navigation – Walk around the museum with WASD controls.

3D Exhibits – Explore artifacts represented as 3D models, with placeholders initially.

Interactive Info Overlays – Click or hover over exhibits to view details.

Polished Lighting & Environment – Realistic lighting, shadows, and subtle postprocessing effects.

Optimized Performance – Smooth experience across modern browsers.

Tech Stack

Frontend

Next.js (React-based framework)

Three.js (3D rendering)

@react-three/fiber (React wrapper for Three.js)

@react-three/drei (helpers and utilities)

Tailwind CSS (styling)

Backend (Optional for future persistence)

Node.js with Express.js

MongoDB (for storing user sessions or visited exhibits)

REST API with CRUD operations

Installation

Prerequisites

Node.js (v16+ recommended)

MongoDB (optional for backend persistence)

Setup
Clone the repository:

git clone https://github.com/kalviumcommunity/S65_Akshit_Radio_Ga_Ga.git

Install frontend dependencies:

bun install

Start the development server:

bun dev

For backend setup (if using MongoDB persistence):

cd backend
bun install

Set up environment variables in a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the backend server:

bun run dev

Future Enhancements

Detailed 3D Models – Replace placeholders with realistic GLTF/GLB assets.

Animations & Rotations – Bring exhibits to life with subtle movement.

User Progress Tracking – Track visited exhibits or favorite artifacts.

Interactive Museum Features – Audio guides, guided tours, or VR support.

License

© 2025 Akshit Sharma. All rights reserved.  
This software may not be copied, modified, distributed, or used without explicit permission.

Contributors

Akshit Sharma

Feedback & Issues

Feel free to open an issue or contribute via pull requests.
