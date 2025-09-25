import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

// export const formatCurrency = (amount: number | string): string => {
//   const numericAmount = typeof amount === "string" ? Number(amount) : amount;
//   return new Intl.NumberFormat("sn-SN", {
//     style: "currency",
//     currency: "XOF",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(numericAmount);
// };

export type Category = {
  id: string;
  title: string;
  slug: string;
  isLink: boolean;
  subcat?: SubType[];
};

export type SubType = Pick<Category, "id" | "title" | "slug">;

export const categories: Category[] = [
  {
    id: "ghfsd",
    title: "Epicerie Sucrée",
    slug: "epicerie-sucree",
    isLink: false,
    subcat: [
      {
        id: "haotb",
        title: "Café capsule & Moulu",
        slug: "cafe-capsule-moulu",
      },
      {
        id: "gvwts",
        title: "Crémerie & Fromage",
        slug: "cremerie-fromage",
      },
      {
        id: "laxpe",
        title: "Sucres & Edulcorants",
        slug: "sucres-edulcorants",
      },
      {
        id: "kwany",
        title: "Pâte â Tartiner",
        slug: "pate-a-tartiner",
      },
      {
        id: "bpawv",
        title: "Pâtes à tartiner",
        slug: "pates-a-tartiner",
      },
      {
        id: "jwxit",
        title: "Beurre & Margarine",
        slug: "beurre-margarine",
      },
    ],
  },
  {
    id: "kaxpq",
    title: "Riz",
    slug: "riz",
    isLink: false,
    subcat: [
      {
        id: "hzwls",
        title: "Riz parfumé 100% brisure",
        slug: "riz-parfume-100-brisure",
      },
      {
        id: "gvwt1",
        title: "Riz nom parfumé",
        slug: "riz-nom-parfume",
      },
      {
        id: "laxp1",
        title: "Riz de la vallée",
        slug: "riz-de-la-vallee",
      },
    ],
  },
  {
    id: "vxfwi",
    title: "Huile",
    slug: "huile",
    isLink: false,
    subcat: [
      {
        id: "hzwl1",
        title: "Huile végétale",
        slug: "huile-vegetale",
      },
      {
        id: "gvwt2",
        title: "huile de soja",
        slug: "huile-de-soja",
      },
      {
        id: "laxp2",
        title: "huile de tournesol",
        slug: "huile-de-tournesol",
      },
      {
        id: "kwan1",
        title: "huile d'arachide",
        slug: "huile-d-arachide",
      },
      {
        id: "bpaw1",
        title: "huile de palme",
        slug: "huile-de-palme",
      },
      {
        id: "jwxi1",
        title: "huile d'olive",
        slug: "huile-d-olive",
      },
    ],
  },
  {
    id: "jzqpa",
    title: "Boissons",
    slug: "boissons",
    isLink: false,
    subcat: [
      {
        id: "hwqmd",
        title: "Eau",
        slug: "eau",
      },
      {
        id: "gvwt3",
        title: "Jus de fruits",
        slug: "jus-de-fruits",
      },
      {
        id: "laxp3",
        title: "Boissons gazeuses",
        slug: "boissons-gazeuses",
      },
      {
        id: "kwan2",
        title: "Thé et infusions",
        slug: "the-et-infusions",
      },
      {
        id: "bpaw2",
        title: "Jus de citron",
        slug: "jus-de-citron",
      },
      {
        id: "jwxi2",
        title: "Miel pur",
        slug: "miel-pur",
      },
      {
        id: "jxapw",
        title: "Huile de palme",
        slug: "huile-de-palme",
      },
      {
        id: "lwqmb",
        title: "diw nior (beurre de vache)",
        slug: "diw-nior-beurre-de-vache",
      },
    ],
  },
  {
    id: "mkwya",
    title: "Pâte Alimentaire",
    slug: "pate-alimentaire",
    isLink: false,
    subcat: [
      {
        id: "hwqm1",
        title: "Couscous",
        slug: "couscous",
      },
      {
        id: "gvwt4",
        title: "Mouhamsa",
        slug: "mouhamsa",
      },
      {
        id: "laxp4",
        title: "Pâte d'arachide",
        slug: "pate-d-arachide",
      },
      {
        id: "kwan3",
        title: "Spaghetti",
        slug: "spaghetti",
      },
      {
        id: "bpaw3",
        title: "Vermicelle",
        slug: "vermicelle",
      },
      {
        id: "jwxi3",
        title: "Autres pâtes",
        slug: "autres-pates",
      },
      {
        id: "pzqkf",
        title: "Macaroni",
        slug: "macaroni",
      },
    ],
  },
  {
    id: "lxaiu",
    title: "Fruits & légumes & viandes",
    slug: "fruits-legumes-viandes",
    isLink: true,
    subcat: [
      {
        id: "haxpw",
        title: "Fruits",
        slug: "fruits",
      },
      {
        id: "gvwt5",
        title: "Légumes",
        slug: "legumes",
      },
      {
        id: "laxp5",
        title: "Viandes d'agneau",
        slug: "viandes-d-agneau",
      },
      {
        id: "kwan4",
        title: "Viande de veau",
        slug: "viande-de-veau",
      },
      {
        id: "bpaw4",
        title: "Poulets",
        slug: "poulets",
      },
    ],
  },
  {
    id: "lvwkf",
    title: "Biscuits & Confiserie",
    slug: "biscuits-confiserie",
    isLink: false,
    subcat: [
      {
        id: "haxdt",
        title: "Café capsule & Moulu",
        slug: "cafe-capsule-moulu",
      },
      {
        id: "gvwt6",
        title: "Crémerie & Fromage",
        slug: "cremerie-fromage",
      },
      {
        id: "laxp6",
        title: "Sucres & Edulcorants",
        slug: "sucres-edulcorants",
      },
      {
        id: "kwan5",
        title: "Pâte â Tartiner",
        slug: "pate-a-tartiner",
      },
      {
        id: "bpaw5",
        title: "Pâtes à tartiner",
        slug: "pates-a-tartiner",
      },
      {
        id: "jwxi4",
        title: "Beurre & Margarine",
        slug: "beurre-margarine",
      },
    ],
  },
  {
    id: "mxjax",
    title: "Produits-bébé",
    slug: "produits-bebe",
    isLink: false,
    subcat: [
      {
        id: "kqbdt",
        title: "Aliments bébé",
        slug: "aliments-bebe",
      },
      {
        id: "gvwt7",
        title: "Couches",
        slug: "couches",
      },
      {
        id: "laxp7",
        title: "Assouplissant",
        slug: "assouplissant",
      },
      {
        id: "kwan6",
        title: "Parfumerie",
        slug: "parfumerie",
      },
      {
        id: "bpaw6",
        title: "Pates dentifrice",
        slug: "pates-dentifrice",
      },
      {
        id: "jwxi5",
        title: "Lingette",
        slug: "lingettes",
      },
      {
        id: "haqvi",
        title: "Lait de corps",
        slug: "lait-de-corps",
      },
      {
        id: "jwzit",
        title: "Savon",
        slug: "savon",
      },
      {
        id: "iqdlh",
        title: "poudre bébé",
        slug: "poudre-bebe",
      },
      {
        id: "hwzpy",
        title: "Brosse a dents",
        slug: "brosse-a-dents",
      },
    ],
  },
  {
    id: "mkxzb",
    title: "Epicerie Salée",
    slug: "epicerie-salee",
    isLink: false,
    subcat: [
      {
        id: "lzysr",

        title: "piment-ail-poivre-épices",
        slug: "piment-ail-poivre-epices",
      },
      {
        id: "kwbai",
        title: "Vinaigres & Vinaigrettes",
        slug: "vinaigres-vinaigrettes",
      },
      {
        id: "gvwt8",
        title: "Moutarde",
        slug: "moutarde",
      },
      {
        id: "laxp8",
        title: "Sauces & Tomates & Mayonnaises",
        slug: "sauces-tomates-mayonnaises",
      },
      {
        id: "kwan7",
        title: "Bouillon",
        slug: "bouillon",
      },
      {
        id: "bpaw7",
        title: "Condiment",
        slug: "condiment",
      },
      {
        id: "jwxi6",
        title: "Tomate",
        slug: "tomate",
      },
      {
        id: "oszvi",
        title: "Thon",
        slug: "thon",
      },
      {
        id: "izqkh",
        title: "Conserve",
        slug: "conserve",
      },
      {
        id: "haqv1",
        title: "Sauces et aromes",
        slug: "sauces-et-aromes",
      },
      {
        id: "nvghd",
        title: "Oeufs",
        slug: "oeufs",
      },
    ],
  },
  {
    id: "ynegv",
    title: "Surgelées & charcuterie",
    slug: "surgelees-charcuterie",
    isLink: true,
  },
  {
    id: "pcawm",
    title: "Hygiène & Beauté & Pharmacie",
    slug: "hygiene-beaute-pharmacie",
    isLink: true,
  },
  {
    id: "jkdve",
    title: "Boulangerie & Patisserie",
    slug: "boulangerie-patisserie",
    isLink: false,
  },
  {
    id: "jiawb",
    title: "Produits locaux",
    slug: "produits-locaux",
    isLink: true,
  },
  {
    id: "mzopa",
    title: "Divers Produits",
    slug: "divers-produits",
    isLink: true,
  },
  {
    id: "iazpe",
    title: "Divers Produits",
    slug: "divers-produits",
    isLink: true,
  },
];

export const convertDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
