// Theme toggle: persists `theme` in localStorage ('light'|'dark')
(function(){
    const KEY = 'theme';
    const btnSelector = 'themeToggle';

    function setTheme(theme){
        if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
        else document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(KEY, theme);
        updateButtonIcon();
    }

    function getTheme(){
        return localStorage.getItem(KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    function toggleTheme(){
        const current = getTheme();
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    function updateButtonIcon(){
        const btn = document.getElementById(btnSelector);
        if(!btn) return;
        const isDark = (getTheme() === 'dark');
        btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        btn.setAttribute('aria-pressed', isDark);
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        // Initialize
        const initial = getTheme();
        if(initial === 'dark') document.documentElement.setAttribute('data-theme','dark');
        else document.documentElement.removeAttribute('data-theme');
        updateButtonIcon();

        // Attach click
        const btn = document.getElementById(btnSelector);
        if(btn) btn.addEventListener('click', toggleTheme);

        // Sync with settings page checkbox if present
        const settingsCheckbox = document.getElementById('darkModeToggle');
        if(settingsCheckbox){
            settingsCheckbox.checked = (getTheme() === 'dark');
            settingsCheckbox.addEventListener('change', function(){
                setTheme(this.checked ? 'dark' : 'light');
            });
        }

        // React to OS changes
        if(window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e=>{
                // don't override an explicit user choice
                if(!localStorage.getItem(KEY)){
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });
})();
