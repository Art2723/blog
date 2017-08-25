var Blog = require('../models/blog_model');
var config = require('../config');
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');
var marked = require('marked');
var moment = require('moment');

// Display all posts
exports.blog = function(req, res, next) {
  Blog.find({deleted:false})
    .sort({date_of_creation: -1})
    .exec(function (err, list_posts) {
      if (err) return next(err);
      var pages = Math.ceil(list_posts.length/config.view.posts_on_page);//how many pages
      if (list_posts.length>config.view.posts_on_page) 
        // if page param undifined then equal 0 or it can be 2,3 and so on (-1 used to make 1,2 and so on)
        {list_posts=list_posts.splice((req.query.page?(req.query.page-1):0)*config.view.posts_on_page, config.view.posts_on_page);};
      //Successful, so render
      res.render('index', {config:config.view,  title: 'all', posts_list: list_posts, page:req.query.page, pages:pages});
    });
    
};

// Display tagged posts
exports.tagged_posts = function(req, res, next) {
    Blog.find(
      //{tags_list:req.params.id},
      {tags_post:{"$regex":"#"+req.params.id+'(#|$| )+'}, deleted:false})
    .sort({date_of_creation: -1})
    .exec(function (err, list_posts) {
      if (err) { return next(err); }
      var pages = Math.ceil(list_posts.length/config.view.posts_on_page);//how many pages
      if (list_posts.length>config.view.posts_on_page) 
        // if page param undifined then equal 0 or it can be 2,3 and so on (-1 used to make 1,2 and so on)
      {list_posts=list_posts.splice((req.query.page?(req.query.page-1):0)*config.view.posts_on_page, config.view.posts_on_page);};
      //Successful, so render
      res.render('index', {config:config.view,  title: req.params.id, posts_list: list_posts, page:req.query.page, pages:pages, tag:req.params.id});
    });
};

// Display detail page for a specific post
exports.post = function(req, res, next) {
    Blog.findOne({_id:req.params.id, deleted:false})
    .exec(function(err, post) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('post', {config:config.view,  post: post } );
     });

};



// Display post create form on GET
exports.post_create_get = function(req, res) {
    res.render('admin_create', {config:config.view,  title: 'Create',  });
};

// Handle post create on POST
exports.post_create_post = function(req, res, next) {
  if (req.body.submit =='Ok'){
      var post= new Blog({  
        blog_post_name: req.body.name,
        blog_post_img: req.body.img,
        blog_post_marked: req.body.post,
        blog_post: marked(req.body.post),
        tags_post: req.body.tags,
        date_of_creation: new Date(),
        deleted: req.body.check_deleted||false //if uncheked => req.body returns undefined =>false, if checked => it returns true
      });
        post.save(function (err, cb) {
        if (err) return next(err);
        res.redirect('/admin/all');     
        }); 
  } else if (req.body.submit =='Preview'){
        preview.blog_post_name = req.body.name;
        preview.blog_post_img= req.body.img;
        preview.blog_post= marked(req.body.post);
        preview.tags_post= req.body.tags;
        preview.date_of_creation= moment(new Date()).format('MMMM Do, YYYY');
        res.redirect('/admin/'+req.params.id+'/preview'); 
  } else {
        res.redirect('/admin/all');     
  }
};

// Display post delete form on GET
exports.post_delete_get = function(req, res, next) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) return next(err);
    blog.deleted = true;
    blog.save(function (err, updated) {
      if (err) return next(err);
      res.redirect('/admin/all');
    });
  });
};

// Display post restore form on GET
exports.post_restore_get = function(req, res, next) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) return next(err);
    blog.deleted = false;
    blog.save(function (err, updated) {
      if (err) return next(err);
      res.redirect('/admin/all');
    });
  });
};

// Display post update form on GET
exports.post_update_get = function(req, res, next) {
    Blog.findById(req.params.id)
    .exec(function(err, post) {
      if (err) return next(err); 
      //Successful, so render
      res.render('admin_create', {config:config.view,  title: 'Edit', name: post.blog_post_name, post: post.blog_post_marked, tags: post.tags_post, img:post.blog_post_img, deleted:post.deleted, date:post.date_of_creation_formatted });
     });
};

// Handle post update on POST
exports.post_update_post = function(req, res, next) {
  if (req.body.submit =='Ok'){
    Blog.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        post.blog_post_name= req.body.name;
        post.blog_post_img= req.body.img;
        post.blog_post_marked = req.body.post,
        post.blog_post= marked(req.body.post);
        post.tags_post= req.body.tags;
        post.date_of_last_edit= new Date();
        post.deleted = req.body.check_deleted||false; //if uncheked => req.body returns undefined =>false, if checked => it returns true
        post.save(function (err, cb) {
        if (err) return next(err);
        res.redirect('/admin/all');     
        }); 
    });
  } else if (req.body.submit =='Preview'){
        preview.blog_post_name = req.body.name;
        preview.blog_post_img= req.body.img;
        preview.blog_post= marked(req.body.post);
        preview.tags_post= req.body.tags;
        preview.date_of_creation= req.body.date;
        preview.date_of_last_edit= moment(new Date()).format('MMMM Do, YYYY');
        res.redirect('/admin/'+req.params.id+'/preview'); 
  } else {
        res.redirect('/admin/all');     
  }

};


// Display post update form on GET
exports.post_preview_get = function(req, res, next) {
      res.render('admin_post_preview', {config:config.view,  title: 'Preview', 
        blog_post_name: preview.blog_post_name,
        blog_post_img: preview.blog_post_img,
        blog_post: preview.blog_post,
        tags_post: preview.tags_post,
        date_of_creation_formatted: preview.date_of_creation,
        date_of_last_edit_formatted: preview.date_of_last_edit
        
     });
   // })
 };

// Display admin login GET
exports.admin_get = function(req, res, next) {
    res.render('admin_login', {config:config.view,  title: 'Login',  });
};

// Handle admin login POST
exports.admin_post = function(req, res, next) {
  passport.authenticate('local',{
            successRedirect : '/admin/all', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })(req, res, next);
};

exports.post_admin_get = function(req, res, next) {
      Blog.findById(req.params.id, function (err, post) {
        if (err) return next(err);
      }).exec(function (err, post) {
      //Successful, so render
        res.render('admin_post', {config:config.view,  post: post, id: req.params.id, deleted: post.deleted })
      });
};


// Display admin login GET
exports.admin_logout = function(req, res) {
	  req.logout();
    res.redirect('/');
};

// Display admin main
exports.admin_main = function(req, res, next) {
      Blog.find({})
      .sort({date_of_creation: -1})
      .exec(function (err, list_posts) {
      if (err) { return next(err); }
      var pages = Math.ceil(list_posts.length/config.view.posts_on_page);//how many pages
      if (list_posts.length>config.view.posts_on_page) 
        // if page param undifined then equal 0 or it can be 2,3 and so on (-1 used to make 1,2 and so on)
      {list_posts=list_posts.splice((req.query.page?(req.query.page-1):0)*config.view.posts_on_page, config.view.posts_on_page);};
      //Successful, so render
      res.render('admin_index', {config:config.view,  title: 'Admin panel', posts_list: list_posts, page:req.query.page, pages:pages});
    })
};

// Display tagged posts
exports.admin_tagged_posts = function(req, res, next) {
    Blog.find(
      //{tags_list:req.params.id},
      {tags_post:{"$regex":"#"+req.params.id+'(#|$| )+'}})
    .sort({date_of_creation: -1})
    .exec(function (err, list_posts) {
      if (err) { return next(err); }
      var pages = Math.ceil(list_posts.length/config.view.posts_on_page);//how many pages

      if (list_posts.length>config.view.posts_on_page) 
        // if page param undifined then equal 0 or it can be 2,3 and so on (-1 used to make 1,2 and so on)
      {list_posts=list_posts.splice((req.query.page?(req.query.page-1):0)*config.view.posts_on_page, config.view.posts_on_page);};
      //Successful, so render
            res.render('admin_index', {config:config.view,  title: req.params.id, posts_list: list_posts, page:req.query.page, pages:pages, tag:req.params.id});
    });
};

//---------------------
// Display admin login GET
exports.admin_signup_get = function(req, res, next) {
    res.render('admin_signup', {config:config.view, title: 'Change Password/Login' })
};

// Handle admin login POST
exports.admin_signup_post = function(req, res, next) {
   Account.find({}).remove().exec(function (err){ // we find all accounts (must be only one but who knows? lets delete em all) delete and make new one
     if (err) return next(err);
     Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
          if (err) {
            return res.render('admin-login', { error : err.message });
          }
          passport.authenticate('local')(req, res, () => {
              req.session.save((err) => {
                  if (err) {
                      return next(err);
                  }
              });
          });
        res.redirect('/');     
    });
  })
};

//--------------------------

// tags with fast method to make uniq elements via obj
exports.all_tags = function(req, res, next) {
  Blog.find({deleted:false}, 'tags_post')
    .exec(function (err, list_posts) {
      if (err) {return next(err)};
      var arr=[];
      for (var i=0; i<list_posts.length; i++) {
          arr=arr.concat(list_posts[i].tags_post.trim().slice(1).split('#'));
      };
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true; // save string as obj
      };
      arr= Object.keys(obj); 
      res.render('all_tags', {config:config.view, title: 'all_tags', tags_list:arr});
    });
    
};

exports.admin_all_tags = function(req, res, next) {
  Blog.find({deleted:false}, 'tags_post')
    .exec(function (err, list_posts) {
      if (err) {return next(err)};
      var arr=[];
      for (var i=0; i<list_posts.length; i++) {
          arr=arr.concat(list_posts[i].tags_post.trim().slice(1).split('#'));
      };
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true; // save string as obj
      };
      arr= Object.keys(obj); 
      res.render('admin_all_tags', {config:config.view, title: 'all_tags', tags_list:arr});
    });
    
};

// temp object for preview fields
var preview = {};


