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

    // this for only to fill 10000 empty squares
    for (let row = 0; row < 100; row++) {
        for (let column = 0; column < 100; column++) {
            emptySquare.offsetLeft = column * 10;
            emptySquare.offsetTop = row * 10;
            gridElements.push(_.clone(emptySquare));
        }
    }

    const gridContainer = $('.grid-container');
    gridElements.forEach(element => {
        if (element.isEmpty) {
            $('<div class="empty-square" style="width: ' + element.width + 'px; height: ' + element.height + 'px; top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;"><div>').appendTo(gridContainer);
        } else {
            // TODO: create image with link element
        }
    });
    $('.lds-roller').addClass('hide-element');
});