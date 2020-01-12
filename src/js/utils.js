export function getSelectionSize(selectedElements) {
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
