let lastScrollTop = 0;
const header = document.getElementById("mainHeader");

window.addEventListener("scroll", function () {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScrollTop && currentScroll > 50) {
    // Scroll xuống
    header.style.top = "-70px"; // Ẩn header
  } else {
    // Scroll lên
    header.style.top = "0";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // tránh giá trị âm
});
