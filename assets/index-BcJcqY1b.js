(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function a(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(e){if(e.ep)return;e.ep=!0;const n=a(e);fetch(e.href,n)}})();document.addEventListener("DOMContentLoaded",function(){let t="",r=!0,a=null,i=!1;const e=document.getElementById("app");function n(){try{r=!0,c();const l=new URLSearchParams(window.location.search).get("data");l&&(t=decodeURIComponent(l)),r=!1,c()}catch(o){console.error("Error during initialization:",o),a="Failed to decode QR data",r=!1,c()}}function d(o){try{return new URL(o),!0}catch{return!1}}function p(){t&&navigator.clipboard.writeText(t).then(()=>{i=!0,c(),setTimeout(()=>{i=!1,c()},2e3)}).catch(()=>{a="Failed to copy to clipboard",c()})}function s(){window.location.reload()}function c(){r?u():a?f():v()}function u(){e.innerHTML=`
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
    `}function f(){e.innerHTML=`
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div>
            <h3>Error</h3>
            <p>${a}</p>
            <button id="retry-button" class="retry-button">
              <span class="icon">↻</span> Try Again
            </button>
          </div>
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,document.getElementById("retry-button").addEventListener("click",s)}function v(){let o="";t?d(t)?o=`
          <div class="url-container">
            <div class="url-message">
              <p>This appears to be a URL</p>
              <a href="${t}" target="_blank" rel="noopener noreferrer" class="url-link">
                ${t}
              </a>
            </div>
            <a href="${t}" target="_blank" rel="noopener noreferrer" class="open-link-button">
              Open Link
            </a>
          </div>
          <div class="meta-info">
            <p>Content length: ${t.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `:o=`
          <pre class="data-display">${t}</pre>
          <div class="meta-info">
            <p>Content length: ${t.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `:o=`
        <div class="no-data">
          <p>No QR code data detected</p>
          <p class="hint">Scan a QR code with the format: ?data=your-data</p>
        </div>
      `,e.innerHTML=`
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="content-card">
          <div class="card-header">
            <h2>Scanned Content</h2>
            ${t?`
              <button id="copy-button" class="copy-button">
                <span class="icon">📋</span>
                ${i?"Copied!":"Copy"}
              </button>
            `:""}
          </div>
          
          <div class="card-body">
            ${o}
          </div>
        </div>
        
        <div class="actions">
          <button id="scan-button" class="scan-button">
            <span class="icon">↻</span> Scan New Code
          </button>
          ${t?`
            <button id="print-button" class="print-button">
              <span class="icon">🖨️</span> Print Data
            </button>
          `:""}
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,document.getElementById("scan-button").addEventListener("click",s),t&&(document.getElementById("copy-button").addEventListener("click",p),document.getElementById("print-button").addEventListener("click",()=>window.print()))}n()});
