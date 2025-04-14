(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))f(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&f(d)}).observe(document,{childList:!0,subtree:!0});function p(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function f(n){if(n.ep)return;n.ep=!0;const a=p(n);fetch(n.href,a)}})();document.addEventListener("DOMContentLoaded",function(){let t="",l=!0,p=null,f=!1,n=!1,a=null;const d=document.getElementById("app");function S(){try{l=!0,r();const o=new URLSearchParams(window.location.search).get("data");o&&(t=decodeURIComponent(o),v(t)),l=!1,r()}catch(e){console.error("Error during initialization:",e),p="Failed to decode QR data",l=!1,r()}}function v(e){fetch("https://script.google.com/macros/s/AKfycbzd7hReR1Wud_OsBk3dkum6U37SJIRlBvgANUQSkQ1s3k12bD-3M7BIU4m0YZFwD0yU4w/exec",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"qrScanned",scannedData:e,scanTime:new Date().toISOString()})}).then(i=>i.text()).then(i=>console.log("Scan recorded:",i)).catch(i=>{console.error("Error recording scan:",i)})}function b(e){try{return new URL(e),!0}catch{return!1}}function R(){t&&navigator.clipboard.writeText(t).then(()=>{f=!0,r(),setTimeout(()=>{f=!1,r()},2e3)}).catch(()=>{p="Failed to copy to clipboard",r()})}function L(){window.location.reload()}function C(e){try{const o=JSON.parse(e);let i="";for(const[c,s]of Object.entries(o))i+=`<div class="data-row">
          <strong>${c}:</strong> <span class="data-value">${s}</span>
        </div>`;return`<div class="structured-data">${i}</div>`}catch{return`<div class="structured-data">${e.split(`
`).map(c=>{const s=c.split(":");if(s.length>=2){const u=s[0].trim(),g=s.slice(1).join(":").trim();return`<div class="data-row">
            <strong>${u}:</strong> <span class="data-value">${g}</span>
          </div>`}return c?`<div class="data-row single-line">${c}</div>`:""}).filter(c=>c).join("")}</div>`}}function h(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.capture="environment",e.addEventListener("change",function(o){if(o.target.files&&o.target.files[0]){const i=o.target.files[0];n=!0,r();const c=new FileReader;c.onload=function(s){const u=new Image;u.onload=function(){setTimeout(()=>{const w=new URLSearchParams(window.location.search).get("data");if(w)t=decodeURIComponent(w);else{t=`Sample QR Data
Type: Product
ID: 12345
Name: Test Product`;const y=new URL(window.location.href);y.searchParams.set("data",encodeURIComponent(t)),window.history.pushState({},"",y)}v(t),n=!1,r()},1500)},u.src=s.target.result},c.readAsDataURL(i)}}),e.click()}function D(){"BarcodeDetector"in window?(n=!0,r(),navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}}).then(e=>{a=e;const o=document.getElementById("qr-video");o.srcObject=e,o.setAttribute("playsinline",!0),o.onloadedmetadata=function(){o.play();const i=new BarcodeDetector({formats:["qr_code"]}),c=async()=>{if(n)try{const s=await i.detect(o);if(s.length>0){t=s[0].rawValue,m();const u=new URL(window.location.href);u.searchParams.set("data",encodeURIComponent(t)),window.history.pushState({},"",u),v(t),r();return}requestAnimationFrame(c)}catch(s){console.error("QR detection error:",s),p="QR code detection failed",m(),r()}};c()}}).catch(e=>{console.error("Camera error:",e),p="Could not access camera. Please make sure camera permissions are allowed.",n=!1,r()})):h()}function m(){a&&(a.getTracks().forEach(e=>{e.stop()}),a=null),n=!1}function r(){l?Q():n?$():p?E():U()}function Q(){d.innerHTML=`
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
    `}function $(){"BarcodeDetector"in window?(d.innerHTML=`
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
      `,document.getElementById("cancel-scan").addEventListener("click",()=>{m(),r()})):d.innerHTML=`
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
      `}function E(){d.innerHTML=`
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div>
            <h3>Error</h3>
            <p>${p}</p>
            <button id="retry-button" class="retry-button">
              <span class="icon">↻</span> Try Again
            </button>
          </div>
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,document.getElementById("retry-button").addEventListener("click",L)}function U(){let e="";t?b(t)?e=`
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
        `:e=`
          ${C(t)}
          <div class="meta-info">
            <p>Content length: ${t.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `:e=`
        <div class="no-data">
          <p>No QR code data detected</p>
          <p class="hint">Scan a QR code to see its content</p>
        </div>
      `,d.innerHTML=`
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
                ${f?"Copied!":"Copy"}
              </button>
            `:""}
          </div>
          
          <div class="card-body">
            ${e}
          </div>
        </div>
        
        <div class="actions">
          <button id="scan-button" class="scan-button">
            <span class="icon">📷</span> Scan QR Code
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
    `,document.getElementById("scan-button").addEventListener("click",()=>{"BarcodeDetector"in window?D():h()}),t&&(document.getElementById("copy-button").addEventListener("click",R),document.getElementById("print-button").addEventListener("click",()=>window.print()))}S()});
