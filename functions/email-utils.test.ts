// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { buildResetEmailHtml } from './email-utils.js';

describe('buildResetEmailHtml', () => {
  it('includes the reset URL as a link', () => {
    const html = buildResetEmailHtml('https://example.com/reset/abc123', 'Matti');
    expect(html).toContain('href="https://example.com/reset/abc123"');
  });

  it('includes the user name in greeting', () => {
    const html = buildResetEmailHtml('https://example.com/reset/abc', 'Liisa');
    expect(html).toContain('Hei Liisa');
  });

  it('contains HouseBoard branding', () => {
    const html = buildResetEmailHtml('https://example.com/reset/abc', 'Test');
    expect(html).toContain('HouseBoard');
    expect(html).toContain('Salasanan palautus');
  });
});
