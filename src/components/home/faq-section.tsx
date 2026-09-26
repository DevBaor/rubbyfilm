"use client";

import * as React from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    number: "01",
    question: "RubbyFilm là gì?",
    answer:
      "RubbyFilm là nền tảng xem phim trực tuyến cao cấp, cung cấp hàng ngàn tác phẩm điện ảnh chiếu rạp bom tấn, phim bộ đặc sắc và anime chất lượng cao với tốc độ tải mượt mà.",
  },
  {
    id: "faq-2",
    number: "02",
    question: "Tôi có cần phải đăng nhập hoặc đăng ký tài khoản không?",
    answer:
      "Hoàn toàn KHÔNG! Bạn có thể xem ngay lập tức mọi bộ phim mà không cần bất kỳ tài khoản hay mật khẩu nào. Không yêu cầu email hay thông tin cá nhân.",
  },
  {
    id: "faq-3",
    number: "03",
    question: "Làm thế nào để lưu phim yêu thích và xem tiếp khi không có tài khoản?",
    answer:
      "RubbyFilm tự động lưu trữ 'Danh sách yêu thích' và 'Lịch sử đang xem' trực tiếp trong trình duyệt máy bạn (Local Storage). Bạn có thể quay lại tiếp tục xem bất cứ lúc nào đúng mốc thời gian đã dừng.",
  },
  {
    id: "faq-4",
    number: "04",
    question: "Chất lượng hình ảnh và âm thanh như thế nào?",
    answer:
      "Các bộ phim trên RubbyFilm hỗ trợ độ phân giải sắc nét từ Full HD 1080p đến 4K Ultra HD với đường truyền máy chủ CDN băng thông cao, hạn chế tối đa độ trễ và giật lag.",
  },
  {
    id: "faq-5",
    number: "05",
    question: "Xem phim trên RubbyFilm có mất phí không?",
    answer:
      "Hoàn toàn miễn phí 100%. Bạn có thể thưởng thức toàn bộ kho nội dung điện ảnh phong phú mà không cần đóng bất kỳ khoản phí duy trì nào.",
  },
  {
    id: "faq-6",
    number: "06",
    question: "Nội dung phim được cập nhật với tần suất ra sao?",
    answer:
      "Hệ thống cập nhật phim mới liên tục mỗi ngày, bao gồm các tập phim bộ mới phát sóng, phim chiếu rạp vừa ra mắt kèm bản phụ đề Vietsub và lồng tiếng chuẩn xác.",
  },
  {
    id: "faq-7",
    number: "07",
    question: "Tôi có thể xem RubbyFilm trên những thiết bị nào?",
    answer:
      "RubbyFilm tương thích hoàn hảo trên mọi nền tảng: Điện thoại (iOS, Android), Máy tính bảng (iPad, Tablet), Laptop, PC và Smart TV (Android TV, Apple TV, Samsung, LG) trực tiếp qua trình duyệt web mà không cần cài đặt thêm ứng dụng.",
  },
];

export function FaqSection() {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(["faq-1"]));

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="py-12 sm:py-16 select-none border-t border-[#262626]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F9FAFB] tracking-[-0.02em] mb-3">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-sm sm:text-base text-[#D1D5DB] font-normal leading-[1.6] max-w-2xl">
              Bạn có thắc mắc? Dưới đây là những câu trả lời chi tiết và rõ ràng nhất về trải nghiệm xem phim tự do trên RubbyFilm.
            </p>
          </div>

          <a
            href="https://t.me/Duy_Bao105"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E50000] hover:bg-[#FF1A1A] text-[#F9FAFB] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#E50000]/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hỏi Thêm Thắc Mắc</span>
          </a>
        </div>

        {/* 2-Column FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {faqs.map((faq) => {
            const isOpen = openIds.has(faq.id);

            return (
              <div
                key={faq.id}
                className={`bg-[#0F0F0F] border transition-all duration-200 rounded-2xl p-5 sm:p-6 ${
                  isOpen ? "border-[#E50000]/60 bg-[#141414]" : "border-[#262626] hover:border-[#383838]"
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFaq(faq.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFaq(faq.id);
                    }
                  }}
                  className="flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    {/* Number box */}
                    <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] text-[#F9FAFB] font-extrabold flex items-center justify-center flex-shrink-0 text-sm">
                      {faq.number}
                    </div>

                    {/* Question title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-[#F9FAFB] tracking-[-0.02em] pt-1.5 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle button */}
                  <button
                    type="button"
                    aria-label={isOpen ? "Thu gọn câu trả lời" : "Xem câu trả lời"}
                    className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#262626] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#262626] transition-colors"
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#E50000]" />
                    ) : (
                      <Plus className="w-4 h-4 text-cinema-300" />
                    )}
                  </button>
                </div>

                {/* Dropdown Content */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-[#262626] text-xs sm:text-sm text-[#D1D5DB] font-normal leading-[1.6] pl-14 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
