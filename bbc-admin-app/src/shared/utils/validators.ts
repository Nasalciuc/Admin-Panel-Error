/**
 * Input validation for forms. Used by Leads page, Settings page.
 */

export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function sanitizeName(name: string): string {
  return name.replace(/<[^>]+>/g, '').replace(/[^a-zA-Z\s\-']/g, '').trim().slice(0, 100) || 'Guest';
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
