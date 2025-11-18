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

  //
  // ============= KHỐI CODE CỦA SLIDE 1 (4 RẺ NHẤT) =============
  //

  const productContainer = document.getElementById("homepage-product-slider");

  if (productContainer) {
    db.collection("products")
      .orderBy("PRICE")
      .limit(4)
      .get()
      .then((querySnapshot) => {
        productContainer.innerHTML = ""; // Xóa "Loading"

        querySnapshot.forEach((doc) => {
          const product = doc.data();
          const docId = doc.id;
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

          const cardWrapper = document.createElement("div");
          // (Class cột cho Slide 1)
          cardWrapper.className = "col-6 col-xl-3 cl-center";

          // 🔥 CODE HTML ĐẦY ĐỦ 100% CỦA M
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
          productContainer.appendChild(cardWrapper);
        });
      })
      .catch((error) => {
        console.error("Lỗi slide 1 (Rẻ nhất): ", error);
      });
  } else {
    console.error("KHÔNG TÌM THẤY KHUNG SLIDE 1 (homepage-product-slider)");
  }

  //
  // ============= KHỐI CODE CỦA SLIDE 2 (3 ĐẮT NHẤT) =============
  //

  const expensiveProductContainer = document.getElementById(
    "expensive-product-slider"
  );

  if (expensiveProductContainer) {
    db.collection("products")
      .orderBy("PRICE", "desc")
      .limit(3)
      .get()
      .then((querySnapshot) => {
        expensiveProductContainer.innerHTML = ""; // Xóa "Loading VIP"

        querySnapshot.forEach((doc) => {
          const product = doc.data();
          const docId = doc.id;
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

          const cardWrapper = document.createElement("div");
          // (Class cột cho Slide 2 - t để 3 cột)
          cardWrapper.className = "col-6 col-xl-4 cl-center";

          // 🔥 CODE HTML ĐẦY ĐỦ 100% CỦA M
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
          expensiveProductContainer.appendChild(cardWrapper);
        });
      })
      .catch((error) => {
        console.error("Lỗi slide 2 (Đắt nhất): ", error);
        // (Lỗi này 99% là "Missing Index", m phải tạo Index
        // cho PRICE Descending như t chỉ)
      });
  } else {
    console.error("KHÔNG TÌM THẤY KHUNG SLIDE 2 (expensive-product-slider)");
  }

  // Đóng cái "lồng" window.onload
};
