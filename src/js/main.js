import  {Swiper,  Autoplay, EffectFade, Navigation, Pagination, Thumbs } from 'swiper';
const swiper = new Swiper('.karaoke-slider', {
    modules: [Navigation, Pagination],
    direction:"horizontal",
    loop:true,
    pagination:{
        el: ".swiper-pagination",
        clickable: true,
        bulletClass: 'swiper-pagination-bullet karaoke-slider-bullet'
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
});

let ourHalls = document.getElementById("halls");


const pageWidth = document.documentElement.scrollWidth;
if (pageWidth<=750){
  let sliderToInsert = document.querySelector(".gallery");
  let hallSlider = document.querySelector('.karaoke__items');
  document.querySelector(".karaoke-slider").insertBefore(sliderToInsert, hallSlider);
  let reservationPag = document.querySelector(".reservation-top .swiper-button-wrapper");
  document.querySelector(".reservation .swiper").after(reservationPag);
}

let dots = document.querySelectorAll(".karaoke-slider-bullet");

let text = 'HALL №';
let k=0;
const bullets = Array.from(dots);

let burgerMenu = document.querySelector(".header__menu-btn");
burgerMenu.addEventListener("click", function(){
    document.querySelector(".header__nav-wrapper").classList.toggle("header__nav-wrapper--active");
    document.querySelector(".overlay").classList.toggle("overlay--active");
    document.querySelector(".header").classList.toggle("header--grey");
    document.querySelector(".header__menu-btn").classList.toggle("header__menu-btn--active");
  })

dots.forEach(element => {
    k+=1
    element.textContent = text+k;
});

    let currentSlide = document.querySelector(".karaoke__item.swiper-slide-active").getAttribute('data-swiper-slide-index=') + 1;
    let counter = document.createElement("span");
    counter.innerHTML = currentSlide;
    counter.classList.add("swiper-counter");
    let NumOfPages = document.createElement("span");
    NumOfPages.innerHTML = k;
    let of = document.createElement("span");
    of.textContent = " из ";
    of.classList.add("swiper-counter-all");
    NumOfPages.classList.add('swiper-counter-all');
    let swiperNextBtn = document.getElementsByClassName('swiper-button-next')[0];
    let wrapper = swiperNextBtn.parentNode;
    wrapper.insertBefore(counter, swiperNextBtn);
    wrapper.insertBefore(of, swiperNextBtn);
    wrapper.insertBefore(NumOfPages, swiperNextBtn);
    let numOfHall = document.querySelector(".karaoke-slider__pagination");
    numOfHall.addEventListener('click', function(event){
        let arrOfDots = Array.from(dots);
        var index = parseInt(arrOfDots.indexOf(event.target))+1;
        if (~index){
          counter.innerHTML = index;
        }
      });

let elements = document.querySelectorAll('.swiper-button');
elements.forEach( el => {
    el.addEventListener("click", () => {
    counter.textContent = parseInt(document.querySelector(".karaoke__item.swiper-slide-active").getAttribute('data-swiper-slide-index'))  + 1;
    })
});
var galleryThumbs = new Swiper(".gallery-thumbs", {
  slidesPerView: 5,
  slideToClickedSlide:true,
  freeMode: true,
  loop:true,
  watchSlidesProgress: true,
});
var galleryTop = new Swiper(".gallery-top", {
  modules:[Thumbs],
  spaceBetween: 10,
  thumbs: {
    swiper: galleryThumbs,
  },
  
});


  var reservation = new Swiper(".swiper.reservation-slider", {
    modules: [Navigation, Pagination],
    spaceBetween:106,
    slidesPerView: 5,
    centeredSlides:true,
    navigation: {
      nextEl: '.reservation-button-next',
      prevEl: '.reservation-button-prev',
    },
    pagination:{
      el:'.swiper-button-wrapper .swiper-pagination',
      type:'fraction',
  },
    breakpoints:{
      320:{
        slidesPerView: 'auto',

      },
      361:{
      slidesPerView: 1,
      },
      531:{
      slidesPerView: 2,
      },
      851:{
      slidesPerView: 3,
      },
      1251:{
        slidesPerView:5,
      }
    },
  });
  let current = document.querySelector(".reservation .swiper-pagination-current");
  let total = document.querySelector(".reservation .swiper-pagination-total");
  let stepPagination =  document.querySelector(".reservation .swiper-pagination-fraction");
  stepPagination.innerHTML="";
  stepPagination.append(current);
  let ofStep = document.createElement("span");
  ofStep.textContent =  ' из ';
  stepPagination.append(ofStep);
  stepPagination.append(total);

  document.querySelector(".reservation .swiper-pagination-fraction").style.color = "#606571";
  document.querySelector(".reservation .swiper-pagination-current").style.cssText = "color:#FFF; font-size:24px;";

  let questions = document.querySelectorAll(".quiz__item");
  questions.forEach( el => {
    el.addEventListener("click", () =>{
      el.classList.toggle("quiz__item--active");
    });
  });

  if (pageWidth<=360){
    let newFooter = document.querySelector(".header__nav-wrapper").cloneNode(true);
    document.querySelector(".footer__inner .logo").after(newFooter);
    document.querySelector(".footer__inner .header__nav-wrapper").classList.toggle("footer__wrapper");

  }

  let flag = 0;
  window.addEventListener("resize" , function(event){
    if (this.document.documentElement.scrollWidth <= 360){
      flag=1;
    };
    if (flag == 1 && this.document.documentElement.scrollWidth > 360){
      this.document.querySelector(".footer__wrapper").remove();
    }
  });

  document.querySelector('.scroll__link').onclick = () => {
    window.scrollTo(pageYOffset, 0);
}