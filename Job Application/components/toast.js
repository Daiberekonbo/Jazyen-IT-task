/* ============================================================
   TOAST COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/toast.js"></script>
   showToast("Message here", "success");
   
   Types: success, error, warning, info
   ============================================================ */

function showToast(message, type) {
    type = type || "info";

    // Create toast container if it doesn't exist
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = "toast " + type;

    // Choose icon
    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    if (type === "error") iconClass = "fa-solid fa-circle-xmark";
    if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";

    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    // Auto-dismiss after 3.5 seconds
    setTimeout(function() {
        toast.classList.add("fade-out");
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3500);
}