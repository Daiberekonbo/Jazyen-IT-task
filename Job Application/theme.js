// Theme toggle: persists `theme` in localStorage ('light'|'dark')
(function(){
    const KEY = 'theme';
    const btnSelector = 'themeToggle';

    function applyThemeState(theme){
        const isDark = (theme === 'dark');
        document.documentElement.toggleAttribute('data-theme', isDark);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.style.colorScheme = theme;
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        document.body.setAttribute('data-theme-state', theme);
        document.body.dataset.themeState = theme;
        updateButtonIcon();
        syncSettingsToggle();
        if (window.syncSidebarUser) window.syncSidebarUser();
    }

    function setTheme(theme){
        const safeTheme = theme === 'dark' ? 'dark' : 'light';
        localStorage.setItem(KEY, safeTheme);
        const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        userSettings.darkMode = safeTheme === 'dark';
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        applyThemeState(safeTheme);
    }

    function getTheme(){
        const saved = localStorage.getItem(KEY);
        if (saved === 'dark' || saved === 'light') return saved;

        const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        if (typeof userSettings.darkMode === 'boolean') {
            return userSettings.darkMode ? 'dark' : 'light';
        }

        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
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

    function syncSettingsToggle(){
        const settingsCheckbox = document.getElementById('darkModeToggle');
        if(settingsCheckbox){
            settingsCheckbox.checked = (getTheme() === 'dark');
        }
    }

    window.appTheme = {
        getTheme,
        setTheme,
        toggleTheme
    };

    document.addEventListener('DOMContentLoaded', ()=>{
        const initial = getTheme();
        applyThemeState(initial);

        const btn = document.getElementById(btnSelector);
        if(btn) btn.addEventListener('click', toggleTheme);

        const settingsCheckbox = document.getElementById('darkModeToggle');
        if(settingsCheckbox){
            settingsCheckbox.addEventListener('change', function(){
                setTheme(this.checked ? 'dark' : 'light');
            });
        }

        if(window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e=>{
                if(!localStorage.getItem(KEY)){
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });
})();
