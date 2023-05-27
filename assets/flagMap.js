export function flagMap(countryCode) {
  return require(`./flags/${countryCode?.toLowerCase()}.svg`);
}
