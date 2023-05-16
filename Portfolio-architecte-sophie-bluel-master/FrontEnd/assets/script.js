//Recover photos
const galleryApi = document.querySelector(".gallery");

function displayProject(title, imageUrl, filter)
{
    // Create HTML element
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figureCaption = document.createElement("figcaption");

    //Create class for figures 
    filter = filter.replace(/\s+/g, '').replace("&", "");
    figure.classList.add(filter);

    // Create hierarchy
    figure.appendChild(image);
    figure.appendChild(figureCaption);
    galleryApi.appendChild(figure);

    // give an image and a title to the created elements
    image.setAttribute("src", imageUrl);
    figureCaption.innerText = title;
}

function addFilters(filtersName)
{
    //Creation and position of the div containing buttons
    const filter = document.getElementById("portfolio");
    const positionInId = filter.getElementsByTagName("h2")[0];
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttonfilter");
    positionInId.insertAdjacentElement('afterend', buttonDiv);
    
    for (let i =0; i < filtersName.length; i++) 
    {
        let buttonText = filtersName[i];

        //Creation and position of boutons 
        const buttonFilter = document.createElement("button");
        buttonDiv.appendChild(buttonFilter);

        //Adding texte inside the bouton 
        buttonFilter.innerText = buttonText;

        //Adding filter on the main button
        if(i === 0)
        {
            buttonFilter.classList.add('filterselected');
        }

        //Adding click and sort
        const projectsToHide = document.querySelectorAll('figure');

        buttonText = buttonText.replace(/\s+/g, '').replace("&", "");

        let projectsToShow;
        if (buttonText === 'Tous') {
            projectsToShow = document.querySelectorAll('figure');
        }
        else {
            projectsToShow = document.querySelectorAll("." + buttonText);
        }


        buttonFilter.addEventListener('click', function () {
            const allButtons = document.querySelectorAll('.buttonfilter button');
            for (let l = 0; l < allButtons.length; l++) 
            {
                allButtons[l].classList.remove('filterselected');
            }

            for(let j = 0; j < projectsToHide.length; j++)
            {
                projectsToHide[j].style.display = "none";
            }

            for(let k = 0; k < projectsToShow.length; k++)
            {
                projectsToShow[k].style.display = "block";
            }
            buttonFilter.classList.add('filterselected');
        });
    }
}

fetch("http://localhost:5678/api/works")
.then (function(response) { 
    return response.json();
})
.then(function(json) {
    for (let object of json) 
    {
        displayProject(object.title, object.imageUrl, object.category.name);
    }

    let namesFilter = json.map(object => object.category.name); //Return the value of filters's name as a list

    let uniqueFilter = Array.from(new Set(namesFilter)); //Sort and store unique values ​​+ return an array
    uniqueFilter.unshift("Tous");

    addFilters(uniqueFilter);

});
