// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signJwt, verifyJwt } from './auth-utils.js';

describe('hashPassword + verifyPassword', () => {
  it('round-trips correctly', async () => {
    const password = 'TestPassword123!';
    const stored = await hashPassword(password);
    const valid = await verifyPassword(password, stored);
    expect(valid).toBe(true);
  });

  it('produces saltHex:hashHex format', async () => {
    const stored = await hashPassword('test');
    expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{64}$/);
  });

  it('generates different salts each time', async () => {
    const a = await hashPassword('same');
    const b = await hashPassword('same');
    expect(a).not.toBe(b);
  });

  it('uses provided salt deterministically', async () => {
    const salt = 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8';
    const a = await hashPassword('test', salt);
    const b = await hashPassword('test', salt);
    expect(a).toBe(b);
  });

  it('rejects wrong password', async () => {
    const stored = await hashPassword('correct');
    const valid = await verifyPassword('wrong', stored);
    expect(valid).toBe(false);
  });

  it('rejects malformed stored hash', async () => {
    const valid = await verifyPassword('test', 'not-a-valid-hash');
    expect(valid).toBe(false);
  });
});

describe('signJwt + verifyJwt', () => {
  const secret = 'test-secret-key';
  const payload = {
    sub: 'u1',
    email: 'test@example.com',
    name: 'Test User',
    apartment: 'A 1',
    role: 'resident' as const,
  };

  it('round-trips correctly', async () => {
    const token = await signJwt(payload, secret);
    const decoded = await verifyJwt(token, secret);
    expect(decoded).not.toBeNull();
    expect(decoded!.sub).toBe('u1');
    expect(decoded!.email).toBe('test@example.com');
    expect(decoded!.name).toBe('Test User');
    expect(decoded!.apartment).toBe('A 1');
    expect(decoded!.role).toBe('resident');
  });

  it('produces a three-part token', async () => {
    const token = await signJwt(payload, secret);
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });

  it('includes iat and exp in payload', async () => {
    const token = await signJwt(payload, secret, 3600);
    const decoded = await verifyJwt(token, secret);
    expect(decoded).not.toBeNull();
    expect(decoded!.iat).toBeGreaterThan(0);
    expect(decoded!.exp).toBe(decoded!.iat + 3600);
  });

  it('returns null for expired token', async () => {
    // Sign with 0-second expiry
    const token = await signJwt(payload, secret, -1);
    const decoded = await verifyJwt(token, secret);
    expect(decoded).toBeNull();
  });

  it('returns null for wrong secret', async () => {
    const token = await signJwt(payload, secret);
    const decoded = await verifyJwt(token, 'wrong-secret');
    expect(decoded).toBeNull();
  });

  it('returns null for tampered token', async () => {
    const token = await signJwt(payload, secret);
    const parts = token.split('.');
    // Reverse the signature to reliably produce an invalid HMAC
    parts[2] = parts[2].split('').reverse().join('');
    const tampered = parts.join('.');
    const decoded = await verifyJwt(tampered, secret);
    expect(decoded).toBeNull();
  });

  it('returns null for malformed token', async () => {
    const decoded = await verifyJwt('not.a.valid-token-content', secret);
    expect(decoded).toBeNull();
  });

  it('returns null for token with wrong number of parts', async () => {
    const decoded = await verifyJwt('only-one-part', secret);
    expect(decoded).toBeNull();
  });
});
