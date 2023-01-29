const inputs = Array.from(document.querySelectorAll('input'));
const form = document.querySelector('form');

inputs.forEach(input => {
    input.addEventListener("invalid", handleVerification);
    input.addEventListener('input', handleVerification)
})

function handleVerification(e) {
    if (e.type === "invalid") {
        e.target.setCustomValidity("Faut remplir là...")
    } else {
        e.target.setCustomValidity("")
    }
}

form.addEventListener('submit', handleForm);

function handleForm(e) {
    e.preventDefault();

    const newCookie = {}

    // Gestions des données
    inputs.forEach(input => {
        // Récuperation des attributs
        const nameAttribute = input.getAttribute("name");

        // Ajouts des valeurs des attributs dans l'objet newCookie
        newCookie[nameAttribute] = input.value;

        // Reset des inputs
        input.value = "";

    });

    // Expiration des cookies dans une semaine
    newCookie.expire = new Date(new Date().getTime() + 365 * 30 * 7 * 24 * 60 * 60 * 1000);
    
    // Créer un nouveau cookie 
    createCookie(newCookie);
}

function createCookie(newCookie) {

    // Vérifie si un cookie du même nom existe
    if (doesCookieExist(newCookie.name)) {
        createToast({name: newCookie.name, state: "modifié", color: "orange", emoji: "✏️"});
    }
    else {
        createToast({name: newCookie.name, state: "créer", color: "green", emoji: "✅"});
        // Si les cookies sont afficher alors créer directement une nouvelle box de cookie
        if (showCookies) createCookieElement(newCookie.name, newCookie.value);
    }

    // Création du cookie
    document.cookie = `${encodeURIComponent(newCookie.name)}=${newCookie.value}; expires=${newCookie.expire.toUTCString()}`;
}

function doesCookieExist(name) {
    // Permet de récuperer les cookies ensuite les supprimer les espaces ensuite retourner un tableau avec 'name=value' ensuite récuperer un tableau avec que les names
    const cookiesNames = document.cookie.replace(/\s/g, "").split(';').map(cookie => cookie.split('=')[0]);

    // Retourne si il y'a un cookie du même nom dans le tableau
    return cookiesNames.some(cookie => cookie === encodeURIComponent(name));
}


const toastContainer = document.querySelector('.toast_container');

function createToast({name, state, color, emoji}) {
    const toastElement = document.createElement("p");

    toastElement.className = "toast";
    toastElement.textContent = `${emoji} Cookie ${name} ${state}`;
    toastElement.style.borderLeft = `9px solid ${color}`;

    toastContainer.appendChild(toastElement);

    setTimeout(() => {
        toastElement.remove();
    }, 5000);
}


const showCookiesButton = document.querySelector('.show_cookie');
const sectionCookies = document.querySelector('.section_cookies');

showCookiesButton.addEventListener('click', displayCookies);

let lockText = false;
let showCookies = false

function displayCookies(e) {
    e.preventDefault();
    
    const cookies = document.cookie.replace(/\s/g, '').split(';').reverse();
    
    if (!cookies[0]) {
        if (lockText) return;
        
        lockText = true;
        sectionCookies.innerHTML = `<p class="no_cookies_text">Il n'y a aucun cookie pour le moment. Essayer d'en créer un !</p>`

        setTimeout(() => {
            sectionCookies.textContent = "";
            lockText = false;
        }, 1500)
    } 
    else {
        // Si les cookies sont afficher et qu'on clique sur le bouton "Cacher"
        if (showCookies) {
            showCookiesButton.textContent = "Afficher 🙉";
            sectionCookies.innerHTML = "";
            showCookies = false;
        }
        // Si les cookies ne sont pas afficher
        else {
            handleCookiesElement(cookies);
            
            showCookiesButton.textContent = "Cacher 🙈";
            showCookies = true;
        }
    }
}

function handleCookiesElement(cookies) {
    
    cookies.forEach(cookie => {
        const formatCookie = cookie.split('=');
        const cookieName = decodeURIComponent(formatCookie[0]);
        const cookieValue = formatCookie[1];
        
        createCookieElement(cookieName, cookieValue);
    });
}

function createCookieElement(cookieName, cookieValue) {
    const cookieElement = document.createElement('div');

    cookieElement.className = "cookie_element";
    cookieElement.innerHTML = `
        <button class="button_delete_cookie">X</button>

        <p class="text_cookie_element"><span class="span_cookie_element">Nom : </span> ${cookieName}</p>
        <p class="text_cookie_element"><span class="span_cookie_element">Valeur : </span> ${cookieValue}</p>
        `;

    // Ajoute au DOM la box du cookie
    sectionCookies.appendChild(cookieElement);

    // Name du cookie avec l'encodage URI
    const cookieNameURI = encodeURIComponent(cookieName);

    // Au click du bouton delete
    cookieElement.querySelector('.button_delete_cookie').addEventListener('click', e => {
        createToast({name: cookieName, state: "supprimé", color: "red", emoji: "❌"});

        document.cookie = `${cookieNameURI}=; expires=${new Date(0)}`;
        cookieElement.remove();
    })
}
