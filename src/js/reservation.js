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
        $('.modal-start').addClass('hide-element');
        $('.modal-reserve').css( { left: modalLeft, top: modalTop } ).removeClass('hide-element');
    }
}

export function startReservation() {
    if (elementToPurchase) {
        console.log('element to reserve ', elementToPurchase);
        $('.modal-reserve').addClass('hide-element');
        $('.timer-reserve').removeClass('hide-element');
        const timer = $('.time');
        let startTime = 10*60; // 10 min
        setInterval(()=> {
            --startTime;
            var minutes = Math.floor(startTime / 60);
            var seconds = startTime - minutes * 60;
            timer.html(minutes + ':' + seconds);
        }, 1000);
        // TODO: format left 0 on seconds
        // TODO: stop interval on 0 and set as free reserved squares
        // TODO: validate captcha
        // TODO: set element as reserved and block for other users
    } else {
        console.error('undefined elementToPurchase');
    }
}