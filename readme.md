# Simple Blog on node, express and mongodb

Simple and easy to install node.js blog which allow markdown posts. 

## Getting Started

1. For this blog you must have MongoDB installed and running [locally](https://docs.mongodb.com/v3.4/installation/) or online (for example mLab.com)
2. Install node.js and npm
3. Clone/download this project
4. In project folder enter "npm install"
5. Edit "config.json" => insert your MongoDB path like this "mongodb://localhost/blogdb" or for ex. "mongodb://login:password@ds139342.mlab.com:39342/blogdatabase". You can also configure here your blog name etc.
6. In project folder enter "node bin/www"
7. In browser enter address "localhost:3000" and you must see the blog menu.
8. To make/edit/delete a post: in browser enter address "localhost:3000/login", login/password are admin/admin (you should change it). You can use markdown or html in your posts. To insert the picture in post name or in post body you must insert web URL or save the picture in folder "public/img" and insert the URL "/img/your_picture_filename". Deleted posts are marked like deleted in your database but not really deleted so you can recover it.
9. Menu customization: you can customize menu items in "config.json". The items names are equivalents of tags ('fun' shows all posts with '#fun' tag, you can use more than one tag in your post).
10. Comments adding (used disqus for ex.): register on [disqus](https://disqus.com/profile/signup/), in "views" folder edit: "layout.pug" and "post.pug" (follow the comments)
11. For view changing: edit "public/stylesheets/styles.css" or make your own css file and insert the path in "config.json"

## Deployment

This project was deployed on Digital Ocean using [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Disclaimer

This is my first real project in coding generally and on javascript/node.js in particular. I don't have any developer background. JS is my hobby and I've made this project because I didn't find free blog on Javascript/node.js (and of course for fun). I've used excellent tutorials on MDN and answers on stackoverflow. I'm sure many things are made wrong (not absolutely correct) and my code consists some unnecessary parts which haven’t been cleaned up after some experiments, but it works!!! :)
