import { describe, expect, it } from 'vitest';
import { toEmbedUrl } from './courseLabels';

describe('toEmbedUrl (YouTube → embed)', () => {
  it('converte watch?v=ID', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('converte watch?v=ID sem www', () => {
    expect(toEmbedUrl('https://youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('converte youtu.be/ID', () => {
    expect(toEmbedUrl('https://youtu.be/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('converte /shorts/ID', () => {
    expect(toEmbedUrl('https://www.youtube.com/shorts/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('mantém URL que já é embed', () => {
    expect(toEmbedUrl('https://www.youtube.com/embed/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    );
  });

  it('retorna null para provedor não suportado', () => {
    expect(toEmbedUrl('https://vimeo.com/123')).toBeNull();
  });

  it('retorna null para valores vazios ou inválidos', () => {
    expect(toEmbedUrl(null)).toBeNull();
    expect(toEmbedUrl('')).toBeNull();
    expect(toEmbedUrl('abc')).toBeNull();
  });
});