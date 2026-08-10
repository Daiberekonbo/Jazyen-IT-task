/* ============================================================
   MODAL COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/modal.js"></script>
   openModal("Title", "<p>Content</p>");
   closeModal();
   ============================================================ */

function openModal(title, contentHTML) {
    closeModal();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            ${contentHTML}
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    // Close on overlay click
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // Close button
    modal.querySelector(".modal-close").addEventListener("click", closeModal);

    // Close on Escape
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}

function closeModal() {
    const existing = document.querySelector(".modal-overlay");
    if (existing) {
        existing.remove();
    }
    document.body.style.overflow = "";
}