Garrett Collier Personal Website

Static HTML website for garrettcollier.net, hosted with GitHub Pages.

Local preview (no package installation required; uses Node.js built-in modules):

    npm start

Open http://127.0.0.1:4173/. To select another port:

    npm start -- --port=4174

Validate published routes, internal links, responsive image sources, metadata,
headings, and navigation:

    npm run check

Navigation:

About, Work, Writing, Speaking, and Contact are the five primary destinations.
/work/ combines projects, technology, research, and public-service material.
/about/ combines biography, professional history, education, and academic work.
The old /projects/, /technology/, /public-service/, and /experience/ files only
forward existing bookmarks; they are absent from navigation and the sitemap.
All published internal links use the consolidated destinations directly.

Primary files:

    index.html
    work/index.html
    about/index.html
    speaking/index.html
    contact/index.html
    writing/index.html
    writing/ai-supply-chain-economy/index.html
    assets/css/site-redesign.css
    assets/css/garrettcollier.css
    assets/js/reading-motion.js
    assets/docs/usc-mpa-capstone-ai-supply-chain-economy.pdf
    sitemap.xml

Reading layout:

All public pages use bold Arial/Helvetica headings matching the earlier rendered
design, Source Sans Pro body text at 17px, and a consistent heading hierarchy.
Projects, writing entries, related keynotes, and contact sections use visible
tiles with subtle borders and shadows. Reading text remains in a narrow column.
There are no expandable sections, floating sidebars, or dropdown controls. Navigation
stays visible on mobile. Links stay in the same tab. The homepage portrait hero
retains its established desktop/mobile treatment.

Motion:

Section headings ease into view once below the initial viewport. Paragraphs and
article bodies stay still. Native scrolling and anchor navigation are preserved.
The enhancement uses IntersectionObserver, stays visible without JavaScript, and
turns off for reduced-motion preferences. Buttons and navigation have small
hover/focus transitions. The hero photograph and mobile crop remain unchanged.

Speaking inquiries:

Email inquiry links open a mailto draft with the selected talk title and a short
description, followed by blank event details. General inquiry links provide the
same event template with a blank topic. Visitors complete and send the email in
their own mail app. No web form, popup, or inquiry JavaScript is needed.

Images and mobile hero:

The hero retains header.jpg and its existing desktop/mobile crop. The large name
is visually hidden on phones to avoid covering the portrait, while remaining
available to assistive technology. The separate About/Speaking portrait uses
responsive WebP derivatives and a JPEG fallback. Original photography is retained.

Legacy styling tasks:

Gulp configuration now points to the repository's actual root and assets folders.
Those optional tasks require the legacy development dependencies in package.json;
the preview and site checks above do not. The current site styles are served from
the committed CSS files, including the additive site-redesign.css stylesheet.

Publication:

Local edits are not published until the repository's normal GitHub Pages workflow
is used. The sitemap defines the public routes checked by npm run check; an
unlisted local draft is not automatically added to the writing index or sitemap.

Social icon asset:

assets/icons/substack.svg is the Substack symbol from Simple Icons:
https://github.com/simple-icons/simple-icons/blob/develop/icons/substack.svg
The homepage hero uses two actions: Writing (primary) and Work (secondary).
Speaking remains in the primary navigation and homepage speaking section.
