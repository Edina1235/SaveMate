import { ThousandSpacePipe } from './thousand-space.pipe';

describe('ThousandSpacePipe', () => {
  let pipe: ThousandSpacePipe;

  beforeEach(() => {
    pipe = new ThousandSpacePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number with thousand spaces', () => {
    expect(pipe.transform(1000)).toBe('1 000');
    expect(pipe.transform(1000000)).toBe('1 000 000');
  });

  it('should work with string input', () => {
    expect(pipe.transform('1234567')).toBe('1 234 567');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle small numbers correctly', () => {
    expect(pipe.transform(123)).toBe('123');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0)).toBe('0');
  });
});