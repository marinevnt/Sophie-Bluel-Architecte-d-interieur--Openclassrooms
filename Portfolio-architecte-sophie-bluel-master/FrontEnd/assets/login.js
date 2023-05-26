const form = document.getElementsByTagName('form')[0];

const messageErrorEmail = document.createElement('span');
const messageErrorPassword  = document.createElement('span');
const spanEmail = document.getElementById('email');
const spanPassword = document.getElementById('pass');

spanEmail.insertAdjacentElement('afterend', messageErrorEmail);
spanPassword.insertAdjacentElement('afterend', messageErrorPassword);

// prevent form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const email = form.email.value;
    const password = form.pass.value;

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then (response => response.json())
    .then(data => {
        if (data.token) {
            // stores the token in local storage
            console.log(data.token);
            localStorage.setItem("token", data.token);
            // redirect the user to the homepage
            window.location.href = 'index.html';
        } 
        else {
            // displays an error message
            messageErrorEmail.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
            messageErrorPassword.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        }
    })
    .catch(error => console.log(error));
});

