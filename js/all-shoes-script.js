// BỌC LẠI TOÀN BỘ CODE
window.onload = function () {
  // --- (firebaseConfig và khởi tạo db y như cũ) ---
  const firebaseConfig = {
    apiKey: "AIzaSyBwPNmF9kpCIJ3xKgLxjfbDHjuu87cdo2A",
    authDomain: "citi-shoes.firebaseapp.com",
    projectId: "citi-shoes",
    storageBucket: "citi-shoes.firebasestorage.app",
    messagingSenderId: "570106506940",
    appId: "1:570106506940:web:06e134b871a06b50532ab9",
    measurementId: "G-1CB1H6C4GX",
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  // --------------------------------------------------

  // 1. LẤY CÁC NÚT VÀ "KHUNG"
  const productContainer = document.getElementById("all-shoes-container");
  const btnSortPriceAsc = document.getElementById("sort-price-asc"); // M phải tự đặt ID này
  const btnSortPriceDesc = document.getElementById("sort-price-desc"); // M phải tự đặt ID này
  const btnSortNameAz = document.getElementById("sort-name-az"); // M phải tự đặt ID này

  const searchInput = document.getElementById("box-search");
  const searchButton = document.getElementById("submit-search");

  // 2. KHAI BÁO "KHO" TẠM
  let allProducts = [];

  //
  // ============= 3. HÀM "VẼ" (Render) =============
  //
  function renderProducts(productsArray) {
    if (!productContainer) return;

    productContainer.innerHTML = ""; // Xóa sạch card cũ

    if (productsArray.length === 0) {
      productContainer.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
      return;
    }

    // LẶP QUA MẢNG SẢN PHẨM (ĐÃ LỌC/SẮP XẾP)
    productsArray.forEach((product) => {
      const docId = product.id;
      const price = product.PRICE.toLocaleString("vi-VN");
      const mainImage = product.imageUrl;
      const productName = docId.replace(/-/g, " ").toUpperCase();
      let colorHtml = "";
      if (product.availableColors) {
        product.availableColors.forEach((hexCode) => {
          colorHtml += `<span style="background-color: ${hexCode}"></span>`;
        });
      }
      const detailLink = `/html/product-detail.html?id=${docId}`;

      // TẠO "CỘT" BÊN NGOÀI
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "col-6 col-xl-3 cl-center";

      // 🔥 "NHỒI" CODE HTML (BẢN ĐẦY ĐỦ 100%)
      cardWrapper.innerHTML = `
        <div class="card-shoes">
          <div class="container">
            <div class="row r-icon">
              <div class="icon-heart"><i class="bx bx-heart"></i></div>
              <div class="icon-cart"><i class="bx bx-cart"></i></div>
            </div>
            <div class="row r-img">
              <div class="csr2-img">
                <img src="${mainImage}" alt="${productName}" />
              </div>
            </div>
            <div class="row r-name-prime">
              <span>${productName}</span>
              <span>${price} VND</span>
            </div>
            <div class="row r-size-color-button">
              <div class="col-12" id="r-size">
                <div class="card-size">
                  <span>Size</span>
                  <span class="card-size-number">36 - 43</span> 
                </div>
              </div>
              <div class="col-3 card-color">
                <p>Color</p>
              </div>
              <div class="col-9 card-color">
                ${colorHtml} 
              </div>
              <div class="col-12 r-button">
                <a href="${detailLink}">
                  <button class="card-button">
                    <p>Xem chi tiết</p>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      // NHÉT "CỘT" VÀO "HÀNG"
      productContainer.appendChild(cardWrapper);
    });
  }

  //
  // ============= 4. GẮN "TAI NGHE" (KIỂM TRA AN TOÀN) =============
  //

  if (btnSortPriceAsc) {
    btnSortPriceAsc.addEventListener("click", () => {
      const sortedProducts = [...allProducts].sort((a, b) => a.PRICE - b.PRICE);
      renderProducts(sortedProducts);
    });
  }

  if (btnSortPriceDesc) {
    btnSortPriceDesc.addEventListener("click", () => {
      const sortedProducts = [...allProducts].sort((a, b) => b.PRICE - a.PRICE);
      renderProducts(sortedProducts);
    });
  }

  if (btnSortNameAz) {
    btnSortNameAz.addEventListener("click", () => {
      const sortedProducts = [...allProducts].sort((a, b) =>
        a.id.localeCompare(b.id)
      );
      renderProducts(sortedProducts);
    });
  }

  // NÚT TÌM KIẾM (ĐÃ VÁ LỖI)
  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      event.preventDefault(); // CHẶN TẢI LẠI TRANG
      if (!searchInput) return;
      const searchTerm = searchInput.value.toLowerCase();
      const filteredProducts = allProducts.filter((product) =>
        product.id.toLowerCase().includes(searchTerm)
      );
      renderProducts(filteredProducts);
    });
  }

  // NÚT ENTER (ĐÃ VÁ LỖI)
  if (searchInput) {
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // CHẶN TẢI LẠI TRANG
        if (searchButton) searchButton.click();
      }
    });
  }

  //
  // ============= 5. TẢI DATA LẦN ĐẦU (Hút data) =============
  //

  if (productContainer) {
    console.log("Đang tải TẤT CẢ sản phẩm...");
    db.collection("products")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          allProducts.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // "Vẽ" lần đầu với đầy đủ "kho"
        renderProducts(allProducts);
      })
      .catch((error) => {
        console.error("Lỗi rồi: ", error);
        productContainer.innerHTML = "Lỗi, không tải được data. (Mở F12 lên)";
      });
  } else {
    console.error("KHÔNG TÌM THẤY KHUNG CHÍNH (all-shoes-container)");
  }

  // Đóng cái "lồng" window.onload
};
