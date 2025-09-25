const multer = require('multer')

const storage = multer.memoryStorage();
const fileFilter= (req, file, cb)=>{
    const allowedMines= [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel" // .xls
    ];

    if(allowedMines.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('only accept excel file'))
    }
}

const uploadExcelAthlete = multer({storage, fileFilter})
module.exports = uploadExcelAthlete;