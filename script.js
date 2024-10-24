const modal = document.getElementById('myModal');
const span = document.getElementsByClassName("close")[0];
const modalMessage = document.getElementById('modal-message');
const notificationSound = document.getElementById('notification-sound');

// Modal tổng đơn hàng
const summaryModal = document.getElementById('summaryModal');
const closeSummary = document.getElementsByClassName("close-summary")[0];
const summaryMessage = document.getElementById('summary-message');

// Mảng chứa các món ăn và giá
const dishes = {
    "Sinh Tố": {
        "-- Sinh Tố --": 0,
        "Sinh Tố Bơ": 25000,
        "Sinh Tố Dâu Tây": 25000,
        "Sinh Tố Mãng Cầu": 25000,
        "Sinh Tố Dâu Chuối": 20000,
        "Sinh Tố Chanh Tuyết Bạc Hà trân châu": 20000,
        "Sinh Tố Chuối": 20000,
        "Sinh Tố Đu đủ": 15000,
        "Sinh Tố Chanh Leo": 15000,
        "Sinh Tố Dưa Lưới": 15000,
        "Sinh Tố Chanh Tuyết Bạc Hà": 15000,
        "Sinh Tố Chanh tuyết": 15000,
    },
    // Các loại đồ uống khác...
};

// Thay đổi món ăn và giá khi loại trà được chọn
document.getElementById('dish-type').addEventListener('change', function () {
    const dishSelect = document.getElementById('dish');
    dishSelect.innerHTML = ""; // Xóa nội dung hiện tại của danh sách món ăn
    
    const selectedType = this.value;
    if (selectedType && dishes[selectedType]) {
        for (const [item, price] of Object.entries(dishes[selectedType])) {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            dishSelect.appendChild(option);
        }
    }
});

// Hiển thị giá khi món ăn được chọn
document.getElementById('dish').addEventListener('change', function () {
    updatePrice();
});

// Cập nhật giá tổng khi số lượng thay đổi
document.getElementById('quantity').addEventListener('input', function () {
    updateTotalPrice();
});

function updatePrice() {
    const selectedDish = document.getElementById('dish').value;
    const selectedType = document.getElementById('dish-type').value;
    const price = selectedType ? (dishes[selectedType][selectedDish] || 0) : 0;
    document.getElementById('price').innerText = `Giá: ${price} VNĐ`;
    updateTotalPrice(); // Cập nhật tổng giá khi giá món ăn thay đổi
}

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value) || 0; // Chuyển đổi sang số nguyên
    const selectedDish = document.getElementById('dish').value;
    const selectedType = document.getElementById('dish-type').value;

    const price = selectedType ? (dishes[selectedType][selectedDish] || 0) : 0;
    const totalAmount = price * quantity;
    document.getElementById('total-price').innerText = `Tổng: ${totalAmount} VNĐ`;
}

document.getElementById('order-button').addEventListener('click', function() {
    const name = document.getElementById('name').value; // Lấy giá trị trường Họ và Tên
    const dishType = document.getElementById('dish-type').value; // Lấy loại trà
    const dish = document.getElementById('dish').value; // Lấy món ăn
    const price = document.getElementById('price').value || 0; // Lấy giá
    const quantity = document.getElementById('quantity').value; // Lấy số lượng
    const totalAmount = price * quantity; // Tính tổng số tiền

    // Cập nhật thông báo tổng đơn hàng
    summaryMessage.innerText = `Bạn đã chọn món: ${dish}\nSố lượng: ${quantity}\nThành tiền: ${totalAmount} VNĐ`;
    summaryModal.style.display = "block"; // Hiện modal tổng đơn hàng
});

closeSummary.onclick = function () {
    summaryModal.style.display = "none"; // Đóng modal tổng đơn hàng
}

document.getElementById('confirm-button').addEventListener('click', function () {
    const form = document.getElementById('order-form');
    var formData = new FormData(form);

    fetch('https://script.google.com/macros/s/AKfycbzd2Q5dLiMbETrc4pIL29_X8w2xPIChaQz9FKS0C6BCN_dyUoh6_YCnrkQPmkluDMK_mQ/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // Phát âm thanh thông báo
        notificationSound.play();

        // Thiết lập thông điệp cho modal thành công
        modalMessage.innerText = `Bạn đã đặt hàng thành công sản phẩm: ${formData.get('dish')} (Số lượng: ${formData.get('quantity')})`;
        form.reset(); // Làm trống form sau khi gửi
        summaryModal.style.display = "none"; // Đóng modal tổng đơn hàng
        modal.style.display = "block"; // Hiện modal đặt hàng thành công
    })
    .catch(error => console.error(error));
});

// Hủy đơn hàng
document.getElementById('cancel-button').addEventListener('click', function () {
    summaryModal.style.display = "none"; // Đóng modal tổng đơn hàng
});

// Khi người dùng nhấn vào nút đóng (×), đóng modal
span.onclick = function () {
    modal.style.display = "none";
}

// Khi người dùng nhấn vào bất kỳ đâu bên ngoài modal, đóng modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == summaryModal) {
        summaryModal.style.display = "none"; // Đóng modal tổng đơn hàng nếu nhấp ra ngoài
    }
}