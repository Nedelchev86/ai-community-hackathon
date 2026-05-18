import { useSyncExternalStore } from "react";

export type Role = "donor" | "receiver";

export type Review = {
  rating: number;
  text: string;
  tags: string[];
  ago?: string;
};

export type Exchange = {
  id: string;
  item: string;
  category: string;
  partnerName: string;
  partnerAvatar: string;
  myRole: Role;
  completedAgo: string;
  myReview?: Review;
  partnerReview?: Review;
};

export const TAGS_DONOR = ["Точен", "Любезен", "Бързо взе вещта", "Добра комуникация", "С благодарност"];
export const TAGS_RECEIVER = ["Перфектно състояние", "Точно описание", "Лесна среща", "Топло отношение", "Препоръчвам"];

// Map every tag to one of three rating categories
export const CATEGORY_TAGS: Record<"accuracy" | "communication" | "condition", string[]> = {
  accuracy: ["Точен", "Бързо взе вещта", "Лесна среща", "Точно описание"],
  communication: ["Любезен", "Добра комуникация", "С благодарност", "Топло отношение"],
  condition: ["Перфектно състояние", "Препоръчвам"],
};

export const CATEGORY_LABEL: Record<keyof typeof CATEGORY_TAGS, string> = {
  accuracy: "Точност",
  communication: "Комуникация",
  condition: "Състояние",
};

const INITIAL: Exchange[] = [
  {
    id: "ex1",
    item: 'Детско колело 16"',
    category: "Спорт",
    partnerName: "Мария Г.",
    partnerAvatar: "М",
    myRole: "donor",
    completedAgo: "вчера",
    partnerReview: {
      rating: 5,
      text: "Огромно благодаря на Мария! Колелото е в чудесно състояние, със съвсем леки следи от употреба. Синът ми не спира да го кара от вчера. Много мила и отзивчива дама, срещнахме се в уречения час без никакво забавяне. 💚",
      tags: ["Перфектно състояние", "Топло отношение"],
      ago: "преди 4ч",
    },
  },
  {
    id: "ex2",
    item: "Комплект учебници 5. клас",
    category: "Книги",
    partnerName: "Иван П.",
    partnerAvatar: "И",
    myRole: "receiver",
    completedAgo: "преди 3 дни",
    partnerReview: {
      rating: 5,
      text: "Иван беше изключително точен. Учебниците са много запазени, без надраскано или липсващи страници. Радвам се, че има такива хора, спестихме доста средства за подготовката на дъщеря ми тази година.",
      tags: ["Точен", "Любезен"],
      ago: "преди 2д",
    },
  },
  {
    id: "ex3",
    item: "Зимно яке, ръст 140",
    category: "Дрехи",
    partnerName: "Елена С.",
    partnerAvatar: "Е",
    myRole: "donor",
    completedAgo: "преди седмица",
    myReview: {
      rating: 5,
      text: "Елена дойде точно навреме на уговореното място. Много възпитана и мила. Радвам се, че якето ще влезе в употреба и ще топли друго дете през зимата!",
      tags: ["Точен", "Любезен"],
    },
    partnerReview: {
      rating: 5,
      text: "Якето е прекрасно, много плътно и топло, буквално сякаш не е носено изобщо. Благодаря на Елена за бързата комуникация и отделеното време да се видим в почивката ѝ.",
      tags: ["Перфектно състояние", "Препоръчвам"],
      ago: "преди 6д",
    },
  },
  {
    id: "ex4",
    item: "Кафемашина De'Longhi",
    category: "Техника",
    partnerName: "Петър К.",
    partnerAvatar: "П",
    myRole: "receiver",
    completedAgo: "преди 2 седмици",
    myReview: {
      rating: 4,
      text: "Машината прави страхотно кафе. Имаше леко разминаване в часа на срещата, но момчето се обади да предупреди навреме. Доволен съм.",
      tags: ["Перфектно състояние", "Точно описание"],
    },
    partnerReview: {
      rating: 5,
      text: "Петър беше много комуникативен и разбран, въпреки че се забавих с 15 минути заради ужасно задръстване. Благодаря за разбирането и коректността, надявам се машината да служи дълго!",
      tags: ["Добра комуникация", "С благодарност"],
      ago: "преди 13д",
    },
  },
];

let state: Exchange[] = INITIAL;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const reviewsStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setMyReview: (id: string, review: Review) => {
    state = state.map((e) => (e.id === id ? { ...e, myReview: review } : e));
    emit();
  },
};

export const useExchanges = () =>
  useSyncExternalStore(reviewsStore.subscribe, reviewsStore.get, reviewsStore.get);

// All reviews received BY ME (i.e. partnerReview entries — those are about me)
export const getReceivedReviews = (exchanges: Exchange[]): Review[] =>
  exchanges.map((e) => e.partnerReview).filter((r): r is Review => !!r);

export type CategoryStats = {
  overall: number | null;
  count: number;
  byCategory: Record<keyof typeof CATEGORY_TAGS, { avg: number | null; count: number }>;
};

export const computeProfileStats = (exchanges: Exchange[]): CategoryStats => {
  const reviews = getReceivedReviews(exchanges);
  const overall = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : null;

  const byCategory = {} as CategoryStats["byCategory"];
  (Object.keys(CATEGORY_TAGS) as Array<keyof typeof CATEGORY_TAGS>).forEach((key) => {
    const tags = CATEGORY_TAGS[key];
    const matched = reviews.filter((r) => r.tags.some((t) => tags.includes(t)));
    byCategory[key] = {
      count: matched.length,
      avg: matched.length ? matched.reduce((a, r) => a + r.rating, 0) / matched.length : null,
    };
  });

  return { overall, count: reviews.length, byCategory };
};