import { getSelectionSize } from './utils';

let elementToPurchase;

export function reservePixels() {
   
    const modalHeight = 320;
    const modalWidth = 340;
    const modalMargin = 5;
    const selectedElements = $('.empty-square.selected').toArray();
    if (selectedElements.length > 0) {
        const elementSize = getSelectionSize(selectedElements);
        elementToPurchase = {
            width: elementSize.width,
            height: elementSize.height,
            offsetTop: Number(selectedElements[0].style.top.split('px')[0]),
            offsetLeft: Number(selectedElements[0].style.left.split('px')[0]),
            imageUrl: '',
            linkUrl: '',
            isEmpty: false,
            isReservation: true
        };

        let modalTop = elementToPurchase.height + elementToPurchase.offsetTop;
        let modalLeft = (elementToPurchase.width / 2) + elementToPurchase.offsetLeft;
        if(elementToPurchase.offsetTop > 500) {
          modalTop = modalTop - elementToPurchase.height - modalHeight - (modalMargin * 2);
        }
        if (elementToPurchase.offsetLeft > 500) {
          modalLeft = modalLeft - modalWidth;
        }
        $('.modal-start').addClass('hide-element');
        $('.modal-reserve').css( { left: modalLeft, top: modalTop } ).removeClass('hide-element');
    }
}

export function startReservation() {
    if (elementToPurchase) {
        window.parent.postMessage({ action: 'reserve', elementToPurchase }, '*');
        // TODO: validate captcha
        $('.modal-reserve').addClass('hide-element');
        $('.timer-reserve').removeClass('hide-element');
        const timer = $('.time');
        let startTime = 10*60; // 10 min
        const timerInterval = setInterval(()=> {
            if (startTime === 0) {
                clearInterval(timerInterval);
                // TODO: notify to user the time is over, hide timmer and free the squares
                global.cancelreservation();
                return;
            }
            --startTime;
            var minutes = Math.floor(startTime / 60);
            var seconds = startTime - minutes * 60;
            timer.html(str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2));
        }, 1000);
    } else {
        console.error('undefined elementToPurchase');
    }
}

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

