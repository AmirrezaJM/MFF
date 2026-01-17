# 🧩 Micro Frontend Federation (MFF)

A demonstration project showcasing **Micro Frontend Architecture** using **Webpack Module Federation**. This project demonstrates how to build, share, and consume components across multiple independent React applications at runtime.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-5-8DD6F9?logo=webpack&logoColor=white)
![Module Federation](https://img.shields.io/badge/Module_Federation-Enabled-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Configuration Details](#-configuration-details)
- [Future Plans: Vite Integration](#-future-plans-vite-integration)
- [Common Use Cases](#-common-use-cases)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**Micro Frontends** is an architectural pattern that extends the concepts of microservices to the frontend world. Instead of building a monolithic frontend application, you break it down into smaller, independent applications that can be developed, tested, and deployed independently.

This project demonstrates:

- ✅ **Runtime Integration** - Components are loaded at runtime, not build time
- ✅ **Independent Deployment** - Each app can be deployed separately
- ✅ **Technology Agnostic** - Different apps can use different versions of React (or even different frameworks)
- ✅ **Shared Dependencies** - Common libraries like React can be shared to avoid duplication

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MICRO FRONTEND SYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────┐     ┌─────────────────────┐          │
│   │       APP 1         │     │       APP 2         │          │
│   │   (Remote/Host)     │     │      (Consumer)     │          │
│   │                     │     │                     │          │
│   │   Port: 8083        │────▶│   Port: 8082        │          │
│   │                     │     │                     │          │
│   │   Exposes:          │     │   Consumes:         │          │
│   │   - Button          │     │   - app1/Button     │          │
│   │                     │     │                     │          │
│   └─────────────────────┘     └─────────────────────┘          │
│              │                          ▲                       │
│              │    remoteEntry.js        │                       │
│              └──────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Application Roles

| App   | Role     | Port | Description                                       |
| ----- | -------- | ---- | ------------------------------------------------- |
| App 1 | Remote   | 8083 | Exposes the `Button` component for other apps     |
| App 2 | Consumer | 8082 | Consumes the `Button` component from App 1        |

---

## 📁 Project Structure

```
MFF/
├── app1/                          # Remote Application (Exposes components)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                 # Main application
│   │   ├── Button.js              # ⭐ Exposed component
│   │   ├── App.css
│   │   └── index.js
│   ├── webpack.config.js          # Module Federation config
│   └── package.json
│
├── app2/                          # Consumer Application (Uses remote components)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                 # Consumes app1/Button
│   │   └── index.js
│   ├── webpack.config.js          # Module Federation config
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

### 1. Module Federation Plugin

Webpack 5's **ModuleFederationPlugin** is the core of this architecture. It allows a JavaScript application to dynamically load code from another application at runtime.

### 2. Remote Application (App 1)

App 1 acts as a **remote** that exposes components:

```javascript
// app1/webpack.config.js
new ModuleFederationPlugin({
    name: "app1",                    // Unique identifier
    filename: "remoteEntry.js",      // Entry point for consumers
    exposes: {
        "./Button": "./src/Button",  // Exposed component mapping
    },
})
```

- **name**: Unique identifier used by consumers to reference this remote
- **filename**: The manifest file that contains information about exposed modules
- **exposes**: Maps public paths to internal component paths

### 3. Consumer Application (App 2)

App 2 acts as a **host/consumer** that uses remote components:

```javascript
// app2/webpack.config.js
new ModuleFederationPlugin({
    name: "app2",
    filename: "remoteEntry.js",
    exposes: {},                      // Not exposing anything
    remotes: {
        app1: "app1@http://localhost:8083/remoteEntry.js",
    },
})
```

- **remotes**: Declares where to fetch remote modules from
- Format: `<remote_name>@<url_to_remote_entry>`

### 4. Consuming Remote Components

In App 2, the remote `Button` component is loaded lazily:

```javascript
// app2/src/App.js
import React from 'react';

// Dynamic import from remote app1
const Button = React.lazy(() => import('app1/Button'));

function App() {
    return (
        <div>
            <h1>App 2</h1>
            <React.Suspense fallback="Loading Button...">
                <Button />
            </React.Suspense>
        </div>
    );
}
```

### 5. Runtime Flow

```
1. User visits App 2 (http://localhost:8082)
2. App 2 loads and encounters import('app1/Button')
3. Webpack fetches http://localhost:8083/remoteEntry.js
4. remoteEntry.js provides the Button component code
5. Button is rendered inside App 2
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MFF
   ```

2. **Install dependencies for App 1**
   ```bash
   cd app1
   npm install
   ```

3. **Install dependencies for App 2**
   ```bash
   cd ../app2
   npm install
   ```

### Running the Applications

> ⚠️ **Important**: App 1 (the remote) must be running before App 2 can consume its components.

1. **Start App 1 (Remote)**
   ```bash
   cd app1
   npm run start
   # Runs on http://localhost:8083
   ```

2. **Start App 2 (Consumer)** - In a new terminal
   ```bash
   cd app2
   npm run start
   # Runs on http://localhost:8082
   ```

3. **View the results**
   - App 1: [http://localhost:8083](http://localhost:8083)
   - App 2: [http://localhost:8082](http://localhost:8082)

---

## 🔧 Configuration Details

### Webpack Configuration Breakdown

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    mode: "development",
    devServer: {
        port: 8083,  // Unique port per app
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            // Federation configuration here
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};
```

### Adding Shared Dependencies

To avoid loading React multiple times, you can share dependencies:

```javascript
new ModuleFederationPlugin({
    name: "app1",
    filename: "remoteEntry.js",
    exposes: {
        "./Button": "./src/Button",
    },
    shared: {
        react: { singleton: true, eager: true },
        "react-dom": { singleton: true, eager: true },
    },
})
```

---

## 🔮 Future Plans: Vite Integration

We're planning to expand this project to support **Vite** as an alternative to Webpack, enabling:

- ⚡ **Faster Development** - Vite's native ES modules for instant HMR
- 🎨 **Multi-Framework Support** - Vue + React micro frontends
- 📦 **Modern Build System** - Leveraging Rollup for production builds

### Planned Architecture

```
MFF/
├── webpack/                  # Current Webpack-based implementations
│   ├── react-app1/
│   └── react-app2/
│
├── vite/                     # ⭐ Future Vite-based implementations
│   ├── react-host/          # React Host Application (Vite)
│   ├── react-remote/        # React Remote Application (Vite)
│   ├── vue-remote/          # Vue Remote Application (Vite)
│   └── shared/              # Shared utilities
│
└── README.md
```

### Vite Module Federation Plugin

For Vite, we'll use the `@originjs/vite-plugin-federation` plugin:

```javascript
// vite.config.js (Remote)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'react-remote',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/components/Button.jsx',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
    build: {
        target: 'esnext',
    },
});
```

```javascript
// vite.config.js (Host)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'react-host',
            remotes: {
                reactRemote: 'http://localhost:5001/assets/remoteEntry.js',
                vueRemote: 'http://localhost:5002/assets/remoteEntry.js',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
});
```

### Vue + React Interoperability

With Vite, you can mix frameworks:

```javascript
// In React Host, consuming Vue component
const VueWidget = React.lazy(() => import('vueRemote/Widget'));

// Wrapper for Vue component in React
function VueInReact() {
    return (
        <React.Suspense fallback="Loading Vue Widget...">
            <VueWidget />
        </React.Suspense>
    );
}
```

---

## 💡 Common Use Cases

### 1. Design System Distribution
Share UI components across multiple applications:
```javascript
exposes: {
    './Button': './src/Button',
    './Modal': './src/Modal',
    './Card': './src/Card',
}
```

### 2. Feature Teams
Each team owns their micro frontend:
- **Team A** → `checkout` micro frontend
- **Team B** → `catalog` micro frontend
- **Team C** → `user-account` micro frontend

### 3. A/B Testing
Deploy different versions of components to different users without full app redeployment.

### 4. Legacy Migration
Gradually migrate from legacy to modern frontend by replacing sections incrementally.

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Container is not available" | Ensure the remote app is running and accessible |
| "Shared module is not available" | Check that shared dependencies have matching versions |
| CORS errors | Add appropriate CORS headers to the remote's dev server |
| Component not loading | Verify the remote URL in `remotes` configuration |

### Debugging Tips

1. **Check Network Tab**: Look for `remoteEntry.js` requests
2. **Console Logs**: Look for Module Federation-specific errors
3. **Verify Ports**: Ensure no port conflicts
4. **Clear Cache**: Sometimes hot reload doesn't pick up changes

---

## 📚 Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Micro Frontends Patterns](https://micro-frontends.org/)

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ to demonstrate Micro Frontend Architecture
</p>
