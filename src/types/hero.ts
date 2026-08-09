export interface MediaFile {
  id: string;
  url?: string;
  alt?: string;
}

export interface HeroSlideData {
  id: string;
  tagline?: string;
  title: string;
  subtitle?: string;
  desktopPoster: MediaFile | string;
  desktopVideo?: MediaFile | string;
  mobilePoster: MediaFile | string;
  mobileVideo?: MediaFile | string;
  ctaText?: string;
  ctaLink?: string;
  overlayOpacity?: number;
  order?: number;
  status?: "published" | "draft";
}
