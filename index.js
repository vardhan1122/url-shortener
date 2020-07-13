const express = require ("express")
const mongoose = require("mongoose")
const app  = express()
const ShortUrl = require("./models/shortUrl")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))

// DB Config
const db = require("./config/keys").MongoURI

//Connect Mongo
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true })
.then(()=> console.log("Mongoo DB Connected..."))
.catch(err => console.log(err))

app.get("/", async (req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render("index", { shortUrls:shortUrls })
})

app.get("/:shortUrl", async(req,res) =>{
    const shortUrl = await ShortUrl.findOne({ short:req.params.shortUrl })
    if (shortUrl == null ) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
} )

app.post("/shortUrls", async(req,res) => {
    await ShortUrl.create({ full : req.body.fullUrl})
    res.redirect("/")
})

app.get("/delete/:id", async (req,res) => {
    await ShortUrl.findByIdAndDelete({_id:req.params.id})
    try{
        res.redirect('/')
    }catch(e){
        console.error(e)
    }
})



app.listen (process.env.PORT || 3000, () => console.log("server is up and running successfully"))