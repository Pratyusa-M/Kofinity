


export const FormatNumberWithCommas2 = (number) => {
    // Check if the number is negative
    const isNegative = number < 0;
    
    // Round the absolute value of the number to two decimal places
    const absRoundedNumber = Math.round(Math.abs(number) * 100) / 100;
    const strNumber = absRoundedNumber.toString();
    const decimalIndex = strNumber.indexOf('.');
    let integerPart = strNumber;
    let decimalPart = '';

    if (decimalIndex !== -1) {
        integerPart = strNumber.slice(0, decimalIndex);
        decimalPart = strNumber.slice(decimalIndex, decimalIndex + 3); // Only keep two decimal places
    }

    let formattedNumber = '';

    if (integerPart.length <= 3) {
        // If the integer part is less than 1000, no need for commas
        formattedNumber = integerPart;
    } else if (integerPart.length <= 5) {
        // If the integer part is between 1000 and 99999, format it as xx,xxx
        formattedNumber = integerPart.slice(0, integerPart.length - 3) + ',' + integerPart.slice(integerPart.length - 3);
    } else if (integerPart.length <= 7) {
        // If the integer part is between 100000 and 9999999, format it as x,xx,xxx
        formattedNumber = integerPart.slice(0, integerPart.length - 5) + ',' + integerPart.slice(integerPart.length - 5, integerPart.length - 3) + ',' + integerPart.slice(integerPart.length - 3);
    } else {
        // For integer parts greater than or equal to 1 crore
        formattedNumber = integerPart.slice(0, integerPart.length - 7) + ',' + integerPart.slice(integerPart.length - 7, integerPart.length - 5) + ',' + integerPart.slice(integerPart.length - 5, integerPart.length - 3) + ',' + integerPart.slice(integerPart.length - 3);
    }

    // If the number is negative, add the minus sign separately
    formattedNumber = isNegative ? '-' + formattedNumber : formattedNumber;

    return formattedNumber + decimalPart;
};

export const FormatNumberWithCommas = (number) => {
    // Check if the number is negative
    const isNegative = number < 0;

    // Round the absolute value of the number to two decimal places
    const absRoundedNumber = Math.round(Math.abs(number) * 100) / 100;
    const strNumber = absRoundedNumber.toString();
    const decimalIndex = strNumber.indexOf('.');
    let integerPart = strNumber;
    let decimalPart = '';

    if (decimalIndex !== -1) {
        integerPart = strNumber.slice(0, decimalIndex);
        decimalPart = strNumber.slice(decimalIndex, decimalIndex + 3); // Only keep two decimal places
    }

    let formattedNumber = '';
    const integerLength = integerPart.length;

    if (integerLength <= 3) {
        // If the integer part is less than 1000, no need for commas
        formattedNumber = integerPart;
    } else if (integerLength <= 6) {
        // If the integer part is between 1000 and 999999, format it as x,xxx
        formattedNumber = integerPart.slice(0, integerLength - 3) + ',' + integerPart.slice(integerLength - 3);
    } else if (integerLength <= 9) {
        // If the integer part is between 1 million and 999 million, format it as x,xx,xxx
        formattedNumber = integerPart.slice(0, integerLength - 6) + ',' + integerPart.slice(integerLength - 6, integerLength - 3) + ',' + integerPart.slice(integerLength - 3);
    } else {
        // For integer parts greater than or equal to 1 billion
        formattedNumber = integerPart.slice(0, integerLength - 9) + ',' + integerPart.slice(integerLength - 9, integerLength - 6) + ',' + integerPart.slice(integerLength - 6, integerLength - 3) + ',' + integerPart.slice(integerLength - 3);
    }

    // If the number is negative, add the minus sign separately
    formattedNumber = isNegative ? '-' + formattedNumber : formattedNumber;

    return formattedNumber + decimalPart;
};
