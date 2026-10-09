import { PiggyBank, Unlink, Map, Users, TrendingUp, type LucideIcon } from "lucide-react";
import type { GoalId } from "./store";
import type { T2 } from "./i18n";

export interface Goal {
  id: GoalId;
  icon: LucideIcon;
  title: T2;
  tagline: T2;
  steps: T2[];
  tips: { title: T2; text: T2 }[];
  tool: "savings" | "debt" | "budget" | "income";
}

export const GOALS: Goal[] = [
  {
    id: "save",
    icon: PiggyBank,
    title: { uz: "Pul tejash", ru: "Экономить деньги" },
    tagline: { uz: "Har oy ozgina — yil oxirida katta natija.", ru: "Понемногу каждый месяц — большой результат к концу года." },
    tool: "savings",
    steps: [
      { uz: "Oylik daromadning 10% ini birinchi kuni alohida kartaga o'tkazing", ru: "В первый день откладывайте 10% дохода на отдельную карту" },
      { uz: "1 hafta davomida barcha xarajatlarni yozib boring", ru: "Записывайте все траты в течение недели" },
      { uz: "Keraksiz 3 ta obunani bekor qiling", ru: "Отмените 3 ненужные подписки" },
      { uz: "3 oylik xavfsizlik yostig'i maqsadini qo'ying", ru: "Поставьте цель: подушка безопасности на 3 месяца" },
      { uz: "Katta xarid oldidan 48 soat kuting", ru: "Перед крупной покупкой подождите 48 часов" },
    ],
    tips: [
      { title: { uz: "Avval o'zingizga to'lang", ru: "Сначала заплатите себе" }, text: { uz: "Maosh tushishi bilan tejash summasini ajrating — qolganini sarflang.", ru: "Как только пришла зарплата — отложите сумму, остальное тратьте." } },
      { title: { uz: "Mayda xarajatlar", ru: "Мелкие траты" }, text: { uz: "Kuniga 15 000 so'mlik kofe — yiliga 5 mln so'mdan ortiq.", ru: "Кофе за 15 000 сум в день — больше 5 млн сум в год." } },
      { title: { uz: "Naqd pul usuli", ru: "Метод наличных" }, text: { uz: "Haftalik budjetni naqd oling — tugasa, xarid ham tugaydi.", ru: "Берите недельный бюджет наличными — кончились, значит стоп." } },
    ],
  },
  {
    id: "debt",
    icon: Unlink,
    title: { uz: "Qarzdan chiqish", ru: "Выйти из долгов" },
    tagline: { uz: "Reja bilan har qanday qarzdan qutulish mumkin.", ru: "С планом можно закрыть любой долг." },
    tool: "debt",
    steps: [
      { uz: "Barcha qarzlarni ro'yxatga yozing: summa, foiz, muddat", ru: "Выпишите все долги: сумма, процент, срок" },
      { uz: "Eng yuqori foizli qarzni birinchi o'ringa qo'ying", ru: "Поставьте долг с наибольшим процентом на первое место" },
      { uz: "Yangi kredit va muddatli to'lovlarni to'xtating", ru: "Остановите новые кредиты и рассрочки" },
      { uz: "Har oy minimal to'lovdan ko'proq to'lang", ru: "Платите каждый месяц больше минимального платежа" },
      { uz: "Bank bilan foizni kamaytirish haqida gaplashing", ru: "Поговорите с банком о снижении ставки" },
    ],
    tips: [
      { title: { uz: "Ko'chki usuli", ru: "Метод лавины" }, text: { uz: "Eng qimmat foizli qarzni birinchi yoping — umumiy to'lov kamayadi.", ru: "Сначала гасите самый дорогой долг — общая переплата меньше." } },
      { title: { uz: "Qor to'pi usuli", ru: "Метод снежного кома" }, text: { uz: "Eng kichik qarzni yoping — g'alaba motivatsiya beradi.", ru: "Закройте самый маленький долг — победа даёт мотивацию." } },
      { title: { uz: "Qarz bilan qarz yopmang", ru: "Не гасите долг долгом" }, text: { uz: "Yangi kredit eski qarzni faqat kechiktiradi.", ru: "Новый кредит лишь откладывает старый долг." } },
    ],
  },
  {
    id: "plan",
    icon: Map,
    title: { uz: "Moliyaviy reja tuzish", ru: "Составить финансовый план" },
    tagline: { uz: "Aniq reja — xotirjam kelajak.", ru: "Чёткий план — спокойное будущее." },
    tool: "budget",
    steps: [
      { uz: "1, 3 va 5 yillik maqsadlaringizni yozing", ru: "Запишите цели на 1, 3 и 5 лет" },
      { uz: "Daromadni 50/30/20 qoidasi bo'yicha taqsimlang", ru: "Распределите доход по правилу 50/30/20" },
      { uz: "Har bir maqsad uchun oylik summa belgilang", ru: "Определите ежемесячную сумму на каждую цель" },
      { uz: "Oyda bir marta rejani qayta ko'rib chiqing", ru: "Раз в месяц пересматривайте план" },
      { uz: "Sug'urta va favqulodda holatlarni hisobga oling", ru: "Учтите страховку и непредвиденные ситуации" },
    ],
    tips: [
      { title: { uz: "SMART maqsad", ru: "SMART-цель" }, text: { uz: "\"Ko'proq tejash\" emas, \"12 oyda 12 mln so'm\" deb yozing.", ru: "Не «больше копить», а «12 млн сум за 12 месяцев»." } },
      { title: { uz: "50/30/20", ru: "50/30/20" }, text: { uz: "50% ehtiyoj, 30% xohish, 20% jamg'arma va qarz.", ru: "50% нужды, 30% желания, 20% накопления и долги." } },
      { title: { uz: "Inflyatsiyani unutmang", ru: "Помните об инфляции" }, text: { uz: "Bugungi 10 mln 5 yildan keyin kamroq narsaga yetadi.", ru: "10 млн сегодня через 5 лет купят меньше." } },
    ],
  },
  {
    id: "family",
    icon: Users,
    title: { uz: "Oila budjetini boshqarish", ru: "Управлять семейным бюджетом" },
    tagline: { uz: "Birgalikda rejalashtiring, birgalikda yuting.", ru: "Планируйте вместе — побеждайте вместе." },
    tool: "budget",
    steps: [
      { uz: "Oila a'zolari bilan haftalik 15 daqiqalik moliya suhbati", ru: "Еженедельный 15-минутный разговор о финансах с семьёй" },
      { uz: "Umumiy va shaxsiy xarajatlarni ajrating", ru: "Разделите общие и личные расходы" },
      { uz: "Oziq-ovqat uchun oylik limit belgilang", ru: "Установите месячный лимит на продукты" },
      { uz: "Bolalar ta'limi uchun alohida jamg'arma oching", ru: "Откройте отдельный фонд на образование детей" },
      { uz: "Bayram va to'ylar uchun oldindan pul ajrating", ru: "Заранее откладывайте на праздники и свадьбы" },
    ],
    tips: [
      { title: { uz: "Konvert usuli", ru: "Метод конвертов" }, text: { uz: "Har bir toifaga alohida summa: ovqat, transport, kommunal.", ru: "Отдельная сумма на каждую категорию: еда, транспорт, ЖКХ." } },
      { title: { uz: "Ro'yxat bilan bozor", ru: "Рынок по списку" }, text: { uz: "Ro'yxatsiz xarid 20–30% ortiqcha xarajat keltiradi.", ru: "Покупки без списка дают 20–30% лишних трат." } },
      { title: { uz: "Bolalarni jalb qiling", ru: "Вовлекайте детей" }, text: { uz: "Kichik cho'ntak puli — eng yaxshi moliyaviy tarbiya.", ru: "Небольшие карманные деньги — лучшее финансовое воспитание." } },
    ],
  },
  {
    id: "income",
    icon: TrendingUp,
    title: { uz: "Daromadni oshirish", ru: "Увеличить доход" },
    tagline: { uz: "Ko'proq ishlash emas — aqlliroq ishlash.", ru: "Не больше работать — работать умнее." },
    tool: "income",
    steps: [
      { uz: "Bozorda talab yuqori bo'lgan 1 ko'nikmani tanlang", ru: "Выберите 1 востребованный на рынке навык" },
      { uz: "Hozirgi ishingizda oshirish so'rash uchun dalillar yig'ing", ru: "Соберите аргументы для запроса повышения" },
      { uz: "Qo'shimcha daromad g'oyasini 30 kun sinab ko'ring", ru: "Протестируйте идею подработки 30 дней" },
      { uz: "Qo'shimcha daromadning 50% ini jamg'armaga yo'naltiring", ru: "Направляйте 50% доп. дохода в накопления" },
      { uz: "Keraksiz buyumlarni soting", ru: "Продайте ненужные вещи" },
    ],
    tips: [
      { title: { uz: "Soatingiz narxi", ru: "Цена вашего часа" }, text: { uz: "Oylik daromadni ish soatlariga bo'ling — vaqtingizni qadrlang.", ru: "Поделите доход на рабочие часы — цените своё время." } },
      { title: { uz: "Bir nechta manba", ru: "Несколько источников" }, text: { uz: "Bitta daromad manbai — xavf. Ikkinchisini quring.", ru: "Один источник дохода — риск. Постройте второй." } },
      { title: { uz: "Turmush darajasini ushlang", ru: "Держите уровень расходов" }, text: { uz: "Daromad oshsa ham, xarajatni darhol oshirmang.", ru: "Доход вырос — не повышайте расходы сразу." } },
    ],
  },
];

export const goalById = (id?: string) => GOALS.find((g) => g.id === id);
