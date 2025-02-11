import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import type { Locale } from "@/types";

export const routing = defineRouting({
  locales: ["pt", "en"] as Locale[],
  defaultLocale: "en",
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);