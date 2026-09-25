import * as React from "react";
import {
  Smartphone,
  Tablet,
  Tv,
  Laptop,
  Gamepad2,
  Glasses,
} from "lucide-react";

const devices = [
  {
    icon: Smartphone,
    title: "Smartphones",
    description:
      "Tối ưu hoàn hảo cho iOS và Android. Thao tác vuốt chạm mượt mà, tải nhanh và tiết kiệm dữ liệu di động.",
  },
  {
    icon: Tablet,
    title: "Máy Tính Bảng (Tablet)",
    description:
      "Hiển thị sắc nét trên iPad và tablet Android với khung hình chuẩn 16:9 và âm thanh stereo sống động.",
  },
  {
    icon: Tv,
    title: "Smart TV",
    description:
      "Trải nghiệm rạp chiếu tại gia trên Android TV, Samsung Tizen, LG webOS, Apple TV với chất lượng 4K HDR.",
  },
  {
    icon: Laptop,
    title: "Laptop & PC",
    description:
      "Tương thích mọi trình duyệt hiện đại Chrome, Edge, Firefox, Safari với phím tắt điều khiển tiện lợi.",
  },
  {
    icon: Gamepad2,
    title: "Gaming Consoles",
    description:
      "Thưởng thức điện ảnh trên PlayStation 5 và Xbox Series qua trình duyệt tích hợp siêu mượt mà.",
  },
  {
    icon: Glasses,
    title: "Kính Thực Tế Ảo (VR)",
    description:
      "Hòa mình vào không gian rạp phim ảo IMAX khổng lồ trên kính Meta Quest và Apple Vision Pro.",
  },
];

export function DevicesSection() {
  return (
    <section className="py-12 sm:py-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
            Trải Nghiệm Xem Phim Trên Mọi Thiết Bị
          </h2>
          <p className="text-sm sm:text-base text-cinema-400 max-w-3xl leading-relaxed">
            Với RubbyFilm, bạn có thể thưởng thức những bộ phim và series yêu thích mọi lúc, mọi nơi. 
            Nền tảng được tối ưu hóa đồng bộ trên mọi nền tảng thiết bị, đảm bảo chất lượng hình ảnh vượt trội.
          </p>
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div
                key={device.title}
                className="bg-gradient-to-br from-[#141414] via-[#0F0F0F] to-[#0A0A0A] border border-[#262626] rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-[#E50000]/50 transition-all duration-300 relative overflow-hidden shadow-lg"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50000]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E50000]/10 transition-colors" />

                <div>
                  {/* Icon & Title Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[#E50000] group-hover:scale-105 group-hover:border-[#E50000]/40 transition-all duration-300 shadow-sm flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {device.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-cinema-400 leading-relaxed">
                    {device.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
