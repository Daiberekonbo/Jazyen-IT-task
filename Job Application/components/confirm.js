/* ============================================================
   CONFIRMATION DIALOG COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/confirm.js"></script>
   confirmAction("Are you sure?", function() {
       // Do something when confirmed
   });
   ============================================================ */

function confirmAction(message, onConfirm) {
    if (typeof openModal === "function") {
        openModal("Confirm Action", `
            <p style="margin-bottom: 24px; color: #1F2937;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" id="confirmOkBtn">Confirm</button>
            </div>
        `);

        document.getElementById("confirmOkBtn").addEventListener("click", function() {
            closeModal();
            if (typeof onConfirm === "function") {
                onConfirm();
            }
        });
    } else {
        if (window.confirm(message) && typeof onConfirm === "function") {
            onConfirm();
        }
    }
}