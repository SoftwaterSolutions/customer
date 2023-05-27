export function updateArrayWithFlags(array1, array2) {
  // Create a new array to store the updated objects
  const updatedArray = [];

  // Loop through each object in Array 1
  for (let i = 0; i < array1.length; i++) {
    const country1 = array1[i];

    // Find the corresponding country object in Array 2
    const country2 = array2.find((c) => c.name.common === country1.name);

    // If the corresponding country object exists, update the object in Array 1
    if (country2) {
      const { flags, idd, cca2 } = country2;
      const updatedObject = {
        ...country1,
        png: flags?.png,
        svg: flags?.svg,
        phoneCode: idd?.root + idd?.suffixes,
        shortCode: cca2,
      };
      updatedArray.push(updatedObject);
    } else {
      // If the corresponding country object doesn't exist, add the object from Array 1 as is
      updatedArray.push(country1);
    }
  }

  return updatedArray;
}

export function sortByProperty(array, property, order = 'asc') {
  const sortOrder = order === 'desc' ? -1 : 1;
  if (!Array.isArray(array)) {
    return [];
  } else if (array?.length == 0) {
    return array;
  } else {
    return [...array]?.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      if (aValue < bValue) {
        return -1 * sortOrder;
      }
      if (aValue > bValue) {
        return 1 * sortOrder;
      }
      return 0;
    });
  }
}
