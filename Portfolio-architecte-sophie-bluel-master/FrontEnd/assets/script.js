//Récupérer les photos
const galleryApi = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
.then (function(response) { 
    return response.json();
})
.then(function(json) {
    console.log(json);

    for (let project of json) {
        
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figureCaption = document.createElement("figcaption");

        image.setAttribute("src", project.imageUrl);
        figureCaption.innerText = project.title;

        figure.appendChild(image);
        figure.appendChild(figureCaption);
        galleryApi.appendChild(figure);
    }

    let namesFilter = json.map(project => project.category.name); //Retourne la valeur des noms des filtres sous forme de liste
    console.log(namesFilter);

    let uniqueFilter = Array.from(new Set(namesFilter)); //Trier et stocker des valeurs uniques + retourner un tableau
    uniqueFilter.unshift("Tous");

    const filter = document.getElementById("portfolio");
    const positionInId = filter.getElementsByTagName("h2")[0];
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttonfilter");
    positionInId.appendChild(buttonDiv);

    for (let i =0; i < uniqueFilter.length; i++) 
    {
        let buttonText = uniqueFilter[i];

        //Création et position du bouton 
        const buttonFilter = document.createElement("button");
        buttonDiv.appendChild(buttonFilter);

        //Ajout du texte sur le bouton 
        buttonFilter.innerText = buttonText;
    }
});
