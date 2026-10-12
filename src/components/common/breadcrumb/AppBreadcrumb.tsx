// src/components/common/breadcrumb/AppBreadcrumb.tsx
import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { breadcrumbConfig } from "@/config/breadcrumbConfig";
import { useBreadcrumbContext } from "@/context/BreadcrumbContext";

interface Crumb {
  path: string;
  label: string;
  isLast: boolean;
}

// Viết hoa chữ cái đầu, thay "-" bằng khoảng trắng — dùng làm fallback cuối
// cùng nếu path không có trong config và cũng không được override.
const humanizeSegment = (segment: string): string => {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const { overrides } = useBreadcrumbContext();

  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    // Thứ tự ưu tiên đặt tên:
    // 1. Override runtime từ trang con (vd tên bộ flashcard thật)
    // 2. Config tĩnh khai báo sẵn
    // 3. Tự viết hoa segment URL (fallback cuối, tránh hiện tên trống)
    const label = overrides[path] ?? breadcrumbConfig[path] ?? humanizeSegment(segment);

    return { path, label, isLast };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center text-sm text-zinc-500 mb-4">
      <Link to="/dashboard" className="hover:text-zinc-900 transition-colors">
        Trang chủ
      </Link>
      {crumbs
        .filter((c) => c.path !== "/dashboard") // tránh lặp "Trang chủ"
        .map((crumb) => (
          <Fragment key={crumb.path}>
            <ChevronRight className="w-4 h-4 mx-1.5 shrink-0" />
            {crumb.isLast ? (
              <span className="text-zinc-900 font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-zinc-900 transition-colors">
                {crumb.label}
              </Link>
            )}
          </Fragment>
        ))}
    </nav>
  );
}