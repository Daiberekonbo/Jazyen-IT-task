/* ============================================================
   PAGINATION COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/pagination.js"></script>
   renderPagination(container, totalItems, itemsPerPage, currentPage, onPageChange);
   ============================================================ */

function renderPagination(container, totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = '<div class="pagination">';

    // Previous button
    html += `
        <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage ? 'active' : '';
        html += `<button class="page-btn ${isActive}" data-page="${i}">${i}</button>`;
    }

    // Next button
    html += `
        <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    html += '</div>';

    container.innerHTML = html;

    // Attach event listeners
    container.querySelectorAll(".page-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (this.disabled) return;
            const page = parseInt(this.dataset.page);
            if (page < 1 || page > totalPages) return;
            if (typeof onPageChange === "function") {
                onPageChange(page);
            }
        });
    });
}