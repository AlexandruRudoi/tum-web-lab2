const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
function closeMobileMenu() { mobileMenu.classList.add('hidden'); }

const mascotPin = document.getElementById('mascot-pin');
const mascotTooltip = document.getElementById('mascot-tooltip');
mascotPin.addEventListener('mouseenter', () => mascotTooltip.classList.remove('hidden'));
mascotPin.addEventListener('mouseleave', () => mascotTooltip.classList.add('hidden'));
mascotPin.addEventListener('click', () => window.location.hash = '#contact');
