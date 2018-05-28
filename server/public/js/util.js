const fs = require('fs')

// calculate the center of obj model
const findCenter = function (filepath) {
  try {
    let data = fs.readFileSync(filepath)
    let x_sum = 0, y_sum = 0, z_sum = 0, v_num = 0;

    if (data === null) {
      return {x: 0, y: 0, z: 0}
    }

    let items = data.toString().split("\r\n")
    for (let i = 0; i < items.length; i++) {
      if (items[i].startsWith('v')) {
        let coordinates = items[i].split(' ')
        x_sum += Number(coordinates[1])
        y_sum += Number(coordinates[2])
        z_sum += Number(coordinates[3])
        v_num += 1
      }
    }
    return  {
      x: x_sum / v_num,
      y: y_sum / v_num,
      z: z_sum / z_sum
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  findCenter
}
