import { WizardShell } from '@/components/app/wizard/WizardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Cadastro de imóvel em 7 passos (tela cheia, fora do AppLayout). */
export default function PropertyNew() {
  useDocumentTitle('Novo imóvel');
  return <WizardShell />;
}
