
import messageSerice from './message-service';

var imageObserver;
function setExpiration(cookieLife) {
    const today = new Date();
    const expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000).toUTCString();
    return expr;
}
function setCookie(name, value, expires = null, path = '/') {
    let cookieStr = `${name}=${value};`;
    let expireDate = new Date().toUTCString();
    if (expires) {
        expireDate = new Date(expires).toUTCString();
    } else {
        expireDate = setExpiration(1);
    }
    cookieStr += `expires=${expireDate};`;
    if (path) {
        cookieStr += ` path=${path};`;
    }
    document.cookie = cookieStr;
}


function getCookie(name) {
    const nameLenPlus = (name.length + 1);
    return document.cookie
        .split(';')
        .map(c => c.trim())
        .filter(cookie => {
            return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
        .map(cookie => {
            return cookie.substring(nameLenPlus);
        })[0] || "{}";
}
function deleteCookie(name) {
    this.setCookie(name, '', -1);
}

function loadPages() {
    const lazyloadImages = document.querySelectorAll(".product_img_details");
    if (imageObserver) {
        imageObserver.disconnect();
    }

    imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var image = entry.target;
                const elementIndex = image.getAttribute("product_index") - 1;
                messageSerice.sendMessage('element_entry', { element: 'product_img_details', elementIndex });
                // imageObserver.unobserve(image);
            }
        }, { threshold: 1 });
    });


    lazyloadImages.forEach(function (image) {
        imageObserver.observe(image);
    });
}



export default {
    setCookie,
    getCookie,
    deleteCookie,
    loadPages
}
