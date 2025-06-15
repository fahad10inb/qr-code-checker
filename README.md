# QR Code Checker

A web application for scanning QR codes using your device's camera or image upload. The app decodes QR codes, displays the scanned content in a user-friendly format, and allows easy copying or printing of the data. Scanned data is also sent to a Google Sheets endpoint for record-keeping.

## Features

- Scan QR codes using the device camera (via BarcodeDetector API) or image upload fallback.
- Display scanned content with formatting for URLs and structured data.
- Copy scanned data to clipboard with a single click.
- Print scanned data directly from the app.
- Send scanned data to a Google Sheets backend for logging.
- Responsive and user-friendly interface.

## Technologies Used

- JavaScript (ES6+)
- Vite (build tool)
- React
- TailwindCSS (styling)
- Lucide React (icons)
- Google Sheets API (for scan data logging)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fahad10inb/qr-code-checker.git
   cd qr-code-checker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the URL shown in the terminal).

## Building for Production

To build the app for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured to deploy to GitHub Pages. To deploy, run:

```bash
npm run deploy
```

Make sure the `homepage` field in `package.json` is set correctly to your GitHub Pages URL.

## Usage

- Click the "Scan QR Code" button to start scanning.
- If your browser supports the BarcodeDetector API, the camera will activate for live scanning.
- If not supported, you can upload an image containing a QR code.
- The scanned content will be displayed, with URLs clickable and structured data formatted.
- Use the "Copy" button to copy the scanned data to your clipboard.
- Use the "Print Data" button to print the scanned content.

## License

This project is private and not publicly licensed.

---

© QR Code Checker App - ${new Date().getFullYear()}
