// let lastScrollTop = 0;
// const header = document.getElementById("mainHeader");

// window.addEventListener("scroll", function () {
//   const currentScroll = window.scrollY;

//   if (currentScroll > lastScrollTop && currentScroll > 50) {
//     // Scroll xuống
//     header.style.top = "-70px"; // Ẩn header
//   } else {
//     // Scroll lên
//     header.style.top = "0";
//   }

//   lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // tránh giá trị âm
// });

const header = document.getElementById("mainHeader");

// Ẩn mặc định khi load trang
header.style.top = "-80px";

window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 100) {
    // Khi cuộn xuống > 50px thì hiện navbar
    header.style.top = "0";
    // header.style.backgroundColor='transparent'
  } else {
    // Khi về đầu trang thì ẩn đi
    header.style.top = "-80px";
  }
});


