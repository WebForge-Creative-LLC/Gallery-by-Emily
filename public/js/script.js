// ---------------------------
// 🛍️ Shopping Cart Logic
// ---------------------------
let cart = {};

window.addToCart = function (priceId) {
  cart[priceId] = (cart[priceId] || 0) + 1;
  alert("Added to cart!");
};

window.checkout = function () {
  fetch("https://test-1-5w0d.onrender.com/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed");
      }
    })
    .catch((err) => {
      console.error("Error creating checkout session", err);
      alert("Checkout failed");
    });
};

// ---------------------------
// 📱 Mobile Menu Toggle
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
});

// ---------------------------
// 🔽 Smooth Scrolling
// ---------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ---------------------------
// 🌀 Scroll Animations
// ---------------------------
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75) {
      section.classList.add("fade-in");
    }
  });
});

// ---------------------------
// ✉️ Contact Form w/ EmailJS
// ---------------------------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    emailjs
      .sendForm("service_61l9a3d", "template_0zqk2c8", this)
      .then(() => {
        alert("Message sent!");
        this.reset();
      })
      .catch((error) => {
        console.error("FAILED...", error);
        alert("Error sending message.");
      });
  });
}
