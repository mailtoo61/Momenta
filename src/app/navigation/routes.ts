export const appRoutes = {
  home: "/",
  onboarding: "/onboarding",
  settings: "/settings",
  paywall: "/paywall",
  debug: "/debug"
} as const;

export type AppRouteName = keyof typeof appRoutes;
export type AppRoutePath = (typeof appRoutes)[AppRouteName];
