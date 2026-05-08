import Icon from "@/components/ui/icon";

const PHOTO =
  "https://cdn.poehali.dev/projects/603ba905-8b0a-4a95-9eb7-081add793bbb/files/4574f8ae-68d5-46f0-8f9d-0612247f1486.jpg";

const specs = [
  { label: "Площадь", value: "87 м²" },
  { label: "Этаж", value: "9 из 16" },
  { label: "Год постройки", value: "2021" },
  { label: "Комнат", value: "3" },
  { label: "Потолки", value: "3,1 м" },
  { label: "Санузлы", value: "2 (раздельный)" },
  { label: "Тип дома", value: "Монолит" },
  { label: "Парковка", value: "Подземная" },
];

const advantages = [
  {
    icon: "Sun",
    title: "Солнечная сторона",
    desc: "Окна выходят на юг и запад — естественный свет весь день",
  },
  {
    icon: "TreePine",
    title: "Парк рядом",
    desc: "В 5 минутах пешком — парковая зона с прудом",
  },
  {
    icon: "Shield",
    title: "Закрытый двор",
    desc: "Охрана, видеонаблюдение, консьерж-сервис 24/7",
  },
  {
    icon: "Zap",
    title: "Готово к въезду",
    desc: "Чистовая отделка, встроенная кухня и гардеробные",
  },
];

const rooms: { name: string; size: string; x: number; y: number; w: number; h: number }[] = [
  { name: "Гостиная", size: "28 м²", x: 10, y: 10, w: 48, h: 42 },
  { name: "Спальня 1", size: "18 м²", x: 60, y: 10, w: 38, h: 32 },
  { name: "Спальня 2", size: "14 м²", x: 60, y: 44, w: 38, h: 26 },
  { name: "Кухня", size: "16 м²", x: 10, y: 54, w: 30, h: 26 },
  { name: "Санузел", size: "5 м²", x: 42, y: 54, w: 16, h: 12 },
  { name: "Санузел 2", size: "4 м²", x: 42, y: 68, w: 16, h: 12 },
  { name: "Коридор", size: "7 м²", x: 10, y: 82, w: 88, h: 8 },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <img
          src={PHOTO}
          alt="Объект"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
          <span className="text-white/70 text-xs tracking-[0.2em] uppercase font-light">
            Эксклюзивное предложение
          </span>
          <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full border border-white/20">
            ID: RE-4821
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-5xl">
            <p className="text-white/60 text-xs tracking-widest uppercase mb-3">
              Москва, Пресненский район
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
              3-комнатная квартира<br />
              <span className="text-white/70">87 м² · 9 этаж</span>
            </h1>
            <div className="flex items-end gap-8 flex-wrap">
              <div>
                <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Стоимость</p>
                <p className="text-3xl md:text-4xl text-white font-light" style={{ fontFamily: "'Cormorant', serif" }}>
                  28 500 000 ₽
                </p>
              </div>
              <div className="w-px h-12 bg-white/20 hidden md:block" />
              <div>
                <p className="text-white/50 text-xs tracking-wider uppercase mb-1">За м²</p>
                <p className="text-xl text-white font-light" style={{ fontFamily: "'Cormorant', serif" }}>327 586 ₽</p>
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

      {/* DESCRIPTION + ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-5">Об объекте</p>
            <h2 className="text-3xl md:text-4xl leading-snug mb-6 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
              Светлая квартира с панорамным видом на город
            </h2>
            <p className="text-stone-500 leading-relaxed text-base">
              Просторная трёхкомнатная квартира в доме бизнес-класса с закрытой территорией.
              Выполнена чистовая отделка премиум-материалами: паркет из массива дуба,
              итальянская плитка, встроенная кухня Leicht. Большие панорамные окна
              обеспечивают потрясающий вид на Москву и наполняют пространство светом.
            </p>
            <div className="mt-8 pt-8 border-t border-stone-200">
              <p className="text-stone-500 leading-relaxed text-base">
                Развитая инфраструктура района: школы и детские сады в пешей доступности,
                фитнес-центр в доме, консьерж-сервис. До метро «Улица 1905 года» — 7 минут пешком.
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
          <h2 className="text-3xl md:text-4xl mb-12 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
            Технические характеристики
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-300">
            {specs.map((s) => (
              <div key={s.label} className="bg-stone-100 p-6 md:p-8">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">{s.label}</p>
                <p className="text-2xl md:text-3xl text-stone-900 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
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
        <h2 className="text-3xl md:text-4xl mb-12 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
          Схема расположения комнат
        </h2>
        <div className="bg-white border border-stone-200 p-8 md:p-12">
          <div className="relative w-full max-w-2xl mx-auto" style={{ paddingBottom: "58%" }}>
            <svg
              viewBox="0 0 100 92"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="8" y="8" width="84" height="76" fill="none" stroke="#C5C0B8" strokeWidth="0.8" />
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
                    y={r.y + r.h / 2 - 2}
                    textAnchor="middle"
                    fontSize="3.2"
                    fill="#555"
                    fontFamily="Georgia, serif"
                  >
                    {r.name}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 5}
                    textAnchor="middle"
                    fontSize="2.6"
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
          <h2 className="text-3xl md:text-4xl mb-12 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
            Адрес и инфраструктура
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white overflow-hidden" style={{ height: "380px" }}>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.557940%2C55.758380&z=15&pt=37.557940,55.758380,pm2rdm"
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
                <p className="text-lg font-light" style={{ fontFamily: "'Cormorant', serif" }}>
                  Пресненский Вал, 4с1
                </p>
                <p className="text-sm text-stone-400 mt-1">Пресненский район, Москва</p>
              </div>
              {[
                { icon: "Train", label: "Метро", value: "7 мин пешком" },
                { icon: "GraduationCap", label: "Школа", value: "3 мин пешком" },
                { icon: "ShoppingCart", label: "Магазины", value: "В доме и рядом" },
                { icon: "TreePine", label: "Парк", value: "5 мин пешком" },
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
        <h2 className="text-3xl md:text-4xl mb-12 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
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
                  Анна Соколова
                </p>
                <p className="text-sm text-stone-400">Старший брокер · 12 лет опыта</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "Phone", label: "+7 (925) 000-00-00" },
                { icon: "Mail", label: "anna@realty.ru" },
                { icon: "MessageCircle", label: "Telegram: @anna_sokolova" },
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
              <p className="text-xl text-white mb-3 font-light" style={{ fontFamily: "'Cormorant', serif" }}>
                Записаться на просмотр
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                Организуем показ в удобное для вас время. Ответим на все вопросы об объекте.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <button className="w-full bg-white text-stone-900 py-3.5 text-xs tracking-widest uppercase hover:bg-stone-100 transition-colors">
                Позвонить
              </button>
              <button className="w-full border border-white/30 text-white py-3.5 text-xs tracking-widest uppercase hover:border-white/60 transition-colors">
                Написать
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400 tracking-wider">
            Объект ID: RE-4821 · Москва, 2026
          </p>
          <p className="text-xs text-stone-300">
            Информация носит ознакомительный характер и не является публичной офертой
          </p>
        </div>
      </footer>
    </div>
  );
}