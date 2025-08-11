const testRoute = require('./test')
const adminRoute = require('./adminRoute')
const clientRoute = require('./clientRoute');
//Dấu / đầu tiên giúp trình duyệt hiểu rằng đây là từ gốc domain, không phụ thuộc vào thư mục hiện tại.
function route(app){

    //mapping route admin
    app.use('/admin', adminRoute)

    //mapping route client
    // app.use('/', testRoute);
    app.use('/', clientRoute)
    app.use('/', (req, res)=>{
        res.render('pages/home', {title: "Trang chu"});//admin/news/form-create-category
    })

}

module.exports = route;