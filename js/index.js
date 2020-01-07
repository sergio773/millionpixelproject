 // when a message is received from the page code
 window.onmessage = (event) => {
    if (event.data) {
        document.getElementById("theLabel").innerHTML = event.data;
    }
};

// send message to the page code
function button_click() {
    window.parent.postMessage(document.getElementById("theMessage").value, "*");
}

function isFilled(square, imageElements) {
    imageElements.some(element => {
        const offSetLeftLast = element.width - 10;
        const offSetTopLast = element.height -10;
        const isInsideX = square.offsetLeft >= element.offsetLeft && square.offsetLeft <= offSetLeftLast;
        const isInsideY = square.offsetTop <= element.offsetTop && square.offsetTop >= offSetTopLast;
        return isInsideX && isInsideY;
    });
}
//add grid elements
document.addEventListener('DOMContentLoaded', function (event) {
    const gridRowSize = 100;
    const gridColumnSize = 100;
    let offsetTop = 0;
    let offsetLeft = 0;
    let emptySquare = {
        width: '8',
        height: '8',
        imageUrl: '',
        isEmpty: true
    };
    const gridElements = [];//Should get from db
    const imageElements = [
        {
            width: '100',
            height: '100',
            offsetTop: '10',
            offsetLeft: '10',
            imageUrl: 'https://dummyimage.com/100x100/red/0011ff&text=customer+image',
            isEmpty: false
        }
    ];

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
            // TODO: create image with link element
        }
    });
    $('.lds-roller').addClass('hide-element');
});