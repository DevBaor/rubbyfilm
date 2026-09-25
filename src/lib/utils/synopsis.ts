/**
 * Generates an engaging, cinema-grade short synopsis snippet for movies
 * that lack descriptions in the raw data, preventing dull "Đang cập nhật..." placeholders.
 */

export function generateMovieSynopsis(movie: {
  title?: string;
  originalTitle?: string;
  description?: string;
  genres?: string[];
  genreSlugs?: string[];
  year?: number;
  type?: string;
  country?: string;
  slug?: string;
}): string {
  const existing = (movie.description || "").trim();
  const isGenericPlaceholder =
    !existing ||
    existing.length < 25 ||
    existing.toLowerCase().includes("đang cập nhật nội dung") ||
    existing.toLowerCase().includes("nội dung đang được cập nhật");

  if (!isGenericPlaceholder) {
    return existing;
  }

  const title = movie.title || "Tác phẩm";
  const yearStr = movie.year ? ` (${movie.year})` : "";
  const genres = movie.genres || [];
  const slugs = movie.genreSlugs || [];

  // Check genres for thematic tailored summaries
  if (slugs.includes("hanh-dong") || genres.some((g) => g.toLowerCase().includes("hành động"))) {
    return `Tác phẩm điện ảnh hành động kịch tính ${title}${yearStr} mang đến cho khán giả những trường đoạn rượt đuổi nghẹt thở, kỹ xảo mãn nhãn và cuộc đối đầu cam go đầy lôi cuốn.`;
  }

  if (slugs.includes("kinh-di") || slugs.includes("bi-an") || genres.some((g) => g.toLowerCase().includes("kinh dị") || g.toLowerCase().includes("bí ẩn"))) {
    return `Bộ phim ${title}${yearStr} dẫn dắt người xem vào thế giới bí ẩn rùng rợn cùng chuỗi tình tiết ly kỳ và những cú twist nghẹt thở đến tận phút chót.`;
  }

  if (slugs.includes("tinh-cam") || slugs.includes("hai-huoc") || genres.some((g) => g.toLowerCase().includes("tình cảm") || g.toLowerCase().includes("hài hước"))) {
    return `Câu chuyện ngọt ngào và đong đầy cảm xúc trong ${title}${yearStr} chạm tới trái tim người xem qua những khoảnh khắc lãng mạn, hóm hỉnh và chữa lành tâm hồn.`;
  }

  if (slugs.includes("khoa-hoc") || slugs.includes("vien-tuong") || genres.some((g) => g.toLowerCase().includes("viễn tưởng"))) {
    return `Khám phá thế giới giả tưởng kỳ vĩ trong siêu phẩm ${title}${yearStr} với kỹ xảo hoành tráng và câu chuyện phiêu lưu tương lai đầy kịch tính.`;
  }

  if (movie.type === "series") {
    return `Bộ phim truyền hình đặc sắc ${title}${yearStr} quy tụ dàn diễn viên thực lực cùng cốt truyện hấp dẫn, lôi cuốn người xem qua từng tập phim gay cấn.`;
  }

  return `Khám phá siêu phẩm điện ảnh đặc sắc ${title}${yearStr} - tác phẩm chuẩn 4K đỉnh cao đưa bạn vào chuyến hành trình điện ảnh sống động và giàu cảm xúc.`;
}
