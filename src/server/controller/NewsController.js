const Post = require("../model/Post");

class NewsController{
    //Action
    async Index(req, res){
        try{
            var post = await Post.findById('6896ca1027bb8da2d4202346');
            // res.render('pages/news', {title: "News", post})
            res.render('pages/news', {title: "News", posts:[post]})

        }catch(error){
            console.error("Error fetching posts:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new NewsController();