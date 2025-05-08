export const validateNIN = (nin: string) => {
  if (!nin) return true; // Allow empty value

  // Check length
  if (nin.length !== 14) {
    return false;
  }

  // Check first character is a letter (usually C)
  if (!/^[A-Z]/.test(nin)) {
    return false;
  }

  // Check second character is M or F
  if (!/^.[MF]/.test(nin)) {
    return false;
  }

  // Check characters 3 and 4 are numbers (year)
  if (!/^..[0-9]{2}/.test(nin)) {
    return false;
  }

  // Check characters 5, 6, and 7 are numbers
  if (!/^....[0-9]{3}/.test(nin)) {
    return false;
  }

  return true;
};
