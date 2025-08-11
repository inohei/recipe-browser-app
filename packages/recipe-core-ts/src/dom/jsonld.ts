export function getJsonLdScriptsFromDocument(
  doc: Document = document
): string[] {
  const nodes = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]')
  );
  return nodes.map((n) => n.textContent || "").filter(Boolean);
}
