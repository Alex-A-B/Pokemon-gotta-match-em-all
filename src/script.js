// test linkages 

const para = document.createElement('p')
para.innerText = "General Kenobi"
document.getElementById("start").appendChild(para)

// test fetch and console log

fetch("https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id")
.then(response => response.json())
.then(obj => console.log(obj.data))


// render images