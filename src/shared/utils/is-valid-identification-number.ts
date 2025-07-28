export const isValidIdentificationNumber = (identificationNumber: string) => {
  const digits = identificationNumber.split("").map(Number);

  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];

    if (i % 2 === 0) digit = digit * 2;

    if (digit > 9) digit = digit - 9;

    sum += digit;
  }

  return sum % 10 === 0;
};
