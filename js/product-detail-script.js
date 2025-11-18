console.log("FILE CHI TIẾT ĐANG CHẠY...");

window.onload = function () {
  // 1. CẤU HÌNH FIREBASE
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

  // 2. LẤY ID TỪ URL
  // Ví dụ link là: .../product-detail.html?id=nike-jordan
  // Thì productId sẽ là "nike-jordan"
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // 3. LẤY CÁC KHUNG HTML
  const nameContainer = document.getElementById("sa-name");
  const costContainer = document.getElementById("sa-cost");
  const carouselContainer = document.querySelector(".carousel-inner");
  const colorContainer = document.getElementById("color-value");

  if (!productId) {
    alert("Lỗi: Không tìm thấy ID sản phẩm trên đường link!");
    return;
  }

  // 4. GỌI FIREBASE LẤY 1 SẢN PHẨM
  console.log("Đang tải sản phẩm ID:", productId);

  db.collection("products")
    .doc(productId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const product = doc.data();

        // --- VẼ TÊN & GIÁ ---
        nameContainer.textContent = doc.id.replace(/-/g, " ").toUpperCase();
        costContainer.textContent =
          product.PRICE.toLocaleString("vi-VN") + " VND";

        // --- VẼ MÀU SẮC ---
        let colorHtml = "";
        if (product.availableColors) {
          product.availableColors.forEach((hexCode) => {
            colorHtml += `<span class="color-dot" style="background-color: ${hexCode};" title="${hexCode}"></span>`;
          });
        }
        colorContainer.innerHTML = colorHtml;

        // --- VẼ ẢNH (SLIDER) ---
        let albumHtml = "";
        // Ưu tiên lấy từ album, nếu không có thì lấy imageUrl làm ảnh duy nhất
        const images = product.album || [product.imageUrl];

        if (images.length > 0) {
          images.forEach((imgUrl, index) => {
            const activeClass = index === 0 ? "active" : "";
            albumHtml += `
              <div class="carousel-item ${activeClass}">
                <img src="${imgUrl}" class="d-block w-100" alt="Ảnh giày">
              </div>
            `;
          });
          carouselContainer.innerHTML = albumHtml;
        }
      } else {
        nameContainer.textContent = "Sản phẩm không tồn tại";
        costContainer.textContent = "";
      }
    })
    .catch((error) => {
      console.error("Lỗi:", error);
    });
};
