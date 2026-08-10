/* ============================================================
   SPINNER COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/spinner.js"></script>
   showSpinner("Loading...");
   hideSpinner();
   ============================================================ */

function showSpinner(message) {
    hideSpinner();
    message = message || "Loading...";

    const overlay = document.createElement("div");
    overlay.className = "spinner-overlay";

    overlay.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="color: #fff; margin-top: 12px; font-size: 14px;">${message}</p>
        </div>
    `;

    document.body.appendChild(overlay);
}

function hideSpinner() {
    const existing = document.querySelector(".spinner-overlay");
    if (existing) {
        existing.remove();
    }
}