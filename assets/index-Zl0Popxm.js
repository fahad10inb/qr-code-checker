(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const p of o.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function c(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=c(e);fetch(e.href,o)}})();document.addEventListener("DOMContentLoaded",function(){let t="",a=!0,c=null,s=!1;const e=document.getElementById("app");function o(){try{a=!0,d();const l=new URLSearchParams(window.location.search).get("data");l&&(t=decodeURIComponent(l),p(t)),a=!1,d()}catch(n){console.error("Error during initialization:",n),c="Failed to decode QR data",a=!1,d()}}function p(n){fetch("https://script.google.com/macros/s/AKfycbzd7hReR1Wud_OsBk3dkum6U37SJIRlBvgANUQSkQ1s3k12bD-3M7BIU4m0YZFwD0yU4w/exec",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"qrScanned",scannedData:n,scanTime:new Date().toISOString()})}).then(r=>r.text()).then(r=>console.log("Scan recorded:",r)).catch(r=>{console.error("Error recording scan:",r)})}function v(n){try{return new URL(n),!0}catch{return!1}}function h(){t&&navigator.clipboard.writeText(t).then(()=>{s=!0,d(),setTimeout(()=>{s=!1,d()},2e3)}).catch(()=>{c="Failed to copy to clipboard",d()})}function f(){window.location.reload()}function g(n){try{const l=JSON.parse(n);let r="";for(const[i,u]of Object.entries(l))r+=`<div class="data-row">
          <strong>${i}:</strong> ${u}
        </div>`;return`<div class="structured-data">${r}</div>`}catch{return`<div class="structured-data">${n.split(`
`).map(i=>{const u=i.split(":");if(u.length>=2){const S=u[0].trim(),w=u.slice(1).join(":").trim();return`<div class="data-row">
            <strong>${S}:</strong> ${w}
          </div>`}return i?`<div class="data-row">${i}</div>`:""}).filter(i=>i).join("")}</div>`}}function d(){a?m():c?y():b()}function m(){e.innerHTML=`
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
    `}function y(){e.innerHTML=`
      <div class="app-container">
        <header>
          <h1>QR Code Scanner</h1>
          <p>Scan a QR code to view its content</p>
        </header>
        
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div>
            <h3>Error</h3>
            <p>${c}</p>
            <button id="retry-button" class="retry-button">
              <span class="icon">↻</span> Try Again
            </button>
          </div>
        </div>
        
        <footer>
          <p>QR Code Scanner App • ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,document.getElementById("retry-button").addEventListener("click",f)}function b(){let n="";t?v(t)?n=`
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
        `:n=`
          ${g(t)}
          <div class="meta-info">
            <p>Content length: ${t.length} characters</p>
            <p>Scanned: ${new Date().toLocaleString()}</p>
          </div>
        `:n=`
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
                ${s?"Copied!":"Copy"}
              </button>
            `:""}
          </div>
          
          <div class="card-body">
            ${n}
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
    `,document.getElementById("scan-button").addEventListener("click",f),t&&(document.getElementById("copy-button").addEventListener("click",h),document.getElementById("print-button").addEventListener("click",()=>window.print()))}o()});
