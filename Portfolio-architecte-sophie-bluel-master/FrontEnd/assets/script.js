let token;
//Recover photos
const loginUrl = "login.html";

const loginSelected = document.getElementById('buttonlogin');

//The user is not logged yet
let userLogged = false;

function displayProject(title, imageUrl, filter, id)
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

        //Create id for figures
        figure.classList.add("figure" + id);
        console.log(figure);

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

        //const projectPlace = document.querySelectorAll('.gallery')[1];
        const projectPlace = document.getElementById('gallery_home');

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

//Remove filters when login and add modal
function adminMode(isAdmin)
{
    const hideFilters = document.querySelector('.buttonfilter');
    const displayModal = document.querySelectorAll('.js-modal');
    const bodyBanner = document.querySelector('.banner');

    if(isAdmin)
    {
        hideFilters.style.display = "flex";
        displayModal.forEach(modal => {modal.style.display = "none"});
        bodyBanner.style.display = "none";
    }
    else
    {
        hideFilters.style.display = "none";
        displayModal.forEach(modal => {modal.style.display = "inline"});
        bodyBanner.style.display = "flex";
    }
}

//Display login or logout
function isLogged() 
{
    token = localStorage.getItem("token");

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
        adminMode(true);
    }
    else
    {
        window.location.href = loginUrl;
    }
});

//Add the modale 
function createModale() 
{
    //Add the button "modifier"
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];
    const buttonModify = document.createElement('a');
    editGallery.appendChild(buttonModify);

    buttonModify.outerHTML = `
        <a href= "#modal-gallery" class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;
    
    const imagePresentationGallery = document.getElementById('image_presentation');
    const modifyImagePresentation = document.createElement('a');
    imagePresentationGallery.appendChild(modifyImagePresentation);

    modifyImagePresentation.outerHTML = `
    <a href= "#modal-gallery" class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;

    const textPresentationGallery = document.getElementById('text_presentation');
    const modifyTextPresentation = document.createElement('a');
    textPresentationGallery.insertAdjacentElement('afterbegin', modifyTextPresentation);

    modifyTextPresentation.outerHTML = `
    <a href= "#modal-gallery" class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;

    //Add the modal content
    const displayModal = document.createElement('aside');
    displayModal.setAttribute('id', 'modal-gallery');
    displayModal.classList.add("modal");
    displayModal.style.display ='none';

    displayModal.innerHTML = `
    <div class=" modal_content js-modal-stop">
        <button class= "js-modal-close">X</button> 
        <h3>Galerie photo</h3>
        <div class= "gallery gallery_modal"></div>
        <hr>
        <div class= "submit_gallery">
            <button class= "button_add-photo">Ajouter une photo</button>
            <button class= "button_delete">Supprimer la galerie</button>
        </div>
    </div>
    `;
    editGallery.appendChild(displayModal);

    //Opening and closing modal function
    let modal = null;

    const openModal = function (e) {
        e.preventDefault();
        modal = document.querySelector(document.querySelector('.js-modal').getAttribute('href'));
        modal.style.display = null;
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    };
    const closeModal = function (e) {
        e.preventDefault();
        modal.style.display = 'none';
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        modal = null;
    }
    const stopPropagation = function (e) {
        e.stopPropagation();
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });
}
createModale();

//Add the black banner when connected
function topBanner() {
    const bannerPosition = document.querySelector('body');
    const banner = document.createElement('div');
    bannerPosition.insertAdjacentElement('afterbegin', banner);
    banner.outerHTML = `
    <div class= "banner">
        <div class= "banner_content">
            <button class= "button_edition"> 
                <i class= "fa-regular fa-pen-to-square">
                    <p>Mode édition</p>
                </i>
            </button>
            <button class= "button_publication">publier les changements</button>
        </div>
    </div>
    `;
}
topBanner();

function updateModale() 
{
    const figuresInGalleryModal = document.querySelector('.gallery_modal').getElementsByTagName('figure');
    const textGalleryModale = document.querySelector('.gallery_modal').getElementsByTagName('figcaption');

    for(let i = 0; i < figuresInGalleryModal.length; i++)
    {
        //Add the icone trash
        const buttonTrash = document.createElement('button');
        buttonTrash.classList.add('button_trash')
        const iconTrash = document.createElement('i');
        iconTrash.classList.add('fa-regular');
        iconTrash.classList.add('fa-trash-can');
        buttonTrash.appendChild(iconTrash);

        const figure = figuresInGalleryModal[i];
        figure.insertAdjacentElement('beforeend', buttonTrash); 
    }
    //Change the image text width "éditer"
    for(let i = 0; i < textGalleryModale.length; i++)
    {
        textGalleryModale[i].textContent = 'éditer';
    }
}

//Delete image when clic on trash
function modifyImages(ids) {
    const trashes = document.querySelectorAll('.button_trash');
    const deleteAll = document.querySelector('.button_delete');

    for (let i = 0; i < trashes.length; i++) {
        let trash = trashes[i];
        let imageId = ids[i];  

        trash.addEventListener('click', event => {
            // Request DELETE to the API
            fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(function(response) {
                if (response.ok) {
                    // Remove the project from the gallery
                    let figures = document.querySelectorAll(".figure" + imageId);
                    figures.forEach(figure => figure.remove());
                } else {
                    console.error('Erreur lors de la suppression')
                }
            })
            .catch(function(error) {
                // Erreur lors de la requête
                console.log('Erreur lors de la requête DELETE', error);
            });
        });
    }
    deleteAll.addEventListener('click', event => {
        for(let i = 0; i < ids.length; i++)
        {
            let imageId = ids[i];

            // Request DELETE to the API
            fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .catch(function(error) {
                // Erreur lors de la requête
                console.log('Erreur lors de la requête DELETE', error);
            });
        }

        // Remove all the project from the gallery
        let figures = document.getElementById('portfolio').querySelectorAll('figure');
        for (let i = 0; i < figures.length; i++) 
        {
            figures[i].remove();
        }
    });
}

fetch("http://localhost:5678/api/works")
.then (function(response) { 
    return response.json();
})
.then(function(json) {
    for (let object of json) 
    {
        displayProject(object.title, object.imageUrl, object.category.name, object.id);
    }

    let namesFilter = json.map(object => object.category.name); //Return the value of filters's name as a list

    let uniqueFilter = Array.from(new Set(namesFilter)); //Sort and store unique values ​​+ return an array
    uniqueFilter.unshift("Tous");

    let imagesId = json.map(image => image.id); //Return the value of id's images

    addFilters(uniqueFilter);
    adminMode(!userLogged); 
    updateModale();
    modifyImages(imagesId);
})
.catch(function(error) {
    console.log(error)
});