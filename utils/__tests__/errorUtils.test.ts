import { ErrorMessageResolver } from '../errorUtils';

describe('ErrorMessageResolver', () => {
  it('returns default message for empty input', () => {
    expect(ErrorMessageResolver.getErrorMessage(null)).toBe(
      'An unexpected error occurred. Please try again.',
    );
  });

  it('returns string errors directly', () => {
    expect(ErrorMessageResolver.getErrorMessage('Network unavailable')).toBe('Network unavailable');
  });

  it('returns message from Error instances', () => {
    expect(ErrorMessageResolver.getErrorMessage(new Error('Permission denied'))).toBe(
      'Permission denied',
    );
  });

  it('returns message from plain objects', () => {
    expect(ErrorMessageResolver.getErrorMessage({ message: 'Invalid payload' })).toBe(
      'Invalid payload',
    );
  });
});
