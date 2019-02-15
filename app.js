// jshint esversion:6

// requires
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let playerScore = 0;

// express setup
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set("view engine", "ejs");

// mongodb setup
mongoose.connect("mongodb://localhost:27017/simonDB", {
  useNewUrlParser: true
});

// schema
const playerSchema = new mongoose.Schema({
  playerName: String,
  playerScore: Number
});

// collection model
const Player = mongoose.model('Player', playerSchema);


//routes
app.get("/", function(req, res) {
  res.render('index');
});

app.get("/game", function(req, res) {
  playerScore = 0;
  res.render('game');
});



app.post("/result", function(req, res) {
  console.log("received POST request on /results");
  playerScore = req.body.score;
  res.render("result", {
    playerScore: playerScore
  });
});


app.get("/leaderboard-individual", function(req,res){
  Player.find({}).sort({"playerScore": "desc"}).limit(10).exec(function(err, docs){
    if (docs) {
      res.render("leaderboard-individual", {
        foundPlayers: docs,
      });
    }
  });
});

app.get("/leaderboard/:playerId", function(req, res) {
  console.log("received get request on /leaderboard/playerId");
  const playerId = req.params.playerId;
  let playerRank;
  let player;

  Player.findOne({_id: playerId}, function(err, foundPlayer){
    player = foundPlayer;

    Player.find({}).sort({
      playerScore: "desc",
    }).exec(function(err, foundPlayers) {
      if (foundPlayers) {
        playerRank = foundPlayers.findIndex(x => x._id.toString() === playerId.toString()) + 1;
      }

      Player.find({}).sort({"playerScore": "desc"}).limit(10).exec(function(err, docs){
        if (docs) {
          res.render("leaderboard", {
            foundPlayers: docs,
            playerRank: playerRank,
            playerName: player.playerName,
            playerScore: player.playerScore
          });
        }
      });
    });
  });
});

app.post("/leaderboard", function(req, res) {
  console.log("received POST request on /leaderboard");
  const newRecord = new Player({
    playerName: req.body.playerName,
    playerScore: playerScore
  });
  newRecord.save();
  setTimeout(function(){
    res.redirect(`/leaderboard/${newRecord._id.toString()}`);
  }, 500);

});





app.listen(3000, function() {
  console.log("Server is listening on port 3000!");
});
