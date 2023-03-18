import type { Observable } from 'rxjs';
import { fromEvent, map, startWith } from 'rxjs';

export function media(query: string): Observable<boolean> {
  const mediaQuery = window.matchMedia(query);
  return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
    startWith(mediaQuery),
    map((list: MediaQueryList) => list.matches)
  );
}

export const titleCase = (str: string) =>
  str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
