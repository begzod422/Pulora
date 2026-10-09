import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru";
export type T2 = { uz: string; ru: string };

const dict = {
  nav_tools: { uz: "Kalkulyatorlar", ru: "Калькуляторы" },
  nav_pricing: { uz: "Tariflar", ru: "Тарифы" },
  nav_home: { uz: "Mening sahifam", ru: "Моя страница" },
  nav_start: { uz: "Boshlash", ru: "Начать" },
  nav_logout: { uz: "Chiqish", ru: "Выйти" },
  hero_kicker: { uz: "Moliyaviy savodxonlik — har kuni", ru: "Финансовая грамотность — каждый день" },
  hero_title: { uz: "Pulingiz siz uchun ishlasin", ru: "Пусть деньги работают на вас" },
  hero_sub: {
    uz: "PULORA — shaxsiy moliyaviy yordamchingiz. Maqsad qo'ying, hisoblang, odatlarni kuzating va natijani ko'ring.",
    ru: "PULORA — ваш личный финансовый помощник. Ставьте цель, считайте, отслеживайте привычки и видьте результат.",
  },
  hero_cta: { uz: "Bepul boshlash", ru: "Начать бесплатно" },
  hero_cta2: { uz: "Kalkulyatorlarni sinash", ru: "Попробовать калькуляторы" },
  feat1_t: { uz: "Aniq hisob-kitob", ru: "Точные расчёты" },
  feat1_d: { uz: "Jamg'arma, qarz va budjet kalkulyatorlari bir joyda.", ru: "Калькуляторы накоплений, долгов и бюджета в одном месте." },
  feat2_t: { uz: "Shaxsiy yo'l xaritasi", ru: "Личная дорожная карта" },
  feat2_d: { uz: "Maqsadingizga mos qadamlar va kundalik vazifalar.", ru: "Шаги и ежедневные задачи под вашу цель." },
  feat3_t: { uz: "Oila uchun", ru: "Для семьи" },
  feat3_d: { uz: "Oila budjetini birgalikda boshqarish oson.", ru: "Управлять семейным бюджетом вместе — просто." },
  stat1: { uz: "foydalanuvchi o'z maqsadini belgiladi", ru: "пользователей поставили цель" },
  stat2: { uz: "o'rtacha oylik tejash", ru: "средняя экономия в месяц" },
  stat3: { uz: "moliyaviy maqsad turi", ru: "типов финансовых целей" },
  reg_title: { uz: "Ro'yxatdan o'tish", ru: "Регистрация" },
  reg_sub: { uz: "Bir daqiqada hisob yarating", ru: "Создайте аккаунт за минуту" },
  name: { uz: "Ismingiz", ru: "Ваше имя" },
  password: { uz: "Parol", ru: "Пароль" },
  phone: { uz: "Telefon raqam", ru: "Номер телефона" },
  send_code: { uz: "Kod yuborish", ru: "Отправить код" },
  sending: { uz: "Yuborilmoqda...", ru: "Отправка..." },
  err_name: { uz: "Ismni kiriting (2–50 belgi)", ru: "Введите имя (2–50 символов)" },
  err_pass: { uz: "Parol kamida 6 belgidan iborat bo'lsin", ru: "Пароль — минимум 6 символов" },
  err_phone: { uz: "Telefon raqamni to'liq kiriting", ru: "Введите номер полностью" },
  err_sms: { uz: "SMS yuborilmadi. Keyinroq urinib ko'ring.", ru: "SMS не отправлено. Попробуйте позже." },
  ver_title: { uz: "Kodni kiriting", ru: "Введите код" },
  ver_sub: { uz: "6 xonali kod quyidagi raqamga yuborildi:", ru: "6-значный код отправлен на номер:" },
  ver_btn: { uz: "Tasdiqlash", ru: "Подтвердить" },
  ver_wrong: { uz: "Kod noto'g'ri", ru: "Неверный код" },
  ver_expired: { uz: "Kod muddati tugadi, qayta yuboring", ru: "Срок кода истёк, отправьте снова" },
  ver_resend: { uz: "Kodni qayta yuborish", ru: "Отправить код снова" },
  ver_demo: { uz: "Sinov rejimi: SMS xizmati hali ulanmagan. Kodingiz:", ru: "Тестовый режим: SMS-сервис ещё не подключён. Ваш код:" },
  goal_title: { uz: "Maqsadingiz nima?", ru: "Какая у вас цель?" },
  goal_sub: { uz: "Bittasini tanlang — sahifangiz shunga moslashadi", ru: "Выберите одну — страница подстроится под неё" },
  change_goal: { uz: "Maqsadni o'zgartirish", ru: "Сменить цель" },
  hello: { uz: "Salom", ru: "Привет" },
  your_steps: { uz: "Sizning qadamlaringiz", ru: "Ваши шаги" },
  progress: { uz: "Bajarildi", ru: "Выполнено" },
  quick_tool: { uz: "Tezkor hisob", ru: "Быстрый расчёт" },
  tips: { uz: "Foydali maslahatlar", ru: "Полезные советы" },
  premium_lock: { uz: "Premium bilan ochiladi", ru: "Доступно в Premium" },
  see_plans: { uz: "Tariflarni ko'rish", ru: "Смотреть тарифы" },
  sum: { uz: "so'm", ru: "сум" },
  months: { uz: "oy", ru: "мес." },
  tour_next: { uz: "Keyingi", ru: "Далее" },
  tour_done: { uz: "Tushunarli", ru: "Понятно" },
  tour_skip: { uz: "O'tkazib yuborish", ru: "Пропустить" },
  pricing_title: { uz: "O'zingizga mos tarifni tanlang", ru: "Выберите подходящий тариф" },
  pricing_sub: { uz: "Asosiy imkoniyatlar doim bepul. Premium — chuqurroq tahlil uchun.", ru: "Базовые функции всегда бесплатны. Premium — для глубокого анализа." },
  choose: { uz: "Tanlash", ru: "Выбрать" },
  soon: { uz: "To'lov tez orada ulanadi", ru: "Оплата скоро будет подключена" },
  popular: { uz: "Ommabop", ru: "Популярный" },
  free: { uz: "Bepul", ru: "Бесплатно" },
} satisfies Record<string, T2>;

export type DictKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "uz",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  useEffect(() => {
    const l = localStorage.getItem("pulora_lang");
    if (l === "ru" || l === "uz") setLangState(l);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pulora_lang", l);
    document.documentElement.lang = l;
  };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const { lang, setLang } = useContext(Ctx);
  const t = (k: DictKey) => dict[k][lang];
  const tx = (v: T2) => v[lang];
  return { lang, setLang, t, tx };
}
