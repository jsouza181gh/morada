import type { ComponentType } from 'react';
import { useSearchParams } from 'react-router';
import { PageHeader } from '@/components/app/shell';
import {
  AppearanceSection,
  isSectionId,
  NotificationsSection,
  PlanSection,
  ProfileSection,
  SettingsNav,
  TeamSection,
  type SectionId,
} from '@/components/app/settings';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const VIEWS: Record<SectionId, ComponentType> = {
  perfil: ProfileSection,
  plano: PlanSection,
  notificacoes: NotificationsSection,
  equipe: TeamSection,
  aparencia: AppearanceSection,
};

export default function Settings() {
  useDocumentTitle('Configurações');
  const [params, setParams] = useSearchParams();
  const raw = params.get('secao');
  const active: SectionId = isSectionId(raw) ? raw : 'perfil';
  const View = VIEWS[active];

  return (
    <>
      <PageHeader title="Configurações" />
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
        <SettingsNav
          active={active}
          onChange={(id) =>
            setParams((p) => {
              const next = new URLSearchParams(p);
              next.set('secao', id);
              return next;
            })
          }
        />
        <div className="min-w-0 max-w-[760px]">
          <View />
        </div>
      </div>
    </>
  );
}
