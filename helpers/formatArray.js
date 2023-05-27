export function getRandomElementFromArray(arr) {
  if (arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  return;
}

export function toggleArrayElement(array, element) {
  const index = array.indexOf(element);
  if (index === -1) {
    // Element doesn't exist in array, so add it
    array.push(element);
  } else {
    // Element exists in array, so remove it
    array.splice(index, 1);
  }
  return array;
}

export const flattenedArray = (originalArray) => {
  return originalArray.reduce((acc, innerArray) => {
    return [...acc, ...innerArray];
  }, []);
};

export function getPropertyArray(array, property) {
  return array.map(function (obj) {
    return obj[property];
  });
}

export function isSubstringInArray(substring, stringArray) {
  const upperCaseSubstring = substring?.toUpperCase();
  for (let i = 0; i < stringArray?.length; i++) {
    const upperCaseString = stringArray[i]?.toUpperCase();
    if (upperCaseString?.includes(upperCaseSubstring)) {
      return true;
    }
  }
  return false;
}

export function sortAscending(arr) {
  return [...arr]?.sort((a, b) => a?.localeCompare(b));
}

export const sortedDataByCreatedAt = (data) =>
  [...data]?.sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

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

export function generateNaturalNumbers(start, end) {
  let result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

export function updateObjects(arr, condition, propName, propValue) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (condition(arr[i])) {
      let newObj = { ...arr[i], [propName]: propValue };
      newArr.push(newObj);
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

export function getAdjacentObject(
  array,
  currentPropValue,
  propName,
  direction
) {
  const currentIndex = array.findIndex(
    (obj) => obj[propName] === currentPropValue
  );
  const adjacentIndex =
    direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  return array[adjacentIndex] || null;
}

export function isLastObjectByProperty(arr, obj, prop) {
  const lastIndex = arr.length - 1;
  const lastElement = arr[lastIndex];
  return lastElement[prop] === obj[prop];
}

export function getFilenames(fileList) {
  let filenames = [];
  for (let i = 0; i < fileList.length; i++) {
    filenames.push(fileList[i].name);
  }
  return filenames;
}

export function extractPropsByInputArray(arr, inPropArr, inProp, outProp) {
  const extProps = [];
  for (const obj of arr) {
    if (inPropArr?.includes(obj[inProp])) {
      extProps?.push(obj[outProp]);
    }
  }
  return extProps;
}

export function areFileListsEqual(fileList1, fileList2) {
  if (fileList1?.length !== fileList2?.length) {
    return false;
  }

  for (let i = 0; i < fileList1?.length; i++) {
    const file1 = fileList1?.item(i);
    let found = false;
    for (let j = 0; j < fileList2?.length; j++) {
      const file2 = fileList2?.item(j);
      if (file1?.name === file2?.name && file1?.size === file2?.size) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }

  return true;
}

export function sortByTagName(array) {
  return [...array].sort((a, b) => {
    const tagA = a?.tags[0]?.name?.toUpperCase();
    const tagB = b?.tags[0]?.name?.toUpperCase();

    if (tagA < tagB) {
      return -1;
    }
    if (tagA > tagB) {
      return 1;
    }

    return 0;
  });

  return array;
}

export function removeDuplicatesByKey(arr, key) {
  return arr.filter(
    (obj, index, self) => index === self.findIndex((o) => o[key] === obj[key])
  );
}

export function removeUndefinedOrNull(arr) {
  if (!arr) return [];
  return arr.filter((item) => item !== undefined && item !== null);
}

export function extractValueFromArray(arr, key) {
  const values = [];
  for (const obj of arr) {
    if (obj[key] !== undefined) {
      values.push(obj[key]);
    } else {
      for (const [nestedKey, nestedValue] of Object.entries(obj)) {
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          const nestedValues = extractValueFromArray([nestedValue], key);
          if (nestedValues.length > 0) {
            values.push(...nestedValues);
          }
        }
      }
    }
  }
  return values;
}

export function removeDuplicates(
  arr,
  preserveOrder = false,
  removeEmptyString = false
) {
  let result;

  if (preserveOrder || removeEmptyString) {
    result = [];
    for (const item of arr) {
      if (!result.includes(item) && item !== '') {
        result.push(item);
      }
    }
  } else {
    result = [...new Set(arr)];
  }

  return result;
}

export function extractObjectWithMarketId(products, uom_id, market_id) {
  let result = null;
  for (let i = 0; i < products?.length; i++) {
    let product = products[i];
    if (product?.uom_id?.id === uom_id) {
      if (product?.market_id?.id === market_id) {
        result = product;
        break;
      } else if (product?.market_id?.name === 'Default') {
        result = product;
      }
    }
  }
  return result;
}

export function removeObjectFromArray(arr, key, value) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but got ${typeof arr}.`);
  }

  if (typeof key !== 'string') {
    throw new TypeError(`Expected a string for key, but got ${typeof key}.`);
  }

  const index = arr.findIndex((item) => item[key] === value);
  if (index !== -1) {
    const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
    arr.length = 0;
    newArray.forEach((item) => arr.push(item));
  }
}
