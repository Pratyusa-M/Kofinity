export const FormatNumberWithCommas2 = (number) => {
  // Check if the number is negative
  const isNegative = number < 0;

  // Convert the absolute value to a string to preserve exact decimal representation
  const strNumber = String(Math.abs(number));
  const decimalIndex = strNumber.indexOf('.');
  let integerPart = strNumber;
  let decimalPart = '';

  if (decimalIndex !== -1) {
    integerPart = strNumber.slice(0, decimalIndex);
    // Truncate to two decimal places without rounding
    const rawDecimal = strNumber.slice(decimalIndex + 1);
    decimalPart = rawDecimal.length > 0 ? '.' + rawDecimal.slice(0, 2) : '';
  }

  let formattedNumber = '';

  if (integerPart.length <= 3) {
    // If the integer part is less than 1000, no need for commas
    formattedNumber = integerPart;
  } else if (integerPart.length <= 5) {
    // If the integer part is between 1000 and 99999, format it as xx,xxx
    formattedNumber =
      integerPart.slice(0, integerPart.length - 3) +
      ',' +
      integerPart.slice(integerPart.length - 3);
  } else if (integerPart.length <= 7) {
    // If the integer part is between 100000 and 9999999, format it as x,xx,xxx
    formattedNumber =
      integerPart.slice(0, integerPart.length - 5) +
      ',' +
      integerPart.slice(integerPart.length - 5, integerPart.length - 3) +
      ',' +
      integerPart.slice(integerPart.length - 3);
  } else {
    // For integer parts greater than or equal to 1 crore
    formattedNumber =
      integerPart.slice(0, integerPart.length - 7) +
      ',' +
      integerPart.slice(integerPart.length - 7, integerPart.length - 5) +
      ',' +
      integerPart.slice(integerPart.length - 5, integerPart.length - 3) +
      ',' +
      integerPart.slice(integerPart.length - 3);
  }

  // If the number is negative, add the minus sign separately
  formattedNumber = isNegative ? '-' + formattedNumber : formattedNumber;

  return formattedNumber + decimalPart;
};

export const FormatNumberWithCommas = (number) => {
  // Check if the number is negative
  const isNegative = number < 0;

  // Convert the absolute value to a string to preserve exact decimal representation
  const strNumber = String(Math.abs(number));
  const decimalIndex = strNumber.indexOf('.');
  let integerPart = strNumber;
  let decimalPart = '';

  if (decimalIndex !== -1) {
    integerPart = strNumber.slice(0, decimalIndex);
    // Truncate to two decimal places without rounding
    const rawDecimal = strNumber.slice(decimalIndex + 1);
    decimalPart = rawDecimal.length > 0 ? '.' + rawDecimal.slice(0, 2) : '';
  }

  let formattedNumber = '';
  const integerLength = integerPart.length;

  if (integerLength <= 3) {
    // If the integer part is less than 1000, no need for commas
    formattedNumber = integerPart;
  } else if (integerLength <= 6) {
    // If the integer part is between 1000 and 999999, format it as x,xxx
    formattedNumber =
      integerPart.slice(0, integerLength - 3) +
      ',' +
      integerPart.slice(integerLength - 3);
  } else if (integerLength <= 9) {
    // If the integer part is between 1 million and 999 million, format it as x,xx,xxx
    formattedNumber =
      integerPart.slice(0, integerLength - 6) +
      ',' +
      integerPart.slice(integerLength - 6, integerLength - 3) +
      ',' +
      integerPart.slice(integerLength - 3);
  } else {
    // For integer parts greater than or equal to 1 billion
    formattedNumber =
      integerPart.slice(0, integerLength - 9) +
      ',' +
      integerPart.slice(integerLength - 9, integerLength - 6) +
      ',' +
      integerPart.slice(integerLength - 6, integerLength - 3) +
      ',' +
      integerPart.slice(integerLength - 3);
  }

  // If the number is negative, add the minus sign separately
  formattedNumber = isNegative ? '-' + formattedNumber : formattedNumber;

  return formattedNumber + decimalPart;
};