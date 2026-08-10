/* ============================================================
   SEARCH COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <script src="components/search.js"></script>
   createSearchBar(container, { placeholder, onSearch });
   ============================================================ */

function createSearchBar(container, options) {
    options = options || {};
    const placeholder = options.placeholder || "Search...";
    const onSearch = options.onSearch || function() {};

    container.innerHTML = `
        <div class="search-bar-modern">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" class="search-input-modern" placeholder="${placeholder}" aria-label="${placeholder}" />
            <button class="btn btn-primary btn-sm">Search</button>
        </div>
    `;

    const input = container.querySelector(".search-input-modern");
    const btn = container.querySelector("button");

    function handleSearch() {
        const term = input.value.trim();
        onSearch(term);
    }

    btn.addEventListener("click", handleSearch);
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    return input;
}