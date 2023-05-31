//Recover photos
const loginUrl = "login.html";

//const loginSelected = document.getElementsByTagName('a')[0];
const loginSelected = document.getElementById('buttonlogin');

//The user is not logged yet
let userLogged = false;

function displayProject(title, imageUrl, filter)
{
    const galleryApi = document.querySelectorAll(".gallery");

    galleryApi.forEach(gallery => {
        // Create HTML element for images
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figureCaption = document.createElement("figcaption");

        //Create class for figures 
        filter = filter.replace(/\s+/g, '').replace("&", "");
        figure.classList.add(filter);

        // Create hierarchy
        figure.appendChild(image);
        figure.appendChild(figureCaption);

        gallery.appendChild(figure);

        // give an image and a title to the created elements
        image.setAttribute("src", imageUrl);
        figureCaption.innerText = title;
    });
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

        //Adding text inside the bouton 
        buttonFilter.innerText = buttonText;

        //Adding filter on the main button
        if(i === 0)
        {
            buttonFilter.classList.add('filterselected');
        }

        const projectPlace = document.querySelector('.gallery');
        //Adding click and sort
        const projectsToHide = projectPlace.querySelectorAll('figure');

        buttonText = buttonText.replace(/\s+/g, '').replace("&", "");

        let projectsToShow;
        if (buttonText === 'Tous') {
            projectsToShow = projectPlace.querySelectorAll('figure');
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
            console.log(projectsToHide);
            for(let j = 0; j < projectsToHide.length; j++)
            {
                projectsToHide[j].style.display = "none";
            }
            console.log(projectsToShow);
            for(let k = 0; k < projectsToShow.length; k++)
            {
                projectsToShow[k].style.display = "block";
            }
            buttonFilter.classList.add('filterselected');
        });
    }
}

//Remove filters when login
function displayFilters(showFilters)
{
    const hideFilters = document.querySelector('.buttonfilter');

    if(showFilters)
    {
        hideFilters.style.display = "flex";
    }
    else
    {
        hideFilters.style.display = "none";
    }
}

//Display login or logout
function isLogged() 
{
    const token = localStorage.getItem("token");

    userLogged = Boolean(token); //If undefined, null return false, else return true
 
    //if connected, write logout
    if (userLogged) {
        loginSelected.innerText = 'logout';
    }
    //if deconnected, write login
    else {
        loginSelected.innerText = 'login';
    }
};

isLogged();

//AddEventListener to remove the token and deconect 
loginSelected.addEventListener('click', () => {
    if (loginSelected.innerText === 'logout') {
        localStorage.removeItem("token");
        isLogged();
        displayFilters(true);
    }
    else
    {
        window.location.href = loginUrl;
    }
});

//Add the modale 
function modale() 
{
    //Add the button "modifier"
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];
    const buttonModify = document.createElement('a');
    buttonModify.href = '#modal-gallery';
    buttonModify.classList.add('js-modal');
    buttonModify.innerText = 'modifier';
    editGallery.insertAdjacentElement('beforeend', buttonModify);

    //Add the modal
    const displayModal = document.createElement('aside');
    displayModal.setAttribute('id', 'modal-gallery');
    displayModal.classList.add("modal");
    displayModal.style.display ='none';
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal_content');
    modalContent.classList.add('js-modal-stop');
    buttonModify.insertAdjacentElement('afterend', displayModal);
    displayModal.insertAdjacentElement('beforeend', modalContent);

    //Add the button to close the modal
    const buttonCloseModal = document.createElement('button');
    buttonCloseModal.classList.add('js-modal-close');
    modalContent.insertAdjacentElement('beforeend', buttonCloseModal);
    buttonCloseModal.innerText = 'X';

    //Add the modal content
    const modalTitle = document.createElement('h3');
    modalTitle.innerText = 'Galerie photo';
    modalContent.insertAdjacentElement('beforeend', modalTitle);

    const galleryModal = document.createElement('div');
    galleryModal.classList.add("gallery");
    modalTitle.insertAdjacentElement('afterend',galleryModal);

    const hr = document.createElement('hr');
    galleryModal.insertAdjacentElement('afterend',hr );
    const divButtons = document.createElement('div');
    divButtons.classList.add('submit_gallery');
    hr.insertAdjacentElement('afterend', divButtons);
    const buttonAddPhoto = document.createElement('button');
    buttonAddPhoto.innerText = 'Ajouter une photo';
    buttonAddPhoto.classList.add('button_add-photo')
    divButtons.insertAdjacentElement('beforeend', buttonAddPhoto);
    const buttonDeleteGallery = document.createElement('button');
    buttonDeleteGallery.innerText = 'Supprimer la galerie';
    buttonDeleteGallery.classList.add('button_delete');
    buttonAddPhoto.insertAdjacentElement('afterend', buttonDeleteGallery);

    //Opening and closing modal function
    let modal = null;

    const openModal = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target.style.display = null;
        modal = target;
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
        console.log("OPEN");
        console.log(modal);
    };
    const closeModal = function (e) {
        e.preventDefault();
        modal.style.display = 'none';
        modal.removeEventListener('click', closeModal);
        modal = null;
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        console.log("CLOSE");
    }
    const stopPropagation = function (e) {
        e.stopPropagation();
    }
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });
}

modale();

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
    displayFilters(!userLogged); 
})
.catch(function(error) {
    console.log(error)
});