$(document).ready(function () {
    // TODO: draw selection rectangle
    // Initialize selectionjs
    const selection = Selection.create({

        // Class for the selection-area
        class: 'selection',

        // All elements in this container can be selected
        selectables: ['.grid-container > .empty-square'],

        // The container is also the boundary in this case
        boundaries: ['.grid-container']
    }).on('start', ({ inst, selected, oe }) => {

        // Remove class if the user isn't pressing the control key or ⌘ key
        if (!oe.ctrlKey && !oe.metaKey) {

            // Unselect all elements
            for (const el of selected) {
                el.classList.remove('selected');
                inst.removeFromSelection(el);
            }

            // Clear previous selection
            inst.clearSelection();
        }

    }).on('move', ({ changed: { removed, added } }) => {
        $('.modal-start').addClass('hide-element');
        // Add a custom class to the elements that where selected.
        for (const el of added) {
            el.classList.add('selected');
        }

        // Remove the class from elements that where removed
        // since the last selection
        for (const el of removed) {
            el.classList.remove('selected');
        }

    }).on('stop', ({ inst }) => {
        inst.keepSelection();
        showModalToStart();
    });
});

function showModalToStart() {
    const modalHeight = 300;
    const modalWidth = 300;
    const modalMargin = 5;
    const selectedElements = $('.empty-square.selected').toArray();
    if (selectedElements.length > 0) {
        const elementSize = getSelectionSize(selectedElements);
        const elementToPurchase = {
            width: elementSize.width,
            height: elementSize.height,
            offsetTop: Number(selectedElements[0].style.top.split('px')[0]),
            offsetLeft: Number(selectedElements[0].style.left.split('px')[0]),
            imageUrl: '',
            linkUrl: '',
            isEmpty: false
        };

        let modalTop = elementToPurchase.height + elementToPurchase.offsetTop;
        let modalLeft = (elementToPurchase.width / 2) + elementToPurchase.offsetLeft;
        if(elementToPurchase.offsetTop > 500) {
          modalTop = modalTop - elementToPurchase.height - modalHeight - (modalMargin * 2);
        }
        if (elementToPurchase.offsetLeft > 500) {
          modalLeft = modalLeft - modalWidth;
        }
        $('.modal-start').css( { left: modalLeft, top: modalTop } ).removeClass('hide-element');
    }
}

function getSelectionSize(selectedElements) {
    let columns = 0;
    let lines = 0;
    const originTop = selectedElements[0].style.top;
    const originLeft = selectedElements[0].style.left;
    selectedElements.forEach(element => {
        if (originLeft === element.style.left) {
            ++lines;
        }
        if (originTop === element.style.top) {
            ++columns;
        }
    });
    return {
        width: columns * 10,
        height: lines * 10
    };
}
