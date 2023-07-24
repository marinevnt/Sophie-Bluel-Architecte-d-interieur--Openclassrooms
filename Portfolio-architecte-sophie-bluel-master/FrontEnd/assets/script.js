/**
 * Recover a project and display it
 * @param {string} title 
 * @param {string} imageUrl 
 * @param {string} filter 
 * @param {number} id 
 */
function displayProjects(projects) {
    const galleryApi = document.querySelectorAll(".gallery");
    galleryApi.forEach(gallery => gallery.innerHTML = "");

    for(let i = 0; i < projects.length; i++)
    {
        galleryApi.forEach(gallery => {
            // Create HTML element for images
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            const figureCaption = document.createElement("figcaption");

            //Create class for figures 
            let filter = projects[i].category.name.replace(/\s+/g, '').replace("&", "");
            figure.classList.add(filter);

            //Create id for figures
            figure.classList.add("figure" + projects[i].id);

            // Create hierarchy
            figure.appendChild(image);
            figure.appendChild(figureCaption);

            gallery.appendChild(figure);

            // give an image and a title to the created elements
            image.setAttribute("src", projects[i].imageUrl);
            figureCaption.innerText = projects[i].title;
        });
    }
}

/**
 * Add filters and sort projects on button click
 * @param {string} filtersName 
 */
function displayFilters(filtersName) {
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
        if(i === 0) {
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

/**
 * Adapt the user interface with filters, banner, buttons modify when login or logout
 * @param {Boolean} isConnected 
 */
async function updateUIOnAuthChanged(isConnected) {
    const modifyButtons = document.querySelectorAll('.js-modal');
    const bodyBanner = document.querySelector('.banner');
    const buttonLogin = document.getElementById('buttonlogin');

    let filters = await getCategoriesFromApi();
    displayFilters(["Tous", ...filters.map(category => {return category.name})]);

    const filtersButton = document.querySelector('.buttonfilter');

    if(isConnected)
    {
        buttonLogin.innerText = 'logout';
        bodyBanner.style.display = "flex";
        filtersButton.style.display = "none";
        modifyButtons.forEach(modifyButton => {modifyButton.style.display = "inline"});
        createModalLinks();
    }
    else
    {
        filtersButton.style.display = "flex";
        bodyBanner.style.display = "none";
        buttonLogin.innerText = 'login';
        modifyButtons.forEach(modifyButton => {modifyButton.style.display = "none"});
    }
}

/**
 * Check if the user is connected
 * @returns true if connected, false if not
 */
function isLogged() {
    let token = localStorage.getItem("token");
    return [Boolean(token), token]; //Return an array, if undefined, null return false, else return true
}

/**
 * Create and place the 3 links of modify button
 */
function createModalLinks() {
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

    addModalEventListener();
}

/**
 * Create the structure of the modal with <aside> and <div>
 */
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

/**
 * Create the content of the first modal
 * @returns modalContent
 */
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

/**
 *  Add eventListener on the button modifier to open and close the modal
 */
function addModalEventListener() {
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];
    const linksModify = document.querySelectorAll('.js-modal');

    //Add the modal content
    linksModify.forEach(link => link.addEventListener('click', async () => {
        createModal();

        let modalContent = mainModalContent();
        let modal = document.querySelector(".modal");

        //Closing modal function
        modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal);
        
        let works = await getWorksFromApi();
        displayProjects(works);
        updateModal();
        modifyImages(works.map(work => {return work.id}));
        modal.style.display = null;
        
        secondModal();
    }));
}

/**
 * Remove the eventListener to close the modal
 */
function closeModal() {
    let modal = document.querySelector(".modal");

    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.remove();
}

/**
 * Create the content of the second modal
 * @returns modalContent
 */
function secondModalContent() {
    let modalContent = document.querySelector('.modal_content');

    modalContent.innerHTML = `
        <button class= "js-arrow"><i class= "fa-solid fa-arrow-left"></i></button>
        <button class= "js-modal-close">X</button> 
        <h3>Ajout photo</h3>
        <form class= "modal-addPhoto">
            <div class="photo-location">
                <i class="fa-regular fa-image"></i>
                <input name="image" type="file" id="photoInput" accept="image/jpeg, image/png" style="display: none">
                <label id="select-photo">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input name ="title" type="text" id="title"></input>
            <label for="categories">Catégorie</label>
            <select name="category" id="categories">
            </select>
        </form>
        <hr>
        <button type="submit" class="button_validation-photo">Valider</button>
    `;
        
    return modalContent;
}

/**
 * Open the second modal and make it functional
 */
function secondModal() {
    //Open the second modal to add photos
    const addPhoto = document.querySelector('.button_add-photo');
    const editGallery = document.getElementById('portfolio').getElementsByTagName('h2')[0];

    addPhoto.addEventListener('click', async () => {
        let modalContent = secondModalContent();
        modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal); 

        //Clic on arrow the reach the photo gallery modal
        const arrow = document.querySelector('.js-arrow').addEventListener('click',async () => {
            let modalContent = mainModalContent();
    
            //Closing modal function
            modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal);
            
            let works = await getWorksFromApi();
            displayProjects(works);
            updateModal();
            modifyImages(works.map(work => {return work.id}));

            secondModal();
        }); 

        ReachimagesForModal();

        //Get categories of works from the API
        let workCategories = await getCategoriesFromApi();
        displayCategories(workCategories);

        submissionOfTheForm();
    })
}
/**
 * Select photo on file with an addEventListener on button add photo
 */
function ReachimagesForModal() {
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
}

/**
 * Add the photo on the modal
 * @param {string} imageSrc 
 */
function displayImage(imageSrc) {
    const newPhoto = document.querySelector('.photo-location');
    let children = newPhoto.children;

    for (let i = 0; i < children.length; i++) {
        children[i].style.visibility = 'hidden';
        children[i].style.display = 'none';
    }

    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    newPhoto.appendChild(imageElement);
    }

/**
 * Allow the form submission
 */
function submissionOfTheForm() {
    let form = document.querySelector('.modal-addPhoto');
    let buttonForm = document.querySelector('.button_validation-photo');

    form.addEventListener('input', () => {
        if( handleForm() !== null) 
        {
            buttonForm.classList.add('button_validation-photo--green');
        }
        else 
        {    
            buttonForm.classList.remove('button_validation-photo--green');
        }
    })

    buttonForm.addEventListener('click', async function(event) {
        event.preventDefault();

        let formData = handleForm(); //Get form data

        if(formData !== null) {
            let modalContent = mainModalContent();
        
            //Closing modal function
            modalContent.querySelector('.js-modal-close').addEventListener('click', closeModal);
            
            await postWorkInApi(formData);
    
            let works = await getWorksFromApi();
            displayProjects(works);

            updateModal();
            modifyImages(works.map(work => {return work.id}));

            secondModal();
        }
        else {
            alert("Veuillez remplir tous les champs du formulaire.");
            return;
        }
    })
}

/**
 * Retrieve data of the form (image, title and category) and check if inputs are filled in
 * @returns formData object if all inputs are filled, or null if any input is missing.
 */
function handleForm() {
    // Get inputs values 
    let imageInput = document.getElementById('photoInput');
    let titleInput = document.getElementById('title');
    let categoryInput = document.getElementById('categories');

    // Create a new FormData object
    let formData = new FormData();

    // Add the image
    let imageFile = imageInput.files[0];
    if(imageFile === undefined)
    {
        return null;
    }
    formData.append('image', imageFile); 

    // Get the title
    let title = titleInput.value;
    if(title === "")
    {
        return null;
    }
    formData.append('title', title); 

    // Get the category
    let category = categoryInput.value;
    if(category === "")
    {
        return null;
    }
    formData.append('category', category);

    return formData;
}


/**
 * Post request to add a photo in Api and gallery
 * @param {string} formData 
 */
async function postWorkInApi(formData) {
    let response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la requête POST.');
    }
}

/**
 * Get categories from the Api
 * @returns Array workCategories
 */
async function getCategoriesFromApi() {
    let workCategories = [];

    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const json = await response.json();

        for (let category of json) 
        {
            workCategories.push({name: category.name, id: category.id});
        }

        return workCategories;
    } 
    catch(error)
    {
        console.log(error);
    }
}

/**
 * Display categories in form
 * @param {string} categories 
 */
function displayCategories(categories) {
    const categoriesSelect = document.getElementById('categories');

    // Add a first empty
    const emptyOption = document.createElement('option');
    emptyOption.hidden = true;
    categoriesSelect.appendChild(emptyOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoriesSelect.appendChild(option); 
    })
}
/**
 * Creation of the black banner 
 */
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
 /**
  * Add the icon trash in the gallery modal and change the title of images
  */
function updateModal() 
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

/**
 * Delete image when clic on trash and delete all images when clic on the button
 * @param {number} ids 
 */
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

/**
 * Get title, imageUrl, category and id from the API
 * @returns Array
 */
async function getWorksFromApi() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const json = await response.json();

        let projects = []; 
        for (let object of json) 
        {
            projects.push({
                title:object.title,
                imageUrl:object.imageUrl,
                category: object.category,
                id: object.id
            });
        }

        return projects;
    }
    catch(error) {
        console.log(error);
    };
}

//EXECUTIF
let token = localStorage.getItem("token");

//Recover photos
const loginUrl = "login.html";
const loginSelected = document.getElementById('buttonlogin');

topBanner();

//Check if the user is logged
[userLogged, token] = isLogged();

//AddEventListener to remove the token and deconnect 
loginSelected.addEventListener('click', () => {
    if (userLogged) {
        localStorage.removeItem("token");
        userLogged = false;
        updateUIOnAuthChanged(userLogged);
    }
    else
    {
        window.location.href = loginUrl;
    }
});

console.log(userLogged);

(async () => {
    let works = await getWorksFromApi();
    displayProjects(works);

    updateUIOnAuthChanged(userLogged);
})();
