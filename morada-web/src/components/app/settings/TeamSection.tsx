import { useState, type FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, Button, EmptyState, Skeleton } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMock } from '@/hooks/useMock';
import { getTeam } from '@/mocks/api';
import type { TeamMember } from '@/mocks/types';
import {
  DIALOG_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  SECTION_TITLE_CLASS,
  SELECT_CONTENT_CLASS,
  SELECT_TRIGGER_CLASS,
} from './styles';

type Role = TeamMember['role'];

const ROLE_LABEL: Record<Role, string> = {
  proprietario: 'Proprietário',
  limpeza: 'Limpeza',
  checkin: 'Check-in',
  financeiro: 'Financeiro',
};
const ROLES = Object.keys(ROLE_LABEL) as Role[];
const INVITE_ROLES = ROLES.filter((r) => r !== 'proprietario');

function RoleSelect({
  value,
  onChange,
  disabled,
  labelledBy,
  roles = ROLES,
}: {
  value: Role;
  onChange: (r: Role) => void;
  disabled?: boolean;
  labelledBy: string;
  roles?: Role[];
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Role)} disabled={disabled}>
      <SelectTrigger aria-labelledby={labelledBy} className={SELECT_TRIGGER_CLASS}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={SELECT_CONTENT_CLASS} position="popper">
        {roles.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABEL[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TeamSection() {
  const { data, error } = useMock(getTeam);
  return (
    <section aria-labelledby="secao-equipe" className="rounded-lg bg-surface p-6">
      {error ? (
        <>
          <h2 id="secao-equipe" className={SECTION_TITLE_CLASS}>
            Equipe
          </h2>
          <EmptyState title="Não foi possível carregar a equipe." description="Tente de novo em instantes." />
        </>
      ) : data ? (
        <TeamList initial={data} />
      ) : (
        <>
          <h2 id="secao-equipe" className={SECTION_TITLE_CLASS}>
            Equipe
          </h2>
          <div className="mt-6 space-y-3" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

let inviteCounter = 0;

function TeamList({ initial }: { initial: TeamMember[] }) {
  const [members, setMembers] = useState(initial);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('limpeza');

  function invite(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setMembers((list) => [...list, { id: `t-convite-${++inviteCounter}`, name: value, role }]);
    toast.success(`Convite enviado para ${value}.`);
    setInviteOpen(false);
    setEmail('');
    setRole('limpeza');
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="secao-equipe" className={SECTION_TITLE_CLASS}>
          Equipe
        </h2>
        <Button
          variant="secondary"
          size="sm"
          className="max-sm:min-h-11"
          iconLeft={<UserPlus size={16} strokeWidth={1.5} aria-hidden="true" />}
          onClick={() => setInviteOpen(true)}
        >
          Convidar pessoa
        </Button>
      </div>

      <ul className="mt-6 divide-y divide-line">
        {members.map((m) => {
          const owner = m.role === 'proprietario';
          const labelId = `papel-${m.id}`;
          return (
            <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3">
              <Avatar name={m.name} size={40} tone={owner ? 'dark' : 'verde'} />
              <div className="min-w-0 flex-1">
                <p className="t-body-sm truncate font-medium text-ink">{m.name}</p>
                <span id={labelId} className="sr-only">
                  Papel de {m.name}
                </span>
              </div>
              <div className="w-40">
                <RoleSelect
                  value={m.role}
                  disabled={owner}
                  labelledBy={labelId}
                  roles={owner ? ROLES : INVITE_ROLES}
                  onChange={(r) => setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, role: r } : x)))}
                />
              </div>
              {owner ? (
                <span className="t-body-sm w-[84px] text-center text-ink-2">Você</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-[84px] text-danger max-sm:min-h-11"
                  aria-label={`Remover ${m.name}`}
                  onClick={() => {
                    setMembers((list) => list.filter((x) => x.id !== m.id));
                    toast(`${m.name} saiu da equipe.`);
                  }}
                >
                  Remover
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className={DIALOG_CLASS} showCloseButton={false}>
          <DialogTitle className="font-display text-[21px] leading-7 font-medium text-ink">Convidar pessoa</DialogTitle>
          <DialogDescription className="t-body-sm text-ink-2">
            A pessoa recebe um e-mail para entrar na sua equipe.
          </DialogDescription>
          <form onSubmit={invite} className="space-y-4">
            <div>
              <label htmlFor="convite-email" className={LABEL_CLASS}>
                E-mail
              </label>
              <input
                id="convite-email"
                type="email"
                required
                className={INPUT_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com.br"
                autoComplete="off"
              />
            </div>
            <div>
              <span id="convite-papel" className={LABEL_CLASS}>
                Papel
              </span>
              <RoleSelect value={role} onChange={setRole} labelledBy="convite-papel" roles={INVITE_ROLES} />
            </div>
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setInviteOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar convite</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
