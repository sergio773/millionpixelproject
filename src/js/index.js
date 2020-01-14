require('./select-tool');
require('../css/index.css');
require('../css/modal.css');
require('../css/timer.css');
require('./utils');
import { reservePixels, startReservation } from './reservation'

// when a message is received from the page code
window.onmessage = (event) => {
    switch (event.data.action) {
        case 'loadGridElements':
            loadGrid(event.data.imageElements);
            break;
        case 'add-element':
            const element = event.data.gridElement;
            global.reservedElement = element;
            const gridContainer = $('.grid-container');
            addReservedElement(element, gridContainer);
            removeSquaresOnElement(element);
            break;
        default:
            break;
    }

    if (event.data) {
        loadGrid(event.data);
    }
};

// global variables
global.reservationEnabled = false;
// TODO: store reserved element on session storage
global.reservedElement = undefined;

// golbal functions
global.seeOurCharities = function () {
    window.parent.postMessage({ action: 'see-charities' }, '*');
}

global.reservePixels = function () {
    reservePixels();
}

global.startReservation = function () {
    startReservation();
}

global.cancelreservation = function () {
    $('.timer-reserve').addClass('hide-element');
    if (global.reservedElement) {
        addSquaresOnElement(global.reservedElement,  $('.grid-container'));
        $(`#${global.reservedElement._id}`).remove();
        window.parent.postMessage({ action: 'cancel-reservation', id: global.reservedElement._id }, '*');
    }
    global.reservedElement = undefined;
}

function isFilled(square, imageElements) {
    if ( !imageElements || imageElements.length === 0) {
        return false;
    }
    return imageElements.some(element => {
        if (element.isReservation && isReservedElementExpired(element)) {
            return false;
        }
        const offSetLeftLast = element.width + element.offsetLeft;
        const offSetTopLast = element.height + element.offsetTop;
        const isInsideX = square.offsetLeft >= element.offsetLeft && square.offsetLeft < offSetLeftLast;
        const isInsideY = square.offsetTop >= element.offsetTop && square.offsetTop < offSetTopLast;
        return isInsideX && isInsideY;
    });
}

function loadGrid(imageElements) {
    let emptySquare = {
        width: 8,
        height: 8,
        imageUrl: '',
        isEmpty: true
    };
    const gridElements = [];

    // this for only to fill 10000 empty squares
    for (let row = 0; row < 100; row++) {
        for (let column = 0; column < 100; column++) {
            emptySquare.offsetLeft = column * 10;
            emptySquare.offsetTop = row * 10;
            if (!isFilled(emptySquare, imageElements)) {
                gridElements.push(_.clone(emptySquare));
            }
        }
    }

    const gridContainer = $('.grid-container');
    const resultGrid = gridElements.concat(imageElements);
    resultGrid.forEach(element => {
        if (element.isEmpty && !element.isReservation) {
            addEmptySquare(element, gridContainer);
        } else if (element.isReservation) {
            addReservedElement(element, gridContainer);
        } else {
            const imageElement = '<a href="' + element.linkUrl + '" target="_blank"><img style="" src="' + element.imageUrl + '"></a>'
            $('<div class="image-container" style="width: ' + element.width + 'px; height: ' + element.height + 'px; top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;">' + imageElement + '<div>').appendTo(gridContainer);
        }
    });
    $('.lds-roller').addClass('hide-element');
}

function addReservedElement(element, container) {
    if (isReservedElementExpired(element)) {
        return;
    }
    $(`<div id="${element._id}" class="reserved" style="width: ${element.width}px; height: ${element.height}px; top: ${element.offsetTop}px; left: ${element.offsetLeft}px;"><div>`).appendTo(container);
}

function addEmptySquare(element, container) {
    $(`<div class="empty-square ${element.offsetLeft}-${element.offsetTop}" style="width: ${element.width}px; height: ${element.height}px; top: ${element.offsetTop}px; left: ${element.offsetLeft}px;"><div>`).appendTo(container);
}

function isReservedElementExpired(element) {
    const currentTimeSeconds = new Date().getTime() / 1000;
    const maxReservationSeconds = 10 * 60;
    if (element.createdAt && (currentTimeSeconds - (new Date(element.createdAt).getTime() / 1000)) > maxReservationSeconds) {
        return true;
    }
    return false;
}

function removeSquaresOnElement(element) {
    let x = element.offsetLeft;
    let y = element.offsetTop;
    while (y < (element.offsetTop + element.height)) {
        while (x < (element.offsetLeft + element.width)) {
            $(`.empty-square.${x}-${y}`).remove();
            x = x + 10;
        }
        y = y + 10;
        x = element.offsetLeft;
    }
}

function addSquaresOnElement(element, container) {
    let x = element.offsetLeft;
    let y = element.offsetTop;
    while (y < (element.offsetTop + element.height)) {
        while (x < (element.offsetLeft + element.width)) {
            const emptySquare = {
                width: 8,
                height: 8,
                offsetTop: y,
                offsetLeft: x,
            };

            addEmptySquare(emptySquare, $('.grid-container'));
            x = x + 10;
        }
        y = y + 10;
        x = element.offsetLeft;
    }
}