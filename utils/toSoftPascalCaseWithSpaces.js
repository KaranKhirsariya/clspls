export const toSoftPascalCaseWithSpaces = (str) => {
  if(typeof str !== 'string'){
    return str
  }
  return str
    .toLowerCase()
    .replace(/(?:^|\s|_|\(|\-)(\w)/g, (substr, match) => substr.toUpperCase());
};
