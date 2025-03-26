
# Ludium Portal Frontend

The Lidium Platform built with React, Tailwind, Shadcn.

## 🚀 Features
- **React** – Component-based UI library for building interactive interfaces.
- **Vite** – Lightning-fast build tool for instant development experience.
- **Tailwind CSS** – Utility-first CSS framework for rapid styling.  
- **Shadcn** – Pre-built, customizable UI components for modern design.  
- **Apollo Client** – Powerful GraphQL client for efficient data fetching and state management.  
- **Wepin SDK** – Web3 authentication and wallet integration for seamless user experience.
- **TypeScript** for type safety
- **Biome** for code formatting and linting

## 📋 Prerequisites

- Node.js (v20 or higher)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ludium-Official/ludium-portal.git
   cd ludium-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   VITE_WEPIN_APP_ID={APP_ID}
   VITE_WEPIN_APP_KEY={APP_KEY}
   VITE_SERVER_URL={backend_url}
   ```

## 📚 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run check` - Run code quality checks
- `npm run generate` - Generate types and graphql documents

## 🏗️ Project Structure

```
src/
├── apollo/			# Graphql related files
│   ├── queries/	# Queries
│   ├── mutation/	# Mutations
│   ├── client.ts	# Apollo Client initialized client
├── assets/			# Asset files
├── components/		# React components
├── lib/			# Utility functions
├── pages/			# Portal pages
├── types/			# Generated types
└── main.tsx		# Application entry point
```

## 👥 User Roles

The system supports four user roles:
- **Admin**: Full system access
- **Sponsor**: Can create and manage programs
- **Validator**: Can validate programs and create milestones
- **Builder**: Can apply to programs and complete milestones

## 🤝 Contributing

1. Create your feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.


## 📝 Naming convention

### Types, interfaces and classes - Pascal case

```ts
interface User {}

type Session = {};

class User {
  constructor() {}
}
```

> [!NOTE]
> Prefer interfaces over types.

### Files - Kebab case

```sh
user.ts;
user-auth.ts;
```

### Constants - ALL CAPS

```ts
const SESSION_TIMEOUT = 50;
```

### Enums - Pascal case and members all caps

```ts
enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}
```

### Constant values - lower case

```ts
const USER_ROLE = "admin";
```

### Variables and functions - Camel case

```ts
function getUser() {}
const userData = {};
```

### Use absolute path imports

```ts
// Good:
import config from "@/config/common";
import config from "@/config";

// Bad:
import config from "../../../config";
```

### GraphQL

- [GQL naming convention](https://www.apollographql.com/docs/technotes/TN0002-schema-naming-conventions)