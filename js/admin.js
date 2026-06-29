document
.getElementById("movieForm")
.addEventListener("submit", function(e){

e.preventDefault();

const movie = `
{
  id: "${id.value}",
  title: "${title.value}",
  year: ${year.value},
  runtime: ${runtime.value},
  rating: ${rating.value},
  genres: [${genres.value
    .split(",")
    .map(g=>`"${g.trim()}"`)
    .join(", ")}],
  director: "${director.value}",
  cast: ["Xplorer Guru"],
  language: "${language.value}",
  country: "${country.value}",
  license: "All rights reserved",
  synopsis: "${synopsis.value}",
  poster: "${poster.value}",

  videoType: "archive",
  videoId: "${videoId.value}",

  featured: ${featured.checked},
  trending: ${trending.checked},
},
`;

document.getElementById("output").value = movie;

});

document
.getElementById("copyBtn")
.addEventListener("click", ()=>{

const output =
document.getElementById("output");

output.select();

document.execCommand("copy");

alert("Movie code copied!");
});
