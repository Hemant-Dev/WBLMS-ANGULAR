import { HTMLEncodePipe } from './htmlencode.pipe';

describe('HTMLEncodePipe', () => {
  it('create an instance', () => {
    const pipe = new HTMLEncodePipe();
    expect(pipe).toBeTruthy();
  });
});
