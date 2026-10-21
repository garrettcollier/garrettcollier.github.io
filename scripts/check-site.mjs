import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://garrettcollier.net';
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
const pages = new Map();
const errors = [];
for (const route of routes) {
    if (route.origin !== origin || !route.pathname.endsWith('/')) errors.push(`Noncanonical sitemap URL: ${route}`);
    const filename = path.join(root, decodeURIComponent(route.pathname), 'index.html');
    try { pages.set(filename, { route, text: await readFile(filename, 'utf8') }); }
    catch { errors.push(`Missing sitemap page: ${route.pathname}`); }
}
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(match => [match[1], match[2]]));
const ids = text => new Set([...text.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
for (const [filename, { route, text }] of pages) {
    if ([...text.matchAll(/<h1\b/g)].length !== 1) errors.push(`${route.pathname}: expected one main heading`);
    if (/<(?:details|summary|select|dialog|form)\b/i.test(text)) errors.push(`${route.pathname}: content must remain visible without expandable controls, dropdowns, or forms`);
    if (/target=["']_blank["']/i.test(text)) errors.push(`${route.pathname}: links must stay in the same tab`);
    if (/navbar-toggler|data-toggle=|class="sidebar"/.test(text)) errors.push(`${route.pathname}: remove collapsed navigation and floating sidebars`);
    const primary = text.match(/<ul class="navbar-nav ml-auto">([\s\S]*?)<\/ul>/)?.[1] || '';
    const destinations = [...primary.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    if (destinations.join(',') !== '/about/,/work/,/writing/,/speaking/,/contact/') errors.push(`${route.pathname}: primary navigation must contain the five consolidated destinations`);
    if (!text.includes('aria-label="Primary"')) errors.push(`${route.pathname}: missing labelled primary navigation`);
    const tags = [...text.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0]));
    if (!tags.some(tag => tag.rel === 'canonical' && tag.href === route.href)) errors.push(`${route.pathname}: incorrect canonical`);
    for (const script of text.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
        try { JSON.parse(script[1]); } catch { errors.push(`${route.pathname}: invalid structured data`); }
    }
    for (const tag of text.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/g)) {
        const attr = attributes(tag[0]);
        const links = [attr.href, attr.src, ...(attr.srcset ? attr.srcset.split(',').map(item => item.trim().split(/\s+/)[0]) : [])].filter(Boolean);
        for (const link of links) {
            let url;
            try { url = new URL(link.replaceAll('&amp;', '&'), route); } catch { errors.push(`${route.pathname}: malformed URL ${link}`); continue; }
            if (url.origin !== origin) continue;
            if (['/projects/', '/technology/', '/public-service/', '/experience/'].includes(url.pathname)) errors.push(`${route.pathname}: legacy link ${link}`);
            let target = path.join(root, decodeURIComponent(url.pathname));
            try {
                if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
                await stat(target);
                if (url.hash && target.endsWith('.html')) {
                    const content = pages.get(target)?.text || await readFile(target, 'utf8');
                    if (!ids(content).has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${route.pathname}: missing fragment ${link}`);
                }
            } catch { errors.push(`${route.pathname}: missing local target ${link}`); }
        }
    }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${pages.size} sitemap pages: headings, navigation, canonicals, structured data, links, fragments, images, and responsive sources.`);
