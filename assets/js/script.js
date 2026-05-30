









const select = document.querySelector('select');
const button = document.querySelector('#main-button');
const input = document.querySelector('.main-input');

function logEvent(event) {
    console.log(event)
}

select.addEventListener('change', logEvent);
button.addEventListener('click', logEvent);
input.addEventListener('input', logEvent);