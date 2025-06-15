import '../style.css';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize state
  let data = "";
  let loading = true;
  let error = null;
  let copied = false;
  let scanning = false;
  let videoStream = null;
  
  const appContainer = document.getElementById('app');
  
  // Initialize app
  function init() {
    try {
      loading = true;
      renderApp();
      
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("data");
      if (raw) {
        data = decodeURIComponent(raw);
        // Send scan data to Google Sheets
        sendScanDataToSheets(data);
      }
      
      loading = false;
      renderApp();
    } catch (err) {
      console.error("Error during initialization:", err);
      error = "Failed to decode QR data";
      loading = false;
      renderApp();
    }
  }
  
  // Send scan data back to Google Sheets
  function sendScanDataToSheets(scannedData) {
    const endpoint = "https://script.google.com/macros/s/AKfycbzd7hReR1Wud_OsBk3dkum6U37SJIRlBvgANUQSkQ1s3k12bD-3M7BIU4m0YZFwD0yU4w/exec";
    
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'qrScanned',
        scannedData: scannedData,
        scanTime: new Date().toISOString()
      })
    })
    .then(response => response.text())
    .then(data => console.log('Scan recorded:', data))
    .catch(error => {
      console.error('Error recording scan:', error);
      // Optional: Show error to user
      // error = "Failed to record scan";
      // renderApp();
    });
  }
  
  // Helper functions
  function isValidURL(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
  
  function copyToClipboard() {
    if (data) {
      navigator.clipboard.writeText(data)
        .then(() => {
          copied = true;
          renderApp(); // Update UI to show "Copied!"
          setTimeout(() => {
            copied = false;
            renderApp(); // Update UI back to "Copy"
          }, 2000);
        })
        .catch(() => {
          error = "Failed to copy to clipboard";
          renderApp();
        });
    }
  }
  
  function refreshPage() {
    window.location.reload();
  }
  
  // Format structured data for better display
  function renderStructuredData(data) {
    // Try to parse as JSON first
    try {
      const jsonData = JSON.parse(data);
      let formattedContent = '';
      
      // Format each key-value pair
      for (const [key, value] of Object.entries(jsonData)) {
        formattedContent += `<div class="data-row">
          <strong>${key}:</strong> <span class="data-value">${value}</span>
        </div>`;
      }
      
      return `<div class="structured-data">${formattedContent}</div>`;
    } catch {
      // Not JSON, try to format line by line
      const lines = data.split('\n');
      const formattedLines = lines.map(line => {
        // Format each line that looks like "Key: Value"
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          return `<div class="data-row">
            <strong>${key}:</strong> <span class="data-value">${value}</span>
          </div>`;
        }
        // If not a key-value format, just show the line
        return line ? `<div class="data-row single-line">${line}</div>` : '';
      }).filter(line => line); // Remove empty lines
      
      return `<div class="structured-data">${formattedLines.join('')}</div>`;
    }
  }
  
  // QR Scanner functions
  function startScanner() {
    // Create a file input element for selecting an image
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment'; // Prefer rear camera on mobile
    
    fileInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        scanning = true;
        renderApp(); // Show loading state
        
        // Process the image file
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            // Process the image
            // In a real implementation, this would use an image processing library
            // For now, we'll simulate finding a QR code after a delay
            setTimeout(() => {
              // Simulate scanning complete - in a real app, this would be the result from QR code processing
              const simulatedUrlParams = new URLSearchParams(window.location.search);
              const existingData = simulatedUrlParams.get("data");
              
              if (existingData) {
                data = decodeURIComponent(existingData);
              } else {
                // Use sample data if none exists
                data = "Sample QR Data\nType: Product\nID: 12345\nName: Test Product";
                
                // Update URL with the new data
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set("data", encodeURIComponent(data));
                window.history.pushState({}, '', newUrl);
              }
              
              // Record the scan
              sendScanDataToSheets(data);
              
              scanning = false;
              renderApp();
            }, 1500);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Trigger file selection
    fileInput.click();
  }
  
  // Alternative QR scanner implementation using BarcodeDetector API if available
  function startBarcodeScan() {
    if ('BarcodeDetector' in window) {
      scanning = true;
      renderApp();
      
      // Request camera access
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      .then(stream => {
        videoStream = stream;
        const videoElement = document.getElementById('qr-video');
        videoElement.srcObject = stream;
        videoElement.setAttribute('playsinline', true); // Required for iOS
        
        videoElement.onloadedmetadata = function() {
          videoElement.play();
          
          // Create QR code detector
          const barcodeDetector = new BarcodeDetector({
            formats: ['qr_code']
          });
          
          // Function to detect QR codes
          const detectQR = async () => {
            if (!scanning) return;
            
            try {
              const barcodes = await barcodeDetector.detect(videoElement);
              
              if (barcodes.length > 0) {
                // QR code found
                data = barcodes[0].rawValue;
                
                // Stop scanner
                stopScanner();
                
                // Update URL with the new data
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set("data", encodeURIComponent(data));
                window.history.pushState({}, '', newUrl);
                
                // Record the scan
                sendScanDataToSheets(data);
                
                // Update UI
                renderApp();
                return;
              }
              
              // Continue scanning
              requestAnimationFrame(detectQR);
            } catch (e) {
              console.error("QR detection error:", e);
              error = "QR code detection failed";
              stopScanner();
              renderApp();
            }
          };
          
          // Start detection
          detectQR();
        };
      })
      .catch(err => {
        console.error("Camera error:", err);
        error = "Could not access camera. Please make sure camera permissions are allowed.";
        scanning = false;
        renderApp();
      });
    } else {
      // Fallback to file upload method if BarcodeDetector is not available
      startScanner();
    }
  }
  
  function stopScanner() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => {
        track.stop();
      });
      videoStream = null;
    }
    scanning = false;
  }
  
  // Render functions
  function renderApp() {
    if (loading) {
      renderLoading();
    } else if (scanning) {
      renderScanner();
    } else if (error) {
      renderError();
    } else {
      renderContent();
    }
  }
  
  function renderLoading() {
    appContainer.innerHTML = `
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `;
  }
  
  function renderScanner() {
    // Check if BarcodeDetector is available
    if ('BarcodeDetector' in window) {
      appContainer.innerHTML = `
        <div class="app-container">
          <header>
            <h1>QR Code Scanner</h1>
            <p>Position QR code in the camera view</p>
          </header>
          
          <div class="scanner-container">
            <div class="camera-frame">
              <video id="qr-video" autoplay muted playsinline></video>
              <div class="scanner-overlay">
                <div class="scanner-target"></div>
              </div>
            </div>
            <button id="cancel-scan" class="cancel-button">
              <span class="icon">✕</span> Cancel
            </button>
          </div>
          
          <footer>
            <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
          </footer>
        </div>
      `;
      
      document.getElementById('cancel-scan').addEventListener('click', () => {
        stopScanner();
        renderApp();
      });
    } else {
      // Fallback for browsers without BarcodeDetector
      appContainer.innerHTML = `
        <div class="app-container">
          <header>
            <h1>QR Code Scanner</h1>
            <p>Processing QR code...</p>
          </header>
          
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Processing image...</p>
          </div>
          
          <footer>
            <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
          </footer>
        </div>
      `;
    }
  }
  
  function renderError() {
    appContainer.innerHTML = `
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div>
            <h3>Error</h3>
            <p>${error}</p>
            <button id="retry-button" class="retry-button">
              <span class="icon">↻</span> Try Again
            </button>
          </div>
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `;
    
    document.getElementById('retry-button').addEventListener('click', refreshPage);
  }
  
  function renderContent() {
    let dataSection = '';
    
    if (data) {
      if (isValidURL(data)) {
        dataSection = `
          <div class="url-container">
            <div class="url-message">
              <p>This appears to be a URL</p>
              <a href="${data}" target="_blank" rel="noopener noreferrer" class="url-link">
                ${data}
              </a>
            </div>
            <a href="${data}" target="_blank" rel="noopener noreferrer" class="open-link-button">
              Open Link
            </a>
          </div>
          <div class="meta-info">
            <p>Content length: ${data.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `;
      } else {
        // Use the structured data renderer
        dataSection = `
          ${renderStructuredData(data)}
          <div class="meta-info">
            <p>Content length: ${data.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `;
      }
    } else {
      dataSection = `
        <div class="no-data">
          <p>No QR code data detected</p>
          <p class="hint">Scan a QR code to see its content</p>
        </div>
      `;
    }
    
    appContainer.innerHTML = `
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="content-card">
          <div class="card-header">
            <h2>Scanned Content</h2>
            ${data ? `
              <button id="copy-button" class="copy-button">
                <span class="icon">📋</span>
                ${copied ? "Copied!" : "Copy"}
              </button>
            ` : ''}
          </div>
          
          <div class="card-body">
            ${dataSection}
          </div>
        </div>
        
        <div class="actions">
          <button id="scan-button" class="scan-button">
            <span class="icon">📷</span> Scan QR Code
          </button>
          ${data ? `
            <button id="print-button" class="print-button">
              <span class="icon">🖨️</span> Print Data
            </button>
          ` : ''}
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `;
    
    // Add event listeners after rendering
    document.getElementById('scan-button').addEventListener('click', () => {
      // Check if BarcodeDetector API is available
      if ('BarcodeDetector' in window) {
        startBarcodeScan();
      } else {
        startScanner(); // Fallback to file upload
      }
    });
    
    if (data) {
      document.getElementById('copy-button').addEventListener('click', copyToClipboard);
      document.getElementById('print-button').addEventListener('click', () => window.print());
    }
  }
  
  // Start the application
  init();
});