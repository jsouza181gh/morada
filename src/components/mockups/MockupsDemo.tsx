import { BrowserFrame, LaptopFrame, PhoneFrame, PhoneStatusBar } from './index';

/** Pré-visualização das molduras (não roteada). Importe temporariamente para conferir. */
export function MockupsDemo() {
  return (
    <div className="flex flex-col gap-16 bg-bg-alt px-4 py-16 text-ink">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
        {[320, 600, 900].map((max) => (
          <div key={max} className="mx-auto w-full px-[7%]" style={{ maxWidth: max }}>
            <LaptopFrame label={`Notebook ${max}px`}>
              <div className="flex h-full items-center justify-center bg-bg t-headline">{max}px</div>
            </LaptopFrame>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-center gap-10">
        {[200, 300, 400].map((w, i) => (
          <PhoneFrame key={w} width={w} tone={i === 1 ? 'dark' : 'light'}>
            <PhoneStatusBar />
            <div className="p-4 t-body-sm">Largura {w}px</div>
          </PhoneFrame>
        ))}
      </div>

      <div className="relative mx-auto h-[360px] w-full max-w-[560px]">
        {[-6, 0, 6].map((deg, i) => (
          <BrowserFrame
            key={deg}
            url={`morada.app/anuncio-${i + 1}`}
            className="absolute inset-x-0 top-0"
            style={{ transform: `rotate(${deg}deg) translateY(${i * 24}px)`, zIndex: i }}
          >
            <div className="h-[240px] bg-bg p-6 t-body">Conteúdo {i + 1}</div>
          </BrowserFrame>
        ))}
      </div>
    </div>
  );
}
