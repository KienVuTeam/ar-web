class HomeController{
    Index(req, res){
        res.send('fsag')
    }
    Action(req, res){
        res.send('sa')
    }
}

module.exports = new HomeController;