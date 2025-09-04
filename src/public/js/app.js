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

// 
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link=>{
  link.addEventListener("click", function(el){
    //
    navLinks.forEach(item=>item.classList.remove("active"))
    // 
    this.classList.add("active")
  })
})
