import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState, IconButton, Skeleton } from '@/components/ui';
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ConversationList, type InboxFilter } from '@/components/app/messages/ConversationList';
import type { InboxConversation } from '@/components/app/messages/ConversationItem';
import { GuestPanel } from '@/components/app/messages/GuestPanel';
import type { QuickReply } from '@/components/app/messages/QuickReplies';
import { Thread } from '@/components/app/messages/Thread';
import { useMock } from '@/hooks/useMock';
import { matchesMedia, useMediaQuery } from '@/hooks/useMediaQuery';
import {
  getConversations,
  getProperties,
  getReservations,
  markConversationRead,
  markConversationUnread,
  sendMessage,
} from '@/mocks/api';
import type { Property } from '@/mocks/types';
import { NOW_ISO } from '@/lib/date';
import { cn } from '@/lib/cn';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** ≥734px: lista e conversa lado a lado. Abaixo disso, uma tela por vez. */
const WIDE_QUERY = '(min-width: 734px)';

const matchesWide = () => matchesMedia(WIDE_QUERY, true);

const lastAt = (c: InboxConversation) => c.messages[c.messages.length - 1]?.sentAt ?? '';
const byLastMessage = (a: InboxConversation, b: InboxConversation) => lastAt(b).localeCompare(lastAt(a));
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function buildReplies(c: InboxConversation, p: Property | undefined): QuickReply[] {
  const first = c.guestName.startsWith('Família') ? c.guestName : (c.guestName.split(' ')[0] ?? c.guestName);
  const checkIn = p?.checkIn ?? '15:00';
  const checkOut = p?.checkOut ?? '11:00';
  const place = p ? ` O imóvel fica em ${p.neighborhood}, ${p.city}.` : '';
  const wifi = p ? `Morada-${p.id}` : 'Morada';
  return [
    {
      id: 'checkin',
      label: 'Instruções de check-in',
      text: `Olá, ${first}. O check-in é a partir das ${checkIn}.${place} No dia da chegada mando a senha da fechadura e o passo a passo para entrar.`,
    },
    {
      id: 'wifi',
      label: 'Senha do Wi-Fi',
      text: `${first}, a rede do Wi-Fi é ${wifi} e a senha é ${p ? `${p.id}2026` : 'morada2026'}.`,
    },
    {
      id: 'regras',
      label: 'Regras da casa',
      text: `${first}, as regras são simples: silêncio das 22h às 8h, não fumar dentro do imóvel e check-out até as ${checkOut}. Obrigado.`,
    },
    {
      id: 'obrigado',
      label: 'Obrigado pela estadia',
      text: `Obrigado pela estadia, ${first}. Foi um prazer receber você${p ? ` em ${p.city}` : ''}. Volte quando quiser.`,
    },
  ];
}

let tempSeq = 0;

export default function Messages() {
  useDocumentTitle('Mensagens');
  const [params, setParams] = useSearchParams();
  const paramId = params.get('c');
  const wide = useMediaQuery(WIDE_QUERY, true);

  const [conversations, setConversations] = useState<InboxConversation[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [defaultId, setDefaultId] = useState<string | null>(null);
  const { data: properties } = useMock(getProperties);
  const { data: reservations } = useMock(() => getReservations());

  const [filter, setFilter] = useState<InboxFilter>('all');
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const initialParam = useRef(paramId);

  // Carga inicial. Padrão: a primeira não lida (só quando lista e conversa aparecem juntas).
  useEffect(() => {
    let cancelled = false;
    getConversations()
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort(byLastMessage);
        const first = sorted.find((c) => c.unread > 0) ?? sorted[0];
        const openId = initialParam.current ?? (matchesWide() ? first?.id : undefined);
        setDefaultId(first?.id ?? null);
        if (openId) void markConversationRead(openId).catch(() => {});
        setConversations(sorted.map((c) => (c.id === openId && c.unread > 0 ? { ...c, unread: 0 } : c)));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Foco no composer quando o usuário abre uma conversa.
  useEffect(() => {
    if (focusRequest > 0) composerRef.current?.focus();
  }, [focusRequest]);

  const selectedId = paramId ?? (wide ? defaultId : null);
  const selected = conversations?.find((c) => c.id === selectedId);
  const property = properties?.find((p) => p.id === selected?.propertyId);
  const reservation = selected?.reservationId ? reservations?.find((r) => r.id === selected.reservationId) : undefined;
  const replies = useMemo(() => (selected ? buildReplies(selected, property) : []), [selected, property]);

  const visible = useMemo(() => {
    if (!conversations) return [];
    const q = normalize(query.trim());
    return [...conversations]
      .sort(byLastMessage)
      .filter((c) => filter === 'all' || c.unread > 0 || c.id === selectedId)
      .filter((c) => !q || normalize(c.guestName).includes(q));
  }, [conversations, filter, query, selectedId]);

  function update(id: string, fn: (c: InboxConversation) => InboxConversation) {
    setConversations((list) => list?.map((c) => (c.id === id ? fn(c) : c)) ?? list);
  }

  function open(id: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('c', id);
        return next;
      },
      { replace: wide },
    );
    update(id, (c) => (c.unread > 0 ? { ...c, unread: 0 } : c));
    void markConversationRead(id).catch(() => {});
    setFocusRequest((n) => n + 1);
  }

  function back() {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('c');
      return next;
    });
  }

  function setDraft(id: string, value: string) {
    setDrafts((d) => ({ ...d, [id]: value }));
  }

  function insertReply(text: string) {
    if (!selected) return;
    const id = selected.id;
    setDrafts((d) => {
      const current = d[id]?.trim();
      return { ...d, [id]: current ? `${current}\n${text}` : text };
    });
    setDetailsOpen(false);
    setFocusRequest((n) => n + 1);
  }

  function send(text: string) {
    if (!selected) return;
    const id = selected.id;
    const tempId = `tmp-${++tempSeq}`;
    update(id, (c) => ({
      ...c,
      unread: 0,
      messages: [...c.messages, { id: tempId, from: 'host', text, sentAt: NOW_ISO, pending: true }],
    }));
    setDraft(id, '');
    sendMessage(id, text)
      .then((msg) => update(id, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === tempId ? msg : m)) })))
      .catch(() => {
        update(id, (c) => ({ ...c, messages: c.messages.filter((m) => m.id !== tempId) }));
        setDrafts((d) => ({ ...d, [id]: d[id] || text }));
        toast.error('Não foi possível enviar. Tente de novo.');
      });
  }

  function markUnread() {
    if (!selected) return;
    update(selected.id, (c) => ({ ...c, unread: Math.max(1, c.unread) }));
    void markConversationUnread(selected.id).catch(() => {});
    toast('Conversa marcada como não lida.');
  }

  function archive() {
    toast('Conversa arquivada.');
  }

  if (loadError) {
    return (
      <div className="rounded-lg bg-surface">
        <h1 className="sr-only">Mensagens</h1>
        <EmptyState title="Não foi possível carregar." description="Recarregue a página para tentar de novo." />
      </div>
    );
  }

  const panel = selected ? (
    <GuestPanel
      conversation={selected}
      property={property}
      reservation={reservation}
      onCheckinShortcut={() => {
        const text = replies.find((r) => r.id === 'checkin')?.text;
        if (text) insertReply(text);
      }}
    />
  ) : null;

  return (
    <div className="@container h-[calc(100dvh-192px)] min-h-[440px] md:h-[calc(100dvh-152px)]">
      {paramId && <h1 className="sr-only sm:hidden">Mensagens</h1>}
      <div className="grid h-full grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-lg bg-surface sm:grid-cols-[300px_minmax(0,1fr)] @min-[960px]:grid-cols-[320px_minmax(0,1fr)_300px]">
        {conversations ? (
          <ConversationList
            className={cn(paramId && 'hidden sm:flex')}
            conversations={visible}
            selectedId={selectedId}
            onOpen={open}
            filter={filter}
            onFilterChange={setFilter}
            query={query}
            onQueryChange={setQuery}
          />
        ) : (
          <div className={cn('flex flex-col gap-3 border-line p-4 sm:border-r', paramId && 'hidden sm:flex')}>
            <h1 className="font-display text-[24px] leading-[1.15] font-medium tracking-[-0.02em] text-ink">
              Mensagens
            </h1>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="size-10 shrink-0 rounded-pill" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={cn('min-h-0 min-w-0 flex-col', paramId ? 'flex' : 'hidden sm:flex')}>
          {selected ? (
            <Thread
              key={selected.id}
              conversation={selected}
              property={property}
              reservation={reservation}
              draft={drafts[selected.id] ?? ''}
              onDraftChange={(v) => setDraft(selected.id, v)}
              onSend={send}
              replies={replies}
              onInsertReply={insertReply}
              composerRef={composerRef}
              onBack={back}
              onShowDetails={() => setDetailsOpen(true)}
              onMarkUnread={markUnread}
              onArchive={archive}
            />
          ) : conversations ? (
            <EmptyState
              className="my-auto"
              title={paramId ? 'Conversa não encontrada.' : 'Nenhuma conversa aberta.'}
              description="Escolha uma conversa na lista."
            />
          ) : (
            <div className="flex flex-1 flex-col gap-4 p-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="ml-auto h-12 w-1/2" />
            </div>
          )}
        </div>

        <aside
          aria-label="Detalhes do hóspede"
          className="hidden min-h-0 overflow-y-auto border-l border-line bg-bg-alt/40 @min-[960px]:block"
        >
          {panel}
        </aside>
      </div>

      <Sheet open={detailsOpen && !!selected} onOpenChange={setDetailsOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          aria-describedby={undefined}
          className="app-scope w-full overflow-y-auto border-line bg-bg-alt text-ink sm:max-w-[360px]"
        >
          <div className="flex items-center justify-between px-6 pt-4">
            <SheetTitle className="t-body-sm font-medium text-ink">Detalhes</SheetTitle>
            <SheetClose asChild>
              <IconButton label="Fechar" variant="ghost">
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </IconButton>
            </SheetClose>
          </div>
          {panel}
        </SheetContent>
      </Sheet>
    </div>
  );
}
