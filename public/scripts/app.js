document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const navLinks = document.querySelectorAll('nav a');

    const loadView = async (viewName) => {
        try {
            const response = await fetch(`../views/${viewName}.html`);
            const html = await response.text();
            content.innerHTML = html;

            const module = await import(`./${viewName}.js`);
            const initFunction = module[`init${viewName.charAt(0).toUpperCase() + viewName.slice(1)}View`];
            if (typeof initFunction === 'function') {
                initFunction();
            }

        } catch (error) {
            console.error(error);
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const viewName = event.target.dataset.page;
            console.log(event.target.dataset.page)
            if (viewName) {
                loadView(viewName);
            }
        });
    });
});