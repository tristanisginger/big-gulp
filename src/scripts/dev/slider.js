var heroSlider = $('.hero-slider');
if(heroSlider){
$('.hero-slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    speed: 3100,
  autoplaySpeed: 4000,
  });
}