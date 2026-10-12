// src/context/BreadcrumbContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface BreadcrumbContextValue {
  // key = path đầy đủ (vd "/flashcard/abc123"), value = tên hiển thị (vd "Từ vựng IELTS")
  overrides: Record<string, string>;
  setBreadcrumbLabel: (path: string, label: string) => void;
  clearBreadcrumbLabel: (path: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const setBreadcrumbLabel = useCallback((path: string, label: string) => {
    setOverrides((prev) => {
      if (prev[path] === label) return prev; // tránh re-render thừa
      return { ...prev, [path]: label };
    });
  }, []);

  const clearBreadcrumbLabel = useCallback((path: string) => {
    setOverrides((prev) => {
      if (!(path in prev)) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  return (
    <BreadcrumbContext.Provider
      value={{ overrides, setBreadcrumbLabel, clearBreadcrumbLabel }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error("useBreadcrumbContext phải dùng trong BreadcrumbProvider");
  }
  return ctx;
}

/**
 * Hook tiện dụng để trang con tự đặt tên breadcrumb cho chính nó.
 * Dùng trong component của trang, truyền path hiện tại + tên muốn hiển thị.
 * Tự động dọn dẹp khi component unmount.
 *
 * Ví dụ trong FlashcardList.tsx:
 *   useBreadcrumbLabel(`/flashcard/${setId}`, selectedSet?.topic);
 */
import { useEffect } from "react";

export function useBreadcrumbLabel(path: string, label: string | undefined) {
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbContext();

  useEffect(() => {
    if (!label) return;
    setBreadcrumbLabel(path, label);
    return () => clearBreadcrumbLabel(path);
  }, [path, label, setBreadcrumbLabel, clearBreadcrumbLabel]);
}