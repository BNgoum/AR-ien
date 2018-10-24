var selectorBtnScroll = document.querySelectorAll('.btn-nav-bottom');

for (var i = 0 ; i < selectorBtnScroll.length ; i++) {
    selectorBtnScroll[i].addEventListener('click', scrollToEvent);
}

function scrollToEvent () {
    var nextSection = this.parentElement.nextElementSibling.getAttribute('id');
    console.log(nextSection)
    document.querySelector('#' + nextSection).scrollIntoView({ behavior: 'smooth' });
}