import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";

const PHOTOS = [
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/27f78297-7bf6-4d99-ab16-22b37a00dce8.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/f9e58939-3a5a-410d-98e8-780d3ae3d2c7.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/202b6c1f-842c-43c1-8737-492d6932c839.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/e6ea51be-29ae-4f3e-a321-6dfdaa4a0264.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/4547b25b-e005-40bc-9b2d-9ac26ed3286a.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/fb81af11-edae-428c-af78-e006195d9cd7.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/1ae1bb6e-ce89-4634-b606-0253ce943144.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/d79c305f-331f-472f-a39a-4ba1950b60a9.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/e618b959-05fc-4b46-a5c8-fdd4796ff45a.png",
];

const photoCaptions = [
  "Фасад комплекса Victory Park Residences",
  "Триумфальные ворота — вид рядом",
  "Храм Георгия Победоносца",
  "Образец дизайнерского интерьера",
  "Памятник героям Первой мировой войны",
  "Вид из квартиры на Парк Победы",
  "Кухня-гостиная 60 м²",
  "Мастер-спальня с панорамным окном",
  "Ванная комната, натуральный мрамор",
];

const specs = [
  { label: "Площадь", value: "179,08 м²" },
  { label: "Жилая", value: "90 м²" },
  { label: "Кухня-гостиная", value: "60 м²" },
  { label: "Этаж", value: "10 / 14" },
  { label: "Комнат", value: "4" },
  { label: "Санузлы", value: "3" },
  { label: "Тип сделки", value: "Свободная продажа" },
  { label: "Стиль ремонта", value: "Неодеко" },
];

type Slide =
  | { kind: "cover" }
  | { kind: "about" }
  | { kind: "specs" }
  | { kind: "photo"; index: number }
  | { kind: "location" }
  | { kind: "contact" };

const slides: Slide[] = [
  { kind: "cover" },
  { kind: "about" },
  { kind: "specs" },
  ...PHOTOS.map((_, i) => ({ kind: "photo" as const, index: i })),
  { kind: "location" },
  { kind: "contact" },
];

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [generating, setGenerating] = useState(false);

  const next = () => setCurrent((p) => Math.min(p + 1, slides.length - 1));
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleDownloadPdf = async () => {
    setGenerating(true);
    try {
      // Pre-load all photos as base64 so they appear in PDF
      const toBase64 = (url: string): Promise<string> =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            const ctx = c.getContext("2d");
            if (!ctx) return resolve(url);
            ctx.drawImage(img, 0, 0);
            try {
              resolve(c.toDataURL("image/jpeg", 0.9));
            } catch {
              resolve(url);
            }
          };
          img.onerror = () => resolve(url);
          img.src = url;
        });

      const photosB64 = await Promise.all(PHOTOS.map(toBase64));
      const heroB64 = photosB64[0];

      const win = window.open("", "_blank");
      if (!win) {
        alert("Разрешите всплывающие окна для скачивания PDF");
        return;
      }

      const slideHtml = (inner: string, bg = "#FAFAF8") =>
        `<section style="page-break-after:always;width:100%;height:100vh;background:${bg};display:flex;flex-direction:column;justify-content:center;padding:60px;box-sizing:border-box;">${inner}</section>`;

      const cover = slideHtml(
        `<div style="position:absolute;inset:0;background:url('${heroB64}') center/cover;"></div>
         <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3),rgba(0,0,0,0.85));"></div>
         <div style="position:relative;color:#fff;">
           <p style="letter-spacing:6px;font-size:14px;opacity:0.7;margin-bottom:300px;">VICTORY PARK RESIDENCES · КОРПУС 2</p>
           <h1 style="font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:300;margin:0 0 24px;">4-комнатная квартира</h1>
           <p style="font-family:'Cormorant Garamond',serif;font-size:32px;opacity:0.85;margin:0 0 16px;">179,08 м² · 10/14 этаж · Стиль Неодеко</p>
           <p style="font-size:14px;letter-spacing:3px;opacity:0.6;margin:0;">МОСКВА · НАПРОТИВ ПАРКА ПОБЕДЫ</p>
         </div>`,
        "#1A1A1A",
      );

      const about = slideHtml(
        `<p style="letter-spacing:5px;font-size:11px;color:#8B8B7A;margin:0 0 24px;">ОБ ОБЪЕКТЕ</p>
         <h2 style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;color:#1A1A1A;margin:0 0 32px;max-width:900px;">Редкий видовой лот в одном из самых престижных комплексов Москвы</h2>
         <p style="font-size:16px;line-height:1.7;color:#555;max-width:900px;margin:0 0 16px;">Уникальная 4-комнатная квартира 180 м² на 10 этаже корпуса 2 Victory Park Residences с панорамным видом на Парк Победы и центр Москвы. Лучшее расположение по видовому потенциалу — Музей Победы, Храм Георгия Победоносца, Триумфальные ворота, Москва-Сити.</p>
         <p style="font-size:16px;line-height:1.7;color:#555;max-width:900px;margin:0 0 16px;">Дом сдан, акт приёма-передачи подписан, в квартире никто не проживал. Премиальная дизайнерская отделка от застройщика в стиле Неодеко.</p>
         <p style="font-size:16px;line-height:1.7;color:#555;max-width:900px;margin:0;">Планировка: просторная кухня-гостиная 60 м², три мастер-спальни с собственными санузлами и гардеробными.</p>`,
      );

      const specsBlock = slideHtml(
        `<p style="letter-spacing:5px;font-size:11px;color:#8B8B7A;margin:0 0 24px;">ПАРАМЕТРЫ</p>
         <h2 style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;color:#1A1A1A;margin:0 0 40px;">Технические характеристики</h2>
         <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#DDD;">
           ${specs
             .map(
               (s) => `<div style="background:#F2F1EC;padding:24px;">
             <p style="font-size:10px;letter-spacing:3px;color:#999;margin:0 0 8px;text-transform:uppercase;">${s.label}</p>
             <p style="font-family:'Cormorant Garamond',serif;font-size:26px;color:#1A1A1A;margin:0;">${s.value}</p>
           </div>`,
             )
             .join("")}
         </div>`,
        "#F2F1EC",
      );

      const photoSlides = photosB64
        .map(
          (url, i) => `<section style="page-break-after:always;width:100%;height:100vh;background:#1A1A1A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;box-sizing:border-box;">
          <img src="${url}" style="max-width:100%;max-height:88%;object-fit:contain;" />
          <p style="color:#fff;font-size:14px;letter-spacing:3px;margin-top:20px;text-align:center;">${photoCaptions[i] || ""}</p>
        </section>`,
        )
        .join("");

      const contact = slideHtml(
        `<p style="letter-spacing:5px;font-size:11px;color:#8B8B7A;margin:0 0 24px;">КОНТАКТЫ</p>
         <h2 style="font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:300;color:#fff;margin:0 0 12px;">Янина</h2>
         <p style="font-size:16px;color:#aaa;margin:0 0 60px;">Эксперт по элитной недвижимости</p>
         <div style="display:flex;flex-direction:column;gap:18px;color:#fff;font-size:20px;">
           <p style="margin:0;">Телефон: +7 (967) 119-88-13</p>
           <p style="margin:0;">Почта: yanina.pro.invest@bk.ru</p>
           <p style="margin:0;">Telegram: @Nelyubovna</p>
         </div>`,
        "#1A1A1A",
      );

      const html = `<!DOCTYPE html>
<html lang="ru"><head>
<meta charset="UTF-8"/>
<title>Victory Park Residences</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Golos+Text:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;font-family:'Golos Text',-apple-system,sans-serif;}
  @page{size:A4 landscape;margin:0;}
  @media print{
    section{width:100%;height:100vh;page-break-after:always;}
    body{margin:0;}
  }
</style>
</head><body>
${cover}${about}${specsBlock}${photoSlides}${contact}
<script>
  function startPrint(){
    var imgs = document.images;
    var loaded = 0;
    if(imgs.length === 0){ setTimeout(function(){ window.print(); }, 500); return; }
    for(var i=0;i<imgs.length;i++){
      if(imgs[i].complete){ loaded++; }
      else {
        imgs[i].onload = imgs[i].onerror = function(){
          loaded++;
          if(loaded === imgs.length){ setTimeout(function(){ window.print(); }, 600); }
        };
      }
    }
    if(loaded === imgs.length){ setTimeout(function(){ window.print(); }, 600); }
  }
  window.onload = startPrint;
</script>
</body></html>`;

      win.document.open();
      win.document.write(html);
      win.document.close();
    } finally {
      setGenerating(false);
    }
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans">
      {/* SLIDES */}
      <div className="absolute inset-0">
        {slide.kind === "cover" && <CoverSlide />}
        {slide.kind === "about" && <AboutSlide />}
        {slide.kind === "specs" && <SpecsSlide />}
        {slide.kind === "photo" && (
          <PhotoSlide src={PHOTOS[slide.index]} caption={photoCaptions[slide.index]} />
        )}
        {slide.kind === "location" && <LocationSlide />}
        {slide.kind === "contact" && <ContactSlide />}
      </div>

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <span className="text-white/60 text-xs tracking-[0.3em] uppercase">
          Victory Park Residences
        </span>
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={generating}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xs tracking-widest uppercase px-5 py-2.5 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Icon name={generating ? "Loader" : "Download"} size={14} className={generating ? "animate-spin" : ""} />
            {generating ? "Готовлю..." : "Скачать PDF"}
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <button
        onClick={prev}
        disabled={current === 0}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
        aria-label="Назад"
      >
        <Icon name="ChevronLeft" size={20} />
      </button>
      <button
        onClick={next}
        disabled={current === slides.length - 1}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
        aria-label="Вперёд"
      >
        <Icon name="ChevronRight" size={20} />
      </button>

      {/* BOTTOM PROGRESS */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-3">
        <div className="flex gap-1.5 justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[3px] rounded-full transition-all ${
                i === current ? "w-10 bg-white" : "w-5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
        <div className="text-center text-white/50 text-xs tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ===== SLIDES ===== */

function CoverSlide() {
  return (
    <div className="relative w-full h-full">
      <img src={PHOTOS[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
      <div className="relative h-full flex flex-col justify-end p-12 md:p-20 text-white">
        <p className="text-xs tracking-[0.3em] uppercase opacity-70 mb-6">
          Эксклюзивное предложение
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-8 max-w-5xl"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          4-комнатная<br />квартира
        </h1>
        <p
          className="text-xl md:text-3xl opacity-80 mb-3"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          179,08 м² · 10/14 этаж · Стиль Неодеко
        </p>
        <p className="text-xs tracking-[0.3em] uppercase opacity-60">
          Москва · напротив Парка Победы
        </p>
      </div>
    </div>
  );
}

function AboutSlide() {
  return (
    <div className="w-full h-full bg-stone-50 flex flex-col justify-center p-12 md:p-24 overflow-y-auto">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-6">Об объекте</p>
      <h2
        className="text-3xl md:text-5xl font-light leading-tight mb-10 max-w-4xl text-stone-900"
        style={{ fontFamily: "'Cormorant', serif" }}
      >
        Редкий видовой лот в одном из самых престижных комплексов Москвы
      </h2>
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl text-stone-600 leading-relaxed">
        <p className="text-base md:text-lg">
          Уникальная 4-комнатная квартира 180 м² на 10 этаже корпуса 2 Victory Park Residences
          с панорамным видом на Парк Победы и центр Москвы. Лучшее расположение по видовому
          потенциалу — Музей Победы, Храм Георгия Победоносца, Триумфальные ворота, Москва-Сити.
        </p>
        <p className="text-base md:text-lg">
          Дом сдан, акт приёма-передачи подписан, в квартире никто не проживал. Премиальная
          дизайнерская отделка от застройщика в стиле Неодеко: натуральные материалы,
          панорамные окна. Планировка: кухня-гостиная 60 м², три мастер-спальни с собственными
          санузлами и гардеробными.
        </p>
      </div>
    </div>
  );
}

function SpecsSlide() {
  return (
    <div className="w-full h-full bg-stone-100 flex flex-col justify-center p-12 md:p-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-6">Параметры</p>
      <h2
        className="text-3xl md:text-5xl font-light mb-12 text-stone-900"
        style={{ fontFamily: "'Cormorant', serif" }}
      >
        Технические характеристики
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-300 max-w-6xl">
        {specs.map((s) => (
          <div key={s.label} className="bg-stone-100 p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2">
              {s.label}
            </p>
            <p
              className="text-2xl md:text-3xl text-stone-900 font-light"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoSlide({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 md:p-12">
      <img src={src} alt={caption} className="max-w-full max-h-[85%] object-contain" />
      <p className="text-white/80 text-sm md:text-base tracking-widest mt-6 text-center">
        {caption}
      </p>
    </div>
  );
}

function LocationSlide() {
  return (
    <div className="w-full h-full bg-stone-50 flex flex-col p-12 md:p-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-6">Расположение</p>
      <h2
        className="text-3xl md:text-5xl font-light mb-12 text-stone-900"
        style={{ fontFamily: "'Cormorant', serif" }}
      >
        Адрес и инфраструктура
      </h2>
      <div className="grid md:grid-cols-3 gap-8 flex-1 max-w-6xl">
        <div className="md:col-span-2 bg-white overflow-hidden">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.508%2C55.733&z=15&pt=37.508,55.733,pm2rdm"
            width="100%"
            height="100%"
            frameBorder={0}
            title="Карта"
          />
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "Кремль", value: "15 минут" },
            { label: "Москва-Сити", value: "15 минут" },
            { label: "Парк Победы", value: "Через дорогу" },
            { label: "Рублёвка", value: "Быстрый выезд" },
          ].map((it) => (
            <div key={it.label} className="bg-white p-5 border border-stone-200">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                {it.label}
              </p>
              <p className="text-base text-stone-800">{it.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSlide() {
  return (
    <div className="w-full h-full bg-stone-900 flex flex-col justify-center p-12 md:p-24 text-white">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-6">Контакты</p>
      <h2
        className="text-5xl md:text-7xl font-light mb-3"
        style={{ fontFamily: "'Cormorant', serif" }}
      >
        Янина
      </h2>
      <p className="text-stone-400 mb-16">Эксперт по элитной недвижимости</p>
      <div className="space-y-5 text-lg md:text-xl">
        <div className="flex items-center gap-4">
          <Icon name="Phone" size={18} className="text-stone-500" />
          <span>+7 (967) 119-88-13</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon name="Mail" size={18} className="text-stone-500" />
          <span>yanina.pro.invest@bk.ru</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon name="MessageCircle" size={18} className="text-stone-500" />
          <span>@Nelyubovna</span>
        </div>
      </div>
    </div>
  );
}