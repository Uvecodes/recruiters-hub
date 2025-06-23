# Recruiters Hub

A modern web application for connecting recruiters with talented developers. Built with vanilla JavaScript, HTML5, CSS3, and Firebase.

## Features

- **User Authentication**: Sign up, login, and profile management
- **Developer Profiles**: Create and manage detailed developer profiles
- **Search & Discovery**: Find developers by skills, location, and experience
- **Resume Upload**: Upload and manage resumes with Firebase Storage
- **Real-time Updates**: Live updates using Firebase Firestore
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Custom CSS with modern design principles
- **Build**: No build process required - runs directly in the browser

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (required for ES6 modules)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd recuiters-hub
```

### 2. Firebase Configuration

The project is already configured with Firebase. The configuration is in `public/assets/js/firebase-config.js`.

### 3. Start Local Server

**Important**: This project uses ES6 modules, which require files to be served over HTTP. You cannot open the HTML files directly in a browser.

#### Option A: Using Python (Recommended)

If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js

If you have Node.js installed:

```bash
# Install serve globally
npm install -g serve

# Start server
serve public -p 8000
```

#### Option C: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `public/index.html`
3. Select "Open with Live Server"

### 4. Access the Application

Open your browser and navigate to:
- **Python/Node.js**: `http://localhost:8000`
- **Live Server**: Usually `http://localhost:5500`

## Project Structure

```
recuiters-hub/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── img/
│   │   │   ├── logo.png
│   │   │   ├── rec-logo.png
│   │   │   └── Untitled design.svg
│   │   └── js/
│   │       ├── auth.js
│   │       ├── firebase-config.js
│   │       ├── main.js
│   │       ├── profile.js
│   │       ├── search.js
│   │       ├── upload.js
│   │       └── utils.js
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── user-setting.html
│   └── signup.html
├── firebase.json
└── README.md
```

## Key Files

- **`public/index.html`**: Landing page with search functionality
- **`public/login.html`**: User authentication page
- **`public/signup.html`**: User registration page
- **`public/dashboard.html`**: User dashboard
- **`public/user-setting.html`**: Profile management page
- **`public/assets/js/firebase-config.js`**: Firebase configuration and initialization
- **`public/assets/js/auth.js`**: Authentication logic
- **`public/assets/js/profile.js`**: Profile management
- **`public/assets/js/search.js`**: Search functionality
- **`public/assets/js/upload.js`**: File upload handling
- **`public/assets/js/utils.js`**: Utility functions
- **`public/assets/js/main.js`**: Main application logic

## Firebase Services Used

- **Authentication**: User signup, login, and session management
- **Firestore**: Database for user profiles, search data, and application data
- **Storage**: File storage for resumes and profile images
- **Analytics**: Usage tracking and insights

## Development Notes

### ES6 Modules
This project uses ES6 modules for better code organization. All JavaScript files use `import`/`export` syntax and are loaded with `type="module"` in HTML.

### Firebase SDK
The project uses the modern Firebase SDK (v9+) with modular syntax for better tree-shaking and performance.

### CORS and Local Development
ES6 modules require files to be served over HTTP due to CORS restrictions. This is why a local server is required.

## Troubleshooting

### Common Issues

1. **"Failed to load module" errors**
   - Make sure you're running a local HTTP server
   - Don't open files directly with `file://` protocol

2. **Firebase initialization errors**
   - Check browser console for detailed error messages
   - Verify Firebase configuration in `firebase-config.js`

3. **Authentication issues**
   - Ensure Firebase Authentication is enabled in your Firebase project
   - Check that email/password authentication is enabled

4. **File upload errors**
   - Verify Firebase Storage rules allow uploads
   - Check file size limits (5MB max)

### Browser Compatibility

This application requires a modern browser that supports:
- ES6 modules
- Async/await
- Fetch API
- Modern CSS features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 