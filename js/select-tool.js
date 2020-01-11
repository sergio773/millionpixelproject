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
        $('.modal-start').remove();
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
        // TODO: Show modal depending on where purchase is located to avoid scroll on iframe
        const modalTop = elementToPurchase.height + elementToPurchase.offsetTop; // This shows modal at bottom of the selection
        const modalLeft = (elementToPurchase.width / 2) + elementToPurchase.offsetLeft;
        const gridContainer = $('.grid-container');
        $('<div class="modal-start" style="width: 300px; height: 300px; top: ' + modalTop + 'px; left: ' + modalLeft + 'px;"><div>').appendTo(gridContainer);

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