from pathlib import Path
import re

files = [
    'ApplicationSuccessPage.html', 'DashboardPage.html', 'JobDetailsPage.html',
    'JobsListingPage.html', 'LandingPage2.html', 'MessagesPage.html',
    'MyApplicationsPage.html', 'NotificationsPage.html', 'ProfilePage.html',
    'SavedJobsPage.html', 'SearchResultsPage.html', 'SettingsPage.html'
]

map_icons = {
    'arrow-left': 'fas fa-arrow-left',
    'bell': 'fas fa-bell',
    'bookmark': 'fas fa-bookmark',
    'briefcase': 'fas fa-briefcase',
    'calendar': 'fas fa-calendar',
    'cog': 'fas fa-cog',
    'dashboard': 'fas fa-chart-line',
    'education': 'fas fa-graduation-cap',
    'envelope': 'fas fa-envelope',
    'eye-open': 'fas fa-eye',
    'file': 'fas fa-file',
    'flash': 'fas fa-bolt',
    'globe': 'fas fa-globe',
    'heart': 'fas fa-heart',
    'heart-empty': 'far fa-heart',
    'list': 'fas fa-list',
    'list-alt': 'fas fa-list-alt',
    'log-in': 'fas fa-right-to-bracket',
    'log-out': 'fas fa-right-from-bracket',
    'map-marker': 'fas fa-map-marker-alt',
    'menu-hamburger': 'fas fa-bars',
    'new-window': 'fas fa-arrow-up-right-from-square',
    'ok': 'fas fa-check',
    'pencil': 'fas fa-pencil-alt',
    'remove': 'fas fa-times',
    'search': 'fas fa-search',
    'send': 'fas fa-paper-plane',
    'sort': 'fas fa-sort',
    'stats': 'fas fa-chart-bar',
    'tasks': 'fas fa-tasks',
    'th': 'fas fa-th',
    'th-list': 'fas fa-th-list',
    'time': 'fas fa-clock',
    'upload': 'fas fa-upload',
    'usd': 'fas fa-dollar-sign',
    'user': 'fas fa-user'
}

for name in files:
    path = Path(name)
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    updated = text
    for old, new in map_icons.items():
        updated = re.sub(rf'\bglyphicon glyphicon-{re.escape(old)}\b', new, updated)
    if updated != text:
        path.write_text(updated, encoding='utf-8')

landing_path = Path('LandingPage2.html')
if landing_path.exists():
    text = landing_path.read_text(encoding='utf-8')
    replaced = text.replace(
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha512-pV6UgL1vMK3v6XEAa8uGFRjvQ1vMOPx6lZ4+fS0LbR7wP9g91Jxo4tj6UMxTocrPmcA/yIJ+6xFhX4Tq3vG7xQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />'
    )
    if replaced != text:
        landing_path.write_text(replaced, encoding='utf-8')

design_path = Path('design_system.css')
if design_path.exists():
    text = design_path.read_text(encoding='utf-8')
    newtext = re.sub(r'@import url\("https://cdnjs\.cloudflare\.com/ajax/libs/bootstrap/3\.4\.1/css/bootstrap\.min\.css"\);\s*\n', '', text)
    if newtext != text:
        design_path.write_text(newtext, encoding='utf-8')

print('done')
