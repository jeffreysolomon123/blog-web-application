import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));


const uploadsDir = path.join(__dirname, 'uploads');

let postCount = 0;


import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);  // Directory to store uploaded files
    },

        filename: function (req, file, cb) {
        postCount+=1;
        cb(null, postCount + path.extname(file.originalname));  // Naming the file
    }
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let allPosts = [];

app.get("/", (req, res) => {
    res.render("index", { allPosts:allPosts });
});

app.get("/post", (req, res) => {
    res.render("newPost");
});





app.post("/submit1", upload.single('formFile'), (req, res) => {
    const title = req.body.pheading;
    const content = req.body.pcontent;
    const file = req.file;


    const newPost = {
        t: title,
        c: content,
        f: file ? '/uploads/' + file.filename : 'No file uploaded',
    };



    allPosts.push(newPost);

    res.redirect("/");
});





app.get("/edit", (req, res) => {
    res.render("editPost", { allPosts: allPosts });
});



//deleting the post
app.post("/deletePost/:index", (req,res) => {
    const index = req.params.index;
    if (index >= 0 && index < allPosts.length) {
        allPosts.splice(index,1);
    }
    res.redirect("/edit");
});
app.get("/editInner", (req,res)=>{
    res.render("editInner");
})


app.get("/editPost/:index", (req,res) =>{
    const index = req.params.index;
    const post = allPosts[index];
    res.render("editInner", {post: post, index:index});
});

//update the post

app.post("/updatePost/:index", upload.single('formFile'),(req,res)=>{
    const index = req.params.index;
    const updatedTitle = req.body.pheading;
    const updatedContent = req.body.pcontent;
    const file = req.file;

    allPosts[index].t = updatedTitle;
    allPosts[index].c = updatedContent;
    if(file){
        allPosts[index].f = '/uploads/' + file.filename;
    }

    res.redirect("/edit")
});

//view the post

app.get("/viewPost/:index",(req,res)=>{
    const index = req.params.index;
    const post = allPosts[index];
    res.render("viewPost.ejs", {post: post});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
