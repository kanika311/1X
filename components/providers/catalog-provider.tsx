"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  buildCatalogItems,
  getCartItemsFromCatalog,
  getWishlistItemsFromCatalog,
  type CartLineItem,
  type CatalogItem,
} from "@/lib/catalog-items";
import {
  offerings as staticOfferings,
  type ServiceCategory,
  type ServiceDomain,
  type ServiceOffering,
} from "@/lib/data/service-catalog";
import {
  fetchActiveProducts,
  getOfferingFromList,
  getOfferingsByCategoryFrom,
  resolveOfferingsList,
} from "@/lib/products-api";

type CatalogContextValue = {
  offerings: ServiceOffering[];
  catalog: CatalogItem[];
  loading: boolean;
  fromApi: boolean;
  getOfferingBySlug: (slug: string) => ServiceOffering | undefined;
  getOffering: (domain: string, category: string, slug: string) => ServiceOffering | undefined;
  getByCategory: (domain: ServiceDomain, category: ServiceCategory) => ServiceOffering[];
  getCatalogItem: (id: string) => CatalogItem | undefined;
  getCartItems: (keys: string[]) => CartLineItem[];
  getWishlistItems: (ids: string[]) => CatalogItem[];
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [apiOfferings, setApiOfferings] = useState<ServiceOffering[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchActiveProducts().then((list) => {
      if (!cancelled) {
        setApiOfferings(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const offerings = useMemo(
    () => resolveOfferingsList(apiOfferings),
    [apiOfferings],
  );
  const catalog = useMemo(() => buildCatalogItems(offerings), [offerings]);
  const fromApi = apiOfferings.length > 0;

  const getOfferingBySlug = useCallback(
    (slug: string) => offerings.find((o) => o.slug === slug.toLowerCase()),
    [offerings],
  );

  const getOffering = useCallback(
    (domain: string, category: string, slug: string) =>
      getOfferingFromList(offerings, domain, category, slug) ?? getOfferingBySlug(slug),
    [offerings, getOfferingBySlug],
  );

  const getByCategory = useCallback(
    (domain: ServiceDomain, category: ServiceCategory) =>
      getOfferingsByCategoryFrom(offerings, domain, category),
    [offerings],
  );

  const getCatalogItem = useCallback(
    (id: string) => catalog.find((c) => c.id === id || c.catalogId === id),
    [catalog],
  );

  const getCartItems = useCallback(
    (keys: string[]) => getCartItemsFromCatalog(catalog, keys),
    [catalog],
  );

  const getWishlistItems = useCallback(
    (ids: string[]) => getWishlistItemsFromCatalog(catalog, ids),
    [catalog],
  );

  const value = useMemo(
    () => ({
      offerings,
      catalog,
      loading,
      fromApi,
      getOfferingBySlug,
      getOffering,
      getByCategory,
      getCatalogItem,
      getCartItems,
      getWishlistItems,
    }),
    [
      offerings,
      catalog,
      loading,
      fromApi,
      getOfferingBySlug,
      getOffering,
      getByCategory,
      getCatalogItem,
      getCartItems,
      getWishlistItems,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    const catalog = buildCatalogItems(staticOfferings);
    return {
      offerings: staticOfferings,
      catalog,
      loading: false,
      fromApi: false,
      getOfferingBySlug: (slug: string) =>
        staticOfferings.find((o) => o.slug === slug.toLowerCase()),
      getOffering: (domain: string, category: string, slug: string) =>
        getOfferingFromList(staticOfferings, domain, category, slug) ??
        staticOfferings.find((o) => o.slug === slug.toLowerCase()),
      getByCategory: (domain: ServiceDomain, category: ServiceCategory) =>
        getOfferingsByCategoryFrom(staticOfferings, domain, category),
      getCatalogItem: (id: string) => catalog.find((c) => c.id === id || c.catalogId === id),
      getCartItems: (keys: string[]) => getCartItemsFromCatalog(catalog, keys),
      getWishlistItems: (ids: string[]) => getWishlistItemsFromCatalog(catalog, ids),
    };
  }
  return ctx;
}
