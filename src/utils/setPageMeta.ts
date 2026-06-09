interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function setPageMeta({ title, description, canonical, ogTitle, ogDescription }: PageMeta) {
  document.title = title;

  const setMeta = (name: string, content: string, prop = false) => {
    const attr = prop ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', ogTitle ?? title, true);
  setMeta('og:description', ogDescription ?? description, true);
  setMeta('og:url', canonical ?? window.location.href, true);
  setMeta('twitter:title', ogTitle ?? title);
  setMeta('twitter:description', ogDescription ?? description);

  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }
}
