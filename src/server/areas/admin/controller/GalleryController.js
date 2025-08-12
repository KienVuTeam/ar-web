class GalleryController{


    Index(req, res){
        // res.send('GalleryController Action: Index');
        res.render('admin/gallery/index',{layout: 'layout/layoutAdmin', title: 'Gallery'});
    }
    addImage(image) {
        this.gallery.push(image);
    }
    
    getImages() {
        return this.gallery;
    }
    
    clearGallery() {
        this.gallery = [];
    }
}

module.exports = new GalleryController(); 
