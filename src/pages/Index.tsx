import Icon from "@/components/ui/icon";
import { useState } from "react";

declare global {
  interface Window {
    jspdf?: { jsPDF: new (opts?: object) => JsPDFInstance };
  }
}

interface JsPDFGState {
  opacity: number;
}
interface JsPDFInstance {
  GState: (opts: JsPDFGState) => JsPDFGState;
  setGState: (s: JsPDFGState) => void;
  addPage: () => void;
  setFillColor: (r: number, g: number, b: number) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  rect: (x: number, y: number, w: number, h: number, style?: string) => void;
  setFont: (name: string, style?: string) => void;
  setFontSize: (size: number) => void;
  text: (text: string | string[], x: number, y: number, opts?: object) => void;
  splitTextToSize: (text: string, w: number) => string[];
  addImage: (data: string, fmt: string, x: number, y: number, w: number, h: number) => void;
  addFileToVFS: (name: string, data: string) => void;
  addFont: (file: string, name: string, style: string) => void;
  save: (filename: string) => void;
}

const loadJsPdfFromCdn = (): Promise<typeof window.jspdf> =>
  new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf);
    s.onerror = reject;
    document.head.appendChild(s);
  });

const PHOTOS = [
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/27f78297-7bf6-4d99-ab16-22b37a00dce8.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/f9e58939-3a5a-410d-98e8-780d3ae3d2c7.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/202b6c1f-842c-43c1-8737-492d6932c839.png",
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/e6ea51be-29ae-4f3e-a321-6dfdaa4a0264.png",
];

const HERO = PHOTOS[0];

const specs = [
  { label: "Площадь", value: "179,08 м²" },
  { label: "Жилая", value: "90 м²" },
  { label: "Кухня-гостиная", value: "60 м²" },
  { label: "Этаж", value: "10 из 14" },
  { label: "Комнат", value: "4" },
  { label: "Санузлы", value: "3 (в каждой спальне)" },
  { label: "Тип сделки", value: "Свободная продажа" },
  { label: "Стиль ремонта", value: "Неодеко" },
];

const advantages = [
  {
    icon: "Eye",
    title: "Видовая квартира",
    desc: "Панорамный вид на Парк Победы, Триумфальные ворота и Москва-Сити",
  },
  {
    icon: "Sparkles",
    title: "Премиальный ремонт",
    desc: "Дизайнерская отделка от застройщика в стиле Неодеко, никто не жил",
  },
  {
    icon: "Home",
    title: "Три мастер-спальни",
    desc: "Каждая со своим санузлом и гардеробной",
  },
  {
    icon: "Building2",
    title: "Victory Park Residences",
    desc: "Фитнес, бассейн, wellness, детский сад, закрытая территория",
  },
];

const rooms: { name: string; size: string; x: number; y: number; w: number; h: number }[] = [
  { name: "Кухня-гостиная", size: "60 м²", x: 8, y: 8, w: 54, h: 44 },
  { name: "Мастер-спальня", size: "26 м²", x: 64, y: 8, w: 28, h: 30 },
  { name: "Гардероб", size: "6 м²", x: 64, y: 40, w: 14, h: 12 },
  { name: "С/у", size: "6 м²", x: 80, y: 40, w: 12, h: 12 },
  { name: "Спальня 2", size: "22 м²", x: 8, y: 54, w: 26, h: 30 },
  { name: "С/у 2", size: "5 м²", x: 36, y: 54, w: 12, h: 14 },
  { name: "Гард. 2", size: "5 м²", x: 36, y: 70, w: 12, h: 14 },
  { name: "Спальня 3", size: "20 м²", x: 50, y: 54, w: 26, h: 30 },
  { name: "С/у 3", size: "5 м²", x: 78, y: 54, w: 14, h: 14 },
  { name: "Холл", size: "12 м²", x: 78, y: 70, w: 14, h: 14 },
];

export default function Index() {
  const [active, setActive] = useState(0);

  const [generating, setGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    setGenerating(true);
    try {
      const lib = await loadJsPdfFromCdn();
      if (!lib) throw new Error("Не удалось загрузить jsPDF");
      const { jsPDF } = lib;
      const loadImage = (url: string): Promise<{ data: string; w: number; h: number } | null> =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);
            ctx.drawImage(img, 0, 0);
            try {
              const data = canvas.toDataURL("image/jpeg", 0.85);
              resolve({ data, w: img.naturalWidth, h: img.naturalHeight });
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = url;
        });

      const fetchFontBase64 = async (url: string): Promise<string | null> => {
        try {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        } catch {
          return null;
        }
      };

      const ALL_PHOTOS = [
        ...PHOTOS,
        "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/4547b25b-e005-40bc-9b2d-9ac26ed3286a.png",
        "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/fb81af11-edae-428c-af78-e006195d9cd7.png",
        "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/1ae1bb6e-ce89-4634-b606-0253ce943144.png",
        "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/d79c305f-331f-472f-a39a-4ba1950b60a9.png",
        "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/e618b959-05fc-4b46-a5c8-fdd4796ff45a.png",
      ];

      const photoTitles = [
        "Фасад комплекса",
        "Триумфальные ворота",
        "Храм Георгия Победоносца",
        "Образец интерьера",
        "Памятник героям Первой мировой войны",
        "Вид из квартиры на Парк Победы",
        "Кухня-гостиная 60 м²",
        "Мастер-спальня",
        "Ванная комната",
      ];

      const [images, fontRegular, fontBold] = await Promise.all([
        Promise.all(ALL_PHOTOS.map(loadImage)),
        fetchFontBase64(
          "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf",
        ),
        fetchFontBase64(
          "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.ttf",
        ),
      ]);

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const PW = 297;
      const PH = 210;

      let FONT = "helvetica";
      if (fontRegular && fontBold) {
        pdf.addFileToVFS("Roboto-Regular.ttf", fontRegular);
        pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        pdf.addFileToVFS("Roboto-Bold.ttf", fontBold);
        pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");
        FONT = "Roboto";
      }
      pdf.setFont(FONT, "normal");

      // Page 1 — Cover
      const cover = images[0];
      if (cover) {
        const ratio = cover.w / cover.h;
        const fitW = PW;
        const fitH = PW / ratio;
        const y = fitH < PH ? (PH - fitH) / 2 : 0;
        const w = fitH > PH ? PH * ratio : fitW;
        const h = fitH > PH ? PH : fitH;
        const x = (PW - w) / 2;
        pdf.addImage(cover.data, "JPEG", x, y, w, h);
      }
      pdf.setFillColor(0, 0, 0);
      pdf.setGState(pdf.GState({ opacity: 0.55 }));
      pdf.rect(0, 0, PW, PH, "F");
      pdf.setGState(pdf.GState({ opacity: 1 }));

      pdf.setTextColor(255, 255, 255);
      pdf.setFont(FONT, "normal");
      pdf.setFontSize(10);
      pdf.text("VICTORY PARK RESIDENCES · КОРПУС 2", 18, 22);
      pdf.setFont(FONT, "bold");
      pdf.setFontSize(36);
      pdf.text("4-комнатная квартира", 18, 130);
      pdf.setFont(FONT, "normal");
      pdf.setFontSize(18);
      pdf.text("179,08 м²  ·  10/14 этаж  ·  Стиль Неодеко", 18, 145);
      pdf.setFontSize(11);
      pdf.text("Москва · напротив Парка Победы", 18, 160);

      // Page 2 — About
      pdf.addPage();
      pdf.setFillColor(250, 250, 248);
      pdf.rect(0, 0, PW, PH, "F");
      pdf.setTextColor(139, 139, 122);
      pdf.setFontSize(9);
      pdf.text("ОБ ОБЪЕКТЕ", 18, 22);
      pdf.setTextColor(26, 26, 26);
      pdf.setFont(FONT, "bold");
      pdf.setFontSize(22);
      const title = pdf.splitTextToSize(
        "Редкий видовой лот в одном из самых престижных комплексов Москвы",
        PW - 36,
      );
      pdf.text(title, 18, 36);

      pdf.setFont(FONT, "normal");
      pdf.setTextColor(85, 85, 85);
      pdf.setFontSize(12);
      const aboutTxt = pdf.splitTextToSize(
        "Уникальная 4-комнатная квартира 180 м² на 10 этаже корпуса 2 Victory Park Residences с панорамным видом на Парк Победы и центр Москвы. Лучшее расположение по видовому потенциалу — Музей и Монумент Победы, Храм Георгия Победоносца, Триумфальные ворота, Москва-Сити.\n\nДом сдан, акт приёма-передачи подписан, в квартире никто не проживал. Премиальная дизайнерская отделка от застройщика в стиле Неодеко: натуральные материалы, современные инженерные решения, панорамные окна.\n\nПланировка: просторная кухня-гостиная 60 м², три мастер-спальни с собственными санузлами и гардеробными.",
        PW - 36,
      );
      pdf.text(aboutTxt, 18, 70);

      // Page 3 — Specs
      pdf.addPage();
      pdf.setFillColor(242, 241, 236);
      pdf.rect(0, 0, PW, PH, "F");
      pdf.setTextColor(139, 139, 122);
      pdf.setFontSize(9);
      pdf.text("ПАРАМЕТРЫ", 18, 22);
      pdf.setTextColor(26, 26, 26);
      pdf.setFont(FONT, "bold");
      pdf.setFontSize(22);
      pdf.text("Технические характеристики", 18, 36);

      const cw = (PW - 36) / 4;
      const ch = 32;
      specs.forEach((s, i) => {
        const cx = 18 + (i % 4) * cw;
        const cy = 50 + Math.floor(i / 4) * ch;
        pdf.setFillColor(255, 255, 255);
        pdf.rect(cx, cy, cw - 4, ch - 4, "F");
        pdf.setDrawColor(224, 224, 216);
        pdf.rect(cx, cy, cw - 4, ch - 4, "S");
        pdf.setFont(FONT, "normal");
        pdf.setTextColor(153, 153, 153);
        pdf.setFontSize(8);
        pdf.text(s.label.toUpperCase(), cx + 4, cy + 8);
        pdf.setFont(FONT, "bold");
        pdf.setTextColor(26, 26, 26);
        pdf.setFontSize(15);
        pdf.text(s.value, cx + 4, cy + 20);
      });

      // Photo pages
      images.forEach((img, i) => {
        if (!img) return;
        pdf.addPage();
        pdf.setFillColor(26, 26, 26);
        pdf.rect(0, 0, PW, PH, "F");

        const ratio = img.w / img.h;
        const maxW = PW - 20;
        const maxH = PH - 30;
        let dw = maxW;
        let dh = dw / ratio;
        if (dh > maxH) {
          dh = maxH;
          dw = dh * ratio;
        }
        const dx = (PW - dw) / 2;
        const dy = (PH - dh) / 2 - 5;
        pdf.addImage(img.data, "JPEG", dx, dy, dw, dh);

        pdf.setFont(FONT, "normal");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(11);
        pdf.text(photoTitles[i] || `Фото ${i + 1}`, PW / 2, PH - 8, { align: "center" });
      });

      // Contact page
      pdf.addPage();
      pdf.setFillColor(26, 26, 26);
      pdf.rect(0, 0, PW, PH, "F");
      pdf.setFont(FONT, "normal");
      pdf.setTextColor(139, 139, 122);
      pdf.setFontSize(9);
      pdf.text("КОНТАКТЫ", 18, 22);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(FONT, "bold");
      pdf.setFontSize(40);
      pdf.text("Янина", 18, 60);
      pdf.setFont(FONT, "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(170, 170, 170);
      pdf.text("Эксперт по элитной недвижимости", 18, 72);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text("Телефон:    +7 (967) 119-88-13", 18, 100);
      pdf.text("Почта:        yanina.pro.invest@bk.ru", 18, 112);
      pdf.text("Telegram:   @Nelyubovna", 18, 124);

      pdf.setTextColor(119, 119, 119);
      pdf.setFontSize(9);
      pdf.text("Victory Park Residences · Корпус 2 · Москва", 18, PH - 12);

      pdf.save("Victory-Park-Residences.pdf");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* FLOATING DOWNLOAD BUTTON */}
      <button
        onClick={handleDownloadPdf}
        disabled={generating}
        className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-6 py-4 shadow-2xl hover:bg-stone-800 transition-colors flex items-center gap-3 disabled:opacity-50"
      >
        <Icon name={generating ? "Loader" : "Download"} size={18} className={generating ? "animate-spin" : ""} />
        <span className="text-xs tracking-widest uppercase">
          {generating ? "Создаю PDF..." : "Скачать PDF"}
        </span>
      </button>

      {/* HERO */}
      <section className="print-hero relative h-[92vh] min-h-[600px] overflow-hidden">
        <img
          src={HERO}
          alt="Victory Park Residences"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
          <span className="text-white/70 text-xs tracking-[0.2em] uppercase font-light">
            Victory Park Residences · Корпус 2
          </span>
          <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full border border-white/20">
            Свободная продажа
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-5xl">
            <p className="text-white/60 text-xs tracking-widest uppercase mb-3">
              Москва · напротив Парка Победы
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 font-light"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              4-комнатная квартира<br />
              <span className="text-white/70">179,08 м² · 10/14 этаж</span>
            </h1>
            <div className="flex items-end gap-8 flex-wrap">
              <div>
                <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Стиль</p>
                <p
                  className="text-3xl md:text-4xl text-white font-light"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  Неодеко
                </p>
              </div>
              <div className="w-px h-12 bg-white/20 hidden md:block" />
              <div>
                <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Состояние</p>
                <p
                  className="text-xl text-white font-light"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  Готова к заселению
                </p>
              </div>
              <a
                href="#contact"
                className="ml-auto bg-white text-stone-900 px-8 py-4 text-xs tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                Связаться
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Фотографии</p>
        <h2
          className="text-3xl md:text-4xl mb-12 font-light"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          Объект и окружение
        </h2>
        <div className="bg-stone-200 mb-4" style={{ aspectRatio: "16/10" }}>
          <img
            src={PHOTOS[active]}
            alt={`Фото ${active + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {PHOTOS.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`aspect-[4/3] overflow-hidden border-2 transition-all ${
                active === i ? "border-stone-900" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt={`Превью ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* DESCRIPTION + ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Об объекте</p>
            <h2
              className="text-3xl md:text-4xl leading-snug mb-6 font-light"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Редкий видовой лот в одном из самых престижных комплексов Москвы
            </h2>
            <p className="text-stone-500 leading-relaxed text-base">
              Уникальная 4-комнатная квартира 180 м² на 10 этаже корпуса 2 Victory Park Residences
              с панорамным видом на Парк Победы и центр Москвы. Лучшее расположение по
              видовому потенциалу — Музей и Монумент Победы, Храм Георгия Победоносца,
              Триумфальные ворота, Москва-Сити.
            </p>
            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-stone-500 leading-relaxed text-base">
                Дом сдан, акт приёма-передачи подписан, в квартире никто не проживал.
                Премиальная дизайнерская отделка от застройщика в стиле Неодеко: натуральные
                материалы, современные инженерные решения, панорамные окна.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-stone-500 leading-relaxed text-base">
                Планировка: просторная кухня-гостиная 60 м², три мастер-спальни с собственными
                санузлами и гардеробными. Дополнительно в продаже три машино-места одним блоком
                (50 млн ₽, не входит в стоимость квартиры).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="flex gap-5 p-5 bg-white border border-stone-200 hover:border-stone-400 transition-colors"
              >
                <div className="w-10 h-10 bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-base font-medium mb-1">{item.title}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Параметры</p>
          <h2
            className="text-3xl md:text-4xl mb-12 font-light"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Технические характеристики
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-300">
            {specs.map((s) => (
              <div key={s.label} className="bg-stone-100 p-6 md:p-8">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">{s.label}</p>
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
      </section>

      {/* FLOOR PLAN */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Планировка</p>
        <h2
          className="text-3xl md:text-4xl mb-12 font-light"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          Схема расположения комнат
        </h2>
        <div className="bg-white border border-stone-200 p-8 md:p-12">
          <div className="relative w-full max-w-3xl mx-auto" style={{ paddingBottom: "62%" }}>
            <svg
              viewBox="0 0 100 92"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6"
                y="6"
                width="88"
                height="80"
                fill="none"
                stroke="#C5C0B8"
                strokeWidth="0.8"
              />
              {rooms.map((r) => (
                <g key={r.name}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill="#F8F7F4"
                    stroke="#C5C0B8"
                    strokeWidth="0.4"
                  />
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 - 1}
                    textAnchor="middle"
                    fontSize="2.4"
                    fill="#555"
                    fontFamily="Georgia, serif"
                  >
                    {r.name}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 4}
                    textAnchor="middle"
                    fontSize="2.2"
                    fill="#999"
                    fontFamily="sans-serif"
                  >
                    {r.size}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-center text-xs text-stone-400 mt-4 tracking-wider">
            Схема носит иллюстративный характер · Уточняйте у риэлтора
          </p>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Расположение</p>
          <h2
            className="text-3xl md:text-4xl mb-12 font-light"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Адрес и инфраструктура
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white overflow-hidden" style={{ height: "420px" }}>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.508%2C55.733&z=15&pt=37.508,55.733,pm2rdm"
                width="100%"
                height="100%"
                frameBorder={0}
                title="Карта объекта"
                className="block"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 border border-stone-200">
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">Адрес</p>
                <p
                  className="text-lg font-light leading-tight"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  Victory Park Residences
                </p>
                <p className="text-sm text-stone-400 mt-1">
                  Напротив Парка Победы, Москва
                </p>
              </div>
              {[
                { icon: "Landmark", label: "Кремль", value: "15 минут" },
                { icon: "Building", label: "Москва-Сити", value: "15 минут" },
                { icon: "TreePine", label: "Парк Победы", value: "Через дорогу" },
                { icon: "Car", label: "Рублёвка", value: "Быстрый выезд" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white p-5 border border-stone-200 flex items-center gap-4"
                >
                  <div className="w-9 h-9 bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-stone-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Контакты</p>
        <h2
          className="text-3xl md:text-4xl mb-12 font-light"
          style={{ fontFamily: "'Cormorant', serif" }}
        >
          Ваш риэлтор
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          <div className="bg-white border border-stone-200 p-8">
            <div className="flex items-center gap-5 mb-7">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={28} className="text-stone-400" />
              </div>
              <div>
                <p className="text-xl font-light" style={{ fontFamily: "'Cormorant', serif" }}>
                  Янина
                </p>
                <p className="text-sm text-stone-400">Эксперт по элитной недвижимости</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "Phone", label: "+7 (967) 119-88-13" },
                { icon: "Mail", label: "yanina.pro.invest@bk.ru" },
                { icon: "MessageCircle", label: "Telegram: @Nelyubovna" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <Icon name={c.icon} size={16} className="text-stone-400" />
                  <span className="text-sm text-stone-600">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-stone-900 p-8 flex flex-col justify-between">
            <div>
              <p
                className="text-xl text-white mb-3 font-light"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Записаться на просмотр
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                Организуем показ в удобное для вас время. Ответим на все вопросы об объекте
                и о машино-местах.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <p className="text-white text-sm">+7 (967) 119-88-13</p>
              <p className="text-white text-sm">yanina.pro.invest@bk.ru</p>
              <p className="text-white text-sm">@Nelyubovna</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRA PHOTOS — каждое отдельно */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">
            Дополнительные фото
          </p>
          <h2
            className="text-3xl md:text-4xl mb-12 font-light"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Виды и интерьер
          </h2>

          <div className="space-y-12">
            {[
              {
                src: "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/4547b25b-e005-40bc-9b2d-9ac26ed3286a.png",
                title: "Памятник героям Первой мировой войны",
                desc: "Вид рядом с жилым комплексом",
              },
              {
                src: "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/fb81af11-edae-428c-af78-e006195d9cd7.png",
                title: "Панорамное окно с видом на Храм Георгия Победоносца",
                desc: "Вид из квартиры на Парк Победы",
              },
              {
                src: "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/1ae1bb6e-ce89-4634-b606-0253ce943144.png",
                title: "Кухня-гостиная 60 м²",
                desc: "Просторная зона с панорамным остеклением",
              },
              {
                src: "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/d79c305f-331f-472f-a39a-4ba1950b60a9.png",
                title: "Мастер-спальня",
                desc: "Светлая комната с панорамным окном",
              },
              {
                src: "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/bucket/e618b959-05fc-4b46-a5c8-fdd4796ff45a.png",
                title: "Ванная комната",
                desc: "Натуральный мрамор, отдельностоящая ванна, две раковины",
              },
            ].map((p, i) => (
              <figure key={p.src} className="bg-white">
                <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <figcaption className="p-6 md:p-8 flex justify-between items-end gap-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Фото {String(i + 1).padStart(2, "0")}
                    </p>
                    <p
                      className="text-2xl font-light"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      {p.title}
                    </p>
                  </div>
                  <p className="text-sm text-stone-500">{p.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400 tracking-wider">
            Victory Park Residences · Корпус 2 · Москва
          </p>
          <p className="text-xs text-stone-300">
            Информация носит ознакомительный характер и не является публичной офертой
          </p>
        </div>
      </footer>
    </div>
  );
}