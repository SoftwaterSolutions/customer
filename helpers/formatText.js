export function truncateText(text, maxLength) {
  if (!text) {
    return '....';
  }
  if (text?.length > maxLength) {
    return text?.slice(0, maxLength) + '...';
  } else {
    return text;
  }
}

export function convertToYesNo(value) {
  if (value === 1) {
    return 'Yes';
  } else {
    return 'No';
  }
}

export function timeFormatCheck(timeString) {
  const timeRegex = /^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/;
  return timeRegex.test(timeString);
}

export function formatKobo(number) {
  return (
    typeof number == 'string' ? parseInt(number) / 100 : number / 100
  )?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function extractEndNumber(word) {
  const regex = /\d+$/; // Match one or more digits at the end of the string
  const match = regex.exec(word); // Try to match the regex against the input string
  if (match) {
    return parseInt(match[0]); // Return the matched number as an integer
  } else {
    return null; // If no match was found, return null
  }
}

export function formatAmount(str, type) {
  let num = parseFloat(str) * 100;
  if (type === 'number') {
    return num;
  } else return num.toString();
}

export function formatCurrency(number, dp = 2, currencySign = '₦') {
  if (typeof number === 'string' && /^\d+$/.test(number)) {
    number = Number(number);
  }
  if (typeof number !== 'number' || isNaN(number)) {
    return '---';
  }
  let formattedNumber = Number(number).toFixed(dp);
  let parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  let formattedString = `${currencySign}${parts.join('.')}`;

  return formattedString;
}

export const capitalize = (str) => {
  if (!str) return '----';
  else
    return str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export const obfuscateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return ''; // Return an empty string for invalid inputs
  }

  var parts = email.split('@');

  if (parts.length !== 2) {
    return email; // Return the original email if it doesn't contain exactly one "@" symbol
  }

  var username = parts[0];
  var domain = parts[1];

  if (username.length < 5) {
    return email; // Return the original email if the username is too short
  }

  // Obtain the first letter, letter in between, and last letter
  var firstLetter = username.charAt(0) + username.charAt(1);
  var middleLetter = username.length > 2 ? username.charAt(1) : '';
  var lastLetter =
    username.charAt(username.length - 2) + username.charAt(username.length - 1);

  // Calculate the number of letters to remove
  var numLettersToRemove = username.length - 4;

  // Replace letters with asterisks
  var obfuscatedUsername =
    firstLetter + '*'.repeat(numLettersToRemove) + lastLetter;

  // Construct the obfuscated email
  var obfuscatedEmail = obfuscatedUsername + '@' + domain;

  return obfuscatedEmail;
};
