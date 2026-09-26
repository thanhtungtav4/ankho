/* ==========================================================================
   Bếp Phù Sa – product catalog (loaded on: products, product detail, cart, checkout)
   ========================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   Product catalog (shared by home, listing and detail-related sections)
   --------------------------------------------------------------------- */
var PRODUCTS = [
  { id: 'mam-ca-linh', name: 'Mắm cá linh chưng sả ớt', img: 'mắm cá linh', cat: 'mam', catLabel: 'Mắm', price: 120000, oldPrice: null, rating: 5, reviews: 128, sold: 1250, badge: 'BEST SELLER', badgeType: 'best' },
  { id: 'mam-thai', name: 'Mắm thái chua ngọt', img: 'mắm thái', cat: 'mam', catLabel: 'Mắm', price: 115000, oldPrice: null, rating: 5, reviews: 96, sold: 980, badge: null },
  { id: 'mam-ca-sac', name: 'Mắm cá sặc đặc biệt', img: 'mắm cá sặc', cat: 'mam', catLabel: 'Mắm', price: 110000, oldPrice: null, rating: 4.5, reviews: 74, sold: 650, badge: null },
  { id: 'mam-tom-cha', name: 'Mắm tôm chà Gò Công', img: 'mắm tôm chà', cat: 'mam', catLabel: 'Mắm', price: 135000, oldPrice: null, rating: 5, reviews: 62, sold: 540, badge: null },
  { id: 'kho-ca-loc', name: 'Khô cá lóc dẻo ngon', img: 'khô cá lóc', cat: 'khoca', catLabel: 'Khô cá', price: 155000, oldPrice: 172000, rating: 4.5, reviews: 218, sold: 1160, badge: '-10%', badgeType: 'sale' },
  { id: 'kho-ca-dua', name: 'Khô cá dứa 1 nắng', img: 'khô cá dứa', cat: 'khoca', catLabel: 'Khô cá', price: 135000, oldPrice: null, rating: 5, reviews: 156, sold: 1240, badge: null },
  { id: 'kho-ca-keo', name: 'Khô cá kèo loại 1', img: 'khô cá kèo', cat: 'khoca', catLabel: 'Khô cá', price: 180000, oldPrice: null, rating: 5, reviews: 88, sold: 720, badge: null },
  { id: 'kho-ca-sac', name: 'Khô cá sặc bổi', img: 'khô cá sặc bổi', cat: 'khoca', catLabel: 'Khô cá', price: 165000, oldPrice: 185000, rating: 4.5, reviews: 110, sold: 830, badge: '-10%', badgeType: 'sale' },
  { id: 'kho-muc-loai1', name: 'Khô mực loại 1 Cà Mau', img: 'khô mực loại 1', cat: 'khomuc', catLabel: 'Khô mực', price: 420000, oldPrice: null, rating: 5, reviews: 134, sold: 610, badge: 'BEST SELLER', badgeType: 'best' },
  { id: 'kho-muc-tam', name: 'Khô mực tẩm ăn liền', img: 'khô mực tẩm', cat: 'khomuc', catLabel: 'Khô mực', price: 290000, oldPrice: null, rating: 4.5, reviews: 76, sold: 480, badge: null },
  { id: 'tom-kho', name: 'Tôm khô đất Cà Mau', img: 'tôm khô đất', cat: 'dacsan', catLabel: 'Đặc sản', price: 520000, oldPrice: null, rating: 5, reviews: 142, sold: 560, badge: null },
  { id: 'lap-xuong', name: 'Lạp xưởng tươi Sóc Trăng', img: 'lạp xưởng', cat: 'dacsan', catLabel: 'Đặc sản', price: 145000, oldPrice: null, rating: 4.5, reviews: 98, sold: 910, badge: null },
  { id: 'combo-qua-tang', name: 'Combo quà tặng 4 món đặc sản', img: 'combo quà tặng', cat: 'combo', catLabel: 'Combo - Quà tặng', price: 450000, oldPrice: null, rating: 5, reviews: 82, sold: 420, badge: 'COMBO', badgeType: 'combo' },
  { id: 'combo-tet', name: 'Combo Tết sum vầy 6 món', img: 'combo Tết', cat: 'combo', catLabel: 'Combo - Quà tặng', price: 680000, oldPrice: 750000, rating: 5, reviews: 54, sold: 260, badge: 'COMBO', badgeType: 'combo' }
];

var CATEGORY_LABELS = { all: 'Tất cả', mam: 'Mắm', khoca: 'Khô cá', khomuc: 'Khô mực', dacsan: 'Đặc sản', combo: 'Combo - Quà tặng' };

function findProduct(id) {
  return PRODUCTS.filter(function (p) { return p.id === id; })[0] || null;
}

/* ---------------------------------------------------------------------
   Products listing page: category filter + sort
   --------------------------------------------------------------------- */
function productCardHTML(p) {
  var id = escapeHtml(p.id);
  var name = escapeHtml(p.name);
  var img = escapeHtml(p.img);
  var catLabel = escapeHtml(p.catLabel);
  var oldPriceHTML = p.oldPrice
    ? '<span class="price price--old">' + formatPrice(p.oldPrice) + '</span>'
    : '';
  var badgeHTML = p.badge
    ? '<span class="product-card__badge badge--' + escapeHtml(p.badgeType) + '">' + escapeHtml(p.badge) + '</span>'
    : '';
  return (
    '<article class="product-card">' +
      '<a href="product-detail.html?id=' + id + '" class="product-card__media">' +
        '<span role="img" aria-label="' + name + '" class="product-card__img">ảnh: ' + img + '</span>' +
        badgeHTML +
      '</a>' +
      '<div class="product-card__body">' +
        '<span class="product-card__cat">' + catLabel + '</span>' +
        '<h3 class="product-card__name"><a href="product-detail.html?id=' + id + '">' + name + '</a></h3>' +
        '<div class="product-card__rating"><span class="stars" aria-label="Đánh giá ' + p.rating + '/5">' + starString() + '</span><span>(' + p.reviews + ')</span></div>' +
        '<div class="product-card__price-row"><span class="price">' + formatPrice(p.price) + '</span>' + oldPriceHTML + '</div>' +
        '<button type="button" class="btn-add" data-add-to-cart data-product-id="' + id + '" data-product-name="' + name + '" aria-label="Thêm ' + name + ' vào giỏ">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 2H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>' +
          'Thêm vào giỏ' +
        '</button>' +
      '</div>' +
    '</article>'
  );
}

var SHIPPING_FEE = 30000;
var FREE_SHIPPING_THRESHOLD = 500000;
