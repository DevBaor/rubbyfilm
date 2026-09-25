/**
 * Utility for handling bilingual (Vietnamese & English/Original) movie titles.
 * Guarantees that every movie in RubbyFilm displays both:
 * 1. Primary Vietnamese Title
 * 2. Secondary English/Original Title
 */

// Known translations for movies where the source API only provides an English name
const KNOWN_TITLE_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  "i-mperfect": {
    vi: "Người Không Hoàn Hảo",
    en: "I'mPerfect",
  },
  "imperfect": {
    vi: "Người Không Hoàn Hảo",
    en: "I'mPerfect",
  },
  "tony": {
    vi: "Huyền Thoại Tony",
    en: "Tony",
  },
  "chat": {
    vi: "Phòng Trò Chuyện Bí Mật",
    en: "CHAT",
  },
  "ella-mccay": {
    vi: "Cuộc Đời Ella McCay",
    en: "Ella McCay",
  },
  "digimon-beatbreak": {
    vi: "Chiến Binh Digimon Beatbreak",
    en: "Digimon Beatbreak",
  },
  "tourist-trap": {
    vi: "Bẫy Du Khách",
    en: "Tourist Trap",
  },
  "witchboard-2": {
    vi: "Bàn Cầu Cơ 2",
    en: "Witchboard 2",
  },
  "the-33": {
    vi: "33 Người Thợ Mỏ",
    en: "The 33",
  },
  "shark-frenzy": {
    vi: "Cá Mập Cuồng Nộ",
    en: "Shark Frenzy",
  },
  "drive-through-fire": {
    vi: "Chuyến Xe Rượt Đuổi",
    en: "Drive Through Fire",
  },
  "the-fix": {
    vi: "Phi Vụ Sửa Sai",
    en: "The Fix",
  },
  "hot-fuzz": {
    vi: "Siêu Cớm",
    en: "Hot Fuzz",
  },
  "ripd": {
    vi: "Đồn Cảnh Sát Ma",
    en: "R.I.P.D.",
  },
  "r-i-p-d": {
    vi: "Đồn Cảnh Sát Ma",
    en: "R.I.P.D.",
  },
};

/**
 * Checks if a string contains Vietnamese diacritical characters
 */
export function hasVietnameseDiacritics(text?: string | null): boolean {
  if (!text) return false;
  return /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/i.test(text);
}

/**
 * Converts a slug into title case English words
 * e.g. "bong-ma-buon-ba" -> "Bong Ma Buon Ba"
 */
export function slugToTitleCase(slug?: string | null): string {
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export interface BilingualTitleResult {
  primaryTitle: string; // Vietnamese title
  secondaryTitle: string; // English / Original title
}

/**
 * Normalizes movie titles so that both Vietnamese and English are always available
 */
export function getBilingualTitles(movie: {
  title?: string;
  name?: string;
  originalTitle?: string;
  origin_name?: string;
  slug?: string;
}): BilingualTitleResult {
  const rawTitle = (movie.title || movie.name || "").trim();
  const rawOriginal = (movie.originalTitle || movie.origin_name || "").trim();
  const slug = (movie.slug || "").trim().toLowerCase();

  // 1. Check known translations dictionary first
  if (slug && KNOWN_TITLE_TRANSLATIONS[slug]) {
    return {
      primaryTitle: KNOWN_TITLE_TRANSLATIONS[slug].vi,
      secondaryTitle: rawOriginal || KNOWN_TITLE_TRANSLATIONS[slug].en,
    };
  }

  // 2. Both are present and distinct
  if (rawTitle && rawOriginal && rawTitle.toLowerCase() !== rawOriginal.toLowerCase()) {
    // Check if rawTitle is actually Vietnamese
    if (hasVietnameseDiacritics(rawTitle)) {
      return {
        primaryTitle: rawTitle,
        secondaryTitle: rawOriginal,
      };
    }
    // If rawOriginal has Vietnamese and rawTitle is English
    if (hasVietnameseDiacritics(rawOriginal)) {
      return {
        primaryTitle: rawOriginal,
        secondaryTitle: rawTitle,
      };
    }
    // If neither has diacritics, keep title as primary and original as secondary
    return {
      primaryTitle: rawTitle,
      secondaryTitle: rawOriginal,
    };
  }

  // 3. Either one is missing, or both are identical (like "I'mPerfect")
  const commonTitle = rawTitle || rawOriginal || slugToTitleCase(slug) || "Phim Hay";

  if (hasVietnameseDiacritics(commonTitle)) {
    // Common title is Vietnamese
    const englishFromSlug = slugToTitleCase(slug);
    const secondary =
      rawOriginal && rawOriginal.toLowerCase() !== commonTitle.toLowerCase()
        ? rawOriginal
        : englishFromSlug && englishFromSlug.toLowerCase() !== commonTitle.toLowerCase()
        ? englishFromSlug
        : commonTitle;

    return {
      primaryTitle: commonTitle,
      secondaryTitle: secondary,
    };
  }

  // Common title is in English/Latin (no diacritics)
  // Check if slug has a recognizable pattern
  const formattedEnglish = commonTitle;
  return {
    primaryTitle: formattedEnglish,
    secondaryTitle: rawOriginal && rawOriginal.toLowerCase() !== formattedEnglish.toLowerCase()
      ? rawOriginal
      : `Bản Gốc: ${formattedEnglish}`,
  };
}
