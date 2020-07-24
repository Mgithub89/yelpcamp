var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "USer",
		},
		username: String,
	}
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;