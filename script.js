const inputs = Array.from(document.querySelectorAll('input'));
const form = document.querySelector('form');

inputs.forEach(input => {
    input.addEventListener("invalid", handleVerification);
    input.addEventListener('input', handleVerification)
})

function handleVerification(e) {
    if (e.type === "invalid") {
        e.target.setCustomValidity("dz")
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
    console.log(newCookie)
}