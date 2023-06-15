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
function createModalLinks() 
{
    //Add the button "modifier"
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];
    const buttonModify = document.createElement('a');
    editGallery.appendChild(buttonModify);

    buttonModify.outerHTML = `
        <a class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;
    
    const imagePresentationGallery = document.getElementById('image_presentation');
    const modifyImagePresentation = document.createElement('a');
    imagePresentationGallery.appendChild(modifyImagePresentation);

    modifyImagePresentation.outerHTML = `
    <a class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;

    const textPresentationGallery = document.getElementById('text_presentation');
    const modifyTextPresentation = document.createElement('a');
    textPresentationGallery.insertAdjacentElement('afterbegin', modifyTextPresentation);

    modifyTextPresentation.outerHTML = `
    <a class = "js-modal">
            <i class= "fa-regular fa-pen-to-square">
                <p>modifier</p>
            </i>
        </a> 
    `;
}
createModalLinks();

function createModal() {
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];

    let modal = document.createElement('aside');
    modal.setAttribute('id', 'modal-gallery');
    modal.classList.add('modal');

    modal.innerHTML = `
    <div class="modal_content js-modal-stop">
    </div>
    `;    

    modal.querySelector(".modal_content").addEventListener('click', (e) => {
        e.stopPropagation();
    });

    editGallery.appendChild(modal);
}

function mainModalContent() {
    let modalContent = document.querySelector('.modal_content');

    modalContent.innerHTML = `
        <button class= "js-modal-close">X</button> 
        <h3>Galerie photo</h3>
        <div class= "gallery gallery_modal"></div>
        <hr>
        <div class= "submit_gallery">
            <button class= "button_add-photo">Ajouter une photo</button>
            <button class= "button_delete">Supprimer la galerie</button>
        </div>
    `; 
    return modalContent;
}

function mainModal() {
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];
    const linksModify = document.querySelectorAll('.js-modal');

    //Add the modal content
    linksModify.forEach(link => link.addEventListener('click', () => {
        createModal();

        let modalContent = mainModalContent();
        let modal = document.querySelector(".modal");

        //Closing modal function
        modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal);
        
        getWorksFromApi().then( () => { 
            modal.style.display = null;
        });
        secondModal();
    }));
}

mainModal();

function closeModal(e)
{
    let modal = document.querySelector(".modal");

    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.remove();
}

function secondModalContent() {
    let modalContent = document.querySelector('.modal_content');

    modalContent.innerHTML = `
        <button class= "js-arrow"><i class= "fa-solid fa-arrow-left"></i></button>
        <button class= "js-modal-close">X</button> 
        <h3>Ajout photo</h3>
        <form class= "modal-addPhoto">
            <div class="photo-location">
                <i class="fa-regular fa-image"></i>
                <input type="file" id="photoInput" accept="image/jpeg, image/png" style="display: none">
                <label id="select-photo">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input type="text" id="title"></input>
            <label for="categories">Catégorie</label>
            <select name="categories" id="categories">
            </select>
        </form>
        <hr>
        <button class="button_validation-photo">Valider</button>
    `;
        
    return modalContent;
}
function secondModal() {
    //Open the second modal to add photos
    const addPhoto = document.querySelector('.button_add-photo');
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];

    addPhoto.addEventListener('click', () => {
        let modalContent = secondModalContent();
        modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal); 

        //Clic on arrow the reach the photo gallery modal
        const arrow = document.querySelector('.js-arrow').addEventListener('click',() => {
            let modalContent = mainModalContent();
    
        //Closing modal function
        modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal);
        
        getWorksFromApi();
        secondModal();
        }); 

        //Open the files to reach images on clic on the button
        const selectPhoto = document.getElementById('select-photo');
        selectPhoto.addEventListener('click', () => {
            const photoInput = document.getElementById('photoInput');
            photoInput.click();
        });
        const photoInput = document.getElementById('photoInput');
        photoInput.addEventListener('change', function() {
            const file = photoInput.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageSrc = e.target.result;   //content of the file
                displayImage(imageSrc);
            };

            reader.readAsDataURL(file);
        });

        function displayImage(imageSrc) {
            const newPhoto = document.querySelector('.photo-location');
            while (newPhoto.firstChild) {
                newPhoto.firstChild.remove();
            }
            const imageElement = document.createElement('img');
            imageElement.src = imageSrc;
            newPhoto.appendChild(imageElement);
            }
        //Get categories from the api
        getCategories();

        //Form submission 
        let validationButton = document.querySelector('.button_validation-photo');
        validationButton.addEventListener('click', function(event){
            event.preventDefault();

            const categories = document.getElementById('categories'); 
            const selectedCategory = categories.value;
            console.log(selectedCategory);

            const photoInput = document.querySelector('.photo-location').getElementsByTagName('img');

            const titleInput = document.getElementById('title'); 
            const enteredTitle = titleInput.value; 
            console.log(enteredTitle);

            // Create an object json containing the data to send
            const jsonData = {
                category: selectedCategory,
                image: selectedPhoto,
                title: enteredTitle
            };
            postWorkInApi(jsonData);
        })
    })
}


// POST request
function postWorkInApi(jsonData) {
    fetch('http://localhost:5678/api/categories/works', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête POST.');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        
        // Ajouter la nouvelle image à la galerie
        const gallery = document.querySelectorAll('.gallery');

        gallery.forEach(item => {
            const image = document.createElement('img');
            image.src = data.url;

            item.appendChild(image);
        });
    })
    .catch(error => {
        console.error(error);
    });
}

//Get categories of works from the API
let workCategories = [];

function getCategories() {
    fetch("http://localhost:5678/api/categories")
    .then (function(response) { 
        return response.json();
    })
    .then(function(json) {
        for (let category of json) 
        {
            workCategories.push(category.name);
        }
        
        const categoriesSelect = document.getElementById('categories');
        console.log(categoriesSelect);

        // Add a first empty
        const emptyOption = document.createElement('option');
        categoriesSelect.appendChild(emptyOption);

        workCategories.forEach(category => {
            const option = document.createElement('option');
            option.textContent = category;
            categoriesSelect.appendChild(option); 
        })
    })
    .catch(function(error) {
        console.log(error);
    })
}

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
        const figure = figuresInGalleryModal[i];
        const buttonTrash = document.createElement('button');
        
        figure.insertAdjacentElement('beforeend', buttonTrash);
        buttonTrash.outerHTML =`
        <button class= 'button_trash'>
            <i class= 'fa-regular fa-trash-can'></i>
        </button>
        `;
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

        console.log(token);
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
                    let figure = document.querySelector(".figure" + imageId);
                    figure.remove();
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
        if (confirm("Êtes-vous sûr de vouloir supprimer toutes les images ?")) {
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
                .then(function(response) {
                    // Remove all the project from the gallery
                    let figures = document.getElementById('portfolio').querySelectorAll('figure');
                    for (let i = 0; i < figures.length; i++)
                    {
                        figures[i].remove();
                    }
                })
                .catch(function(error) {
                    // Erreur lors de la requête
                    console.log('Erreur lors de la requête DELETE', error);
                });
            }
        }
    });
}

function getWorksFromApi() {
    return new Promise((resolve, reject) => {
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

            resolve();
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
}

getWorksFromApi();