exports.convertTime = arr => {
  return arr.map(obj => {
    let newObj = { ...obj };
    newObj.created_at = new Date(newObj.created_at).toISOString();
    return newObj;
  });
};

exports.createRef = (arr, key, val) => {
  const refObj = {};
  arr.forEach(obj => {
    refObj[obj[key]] = obj[val];
  });
  return refObj;
};

exports.formatComments = (arr, ref) => {
  return arr.map(obj => {
    let newObj = { ...obj };
    newObj.article_id = ref[newObj.belongs_to];
    delete newObj.belongs_to;
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    return newObj;
  });
};
