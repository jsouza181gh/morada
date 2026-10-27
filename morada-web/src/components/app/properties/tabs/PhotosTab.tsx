import { toast } from 'sonner';
import { Badge, Button } from '@/components/ui';

export type PhotosTabProps = {
  name: string;
  photos: string[];
  coverIndex: number;
  onCoverChange: (index: number) => void;
};

export function PhotosTab({ name, photos, coverIndex, onCoverChange }: PhotosTabProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-5">
      {photos.map((src, i) => {
        const isCover = i === coverIndex;
        return (
          <li key={src} className="overflow-hidden rounded-lg bg-surface">
            <div className="relative">
              <img
                width={1200}
                height={800}
                src={src}
                alt={`Foto ${i + 1} de ${name}`}
                loading="lazy"
                className="aspect-[3/2] w-full bg-verde-soft object-cover"
              />
              {isCover && (
                <Badge tone="dark" className="absolute top-3 left-3">
                  Capa
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="t-body-sm text-ink-2">Foto {i + 1}</span>
              {isCover ? (
                <span className="t-body-sm text-ink-2">Foto de capa</span>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Definir foto ${i + 1} como capa`}
                  onClick={() => {
                    onCoverChange(i);
                    toast('Capa atualizada.');
                  }}
                >
                  Definir como capa
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
