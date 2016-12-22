var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public')
    }/*,
    filename: function(req, file, cb){

    }*/
});

//添加配置文件到muler对象。
var upload = multer({
	storage: storage
});

module.exports = upload;