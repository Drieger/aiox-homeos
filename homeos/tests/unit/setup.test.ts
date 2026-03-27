import { describe, it, expect } from 'vitest';

describe('Vitest setup', () => {
  it('ambiente de teste está funcional', () => {
    expect(true).toBe(true);
  });

  it('matchers do jest-dom estão disponíveis', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
  });
});
