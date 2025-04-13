// main.js - QR Code Scanner

document.addEventListener('DOMContentLoaded', function() {
  // Initialize state
  let data = "";
  let loading = true;
  let error = null;
  let copied = false;
  
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
  
  // Render functions
  function renderApp() {
    if (loading) {
      renderLoading();
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
        dataSection = `
          <pre class="data-display">${data}</pre>
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
          <p class="hint">Scan a QR code with the format: ?data=your-data</p>
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
            <span class="icon">↻</span> Scan New Code
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
    document.getElementById('scan-button').addEventListener('click', refreshPage);
    
    if (data) {
      document.getElementById('copy-button').addEventListener('click', copyToClipboard);
      document.getElementById('print-button').addEventListener('click', () => window.print());
    }
  }
  
  // Start the application
  init();
});