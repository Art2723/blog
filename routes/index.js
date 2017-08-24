var app = require('../app');
var express = require('express');
var router = express.Router();
const Account = require('../models/account');
var passport = require('passport');
// Require controller modules
var blog_controller = require('../controllers/blogController');

/// ROUTES ///

/* GET request for creating post. NOTE This must come before route for id (i.e. display author) */
router.get('/admin/create', blog_controller.post_create_get);

/* POST request for creating post. */
router.post('/admin/create', blog_controller.post_create_post);

// GET request to admin main page
router.get('/admin/all', blog_controller.admin_main);

// GET request logout
router.get('/admin/logout', blog_controller.admin_logout);

/* GET request to delete post. */
router.get('/admin/:id/delete', blog_controller.post_delete_get);

/* GET request to restore post. */
router.get('/admin/:id/restore', blog_controller.post_restore_get);

/* GET request to update post. */
router.get('/admin/:id/update', blog_controller.post_update_get);

// POST request to update post
router.post('/admin/:id/update', blog_controller.post_update_post);

/* GET request to update post. */
router.get('/admin/:id/preview', blog_controller.post_preview_get);

/* GET request for one post. */
router.get('/admin/all/:id', blog_controller.post_admin_get);

router.get('/admin/all_tags', blog_controller.admin_all_tags);

/* GET request for tagged list. */
router.get('/admin/:id', blog_controller.admin_tagged_posts);


// GET request to admin login
router.get('/login', blog_controller.admin_get);

// POST request to admin login
router.post('/login', blog_controller.admin_post);

// GET request to admin signup
router.get('/signup', blog_controller.admin_signup_get);

// POST request to admin signup
router.post('/signup', blog_controller.admin_signup_post);

router.get('/all_tags', blog_controller.all_tags);

/* GET request for one post. */
router.get('/all/:id', blog_controller.post);

router.get('/all', blog_controller.blog);



/* GET request for list of tagged posts. */
router.get('/:id', blog_controller.tagged_posts);

/* GET request for list of all posts. */

router.get('/', blog_controller.blog);


module.exports = router ;