module.exports =function cleanObject(obj) {
  const result = { ...obj }; // copy để tránh sửa trực tiếp
  Object.keys(result).forEach(key => {
    if (result[key] === null || result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
}

