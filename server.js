"use strict";
const express = require("express");
const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
app.get("/top50", (req, res) => {
  res.render("pages/top50.ejs", {
    title: "Top 50 Songs Streamed on Spotify",
    top50: top50,
  });
});

app.get("/top50/popular-artist", (req, res) => {
  let artistsCount = {};
  top50.forEach((song) => {
    if (song.artist in artistsCount) {
      artistsCount[song.artist]++;
    } else {
      artistsCount[song.artist] = 1;
    }
  });

  let mostPopurArtist = "";
  let artistAppearances = 0;

  Object.keys(artistsCount).forEach((artist) => {
    if (artistsCount[artist] > artistAppearances) {
      artistAppearances = artistsCount[artist];
      mostPopurArtist = artist;
    }
  });
  // Will ignore "featuring" other artists
  // Expecting Justin Bieber anyway
  let popular = top50.filter((song) => song.artist === mostPopurArtist);
  res.render("pages/top50.ejs", {
    title: "Most Popular Artist",
    top50: popular,
  });
});

app.get("/top50/song/:number", (req, res) => {
  let rank = parseInt(req.params.number);

  if (rank < 1 || rank > 50) {
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }

  let song = top50.find((x) => x.rank === rank);
  res.render("pages/selected.ejs", {
    title: "Song #" + rank,
    song: song,
  });
});

// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
