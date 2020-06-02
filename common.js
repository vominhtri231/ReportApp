function getAllData(data) {
  var arrayAllData = [];
  for (var i = 1; i <= data.length - 1; i++) {
    var object = {};
    object.row = i + 1;
    for (var j in data[i]) {
      if (data[0][j] !== "") {
        object[data[0][j]] = data[i][j];
      }
    }
    arrayAllData.push(object);
  }
  return arrayAllData;
}
