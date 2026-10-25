# Hướng dẫn chuyển giao diện Bếp Phù Sa sang WordPress

Tài liệu này mô tả cách gắn bộ giao diện tĩnh trong thư mục `template/` vào WordPress + WooCommerce: trang nào thành template nào, dữ liệu nào chuyển vào quản trị, file JS nào giữ / bỏ, và những chỗ trống cần thay thông tin thật.

---

## 1. Tổng quan giao diện hiện tại

| Hạng mục | Hiện trạng |
|---|---|
| Công nghệ | HTML + CSS + JavaScript thuần, không thư viện, không build |
| Số trang | 18 file `.html` trong `template/` |
| CSS | 1 file `assets/css/style.css` (~6.300 dòng, chia section có tiêu đề) |
| JS | 10 file trong `assets/js/` (IIFE, nạp bằng `defer`) |
| Font | Tự host trong `assets/fonts/` (Be Vietnam Pro, Dancing Script), không gọi Google Fonts |
| "Backend" tạm | `localStorage`: giỏ hàng, mã giảm giá, đơn hàng, yêu cầu báo giá B2B |
| Ảnh | Đang là ô sọc placeholder có chữ "ảnh: …", chờ ảnh thật |

Nguyên tắc đã áp dụng xuyên suốt, nên giữ khi chuyển sang WP:

- Không dùng `style=""` inline và không dùng `<script>` inline / `onclick`. Mọi hành vi gắn qua thuộc tính `data-*`.
- JS tìm phần tử bằng `data-*`, **không** dựa vào class. Đổi class thoải mái, nhưng **giữ nguyên các `data-*`** (danh sách ở mục 7).
- Hiệu ứng hover nằm trong `@media (hover: hover) and (pointer: fine)`, để mobile không bị "dính" hover.
- Có quy tắc toàn cục `[hidden] { display: none !important }`. JS ẩn/hiện bằng thuộc tính `hidden`.

---

## 2. Hướng tiếp cận khuyến nghị

**Theme riêng (classic PHP theme) + WooCommerce.**

- WooCommerce lo phần nặng: giỏ hàng, thanh toán, đơn hàng, mã giảm giá, phí ship, email xác nhận, quản lý tồn kho.
- Theme riêng giữ được đúng HTML/CSS hiện tại, chỉ thay phần nội dung tĩnh bằng PHP.
- Nội dung có cấu trúc (điểm nổi bật sản phẩm, FAQ, timeline câu chuyện, số liệu…) nhập qua **ACF (Advanced Custom Fields)**. Bản miễn phí đủ dùng nếu dùng các nhóm field lặp đơn giản; ACF Pro tiện hơn nhờ Repeater và Options Page.
- SEO / thẻ meta / OG: dùng **Rank Math** hoặc **Yoast** thay cho thẻ meta đang viết tay trong từng file.

Không khuyến nghị dùng page builder (Elementor, Flatsome…) cho bộ giao diện này. Chúng sinh HTML riêng và sẽ không dùng lại được CSS/JS hiện có.

---

## 3. Cấu trúc theme đề xuất

```
wp-content/themes/bepphusa/
├── style.css                 ← chỉ chứa header khai báo theme
├── functions.php             ← enqueue CSS/JS, menu, theme support, hook Woo
├── header.php                ← topbar + header + drawer (lấy từ các file .html)
├── footer.php                ← footer + bottom nav + nút Zalo/gọi + toast + back-to-top
├── front-page.php            ← index.html
├── home.php                  ← news.html (trang danh sách bài viết)
├── single.php                ← news-detail.html
├── page.php                  ← trang nội dung chung
├── page-templates/
│   ├── about.php             ← about.html
│   ├── contact.php           ← contact.html
│   ├── policy.php            ← policy.html
│   ├── founder-story.php     ← founder-story.html
│   ├── product-story.php     ← story-kho-ca-loc / story-kho-muc / story-tom-kho (1 template dùng chung)
│   └── b2b-gift.php          ← qua-bieu-doanh-nghiep.html
├── template-parts/           ← khối dùng lại: product-card, story-faq, trust-list, cert-strip…
├── woocommerce/              ← override template Woo (mục 4)
└── assets/                   ← copy nguyên thư mục template/assets
    ├── css/style.css
    ├── js/*.js
    ├── fonts/*.woff2
    └── img/*
```

Copy nguyên `assets/` thì đường dẫn font trong CSS (`url('../fonts/…')`) vẫn đúng, không phải sửa.

---

## 4. Ánh xạ từng trang

| File HTML | Template WordPress | Ghi chú |
|---|---|---|
| `index.html` | `front-page.php` | Các khối trang chủ lấy dữ liệu từ ACF Options / truy vấn Woo (mục 5.3) |
| `products.html` | `woocommerce/archive-product.php` | Dùng chung cho trang Cửa hàng và trang danh mục (`product_cat`) |
| `product-detail.html` | `woocommerce/single-product.php` + `content-single-product.php` | Giữ markup hiện tại, thay chữ tĩnh bằng dữ liệu sản phẩm |
| `cart.html` | `woocommerce/cart/cart.php`, `cart-totals.php` | Giữ class `.cart-*`, đổi phần render sang vòng lặp Woo |
| `checkout.html` | `woocommerce/checkout/form-checkout.php` | Ẩn bớt trường Woo mặc định (mục 6.4) |
| `order-success.html` | `woocommerce/checkout/thankyou.php` | Dữ liệu từ `$order` |
| `login.html`, `register.html` | `woocommerce/myaccount/form-login.php` | Woo gộp đăng nhập + đăng ký một trang. Có thể tách 2 cột hoặc 2 tab |
| `news.html` | `home.php` (đặt "Trang bài viết" trong Cài đặt → Đọc) | Bộ lọc tag → link danh mục bài viết |
| `news-detail.html` | `single.php` | Hộp sản phẩm cuối bài lấy từ field ACF "Sản phẩm liên quan" |
| `about.html` | `page-templates/about.php` | |
| `contact.html` | `page-templates/contact.php` | Form → Contact Form 7 / WPForms (mục 6.6) |
| `policy.html` | `page-templates/policy.php` | Mỗi chính sách là 1 tab, giữ anchor `#doitra`, `#vanchuyen`, `#thanhtoan`, `#baomat`, `#faq` vì footer đang link tới |
| `founder-story.html` | `page-templates/founder-story.php` | |
| `story-kho-ca-loc.html`, `story-kho-muc.html`, `story-tom-kho.html` | `page-templates/product-story.php` | 3 trang cùng cấu trúc → 1 template + ACF (mục 5.4) |
| `qua-bieu-doanh-nghiep.html` | `page-templates/b2b-gift.php` | Form báo giá → plugin form hoặc CPT (mục 6.6) |

### Header / footer

Mọi trang có cùng phần khung, cắt ra như sau (theo `index.html`):

- **`header.php`**: từ `<!doctype html>` đến hết `<aside id="siteDrawer" …>`, gồm topbar, `header.site-header`, overlay và drawer menu. Thay `<head>` tĩnh bằng `wp_head()`, thêm `body_class()` và `wp_body_open()`.
- **`footer.php`**: từ `<footer class="site-footer">` đến cuối file, gồm footer, `nav.bottom-nav` (mobile), `.quick-contact` (Zalo/gọi), `[data-toast-wrap]`, `[data-back-top]`, rồi `wp_footer()`.
- Khối **newsletter** (`section.newsletter`) hiện chỉ có ở trang chủ. Nên tách thành `template-parts/newsletter.php` để chèn ở trang nào cũng được.

Menu: đăng ký 2–3 vị trí (`primary`, `footer_shop`, `footer_info`) bằng `register_nav_menus()`. Menu chính và drawer dùng chung `primary`. Viết một Walker nhỏ (hoặc dùng filter `nav_menu_css_class` / `nav_menu_link_attributes`) để giữ class hiện có và thêm `aria-current="page"` cho mục đang mở.

---

## 5. Dữ liệu: chuyển vào quản trị WordPress

### 5.1 Sản phẩm (WooCommerce)

Danh sách sản phẩm đang nằm trong mảng `PRODUCTS` ở `assets/js/catalog.js`. Nhập vào Woo theo bảng sau:

| Trường trong `PRODUCTS` | Trong WooCommerce |
|---|---|
| `id` (vd. `kho-ca-loc`) | Đường dẫn tĩnh (slug) sản phẩm |
| `name` | Tên sản phẩm |
| `price` / `oldPrice` | Có `oldPrice` → Giá thường = `oldPrice`, Giá khuyến mãi = `price`. Không có → Giá thường = `price` |
| `cat` / `catLabel` | Danh mục `product_cat`: `mam` (Mắm), `khoca` (Khô cá), `khomuc` (Khô mực), `dacsan` (Đặc sản), `combo` (Combo - Quà tặng). Giữ đúng slug vì CSS/URL đang dùng |
| `rating`, `reviews` | Đánh giá sản phẩm của Woo (bật trong Cài đặt → Sản phẩm) |
| `sold` | Meta `total_sales` Woo tự tăng. Có thể nhập số khởi điểm |
| `badge`, `badgeType` | Field ACF "Nhãn" (BEST SELLER / COMBO / -10%…). `-10%` có thể tính tự động từ giá khuyến mãi |
| `img` | Ảnh đại diện + thư viện ảnh sản phẩm |

14 sản phẩm hiện có: mam-ca-linh, mam-thai, mam-ca-sac, mam-tom-cha, kho-ca-loc, kho-ca-dua, kho-ca-keo, kho-ca-sac, kho-muc-loai1, kho-muc-tam, tom-kho, lap-xuong, combo-qua-tang, combo-tet.

### 5.2 Nội dung chi tiết từng sản phẩm

`assets/js/product-detail-page.js` có `PRODUCT_COPY` (nội dung riêng từng sản phẩm) và `CATEGORY_COPY` (nội dung dự phòng theo danh mục). Chép sang:

| Trong JS | Trong WordPress |
|---|---|
| `highlights` (4–5 gạch đầu dòng) | ACF Repeater "Điểm nổi bật", hoặc Mô tả ngắn dạng danh sách |
| `desc` (các đoạn văn) | Mô tả sản phẩm (tab "Mô tả") |
| `spec` (cặp tên – giá trị) | Thuộc tính sản phẩm của Woo (tab "Thông tin bổ sung"), hoặc ACF Repeater |
| Link câu chuyện (`STORY_LINKS`) | ACF field "Trang câu chuyện" (kiểu Link / Page) |

Sau khi PHP render nội dung, **xoá** `PRODUCT_COPY`, `CATEGORY_COPY` và hàm `renderProduct()` khỏi JS.

### 5.3 Trang chủ

| Khối | Nguồn dữ liệu đề xuất |
|---|---|
| Hero (3 slide) | ACF Options: Repeater slide (ảnh, tiêu đề, mô tả, nút) |
| Danh mục | Vòng lặp `get_terms('product_cat')` + ảnh danh mục |
| Bán chạy | `wc_get_products(['orderby' => 'popularity', 'limit' => 6])` |
| Promo (4 thẻ) | ACF Options |
| Nổi bật | ACF: chọn sản phẩm (Relationship) |
| Số liệu + logo chứng nhận | ACF Options (`data-stat-target` lấy từ số nhập) |
| Đánh giá khách | ACF Options Repeater, hoặc lấy đánh giá Woo được gắn sao 5 |
| Video + câu chuyện | ACF: link video, ảnh, đoạn văn |
| Blog | `WP_Query` 3 bài mới nhất |
| FAQ | ACF Repeater (câu hỏi / trả lời) |
| Instagram | Plugin feed (vd. Smash Balloon) hoặc 6 ảnh nhập tay |
| Newsletter | Form gửi vào dịch vụ email (MailPoet, Brevo…) |

Đồng hồ flash sale (`home.js` → `flashSaleDeadline`) đang tự đếm tới 23:59:59 Chủ nhật (giờ VN). Khi có quản trị, nên in hạn chót từ ACF ra thuộc tính `data-deadline` và cho JS đọc thuộc tính đó.

### 5.4 Trang câu chuyện sản phẩm (dùng chung 1 template)

Ba trang story có cùng thứ tự section. Mỗi section là một nhóm field ACF:

1. Hero (kicker, tiêu đề, mô tả, ảnh nền, biến thể màu `story-hero--khoca` / `--khomuc` / `--tomkho`)
2. Các đoạn kể chuyện (tiêu đề, văn bản, ảnh, đảo trái/phải)
3. Trích dẫn
4. Timeline quy trình (Repeater: bước, tiêu đề, mô tả). Giữ `id="quy-trinh"`
5. Số liệu (4 ô)
6. Điểm nổi bật
7. So sánh "hàng chuẩn / hàng kém" (2 danh sách)
8. Món ngon gợi ý (Repeater: ảnh, tên, mô tả)
9. Thẻ mua hàng (chọn 1 sản phẩm Woo → tự in giá, đánh giá, nút giỏ hàng)
10. Đánh giá khách (Repeater)
11. FAQ (Repeater)
12. Câu chuyện liên quan + CTA

---

## 6. JavaScript: giữ, sửa, bỏ

Nạp bằng `wp_enqueue_script()` với `'strategy' => 'defer'` (WP 6.3+), `common.js` luôn trước. Chỉ nạp file của trang cần dùng (dùng `is_front_page()`, `is_product()`, `is_page_template()`…), đúng như cách các file HTML đang nạp:

| Trang | File JS |
|---|---|
| Mọi trang | `common.js` |
| Trang chủ | `home.js`, `story-page.js` |
| Cửa hàng / danh mục | `products-page.js` (xem 6.3) |
| Chi tiết sản phẩm | `product-detail-page.js` |
| Câu chuyện, người sáng lập, quà biếu | `story-page.js` |
| Liên hệ, tin tức, chính sách, quà biếu | `site-pages.js` (phần còn dùng) |

### 6.1 `common.js`: giữ, chỉ thay phần giỏ hàng

Giữ nguyên: drawer menu, back-to-top, ẩn nút nổi khi cuộn, `data-scroll-to`, `data-focus-search`, toast, `escapeHtml`, `formatPrice`.

Thay phần giỏ hàng (`readCart`, `writeCart`, `addToCart`, `initCartButtons`):

- **Thêm vào giỏ**: vẫn dùng listener ủy quyền cho `[data-add-to-cart]`, nhưng gửi `POST` tới `/?wc-ajax=add_to_cart` với `product_id` và `quantity` thay vì ghi `localStorage`. Xong thì gọi `showToast()` như cũ.
- **Mua ngay** (`[data-buy-now]`): thêm vào giỏ rồi chuyển tới URL thanh toán. In URL ra JS bằng `wp_localize_script` (`wc_get_checkout_url()`).
- **Số trên icon giỏ** (`[data-cart-count]`): dùng filter `woocommerce_add_to_cart_fragments` để Woo tự cập nhật sau mỗi lần thêm.
- `data-product-id` lúc này là **ID số** của sản phẩm Woo (in bằng `$product->get_id()`), không còn là slug.
- Vẫn phát sự kiện `bps:cartchange` sau khi thêm thành công, vì thanh "mua thêm để miễn phí ship" trên trang sản phẩm đang lắng nghe sự kiện này.

### 6.2 `catalog.js`: bỏ phần dữ liệu, cấu hình lại trong Woo

| Đang ở JS | Cấu hình trong WooCommerce |
|---|---|
| `SHIPPING_FEE = 30000` | Vận chuyển → Vùng Việt Nam → "Phí cố định" 30.000đ |
| `FREE_SHIPPING_THRESHOLD = 500000` | Thêm phương thức "Miễn phí vận chuyển", điều kiện "Giá trị đơn tối thiểu" 500.000đ |
| `PHUSA10` (giảm 10%) | Mã ưu đãi → "Giảm theo phần trăm giỏ hàng" 10%. Nếu chỉ áp dụng đơn đầu, dùng "Giới hạn sử dụng cho mỗi người dùng" = 1 |
| `FREESHIP` | Mã ưu đãi, tick "Cho phép miễn phí vận chuyển" (và bật tuỳ chọn "mã ưu đãi hợp lệ" trong phương thức Miễn phí vận chuyển) |
| `TET2027` (giảm 50.000đ, đơn từ 500.000đ) | Mã ưu đãi "Giảm cố định giỏ hàng" 50.000đ, "Chi tiêu tối thiểu" 500.000đ |

Sau đó xoá `PRODUCTS`, `COUPONS`, `computeTotals`, `initCouponForm`. `productCardHTML` chuyển thành `template-parts/product-card.php`.

### 6.3 `products-page.js`

- Nhiều sản phẩm (> 30): bỏ JS, dùng bộ lọc/sắp xếp của Woo (`?orderby=popularity|price|price-desc|date`, trang danh mục, widget lọc giá). Giữ `<select data-sort-select>` nhưng gửi form GET.
- Ít sản phẩm như hiện tại: có thể giữ lọc phía trình duyệt. Khi đó in dữ liệu sản phẩm ra `wp_localize_script` thay cho mảng `PRODUCTS`.

### 6.4 `product-detail-page.js`

Giữ: gallery (`data-gallery-thumb`), bộ tăng/giảm số lượng (`data-qty-*`), tabs (`data-tab-*`), thanh mua dính đáy mobile (`data-sticky-buy`).

Sửa:

- `initFreeshipNudge()` cần tổng tiền giỏ hiện tại → in `WC()->cart->get_subtotal()` và giá sản phẩm ra JS, hoặc trả kèm trong fragments.
- `initRelatedProducts()` → bỏ, dùng `woocommerce_output_related_products()` hoặc `wc_get_related_products()` rồi in bằng template product card.
- `renderProduct()` → bỏ (PHP đã render).

### 6.5 `cart-page.js`, `checkout-page.js`, `order-success-page.js`: thay bằng template Woo

Ba file này mô phỏng những gì Woo đã làm sẵn. Khi override template Woo, giữ lại markup và class để CSS hiện có vẫn áp dụng:

- **Giỏ hàng**: thanh tiến độ miễn phí ship (`data-freeship-*`) tính trong PHP từ `WC()->cart->get_subtotal()`. Khối "Mua thêm để được miễn phí ship" (`.cart-upsell`) dùng cross-sell của Woo hoặc truy vấn sản phẩm có giá ≥ số tiền còn thiếu. Form mã giảm giá dùng form coupon của Woo.
- **Thanh toán**: các trường hiện có là Họ tên, SĐT (bắt buộc), Email, Địa chỉ nhận hàng (bắt buộc), Ghi chú. Dùng filter `woocommerce_checkout_fields` để bỏ các trường Woo không cần (công ty, mã bưu điện, địa chỉ 2…) và đặt SĐT bắt buộc, email không bắt buộc. Thanh toán: "Trả tiền mặt khi nhận hàng" (COD) + "Chuyển khoản ngân hàng" (BACS) có sẵn. MoMo cần plugin cổng thanh toán riêng. Nút đặt hàng giữ chữ "Đặt hàng · {tổng tiền}" bằng filter `woocommerce_order_button_text`, hoặc cập nhật bằng JS khi tổng thay đổi.
- **Đặt hàng thành công**: `thankyou.php` lấy mã đơn, danh sách món, tạm tính / giảm giá / phí ship / tổng từ `$order`. Giữ khối "Các bước tiếp theo" (`.success-steps`) và "Cần hỗ trợ" (`.success-help`).

### 6.6 `site-pages.js`

| Hàm | Khi lên WP |
|---|---|
| `initContactForm` | Thay bằng Contact Form 7 / WPForms. Thêm class `form-input`, `btn-block` cho trường và nút để giữ giao diện |
| `initB2BForm` | Như trên. Hoặc tự xử lý qua `admin-post.php`, lưu vào Custom Post Type "Yêu cầu báo giá" và gửi email. Trường hiện có: người liên hệ, SĐT, công ty, email, số hộp, ngày cần giao, nhu cầu (checkbox), ghi chú |
| `initNewsFilter` | Bỏ. Mỗi nút tag thành link tới trang danh mục bài viết |
| `initPolicyNav` | Giữ nguyên |
| `initAuthForms` | Bỏ. Woo xử lý đăng nhập/đăng ký |

### 6.7 `home.js`, `story-page.js`

Giữ nguyên. Chỉ cần markup in ra đúng các `data-*`.

### 6.8 Dọn `localStorage`

Khi Woo đã lo giỏ hàng/đơn hàng, các khoá sau không còn dùng: `bps_cart`, `bps_coupon`, `bps_orders`, `bps_last_order`, `bps_b2b_requests`.

---

## 7. Các thuộc tính `data-*` cần giữ nguyên

JS dựa vào các thuộc tính này. Khi viết template PHP, in ra y hệt:

- **Chung:** `data-drawer`, `data-drawer-open`, `data-drawer-close`, `data-drawer-overlay`, `data-cart-count`, `data-toast-wrap`, `data-back-top`, `data-scroll-to`, `data-focus-search`, `data-newsletter-form`, `data-newsletter-msg`
- **Nút mua:** `data-add-to-cart`, `data-buy-now`, `data-product-id`, `data-product-name`, `data-use-qty`
- **Trang chủ:** `data-hero`, `data-hero-slide`, `data-hero-dot`, `data-hero-prev`, `data-hero-next`, `data-countdown`, `data-countdown-value`, `data-stats-section`, `data-stat-target`, `data-stat-value`, `data-stat-suffix`, `data-stat-suffix-target`, `data-reviews-track`, `data-review-item`, `data-review-prev`, `data-review-next`, `data-video-open`, `data-video-modal`, `data-video-close`
- **Chi tiết sản phẩm:** `data-gallery-thumb`, `data-qty-stepper`, `data-qty-dec`, `data-qty-inc`, `data-qty-value`, `data-tab-btn`, `data-tab-pane`, `data-sticky-buy`, `data-pdp-freeship`, `data-related-grid`
- **Tin tức / chính sách:** `data-tag-btn`, `data-news-card`, `data-policy-nav-btn`, `data-policy-panel`
- **Form:** `data-form-msg`, `data-field-*`, `data-contact-form`, `data-b2b-form`

Nhóm `data-pd-*`, `data-cart-*`, `data-order-*`, `data-checkout-*`, `data-coupon-*`, `data-order-success-*` chỉ phục vụ phần JS sẽ bị thay bằng Woo (mục 6.5). Có thể bỏ khi viết template Woo.

---

## 8. Danh sách chỗ trống cần thay thông tin thật

Nên gom các thông tin dùng nhiều nơi vào **một chỗ** (ACF Options Page hoặc Customizer) rồi gọi hàm, thay vì sửa tay từng trang.

| Thông tin | Hiện đang là | Số chỗ | Gợi ý |
|---|---|---|---|
| Hotline | `0909 123 456` / `tel:0909123456` | ~59 | Option `hotline`, in bằng `get_field('hotline', 'option')` |
| Zalo | `https://zalo.me/0909123456` | ~23 | Option `zalo_url` |
| Email | `bepphusa@gmail.com` | ~19 | Option `email` |
| Địa chỉ cửa hàng | `123 Đường Sông Hậu, Q. Ninh Kiều…` | trang Liên hệ, footer | Option `address` |
| Bản đồ | Ô "nhúng bản đồ Google Maps tại đây" | Liên hệ | Option chứa mã iframe |
| Mạng xã hội | `href="#"` | topbar, footer, chia sẻ bài viết | Option Facebook / TikTok / YouTube / Instagram |
| Ảnh sản phẩm, banner, bài viết, avatar | Ô sọc "ảnh: …" (`role="img"`) | ~100 | Thay bằng `<img>` từ `wp_get_attachment_image()`, **giữ class cũ** |
| Logo chứng nhận | 5 ô `.cert-strip__logo` | Trang chủ | ACF Options (gallery) |
| Số liệu (10+ năm, 5.000+ đơn, 97%, 34 tỉnh, 30+ hộ dân) | Số mẫu | Trang chủ, Giới thiệu, Người sáng lập, Story | Nhập số thật |
| Đánh giá khách hàng | Nội dung mẫu | Trang chủ, Story, sản phẩm | Đánh giá thật (có thể kèm ảnh) |
| Video câu chuyện | Ô placeholder trong modal | Trang chủ | Link YouTube / file video |
| Instagram | 6 ô mẫu | Trang chủ | Plugin feed hoặc ảnh thật |
| Thông tin người sáng lập | "Nguyễn Thị Hạnh, 2014" | Người sáng lập, Giới thiệu | Thông tin thật |
| Ảnh chia sẻ (OG) | `assets/img/og-*.jpg`, URL tuyệt đối GitHub Pages | Mọi trang | Rank Math / Yoast, ảnh riêng từng trang |

Khi thay placeholder bằng ảnh thật, xoá luôn khối CSS "Shared photo placeholder pattern" ở đầu `style.css`. Khối này chỉ vẽ nền sọc cho ô trống.

---

## 9. SEO và thẻ `<head>`

- Xoá toàn bộ thẻ `<title>`, `description`, `og:*`, `twitter:*`, `robots` viết tay trong các file HTML. Để Rank Math / Yoast sinh tự động, nhập tiêu đề và mô tả hiện có vào từng trang trong quản trị.
- Trang giỏ hàng, thanh toán, tài khoản: plugin SEO tự đặt `noindex` (hiện đang đặt tay ở cart, checkout, order-success, login, register).
- Giữ `<meta name="theme-color" content="#68131f">`, favicon (`assets/img/favicon.svg`) và `apple-touch-icon.png`. Có thể đặt favicon qua Tuỳ biến → Biểu tượng trang.
- Thêm `add_theme_support('title-tag')`.

---

## 10. Bảo mật và chất lượng khi viết PHP

- Mọi giá trị in ra phải escape: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()` cho nội dung có HTML. JS đã có `escapeHtml()` cho phần tự render.
- Form tự viết (nếu không dùng plugin) phải có nonce (`wp_nonce_field` / `check_admin_referer`) và kiểm tra dữ liệu phía server. Kiểm tra phía trình duyệt hiện có chỉ để báo lỗi nhanh.
- Không thêm `style=""` hay `<script>` inline vào template. Dữ liệu cần cho JS truyền qua `wp_localize_script()` hoặc thuộc tính `data-*`.

---

## 11. Thứ tự triển khai đề xuất

1. **Dựng theme khung:** `style.css`, `functions.php` (enqueue CSS/JS, menu, `title-tag`, `woocommerce` support), `header.php`, `footer.php`, `page.php`. Kiểm tra một trang nội dung hiển thị đúng như bản HTML.
2. **WooCommerce cơ bản:** cài Woo, tiền tệ VND (0 số lẻ, dấu chấm phân cách nghìn), vùng ship, phí ship 30.000đ + miễn phí từ 500.000đ, 3 mã giảm giá, COD + chuyển khoản.
3. **Nhập sản phẩm** (mục 5.1–5.2) và danh mục đúng slug.
4. **Template Woo:** archive → single product → cart → checkout → thank you. Sửa `common.js` theo mục 6.1.
5. **Trang chủ** + ACF Options cho các khối.
6. **Trang nội dung:** giới thiệu, liên hệ, chính sách, người sáng lập, 3 trang story (1 template), quà biếu doanh nghiệp.
7. **Blog:** `home.php`, `single.php`, hộp sản phẩm cuối bài.
8. **Thay thông tin thật** theo checklist mục 8, cài plugin SEO.
9. **Kiểm tra trước khi chạy thật** (mục 12).

---

## 12. Checklist kiểm tra

- [ ] Không trang nào bị tràn ngang ở 320px, 390px, 768px, 1366px
- [ ] Menu drawer mở/đóng được, bấm Esc đóng được, focus quay lại nút mở
- [ ] Thêm vào giỏ từ: thẻ sản phẩm, trang chi tiết (đúng số lượng đã chọn), thanh dính mobile, trang story, hộp sản phẩm trong bài viết. Số trên icon giỏ cập nhật ngay
- [ ] "Mua ngay" thêm vào giỏ và chuyển thẳng tới thanh toán
- [ ] Thanh "mua thêm … để miễn phí ship" đúng số tiền ở giỏ hàng và trang sản phẩm
- [ ] 3 mã giảm giá tính đúng: PHUSA10 (−10%), FREESHIP (ship 0đ), TET2027 (−50.000đ, chỉ đơn từ 500.000đ)
- [ ] Đặt hàng COD thành công, nhận email xác nhận, trang cảm ơn hiện đúng tạm tính / giảm giá / ship / tổng
- [ ] Form liên hệ và form báo giá B2B gửi được, có email thông báo
- [ ] Link chính sách trong footer mở đúng tab (`#doitra`, `#vanchuyen`, `#thanhtoan`, `#baomat`, `#faq`)
- [ ] FAQ mở/đóng được, link trong câu trả lời đang đóng không nhận Tab
- [ ] Không còn số điện thoại / email / link mạng xã hội mẫu (tìm `0909123456`, `bepphusa@gmail.com`, `href="#"`)
- [ ] Không còn ô ảnh sọc "ảnh: …"
- [ ] Ảnh chia sẻ Facebook / Zalo hiện đúng (kiểm tra bằng Facebook Sharing Debugger)
