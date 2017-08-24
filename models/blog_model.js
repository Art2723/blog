var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlogSchema = Schema(
  {
    blog_post_name: {type: String, required:true, max:100},
    blog_post_img: {type: String},
    blog_post: {type: String, required: true},
    blog_post_marked: {type: String, required: true},
    tags_post: {type: String, required: true, max: 100},
    date_of_creation: {type: Date, required: true},
    date_of_last_edit: {type: Date},
    deleted:{type:Boolean, default:false}
  }
);

// Virtual for blog's URL
BlogSchema
.virtual('url')
.get(function () {
  return '/all/' + this._id;
});

// Virtual for admin
BlogSchema
.virtual('url_edit')
.get(function () {
  return '/admin/all/' + this._id;
});

BlogSchema
.virtual('date_of_creation_formatted')
.get(function () {
  return moment(this.date_of_creation).format('MMMM Do, YYYY');
});

BlogSchema
.virtual('date_of_last_edit_formatted')
.get(function () {
  return moment(this.date_of_last_edit).format('MMMM Do, YYYY');
});

// // Virtual for array of tags
// BlogSchema
// .virtual('tags_list')
// .get(function () {
//   return this.tags_post.trim().slice(1).split('#');
// });

//Export model
module.exports = mongoose.model('Blog', BlogSchema);