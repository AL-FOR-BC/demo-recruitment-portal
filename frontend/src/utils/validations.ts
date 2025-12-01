export const validateNIN = (nin: string): boolean => {
  // Remove any spaces from the NIN
  const cleanNIN = nin.trim().toUpperCase();

  // Check if the length is exactly 14 characters
  if (cleanNIN.length !== 14) {
    return false;
  }

  // Check if it starts with CM (male) or CF (female)
  if (!cleanNIN.startsWith("CM") && !cleanNIN.startsWith("CF")) {
    return false;
  }

  // Extract different parts of the NIN for validation
  const yearPart = cleanNIN.substring(2, 4); // Year (2 digits)
  const numberPart = cleanNIN.substring(4, 10); // 6 digits
  const letterPart = cleanNIN.substring(10); // Last 4 letters

  // Check if year part contains only digits
  if (!/^\d{2}$/.test(yearPart)) {
    return false;
  }

  // Check if number part contains only digits
  if (!/^\d{6}$/.test(numberPart)) {
    return false;
  }

  // Check if letter part contains only letters
  if (!/^[A-Z]{4}$/.test(letterPart)) {
    return false;
  }

  return true;
};

export function lowercaseOrganizationEmail(email: string): string {
  const organizationDomains = ["@hrpsolutions.com", "@reachoutmbuya.org"];

  const matchedDomain = organizationDomains.find((domain) =>
    email.toLowerCase().endsWith(domain.toLowerCase())
  );

  if (matchedDomain) {
    const [localPart, domain] = email.split("@");

    return `${localPart.toLowerCase()}@${domain}`;
  }

  return email;
}
