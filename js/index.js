 // when a message is received from the page code
window.onmessage = (event) => {
    if (event.data) {
        loadGrid(event.data);
    }
};

// send message to the page code
function button_click() {
    window.parent.postMessage(document.getElementById("theMessage").value, "*");
}

function isFilled(square, imageElements) {
    return imageElements.some(element => {
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
            if (!isFilled(emptySquare, imageElements)){
                gridElements.push(_.clone(emptySquare));
            }
        }
    }

    const gridContainer = $('.grid-container');
    const resultGrid = gridElements.concat(imageElements);
    resultGrid.forEach(element => {
        if (element.isEmpty) {
            $('<div class="empty-square" style="width: ' + element.width + 'px; height: ' + element.height + 'px; top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;"><div>').appendTo(gridContainer);
        } else {
            const imageElement = '<a href="' + element.linkUrl + '" target="_blank"><img style="" src="' + element.imageUrl + '"></a>'
            $('<div class="image-container" style="width: ' + element.width + 'px; height: ' + element.height + 'px; top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;">' + imageElement + '<div>').appendTo(gridContainer);
        }
    });
    $('.lds-roller').addClass('hide-element');
}