const Post = require("../model/Post");

class NewsController{
    //Action
    async Index(req, res){
        try{
            var post = await Post.find();
            res.render('pages/news', {title: "News", posts:post})
            // res.render('pages/news', {title: "News", posts:[post]})

        }catch(error){
            console.error("Error fetching posts:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new NewsController();