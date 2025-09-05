const adminRoute = require('./adminRoute')
const clientRoute = require('./clientRoute');
const testRoute = require('./testRoute')
const PageSettingEntity = require("../model/PageSetting");
//Dấu / đầu tiên giúp trình duyệt hiểu rằng đây là từ gốc domain, không phụ thuộc vào thư mục hiện tại.
function route(app){

    //mapping route admin
    app.use('/admin', adminRoute)
    //
    app.use('/test', testRoute)
    //mapping route client
    app.use('/', clientRoute)
    app.use('/', async (req, res)=>{
        res.send('Hello from server')
    })

}

module.exports = route;