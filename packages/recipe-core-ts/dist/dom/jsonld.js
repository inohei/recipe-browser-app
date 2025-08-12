export function getJsonLdScriptsFromDocument(doc = document) {
    const nodes = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    return nodes.map((n) => n.textContent || "").filter(Boolean);
}
