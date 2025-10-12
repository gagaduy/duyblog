<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối database
$conn = new mysqli("localhost", "root", "", "contact_form");
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Kiểm tra dữ liệu gửi bằng POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = $_POST['name'] ?? '';
    $email   = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // Chuẩn bị câu lệnh an toàn
    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        die("Lỗi prepare: " . $conn->error);
    }

    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    if ($stmt->execute()) {
        echo "✅ Tin nhắn đã được lưu thành công!";
    } else {
        echo "❌ Lỗi khi lưu: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Form chưa được gửi bằng POST.";
}

$conn->close();
?>