const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;

function isValidEmail(email: string): boolean {
  if (email.length > EMAIL_MAX_LENGTH) {
    return false;
  }
  return EMAIL_REGEX.test(email);
}

export { isValidEmail };
