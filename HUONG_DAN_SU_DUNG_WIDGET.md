# Hướng Dẫn Sử Dụng ChatBox Widget

Tài liệu này giúp bạn tích hợp widget chat vào trang web của mình. Không cần kiến thức lập trình chuyên sâu.

---

## Phần 1: Xác Định Trường Hợp Sử Dụng

Widget hỗ trợ **3 trường hợp chính**. Hãy đọc mô tả bên dưới để xác định bạn thuộc trường hợp nào.

### Trường Hợp 1: Standalone (Độc lập)

**Mô tả:**
Widget hoạt động hoàn toàn độc lập. Người dùng sẽ đăng nhập trực tiếp vào widget bằng tài khoản Microsoft.

**Bạn thuộc trường hợp này nếu:**
- Trang web của bạn **không có** hệ thống đăng nhập Microsoft sẵn
- Hoặc trang web có đăng nhập nhưng bạn muốn widget **tách biệt** với hệ thống đăng nhập chính
- Bạn muốn cách tích hợp **đơn giản nhất**

**Ví dụ thực tế:**
- Trang web giới thiệu sản phẩm, muốn thêm chatbot hỗ trợ khách hàng
- Blog cá nhân muốn có chatbot tư vấn
- Trang landing page cần chatbot
- Trang web nội bộ công ty chưa có đăng nhập Microsoft

**Cách hoạt động:**
1. Người dùng mở trang web → Thấy nút chat ở góc màn hình
2. Người dùng nhấn nút chat → Hiện cửa sổ chat với nút "Đăng nhập Microsoft"
3. Người dùng đăng nhập → Có thể bắt đầu chat

---

### Trường Hợp 2: Easy Auth (Azure App Service)

**Mô tả:**
Widget dùng chung phiên đăng nhập với ứng dụng web được host trên Azure App Service đã bật Easy Auth.

**Easy Auth là gì?**
Easy Auth (tên chính thức: Azure App Service Authentication) là tính năng **có sẵn trong Azure App Service**. Khi bật tính năng này, Azure sẽ tự động xử lý việc đăng nhập Microsoft cho ứng dụng của bạn mà không cần viết code. Đây là cách đơn giản nhất để thêm đăng nhập Microsoft vào ứng dụng chạy trên Azure.

**Bạn thuộc trường hợp này nếu:**
- Trang web của bạn đang chạy trên **Azure App Service**
- Azure App Service đã bật tính năng **Easy Auth** (Authentication/Authorization trong Azure Portal)
- Bạn muốn người dùng **không cần đăng nhập lại** vào widget (nếu đã đăng nhập ứng dụng chính)

**Ví dụ thực tế:**
- Ứng dụng nội bộ công ty host trên Azure đã có sẵn đăng nhập Microsoft
- Portal nhân viên trên Azure muốn thêm chatbot mà không cần đăng nhập thêm

**Cách hoạt động:**
1. Người dùng đăng nhập vào ứng dụng chính (Azure đã xử lý)
2. Người dùng mở widget chat → Widget tự động nhận diện phiên đăng nhập
3. Người dùng có thể chat ngay **không cần đăng nhập lại**

**Lưu ý quan trọng:**
- Easy Auth yêu cầu file `chatbox.js` phải được **tải về và đặt trên cùng domain** với ứng dụng
- Không thể embed từ server khác khi dùng Easy Auth

**Tại sao Easy Auth không dùng được từ server khác?**

Easy Auth hoạt động dựa trên **cookie phiên đăng nhập** do Azure tạo ra. Khi bạn đăng nhập vào ứng dụng Azure, trình duyệt lưu cookie này và tự động gửi kèm mỗi khi truy cập ứng dụng.

Vấn đề xảy ra khi widget được tải từ server khác:
- Trình duyệt có cơ chế bảo mật gọi là **"Same-Origin Policy"** (chính sách cùng nguồn gốc)
- Cookie của domain A (ứng dụng Azure) **không được gửi** khi truy cập từ domain B (server khác)
- Do đó, widget không thể đọc được thông tin đăng nhập từ Azure

**Ví dụ minh họa:**
- Ứng dụng của bạn: `https://myapp.azurewebsites.net`
- Widget từ server khác: `https://cdn.example.com/chatbox.js`
- Khi widget gọi đến `/.auth/me` để lấy thông tin đăng nhập → Trình duyệt **không gửi cookie** → Azure trả về "chưa đăng nhập"

**Giải pháp:** Đặt file `chatbox.js` trên cùng domain với ứng dụng Azure → Cookie được gửi → Widget đọc được thông tin đăng nhập

---

### Trường Hợp 3: Shared MSAL (Single Sign-On / SSO)

**Mô tả:**
Widget chia sẻ phiên đăng nhập Microsoft với ứng dụng chính đã có sẵn hệ thống đăng nhập MSAL.

**Bạn thuộc trường hợp này nếu:**
- Ứng dụng web của bạn **đã có sẵn** đăng nhập Microsoft (dùng MSAL library)
- Bạn muốn người dùng **đăng nhập 1 lần** và dùng được cả ứng dụng lẫn widget
- Bạn muốn **trải nghiệm liền mạch** giữa ứng dụng và widget

**Ví dụ thực tế:**
- Ứng dụng Vue.js/React đã có đăng nhập Microsoft, muốn thêm chatbot
- Dashboard nội bộ công ty dùng MSAL, muốn tích hợp chatbot
- Ứng dụng SPA (Single Page App) có sẵn đăng nhập Microsoft

**Cách hoạt động:**
1. Người dùng đăng nhập vào ứng dụng chính
2. Người dùng mở widget chat → Widget tự động sử dụng phiên đăng nhập có sẵn
3. Người dùng chat ngay **không cần đăng nhập lại**
4. Ngược lại: Nếu đăng nhập từ widget, ứng dụng chính cũng tự động có phiên đăng nhập

**Yêu cầu kỹ thuật:**
- Ứng dụng chính phải dùng MSAL library
- Client ID và Tenant ID phải **giống nhau** giữa ứng dụng và widget
- MSAL phải được cấu hình dùng **localStorage** (không phải sessionStorage)

---

### Bảng So Sánh Nhanh

| Tiêu chí | Standalone | Easy Auth | Shared MSAL |
|----------|------------|-----------|-------------|
| **Độ phức tạp** | Đơn giản nhất | Trung bình | Cần cấu hình |
| **Cần code thêm** | Không | Không | Có (ít) |
| **SSO (đăng nhập 1 lần)** | Không | Có | Có |
| **Yêu cầu Azure** | Không | Có | Không |
| **Embed từ server khác** | Được | **Không** (phải tải file về) | Được |
| **Phù hợp với** | Mọi trang web | Azure App Service | Ứng dụng có MSAL |

---

## Phần 2: Hướng Dẫn Sử Dụng Theo Từng Trường Hợp

### Trường Hợp 1: Standalone (Độc lập)

Chỉ cần thêm 1 dòng code vào trang HTML, đặt trước thẻ đóng `</body>`:

```html
<script src="https://your-server.com/chatbox.js" data-concierge-id="YOUR_BOT_ID"></script>
```

**Giải thích:**
- `https://your-server.com/chatbox.js` - Địa chỉ file widget (sẽ được cung cấp)
- `YOUR_BOT_ID` - ID bot của bạn (sẽ được cung cấp)

**Ví dụ hoàn chỉnh:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Trang Web Của Tôi</title>
</head>
<body>
    <h1>Chào mừng đến trang web</h1>
    <p>Nội dung trang web của bạn...</p>

    <!-- Thêm dòng này để hiện chatbot -->
    <script src="https://your-server.com/chatbox.js" data-concierge-id="c0003726"></script>
</body>
</html>
```

**Kết quả:** Nút chat xuất hiện ở góc phải dưới màn hình. Người dùng nhấn vào sẽ thấy cửa sổ chat với nút đăng nhập Microsoft.

**Tùy chọn thêm:**

| Thuộc tính | Giá trị | Mô tả |
|------------|---------|-------|
| `data-position` | `bottom-right` hoặc `bottom-left` | Vị trí nút chat (mặc định: góc phải) |

**Ví dụ đặt ở góc trái:**
```html
<script src="https://your-server.com/chatbox.js" data-concierge-id="c0003726" data-position="bottom-left"></script>
```

---

### Trường Hợp 2: Easy Auth (Azure App Service)

**Điều kiện tiên quyết:**
- Ứng dụng của bạn đã được deploy lên Azure App Service
- Đã bật Easy Auth trong Azure Portal (Authentication → Add identity provider → Microsoft)

**Bước 1:** Tải file `chatbox.js` về máy

Liên hệ đội kỹ thuật để nhận file `chatbox.js`.

**Bước 2:** Upload file lên ứng dụng Azure của bạn

Đặt file `chatbox.js` vào thư mục static/public của ứng dụng (ví dụ: `/public/chatbox.js` hoặc `/wwwroot/chatbox.js`).

**Bước 3:** Thêm 1 dòng code vào trang HTML:


<script src="/chatbox.js" data-concierge-id="YOUR_BOT_ID" data-auth-mode="easyauth"></script>






**Lưu ý:** URL là `/chatbox.js` (đường dẫn local), **KHÔNG phải** URL từ server khác.

**Ví dụ hoàn chỉnh:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Ứng Dụng Azure</title>
</head>
<body>
    <h1>Dashboard Công Ty</h1>
    <p>Nội dung ứng dụng...</p>

    <!-- File chatbox.js phải được đặt trên cùng domain -->
    <script src="/chatbox.js" data-concierge-id="c0003726" data-auth-mode="easyauth"></script>
</body>
</html>
```

**Kết quả:**
- Nếu người dùng đã đăng nhập ứng dụng → Widget tự động đăng nhập theo
- Nếu chưa đăng nhập → Widget sẽ chuyển hướng đến trang đăng nhập Microsoft

---

### Trường Hợp 3: Shared MSAL (Single Sign-On)

**Điều kiện tiên quyết:**
- Ứng dụng của bạn đã có đăng nhập Microsoft dùng MSAL
- Bạn có quyền chỉnh sửa cấu hình MSAL của ứng dụng

**Bước 1:** Kiểm tra cấu hình MSAL của ứng dụng

Đảm bảo MSAL được cấu hình như sau:


const msalConfig = {
    auth: {
        clientId: "447ff8a0-01d3-4192-a18a-90259989f917",  // Same Client ID with widget
        authority: "https://login.microsoftonline.com/f91d6d6a-1b50-467d-82d2-b94e92fba2d1",
    },
    cache: {
        cacheLocation: "localStorage"  // MUST be localStorage
    }
};


**Bước 2:** Công khai MSAL instance lên `window`

Thêm dòng này sau khi khởi tạo MSAL:
 


window.msalInstance = msalInstance;




**Bước 3:** Thêm widget vào trang (giống Standalone)


<script src="https://your-server.com/chatbox.js" data-concierge-id="YOUR_BOT_ID"></script>

**Ví dụ hoàn chỉnh:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Ứng Dụng Có MSAL</title>
    <!-- Tải MSAL library -->
    <script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>
</head>
<body>
    <h1>Ứng Dụng Dashboard</h1>

    <script>
        // Khởi tạo MSAL cho ứng dụng chính
        (async function() {
            window.msalInstance = new msal.PublicClientApplication({
                auth: {
                    clientId: "447ff8a0-01d3-4192-a18a-90259989f917",
                    authority: "https://login.microsoftonline.com/f91d6d6a-1b50-467d-82d2-b94e92fba2d1",
                },
                cache: {
                    cacheLocation: "localStorage"  // Quan trọng!
                }
            });
            await window.msalInstance.initialize();
        })();
    </script>

    <!-- Widget tự động phát hiện msalInstance và dùng chung phiên đăng nhập -->
    <script src="https://your-server.com/chatbox.js" data-concierge-id="c0003726"></script>
</body>
</html>
```

**Kết quả:**
- Nếu đã đăng nhập ứng dụng → Widget tự động đăng nhập
- Nếu đăng nhập từ widget → Ứng dụng cũng tự động có phiên đăng nhập (sau khi refresh)

---

## Bảng Checklist Trước Khi Triển Khai

### Checklist Chung

- [ ] Đã có Bot ID (ví dụ: `c0003726`)
- [ ] Đã xác định đúng trường hợp sử dụng

### Checklist Standalone

- [ ] Đã có địa chỉ URL của file `chatbox.js`
- [ ] Đã thêm dòng script vào trang HTML (trước `</body>`)
- [ ] Đã thay `YOUR_BOT_ID` bằng Bot ID thật

### Checklist Easy Auth

- [ ] Ứng dụng đang chạy trên Azure App Service
- [ ] Đã bật Easy Auth trong Azure Portal
- [ ] Đã tải file `chatbox.js` và upload lên ứng dụng
- [ ] Đã thêm `data-auth-mode="easyauth"` vào script tag
- [ ] URL script là đường dẫn local (ví dụ: `/chatbox.js`)

### Checklist Shared MSAL

- [ ] Đã có địa chỉ URL của file `chatbox.js`
- [ ] MSAL cấu hình dùng `localStorage`
- [ ] Đã công khai `window.msalInstance`
- [ ] Client ID và Tenant ID giống nhau với widget
- [ ] MSAL được khởi tạo trước khi tải widget

---

## Câu Hỏi Thường Gặp

**Q: Widget xuất hiện ở vị trí nào?**

A: Mặc định ở góc phải dưới màn hình. Bạn có thể thay đổi bằng cách thêm `data-position="bottom-left"` để chuyển sang góc trái.

**Q: Widget không hiện lên, phải làm sao?**

A: Kiểm tra:
1. URL file `chatbox.js` có đúng không (mở Developer Tools → Console để xem lỗi)
2. Bot ID có đúng không
3. Có lỗi JavaScript nào trong Console không

**Q: Đăng nhập không được, báo lỗi?**

A: Thường do:
1. Domain trang web chưa được đăng ký trong Azure AD
2. Popup bị chặn bởi trình duyệt

**Q: Easy Auth không hoạt động?**

A: Kiểm tra:
1. File `chatbox.js` có được đặt trên **cùng domain** với ứng dụng không
2. Đã thêm `data-auth-mode="easyauth"` chưa
3. Easy Auth đã được bật trong Azure Portal chưa

**Q: SSO không hoạt động (Shared MSAL)?**

A: Kiểm tra:
1. `cacheLocation` có phải `"localStorage"` không (KHÔNG phải `sessionStorage`)
2. Client ID và Tenant ID có giống nhau không
3. `window.msalInstance` đã được gán trước khi widget tải chưa

---

## Thông Tin Cần Được Cung Cấp

Để tích hợp widget, bạn cần nhận được từ đội ngũ kỹ thuật:

| Trường hợp | Cần nhận |
|------------|----------|
| **Standalone** | URL widget, Bot ID |
| **Easy Auth** | File `chatbox.js`, Bot ID |
| **Shared MSAL** | URL widget, Bot ID, Client ID, Tenant ID |

---

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề trong quá trình tích hợp, vui lòng liên hệ đội ngũ kỹ thuật kèm theo:
- Trường hợp sử dụng bạn đang áp dụng
- Screenshot lỗi (nếu có)
- Đoạn code bạn đã thêm vào trang
