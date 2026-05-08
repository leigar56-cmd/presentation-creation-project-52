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
  | { kind: "plan" }
  | { kind: "photo"; index: number }
  | { kind: "location" }
  | { kind: "contact" };

const slides: Slide[] = [
  { kind: "cover" },
  { kind: "about" },
  { kind: "specs" },
  { kind: "plan" },
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

      const PLAN_URL = "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/files/2126649d-223c-47c6-a6a5-cf01c7e7710b.jpg";
      const photosB64 = await Promise.all(PHOTOS.map(toBase64));
      const heroB64 = photosB64[0];
      const planB64 = await toBase64(PLAN_URL);

      const win = window.open("", "_blank");
      if (!win) {
        alert("Разрешите всплывающие окна для скачивания PDF");
        return;
      }

      // Cover: full-bleed photo with centered text overlay
      const cover = `<section style="page-break-after:always;position:relative;width:100%;height:100vh;overflow:hidden;font-family:'Montserrat',sans-serif;">
        <img src="${heroB64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,20,25,0.45) 0%,rgba(15,20,25,0.25) 45%,rgba(15,20,25,0.85) 100%);"></div>
        <div style="position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:40px;">
          <p style="margin:0 0 14px;letter-spacing:4px;font-size:11px;font-weight:600;color:#C9A961;text-transform:uppercase;">Эксклюзив</p>
          <h1 style="margin:0 0 16px;font-size:38px;font-weight:700;letter-spacing:2px;text-transform:uppercase;line-height:1.2;">Квартира на продажу</h1>
          <div style="width:60px;height:3px;background:#C9A961;margin:0 0 20px;"></div>
          <p style="margin:0 0 10px;font-size:22px;font-weight:500;letter-spacing:3px;">VICTORY PARK RESIDENCES</p>
          <p style="margin:0;font-size:13px;letter-spacing:3px;opacity:0.85;font-weight:400;">МОСКВА · ПАРК ПОБЕДЫ</p>
        </div>
      </section>`;

      const ACCENT = "#C9A961";
      const DARK = "#0F1419";
      const TEXT = "#1A1A1A";

      // Two-column page: left text, right photo
      const twoCol = (
        title: string,
        body: string,
        imgUrl: string,
        priceLine?: string,
      ) => `<section style="page-break-after:always;width:100%;height:100vh;display:flex;background:#FFFCF7;">
        <div style="flex:1;padding:50px 40px;display:flex;flex-direction:column;justify-content:flex-start;color:${TEXT};">
          ${title ? `<h2 style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;margin:0 0 8px;line-height:1.2;color:${DARK};letter-spacing:0.5px;">${title}</h2><div style="width:48px;height:3px;background:${ACCENT};margin:0 0 24px;"></div>` : ""}
          <div style="font-size:13px;line-height:1.7;color:#2A2A2A;">${body}</div>
          ${priceLine ? `<div style="margin-top:28px;padding:14px 18px;background:${ACCENT};color:#fff;font-size:15px;font-weight:600;display:inline-block;align-self:flex-start;border-radius:2px;">${priceLine}</div>` : ""}
        </div>
        <div style="flex:1;background:#000;">
          <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
      </section>`;

      const aboutBody = `
        <p style="margin:0 0 14px;">Квартира с двумя спальнями и просторной гостиной.</p>
        <p style="margin:0 0 14px;">Ремонт выполнен в 2025 году.</p>
        <p style="margin:0 0 14px;">Общая площадь ${specs[0].value}. ${specs[3].value} этаж.</p>
        <p style="margin:0 0 8px;">Предлагается с мебелью, декором и оборудованием</p>
        <p style="margin:0 0 6px;">— панорамные окна</p>
        <p style="margin:0 0 6px;">— высота потолка 3.0 м</p>
        <p style="margin:0;">— вентиляция, кондиционирование, "умный дом"</p>
      `;

      const descriptionBody = `
        <p style="margin:0 0 12px;">Просторная 4-комнатная квартира общей площадью ${specs[0].value} в клубном доме Victory Park Residences. Выполнена премиальная дизайнерская отделка в стиле Неодеко, светлые тона, высокие потолки, панорамное остекление, большое количество естественного света.</p>
        <p style="margin:0 0 12px;">Спланирована большая гостиная с зоной отдыха и обеденной зоной. Кухня с островом и встроенной техникой премиум-класса. В холле организована зона библиотеки. Окна выходят на Парк Победы.</p>
        <p style="margin:0;">Мастер-спальня со своей ванной комнатой, отдельной ванной, душем и двумя раковинами. Установлена акустическая система. Санузел отделан натуральным мрамором, итальянская сантехника. Прихожая с вместительной гардеробной. В паркинге 2 машиноместа.</p>
      `;

      const specsBody = specs
        .map(
          (s) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #EFE6D2;font-size:13px;"><span style="color:#6B6B6B;text-transform:uppercase;letter-spacing:1px;font-size:11px;font-weight:500;">${s.label}</span><span style="color:${DARK};font-weight:600;font-size:14px;">${s.value}</span></div>`,
        )
        .join("");

      const about = twoCol(
        "квартира с 4-мя комнатами",
        aboutBody,
        photosB64[6] || photosB64[1],
        "Стоимость по запросу",
      );

      const description = twoCol(
        "О квартире",
        descriptionBody,
        photosB64[7] || photosB64[3],
      );

      const specsPage = twoCol(
        "Технические характеристики",
        specsBody,
        photosB64[8] || photosB64[4],
      );

      // Remaining photos as text+photo pages with captions
      const remainingPhotos = photosB64.slice(1).filter((_, idx) => ![5, 6, 7].includes(idx));
      const galleryPages = remainingPhotos
        .map((url, i) => {
          const realIdx = photosB64.indexOf(url);
          const caption = photoCaptions[realIdx] || "";
          const body = `<p style="margin:0;color:#444;">${caption}</p>`;
          // alternate: even = photo right, odd = photo left
          if (i % 2 === 0) {
            return twoCol("Локация и виды", body, url);
          }
          return `<section style="page-break-after:always;width:100%;height:100vh;display:flex;background:#FFFCF7;">
            <div style="flex:1;background:#000;"><img src="${url}" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>
            <div style="flex:1;padding:50px 40px;display:flex;flex-direction:column;justify-content:flex-start;color:${TEXT};">
              <h2 style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:0.5px;color:${DARK};">Интерьер</h2>
              <div style="width:48px;height:3px;background:${ACCENT};margin:0 0 24px;"></div>
              <p style="margin:0;font-size:13px;line-height:1.7;color:#2A2A2A;">${caption}</p>
            </div>
          </section>`;
        })
        .join("");

      const contact = `<section style="page-break-after:always;width:100%;height:100vh;display:flex;background:${DARK};color:#fff;">
        <div style="flex:1;padding:60px 40px;display:flex;flex-direction:column;justify-content:center;">
          <p style="margin:0 0 14px;letter-spacing:4px;font-size:11px;font-weight:600;color:${ACCENT};text-transform:uppercase;">Контакты</p>
          <h2 style="font-family:'Montserrat',sans-serif;font-size:42px;font-weight:700;margin:0 0 8px;letter-spacing:1px;">Янина</h2>
          <div style="width:48px;height:3px;background:${ACCENT};margin:0 0 16px;"></div>
          <p style="margin:0 0 40px;font-size:13px;color:#B8B8B8;font-weight:400;">Эксперт по элитной недвижимости</p>
          <div style="font-size:14px;line-height:2.2;color:#E8E8E8;font-weight:400;">
            <p style="margin:0;">Телефон: <span style="color:#fff;font-weight:600;">+7 (967) 119-88-13</span></p>
            <p style="margin:0;">Почта: <span style="color:#fff;font-weight:600;">yanina.pro.invest@bk.ru</span></p>
            <p style="margin:0;">Telegram: <span style="color:${ACCENT};font-weight:600;">@Nelyubovna</span></p>
          </div>
        </div>
        <div style="flex:1;background:#000;"><img src="${photosB64[0]}" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>
      </section>`;

      // Planning slide with floor plan image
      const planBody = `
        <p style="margin:0 0 10px;">— Кухня-гостиная 60 м²</p>
        <p style="margin:0 0 10px;">— Мастер-спальня с гардеробной</p>
        <p style="margin:0 0 10px;">— Спальня 2 с санузлом</p>
        <p style="margin:0 0 10px;">— Спальня 3 / кабинет</p>
        <p style="margin:0 0 10px;">— Прихожая с гардеробной</p>
        <p style="margin:0 0 10px;">— Гостевой санузел</p>
        <p style="margin:0 0 18px;">— Балкон с панорамным остеклением</p>
        <p style="margin:0;font-size:11px;color:#999;font-style:italic;">* Изображение носит ознакомительный характер</p>
      `;
      const planPage = `<section style="page-break-after:always;width:100%;height:100vh;display:flex;background:#FFFCF7;">
        <div style="flex:1;padding:50px 40px;display:flex;flex-direction:column;color:${TEXT};">
          <h2 style="font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:0.5px;color:${DARK};">Планировка (приблизительно)</h2>
          <div style="width:48px;height:3px;background:${ACCENT};margin:0 0 24px;"></div>
          <div style="font-size:13px;line-height:1.7;color:#2A2A2A;">${planBody}</div>
        </div>
        <div style="flex:1;background:#F5EFE0;display:flex;align-items:center;justify-content:center;padding:24px;">
          <img src="${planB64}" style="max-width:100%;max-height:100%;object-fit:contain;display:block;" />
        </div>
      </section>`;

      // Order: cover -> about -> SPECS -> PLAN -> description -> gallery -> contact
      const photoSlides = galleryPages;
      const about_combined = about + specsPage + planPage + description;
      const specsBlock = "";

      const html = `<!DOCTYPE html>
<html lang="ru"><head>
<meta charset="UTF-8"/>
<title>Victory Park Residences</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;font-family:'Montserrat',-apple-system,sans-serif;}
  @page{size:A4 portrait;margin:0;}
  @media print{
    section{width:100%;height:100vh;page-break-after:always;}
    body{margin:0;}
    img{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  }
</style>
</head><body>
${cover}${about_combined}${specsBlock}${photoSlides}${contact}
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
        {slide.kind === "plan" && <PlanSlide />}
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

const FONT_HEAD = { fontFamily: "'Montserrat', sans-serif" };

function CoverSlide() {
  return (
    <div className="relative w-full h-full" style={FONT_HEAD}>
      <img src={PHOTOS[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85" />
      <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-20 text-white text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: "#C9A961" }}>
          Эксклюзив
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider uppercase leading-tight mb-5">
          Квартира на продажу
        </h1>
        <div className="w-16 h-[3px] mb-6" style={{ background: "#C9A961" }} />
        <p className="text-lg md:text-2xl font-medium tracking-[0.2em] mb-3">
          VICTORY PARK RESIDENCES
        </p>
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase opacity-80 mb-6">
          Москва · Парк Победы
        </p>
        <p className="text-base md:text-lg opacity-90 mt-4">
          179,08 м² · 10/14 этаж · Стиль Неодеко
        </p>
      </div>
    </div>
  );
}

function AboutSlide() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-12 md:p-24 overflow-y-auto" style={{ background: "#FFFCF7", ...FONT_HEAD }}>
      <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: "#C9A961" }}>
        Об объекте
      </p>
      <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3 max-w-4xl" style={{ color: "#0F1419" }}>
        Редкий видовой лот в одном из самых престижных комплексов Москвы
      </h2>
      <div className="w-16 h-[3px] mb-10" style={{ background: "#C9A961" }} />
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl text-stone-700 leading-relaxed font-normal">
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
    <div className="w-full h-full flex" style={FONT_HEAD}>
      <div className="flex-1 flex flex-col justify-center p-12 md:p-20" style={{ background: "#FFFCF7" }}>
        <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: "#C9A961" }}>
          Основные характеристики
        </p>
        <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: "#0F1419" }}>
          Параметры объекта
        </h2>
        <div className="w-16 h-[3px] mb-8" style={{ background: "#C9A961" }} />
        <div className="space-y-3 max-w-md">
          {specs.map((s) => (
            <div key={s.label} className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#EFE6D2" }}>
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-stone-500">
                {s.label}
              </span>
              <span className="text-sm md:text-base font-semibold" style={{ color: "#0F1419" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-black">
        <img src={PHOTOS[6]} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

const PLAN_IMAGE = "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/files/2126649d-223c-47c6-a6a5-cf01c7e7710b.jpg";

function PlanSlide() {
  return (
    <div className="w-full h-full flex" style={FONT_HEAD}>
      <div className="flex-1 flex flex-col justify-center p-12 md:p-20" style={{ background: "#FFFCF7" }}>
        <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: "#C9A961" }}>
          Планировка (приблизительно)
        </p>
        <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: "#0F1419" }}>
          Схема квартиры
        </h2>
        <div className="w-16 h-[3px] mb-8" style={{ background: "#C9A961" }} />
        <div className="space-y-2 text-sm md:text-base text-stone-700 leading-relaxed max-w-md">
          <p>• Кухня-гостиная — 60 м²</p>
          <p>• Мастер-спальня с гардеробной и санузлом</p>
          <p>• Спальня 2 с собственным санузлом</p>
          <p>• Спальня 3 / кабинет</p>
          <p>• Прихожая с гардеробной</p>
          <p>• Гостевой санузел</p>
          <p>• Балкон с панорамным остеклением</p>
        </div>
        <p className="text-xs text-stone-400 mt-6 italic">
          * Изображение носит ознакомительный характер
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#F5EFE0" }}>
        <img src={PLAN_IMAGE} alt="Планировка" className="max-w-full max-h-full object-contain" />
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
    <div className="w-full h-full flex flex-col p-12 md:p-20" style={{ background: "#FFFCF7", ...FONT_HEAD }}>
      <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-3" style={{ color: "#C9A961" }}>
        Расположение
      </p>
      <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: "#0F1419" }}>
        Адрес и инфраструктура
      </h2>
      <div className="w-16 h-[3px] mb-8" style={{ background: "#C9A961" }} />
      <div className="grid md:grid-cols-3 gap-6 flex-1 max-w-6xl">
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
            <div key={it.label} className="bg-white p-5 border-l-4" style={{ borderColor: "#C9A961" }}>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#C9A961" }}>
                {it.label}
              </p>
              <p className="text-base font-semibold" style={{ color: "#0F1419" }}>{it.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSlide() {
  return (
    <div className="w-full h-full flex" style={FONT_HEAD}>
      <div className="flex-1 flex flex-col justify-center p-12 md:p-20 text-white" style={{ background: "#0F1419" }}>
        <p className="text-[11px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: "#C9A961" }}>
          Контакты
        </p>
        <h2 className="text-4xl md:text-6xl font-bold mb-3 tracking-wide">
          Янина
        </h2>
        <div className="w-16 h-[3px] mb-5" style={{ background: "#C9A961" }} />
        <p className="text-stone-300 mb-12 font-normal">Эксперт по элитной недвижимости</p>
        <div className="space-y-5 text-base md:text-lg">
          <div className="flex items-center gap-4">
            <Icon name="Phone" size={18} style={{ color: "#C9A961" }} />
            <span className="font-semibold">+7 (967) 119-88-13</span>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="Mail" size={18} style={{ color: "#C9A961" }} />
            <span className="font-semibold">yanina.pro.invest@bk.ru</span>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="MessageCircle" size={18} style={{ color: "#C9A961" }} />
            <span className="font-semibold" style={{ color: "#C9A961" }}>@Nelyubovna</span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black">
        <img src={PHOTOS[0]} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}