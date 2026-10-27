import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INPUT_CLASS, LABEL_CLASS, maskPhone, SECTION_TITLE_CLASS, SELECT_CONTENT_CLASS, SELECT_TRIGGER_CLASS } from './styles';

export function ProfileSection() {
  const [name, setName] = useState('Ana Souza');
  const [email, setEmail] = useState('ana@exemplo.com.br');
  const [phone, setPhone] = useState('(48) 99812-3456');
  const [lang, setLang] = useState('pt-BR');

  function submit(e: FormEvent) {
    e.preventDefault();
    toast.success('Alterações salvas.');
  }

  return (
    <form onSubmit={submit} aria-labelledby="secao-perfil" className="rounded-lg bg-surface p-6">
      <h2 id="secao-perfil" className={SECTION_TITLE_CLASS}>
        Perfil
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="perfil-nome" className={LABEL_CLASS}>
            Nome
          </label>
          <input
            id="perfil-nome"
            className={INPUT_CLASS}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="perfil-email" className={LABEL_CLASS}>
            E-mail
          </label>
          <input
            id="perfil-email"
            type="email"
            className={INPUT_CLASS}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="perfil-telefone" className={LABEL_CLASS}>
            Telefone
          </label>
          <input
            id="perfil-telefone"
            type="tel"
            inputMode="numeric"
            className={INPUT_CLASS}
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            autoComplete="tel-national"
          />
        </div>
        <div>
          <span id="perfil-idioma-label" className={LABEL_CLASS}>
            Idioma
          </span>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger aria-labelledby="perfil-idioma-label" className={SELECT_TRIGGER_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT_CLASS} position="popper">
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <Button type="submit">Salvar alterações</Button>
      </div>
    </form>
  );
}
