import { useEffect } from 'react';

const BASE = 'Morada';

/** Define `document.title` como "<título> — Morada" (ou só o título da marca quando vazio). */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Um anúncio. Todos os lugares.`;
  }, [title]);
}
