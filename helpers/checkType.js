export const checkUrlFileType = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return 'pdf';
  } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
    return 'image';
  } else {
    return 'Unknown';
  }
};
