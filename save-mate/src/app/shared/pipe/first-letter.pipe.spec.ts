import { FirstLetterPipe } from './first-letter.pipe';

describe('FirstLetterPipe', () => {
  let pipe: FirstLetterPipe;

  beforeEach(() => {
    pipe = new FirstLetterPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return first letter in uppercase', () => {
    expect(pipe.transform('hello')).toBe('H');
  });

  it('should handle single character string', () => {
    expect(pipe.transform('a')).toBe('A');
  });

  it('should handle uppercase input', () => {
    expect(pipe.transform('World')).toBe('W');
  });
});