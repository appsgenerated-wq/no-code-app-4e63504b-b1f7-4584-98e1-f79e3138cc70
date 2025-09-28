# PlatePalette - Food & Recipe Platform

Welcome to PlatePalette, a fully-featured recipe sharing and food ordering application built entirely with Manifest.

This application demonstrates the power of Manifest for creating complex, data-driven web applications with features like user authentication, role-based access control, rich content management, and complex data relationships.

## Features

- **Role-Based Users**: `customer`, `chef`, and `admin` roles with distinct permissions.
- **Full Recipe CRUD**: Chefs can create, read, update, and delete their own recipes.
- **Rich Recipe Content**: Uses `richText` for detailed ingredients and instructions, and `image` uploads for beautiful food photography.
- **Categorization**: Recipes can be tagged with multiple categories (`belongsToMany` relationship).
- **Reviews & Ratings**: Logged-in customers can leave reviews and star ratings on recipes.
- **Ordering System**: A basic system for customers to place orders for recipes.
- **Dynamic Frontend**: A responsive React frontend built with Tailwind CSS that interacts with the Manifest backend via the SDK.
- **Chef Dashboard**: A dedicated interface for chefs to manage their culinary creations.

## Tech Stack

- **Backend**: Manifest (Headless CMS & BaaS)
- **Frontend**: React (Vite), Tailwind CSS
- **API Communication**: Manifest JS SDK
