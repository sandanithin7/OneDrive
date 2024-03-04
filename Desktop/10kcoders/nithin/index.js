const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('highlight');
  });
});

alert("nithin")