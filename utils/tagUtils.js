export const filterTagParams = (tags) => {
  return tags.map(({ name, _id }) => ({ name, _id }));
};
export const prepareTag = (name, tagsRes) => {
  if (tagsRes.data?.data?.tags?.length) {
    const { name: tagName, _id } = tagsRes.data?.data?.tags[0];
    return { name: tagName, _id };
  }
  return { name };
};
