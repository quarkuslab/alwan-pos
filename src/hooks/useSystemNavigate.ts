import { useCallback, useMemo } from "react";
import { To, useLocation, useNavigate } from "react-router";

export function useCanGoBack() {
  const location = useLocation()
  const canGoBack = useMemo(() => location.pathname.includes("initial-bill") ||
    location.pathname.includes("final-bill") ||
    location.pathname.includes("search") ||
    location.pathname.includes("settings"), [location]);

  return canGoBack
}

export default function useSystemNavigate() {
  const navigate = useNavigate()
  const canGoBack = useCanGoBack()

  const systemNavigate = useCallback((path: To) => navigate(path, { replace: canGoBack }), [navigate, canGoBack])
  return systemNavigate
}