

class TestController {
    Index(req, res){
        // res.send('TestController Action: index');
        // res.render("pages/home", {title: "hello"})
        res.send('TestController Action: Index');
    }   
    Action2(req, res){
        res.send('TestController Action: Action2')
    } 
}

module.exports = new TestController;