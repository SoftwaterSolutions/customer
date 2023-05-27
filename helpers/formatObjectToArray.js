export function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function extractObjectValues(obj) {
  const result = [];
  if (!Array.isArray(obj)) {
    for (const value of Object.values(obj)) {
      if (isObject(value)) {
        result.push(...Object.values(value));
      }
    }
    return result;
  } else {
    return obj;
  }
}
