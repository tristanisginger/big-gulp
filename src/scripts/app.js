/* eslint-disable no-unused-vars */
import jQuery from 'jquery'
window.$ = jQuery;
window.jQuery = $;

// import 'slick-carousel'
// require('bootstrap');
// require('bootstrap-select');

import HelloWorld from '../components/helloworld/helloworld.js'


$( document ).ready( function() {

  console.log('%cApplication initialised 🚀', 'color: #EA7600');

  const helloworld = new HelloWorld()
  
});
