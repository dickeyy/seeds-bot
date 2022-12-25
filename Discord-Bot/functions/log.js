const fs = require('fs')

const log = async (logData) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    if (logData == null) {
        return
    }

    fs.appendFile('../logs/' + date + '.txt', logData, function (err) {
        if (err !== null) {
            fs.writeFile('./logs/' + date + '.txt', logData, function (err) {
                if (err) throw err;
            });
        }
    });

}

exports.log = log;