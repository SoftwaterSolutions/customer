export function objectToFormData(object) {
  const formData = new FormData();

  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(`${key}[]`, item);
        } else if (typeof item === 'string' || typeof item === 'number') {
          formData.append(`${key}[]`, item.toString());
        }
      });
    } else if (value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        formData.append(`${key}[]`, value[i]);
      }
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'string' || typeof value === 'number') {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

export function logFormData(formData) {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}
