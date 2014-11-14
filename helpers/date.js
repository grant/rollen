// returns the next Saturday's date from today
exports.nextSaturday = function(callback) {
  var d = new Date();

  switch (d.getDay()) {
    case 0: d.setDate(d.getDate() + 6);
    break;

    case 1: d.setDate(d.getDate() + 5);
    break;

    case 2: d.setDate(d.getDate() + 4);
    break;

    case 3: d.setDate(d.getDate() + 3);
    break;

    case 4: d.setDate(d.getDate() + 2);
    break;

    case 5: d.setDate(d.getDate() + 1);
    break;

    case 6: d.setDate(d.getDate() + 7);
    break;
  }

  callback(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
}
