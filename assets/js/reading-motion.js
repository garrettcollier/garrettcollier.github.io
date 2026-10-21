/* A one-time entrance for section headings; reading text remains stationary. */
(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;

    const pending = new Set();
    const reveal = element => {
        element.classList.remove('is-pending');
        pending.delete(element);
        observer.unobserve(element);
    };
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) reveal(entry.target);
        }
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });

    const releaseAll = () => {
        for (const element of pending) element.classList.remove('is-pending');
        pending.clear();
        observer.disconnect();
    };

    try {
        // Whole title groups move together. Individual article paragraphs never animate.
        const candidates = document.querySelectorAll('main .section-heading, main .section-kicker, main h2, main .flow-entry > h3, main .flow-section > h3');
        for (const element of candidates) {
            if (element.closest('.article-shell') ||
                (!element.matches('.section-heading') && element.closest('.section-heading')) ||
                element.getBoundingClientRect().top < window.innerHeight) continue;
            element.classList.add('scroll-reveal', 'is-pending');
            pending.add(element);
            observer.observe(element);
        }
        const onPreferenceChange = event => { if (event.matches) releaseAll(); };
        if (preference.addEventListener) preference.addEventListener('change', onPreferenceChange);
        else if (preference.addListener) preference.addListener(onPreferenceChange);
        // Keyboard focus, in-page navigation, find-in-page, and printing reveal content immediately.
        document.addEventListener('focusin', event => {
            const target = event.target.closest('.is-pending');
            if (target) reveal(target);
        });
        window.addEventListener('hashchange', releaseAll);
        window.addEventListener('beforeprint', releaseAll);
        document.addEventListener('keydown', event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') releaseAll();
        });
    } catch {
        releaseAll();
    }
})();
