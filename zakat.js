// دوال تحميل HTML وتهيئة شريط التنقل
async function loadHTML(file, elementId) {
  try {
    const response = await fetch(file);
    const data = await response.text();
    const container = document.getElementById(elementId);
    container.innerHTML = data;

    if (file === "navbar.html") {
      initNavbar();
    }

    return true;
  } catch (error) {
    console.error("Error loading HTML:", error);
    return false;
  }
}

function initNavbar() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar")) {
      navLinks.classList.remove("active");
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  navLinks.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.querySelectorAll(".dropdown-toggle").forEach((item) => {
    item.addEventListener("click", function (e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const dropdown = this.parentNode;
        dropdown.classList.toggle("active");

        document.querySelectorAll(".dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.remove("active");
        });
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 992) {
      navLinks.classList.remove("active");
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", function () {
  loadHTML("navbar.html", "navbar-placeholder");
  loadHTML("footer.html", "footer-placeholder");
});

// سكريبت حساب الزكاة
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("zakatForm");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("resultPopup");
  const currencySelect = document.getElementById("currency");

  // نصاب الذهب والفضة بالشيكل (أسعار ثابتة اليوم)
  const GOLD_NISAB_GRAM = 85;
  const SILVER_NISAB_GRAM = 595;
  const GOLD_PRICE_PER_GRAM = 300;
  const SILVER_PRICE_PER_GRAM = 4;

  const CASH_NISAB = GOLD_NISAB_GRAM * GOLD_PRICE_PER_GRAM;

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const currencySymbol =
      currencySelect.selectedOptions[0].dataset.symbol || "";

    const cash = parseFloat(document.getElementById("cash").value) || 0;
    const gold = parseFloat(document.getElementById("gold").value) || 0;
    const silver = parseFloat(document.getElementById("silver").value) || 0;
    const investments =
      parseFloat(document.getElementById("investments").value) || 0;

    const totalAssets =
      cash + gold * GOLD_PRICE_PER_GRAM + silver * SILVER_PRICE_PER_GRAM + investments;

    form.reset();

    let resultHTML = "";
    if (totalAssets < CASH_NISAB) {
      resultHTML = `
        <h3>لا تجب عليك الزكاة</h3>
        <p style="color: #e74c3c; margin: 1rem 0; font-size: 1.1rem;">
          مجموع أموالك (<strong>${currencySymbol}${totalAssets.toFixed(2)}</strong>) 
          أقل من نصاب الزكاة (<strong>${currencySymbol}${CASH_NISAB.toLocaleString()}</strong>).
        </p>
        <p>لا يُشترط إخراج زكاة حتى يبلغ المال النصاب.</p>
      `;
    } else {
      const zakat = totalAssets * 0.025;
      resultHTML = `
        <h3>إجمالي الزكاة المستحقة</h3>
        <div class="total-amount">${currencySymbol}${zakat.toFixed(2)}</div>
        <a href="DonateNow.html?type=zakat" class="btn" style="margin-top: 1rem; display: inline-block;">
          <i class="fas fa-check-circle"></i> ادفع زكاتك الآن
        </a>
      `;
    }

    popup.innerHTML = resultHTML;
    overlay.classList.add("show");
    popup.classList.add("show");
  });

  overlay?.addEventListener("click", () => {
    overlay.classList.remove("show");
    popup.classList.remove("show");
  });
});

// تحديد نوع الصفحة قبل تحميل الشات بوت
window.pageType = "zakat";
