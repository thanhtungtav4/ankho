/* ==========================================================================
   Bếp Phù Sa – product detail page only: gallery, quantity stepper, tabs, related products
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Render the product named in ?id= (the markup ships khô cá lóc as the
     default, which is also what shows without JS or for an unknown id).
     Copy is per category until the backend supplies per-product content;
     it only repeats promises already made elsewhere on the site.
     --------------------------------------------------------------------- */
  var DEFAULT_PRODUCT_ID = 'kho-ca-loc';

  var CATEGORY_COPY = {
    mam: {
      highlights: ['Ủ theo công thức gia truyền, đậm đà vừa ăn', 'Không chất bảo quản, không phẩm màu', 'Hũ đóng kín, tem nhãn xuất xứ đầy đủ', 'Ăn kèm cơm nóng, rau sống hoặc chưng thịt'],
      desc: ['{name} được Bếp Phù Sa ủ theo công thức gia truyền, từ nguyên liệu thu mua trực tiếp của bà con miền Tây.', 'Không chất bảo quản, không phẩm màu. Ngon nhất khi ăn kèm cơm nóng và rau sống, hoặc chưng cùng thịt ba chỉ.'],
      spec: [['Thành phần', 'Nguyên liệu tươi, muối, gia vị tự nhiên'], ['Bảo quản', 'Ngăn mát tủ lạnh sau khi mở nắp'], ['Cách dùng', 'Ăn trực tiếp, chưng hoặc kho']]
    },
    khoca: {
      highlights: ['Phơi nắng tự nhiên, thịt dẻo thơm', 'Không hàn the, không phẩm màu', 'Đóng gói hút chân không', 'Thích hợp chiên, nướng, kho'],
      desc: ['{name} được làm từ cá tươi thu mua trực tiếp của bà con miền Tây, ướp gia vị theo công thức gia truyền rồi phơi nắng tự nhiên.', 'Không hàn the, không phẩm màu. Chiên giòn, nướng than hoặc kho tiêu đều đậm đà, đưa cơm.'],
      spec: [['Thành phần', 'Cá, muối, gia vị tự nhiên'], ['Bảo quản', 'Ngăn mát 15 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Chiên, nướng hoặc kho']]
    },
    khomuc: {
      highlights: ['Mực tuyển chọn, thịt dày, ngọt tự nhiên', 'Không tẩy trắng, không hóa chất bảo quản', 'Đóng gói hút chân không', 'Nướng than, xé sợi chấm tương ớt'],
      desc: ['{name} được tuyển chọn từ mực biển Cà Mau, phơi nắng gió biển để giữ vị ngọt tự nhiên.', 'Không tẩy trắng, không hóa chất bảo quản. Nướng than rồi xé sợi, chấm tương ớt là ngon nhất.'],
      spec: [['Thành phần', 'Mực biển'], ['Bảo quản', 'Nơi khô ráo 2 tháng, ngăn đông đến 6 tháng'], ['Cách dùng', 'Nướng, chiên hoặc xé sợi']]
    },
    dacsan: {
      highlights: ['Đặc sản chính gốc miền Tây', 'Không chất bảo quản, không phẩm màu', 'Đóng gói kỹ, tem nhãn xuất xứ đầy đủ', 'Thích hợp dùng hằng ngày hoặc làm quà biếu'],
      desc: ['{name} là đặc sản được Bếp Phù Sa tuyển chọn trực tiếp tại vùng nguyên liệu miền Tây.', 'Không chất bảo quản, không phẩm màu. Đóng gói kỹ, giao tận nơi khắp cả nước.'],
      spec: [['Xuất xứ', 'Miền Tây Nam Bộ'], ['Bảo quản', 'Theo hướng dẫn trên bao bì'], ['Cách dùng', 'Chế biến theo khẩu vị gia đình']]
    },
    combo: {
      highlights: ['Gói trọn nhiều đặc sản miền Tây trong một hộp', 'Hộp quà trang nhã, sẵn sàng để biếu tặng', 'Mỗi món đóng gói riêng, hút chân không', 'Giao tận nơi khắp cả nước'],
      desc: ['{name} gói trọn những đặc sản bán chạy của Bếp Phù Sa trong một hộp quà, phù hợp biếu người thân, đối tác dịp lễ Tết.', 'Mỗi món đóng gói riêng, hút chân không, có tem nhãn xuất xứ đầy đủ.'],
      spec: [['Quy cách', 'Hộp quà nhiều món'], ['Bảo quản', 'Theo hướng dẫn trên từng món'], ['Phù hợp', 'Biếu tặng dịp lễ Tết']]
    }
  };

  /* Per-product copy (sales draft: weights, ingredients and shelf life are
     to be confirmed against the real labels before launch). */
  var PRODUCT_COPY = {
    'mam-ca-linh': {
      highlights: ['Cá linh non mùa nước nổi, ủ chín rồi chưng cùng sả ớt', 'Chưng sẵn, mở hũ là ăn, không cần nấu', 'Không chất bảo quản, không phẩm màu', 'Hũ đóng kín, tem nhãn xuất xứ đầy đủ'],
      desc: ['Cá linh là "lộc nước nổi" của miền Tây, mỗi năm chỉ nhiều vào mùa nước nổi tháng 8–11. Bếp Phù Sa ủ cá linh non theo công thức của má, rồi chưng cùng sả, ớt, tỏi phi cho dậy mùi.', 'Mắm đã chưng sẵn nên mở hũ là ăn được: ăn với cơm nóng, cuốn rau sống, chấm thịt luộc. Vị mặn ngọt vừa phải, không gắt, ăn hoài không ngán.'],
      spec: [['Quy cách', 'Hũ 500g'], ['Thành phần', 'Cá linh, muối, đường thốt nốt, sả, ớt, tỏi'], ['Bảo quản', 'Ngăn mát tủ lạnh, dùng trong 2 tháng sau khi mở'], ['Cách dùng', 'Ăn với cơm nóng, rau sống, thịt luộc']]
    },
    'mam-thai': {
      highlights: ['Mắm cá lóc trộn đu đủ bào và thính gạo rang', 'Vị chua ngọt hài hòa, ăn không ngán', 'Ăn liền, không cần chế biến', 'Không chất bảo quản, không phẩm màu'],
      desc: ['Mắm thái làm theo kiểu Châu Đốc: thịt cá lóc ủ mắm được xắt sợi, trộn đu đủ bào, thính gạo rang, tỏi ớt và chút đường thốt nốt cho vị chua ngọt tròn miệng.', 'Ngon nhất khi ăn kèm thịt ba chỉ luộc, bún tươi và rau sống, hoặc đơn giản là một chén cơm nóng.'],
      spec: [['Quy cách', 'Hũ 500g'], ['Thành phần', 'Mắm cá lóc, đu đủ, thính gạo, tỏi, ớt, đường thốt nốt'], ['Bảo quản', 'Ngăn mát tủ lạnh, dùng trong 1 tháng sau khi mở'], ['Cách dùng', 'Ăn với thịt luộc, bún, rau sống']]
    },
    'mam-ca-sac': {
      highlights: ['Cá sặc ủ nguyên con, thịt chắc, thơm đậm', 'Hợp chưng thịt, kho quẹt, nấu lẩu mắm', 'Không chất bảo quản, không phẩm màu', 'Hũ đóng kín, tem nhãn xuất xứ đầy đủ'],
      desc: ['Mắm cá sặc là linh hồn của nồi lẩu mắm miền Tây. Cá sặc được làm sạch, ủ muối và thính theo công thức gia truyền cho đến khi thịt chín mềm, dậy mùi thơm đặc trưng.', 'Dùng để chưng với thịt bằm, trứng vịt; kho quẹt chấm rau luộc; hoặc nấu lẩu mắm cùng cà tím, bông điên điển.'],
      spec: [['Quy cách', 'Hũ 500g'], ['Thành phần', 'Cá sặc, muối, thính gạo'], ['Bảo quản', 'Ngăn mát tủ lạnh sau khi mở'], ['Cách dùng', 'Chưng, kho, nấu lẩu mắm']]
    },
    'mam-tom-cha': {
      highlights: ['Tôm đất Gò Công chà nhuyễn, ủ cùng tỏi ớt', 'Màu đỏ cam tự nhiên từ tôm, không phẩm màu', 'Chấm thịt luộc, xôi, cơm tấm đều ngon', 'Hũ đóng kín, tem nhãn xuất xứ đầy đủ'],
      desc: ['Mắm tôm chà là đặc sản nức tiếng của Gò Công. Tôm đất tươi được chà nhuyễn, ủ với muối, tỏi, ớt cho đến khi lên màu đỏ cam tự nhiên và dậy vị ngọt của tôm.', 'Chỉ cần một muỗng mắm tôm chà là đủ "nâng" một dĩa thịt ba chỉ luộc, xôi trắng hay chén cơm nóng.'],
      spec: [['Quy cách', 'Hũ 500g'], ['Thành phần', 'Tôm đất, muối, tỏi, ớt, đường'], ['Bảo quản', 'Ngăn mát tủ lạnh sau khi mở'], ['Cách dùng', 'Chấm thịt luộc, xôi, cơm tấm']]
    },
    'kho-ca-dua': {
      highlights: ['Cá dứa biển, phơi đúng một nắng', 'Thịt dày, béo, ít xương', 'Chiên hoặc nướng, chấm nước mắm me', 'Đóng gói hút chân không'],
      desc: ['Khô cá dứa một nắng là món khô "sang" của miền biển: thịt cá dày, béo, thớ mịn. Cá được làm sạch, ướp nhạt rồi phơi đúng một nắng để giữ độ mềm và vị ngọt tự nhiên.', 'Chiên vàng hai mặt hoặc nướng than, chấm nước mắm me hay tương ớt, ăn kèm dưa leo là thành món nhậu hoặc món cơm khó cưỡng.'],
      spec: [['Quy cách', 'Gói 500g, hút chân không'], ['Thành phần', 'Cá dứa, muối, đường, tiêu'], ['Bảo quản', 'Ngăn mát 15 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Chiên, nướng']]
    },
    'kho-ca-keo': {
      highlights: ['Cá kèo loại 1, con đều, thịt chắc', 'Phơi nắng tự nhiên, thơm và giòn khi nướng', 'Không hàn the, không phẩm màu', 'Đóng gói hút chân không'],
      desc: ['Cá kèo là món quen của dân miền Tây, nhất là vùng ven biển Bạc Liêu, Sóc Trăng. Bếp Phù Sa chọn cá kèo loại 1 con đều, làm sạch, ướp vừa vị rồi phơi nắng cho thịt săn lại.', 'Nướng than đến khi da phồng giòn, xé ra chấm muối ớt chanh hay nước mắm me; hoặc chiên giòn ăn với cơm trắng.'],
      spec: [['Quy cách', 'Gói 500g, hút chân không'], ['Thành phần', 'Cá kèo, muối, đường, ớt'], ['Bảo quản', 'Ngăn mát 15 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Nướng than, chiên giòn']]
    },
    'kho-ca-sac': {
      highlights: ['Cá sặc bổi đồng, phơi nắng tự nhiên', 'Thịt dẻo, ngọt, chiên lên giòn rụm', 'Không hàn the, không phẩm màu', 'Đóng gói hút chân không'],
      desc: ['Khô cá sặc bổi là món ăn "nhà nghèo" mà ngon có tiếng của miền Tây. Cá sặc đồng được làm sạch, ướp muối đường vừa phải rồi phơi nắng tự nhiên cho thịt dẻo và thơm.', 'Chiên giòn ăn với cơm trắng và xoài chua, hoặc chiên rồi trộn gỏi xoài xanh, đậu phộng rang là món nhậu được nhiều khách đặt lại nhất.'],
      spec: [['Quy cách', 'Gói 500g, hút chân không'], ['Thành phần', 'Cá sặc bổi, muối, đường'], ['Bảo quản', 'Ngăn mát 15 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Chiên giòn, trộn gỏi xoài']]
    },
    'kho-muc-loai1': {
      highlights: ['Mực câu Cà Mau loại 1, con to, thịt dày', 'Không tẩy trắng, không hóa chất bảo quản', 'Phơi nắng gió biển, ngọt tự nhiên', 'Nướng than, xé sợi chấm tương ớt'],
      desc: ['Mực được ngư dân Cà Mau câu vào ban đêm, chọn con loại 1 to đều, thịt dày, không dập nát, rồi phơi nắng gió biển để giữ trọn vị ngọt tự nhiên.', 'Không tẩy trắng, không hóa chất bảo quản nên mực có màu vàng nâu tự nhiên. Nướng than cho thơm, đập dập, xé sợi, chấm tương ớt hoặc mayonnaise.'],
      spec: [['Quy cách', 'Gói 500g, hút chân không'], ['Thành phần', 'Mực câu biển Cà Mau'], ['Bảo quản', 'Nơi khô ráo 2 tháng, ngăn đông đến 6 tháng'], ['Cách dùng', 'Nướng, chiên, xé sợi']]
    },
    'kho-muc-tam': {
      highlights: ['Mực tẩm gia vị cay ngọt, xé sợi sẵn', 'Mở gói ăn liền, không cần nướng', 'Món nhắm, món ăn vặt tiện lợi', 'Đóng gói kín, giữ độ mềm dẻo'],
      desc: ['Khô mực tẩm được làm từ mực biển, tẩm gia vị cay ngọt rồi sấy, cán mỏng và xé sợi sẵn để ăn liền.', 'Món nhắm lý tưởng khi xem bóng đá, đi chơi xa hay làm quà vặt cho cả nhà. Ngon hơn khi hơ nóng nhẹ vài giây.'],
      spec: [['Quy cách', 'Gói 250g'], ['Thành phần', 'Mực biển, đường, muối, ớt, gia vị'], ['Bảo quản', 'Nơi khô ráo, dùng trong 3 ngày sau khi mở gói'], ['Cách dùng', 'Ăn liền hoặc hơ nóng']]
    },
    'tom-kho': {
      highlights: ['Tôm đất nuôi quảng canh giữa rừng ngập mặn', 'Luộc, lột, phơi thủ công từng mẻ', 'Ngọt tự nhiên, không phẩm màu', 'Nấu canh, xào, ăn với củ kiệu dịp Tết'],
      desc: ['Tôm đất Cà Mau được nuôi quảng canh trong rừng đước ngập mặn, ăn thức ăn tự nhiên nên thịt chắc và ngọt. Sau khi thu hoạch, tôm được luộc, lột vỏ và phơi thủ công qua nhiều nắng.', 'Không phẩm màu nên tôm có màu cam đỏ tự nhiên. Dùng nấu canh bí, xào rau, rim mặn, hay ăn cùng củ kiệu, dưa món ngày Tết.'],
      spec: [['Quy cách', 'Gói 500g, hút chân không'], ['Thành phần', 'Tôm đất Cà Mau'], ['Bảo quản', 'Nơi khô ráo 1 tháng, ngăn mát đến 3 tháng'], ['Cách dùng', 'Nấu canh, xào, rim, ăn với củ kiệu']]
    },
    'lap-xuong': {
      highlights: ['Thịt heo nạc vai, mỡ giòn, rượu mai quế lộ', 'Vị ngọt nhẹ đặc trưng Sóc Trăng', 'Không phẩm màu, không hàn the', 'Chiên, nướng, ăn với cơm hoặc xôi'],
      desc: ['Lạp xưởng tươi Sóc Trăng làm từ thịt heo nạc vai xay hạt lựu, trộn mỡ giòn, đường, rượu mai quế lộ rồi phơi nhẹ, giữ độ mềm và vị ngọt thanh đặc trưng.', 'Chiên lửa nhỏ hoặc nướng than cho chảy mỡ, ăn với cơm trắng, xôi, bánh mì, hoặc xắt lát chiên với cơm chiên.'],
      spec: [['Quy cách', 'Gói 500g'], ['Thành phần', 'Thịt heo, mỡ heo, đường, muối, rượu mai quế lộ'], ['Bảo quản', 'Ngăn mát 7 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Chiên, nướng, cơm chiên']]
    },
    'combo-qua-tang': {
      highlights: ['Gồm 4 món: khô cá lóc, khô cá dứa, mắm cá linh, mắm thái', 'Hộp quà trang nhã, sẵn sàng để biếu tặng', 'Mỗi món đóng gói riêng, hút chân không', 'Có thể đổi món theo yêu cầu'],
      desc: ['Combo quà tặng 4 món gom những đặc sản bán chạy nhất của Bếp Phù Sa vào một hộp: hai món khô phơi một nắng và hai món mắm ủ theo công thức của má.', 'Phù hợp biếu ông bà, cha mẹ, đối tác dịp lễ Tết. Muốn đổi món hay mua số lượng lớn, nhắn Zalo hoặc xem trang Quà biếu doanh nghiệp.'],
      spec: [['Quy cách', 'Hộp quà 4 món'], ['Gồm', 'Khô cá lóc, khô cá dứa, mắm cá linh, mắm thái'], ['Bảo quản', 'Theo hướng dẫn trên từng món'], ['Phù hợp', 'Biếu tặng, lễ Tết']]
    },
    'combo-tet': {
      highlights: ['Gồm 6 món đặc sản cho mâm cỗ ngày Tết', 'Hộp quà sang trọng, sẵn sàng để biếu', 'Mỗi món đóng gói riêng, hút chân không', 'Có thể đổi món theo yêu cầu'],
      desc: ['Combo Tết sum vầy gói trọn 6 món đặc sản miền Tây cho những ngày đầu năm: khô cá lóc, khô cá dứa, khô cá sặc bổi, mắm cá linh, mắm thái và lạp xưởng Sóc Trăng.', 'Một hộp quà đủ đầy để biếu gia đình, người thân, đối tác. Đặt số lượng lớn cho công ty, xem trang Quà biếu doanh nghiệp để nhận báo giá theo số lượng.'],
      spec: [['Quy cách', 'Hộp quà 6 món'], ['Gồm', 'Khô cá lóc, khô cá dứa, khô cá sặc bổi, mắm cá linh, mắm thái, lạp xưởng'], ['Bảo quản', 'Theo hướng dẫn trên từng món'], ['Phù hợp', 'Biếu tặng dịp Tết']]
    }
  };

  var STORY_LINKS = {
    'kho-muc-loai1': ['story-kho-muc.html', 'Những đêm câu mực ngoài biển Cà Mau.', 'Đọc câu chuyện khô mực →'],
    'tom-kho': ['story-tom-kho.html', 'Tôm nuôi quảng canh giữa rừng ngập mặn Đất Mũi.', 'Đọc câu chuyện tôm khô →'],
    mam: ['founder-story.html', 'Mắm Bếp Phù Sa bắt đầu từ công thức của má chị Hạnh.', 'Đọc câu chuyện →'],
    other: ['founder-story.html', 'Bếp Phù Sa bắt đầu từ một góc chợ nhỏ ở Cần Thơ.', 'Đọc câu chuyện của chúng tôi →']
  };

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
    return el;
  }

  function renderProduct() {
    var id = new URLSearchParams(window.location.search).get('id');
    var p = id && id !== DEFAULT_PRODUCT_ID ? findProduct(id) : null;
    if (!p) return;
    var copy = PRODUCT_COPY[p.id] || CATEGORY_COPY[p.cat] || CATEGORY_COPY.dacsan;
    var name = escapeHtml(p.name);

    document.title = p.name + ' — Bếp Phù Sa';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', copy.desc[0].replace('{name}', p.name));
    // Only crawlers that run JS see these; Zalo/Facebook keep the static default.
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    if (ogDesc && metaDesc) ogDesc.setAttribute('content', metaDesc.getAttribute('content'));

    var catLink = document.querySelector('[data-pd-cat-link]');
    if (catLink) { catLink.textContent = p.catLabel; catLink.setAttribute('href', 'products.html?cat=' + p.cat); }
    document.querySelectorAll('.desktop-nav__link').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === 'products.html?cat=' + p.cat);
    });
    setText('[data-pd-crumb]', p.name);
    setText('[data-pd-name]', p.name);
    var image = setText('[data-pd-image]', 'ảnh chính: ' + p.img);
    if (image) image.setAttribute('aria-label', p.name);

    var tag = { best: 'Bán chạy', sale: 'Đang giảm giá' }[p.badgeType];
    setText('[data-pd-kicker]', p.catLabel + (tag ? ' · ' + tag : ''));
    var stars = document.querySelector('[data-pd-stars]');
    if (stars) stars.setAttribute('aria-label', p.rating.toFixed(1) + ' trên 5 sao');
    setText('[data-pd-rating]', p.rating.toFixed(1) + ' · (' + p.reviews + ' đánh giá)');
    setText('[data-pd-sold]', 'Đã bán ' + p.sold.toLocaleString('vi-VN'));

    setText('[data-pd-price]', formatPrice(p.price));
    setText('[data-pd-sticky-price]', formatPrice(p.price));
    var oldEls = document.querySelectorAll('[data-pd-old], [data-pd-sticky-old], [data-pd-discount]');
    oldEls.forEach(function (el) { el.hidden = !p.oldPrice; });
    if (p.oldPrice) {
      setText('[data-pd-old]', formatPrice(p.oldPrice));
      setText('[data-pd-sticky-old]', formatPrice(p.oldPrice));
      // Rounded down so the badge never overstates the saving (and matches the cards).
      setText('[data-pd-discount]', '-' + Math.floor((p.oldPrice - p.price) / p.oldPrice * 100) + '%');
    }

    var highlights = document.querySelector('[data-pd-highlights]');
    if (highlights) {
      var tick = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>';
      highlights.innerHTML = copy.highlights.map(function (h) { return '<li>' + tick + escapeHtml(h) + '</li>'; }).join('');
    }

    document.querySelectorAll('[data-add-to-cart][data-use-qty], [data-buy-now][data-use-qty]').forEach(function (btn) {
      btn.setAttribute('data-product-id', p.id);
      btn.setAttribute('data-product-name', p.name);
      if (btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Thêm ' + p.name + ' vào giỏ');
    });
    setText('[data-pd-sticky-name]', p.name);

    var story = STORY_LINKS[p.id] || (p.cat === 'mam' ? STORY_LINKS.mam : STORY_LINKS.other);
    var storyEl = document.querySelector('[data-pd-story]');
    if (storyEl) {
      storyEl.innerHTML = escapeHtml(story[1]) + ' <a href="' + story[0] + '"><strong>' + escapeHtml(story[2]) + '</strong></a>';
    }

    var desc = document.querySelector('[data-pd-desc]');
    if (desc) {
      desc.innerHTML = copy.desc.map(function (d) { return '<p>' + escapeHtml(d.replace('{name}', p.name)) + '</p>'; }).join('');
    }
    var spec = document.querySelector('[data-pd-spec]');
    if (spec) {
      spec.innerHTML = [['Danh mục', p.catLabel]].concat(copy.spec).map(function (row) {
        return '<tr><th scope="row">' + escapeHtml(row[0]) + '</th><td>' + escapeHtml(row[1]) + '</td></tr>';
      }).join('');
    }
    setText('[data-pd-reviews-tab]', 'Đánh giá (' + p.reviews + ')');
    var reviews = document.querySelector('[data-pd-reviews]');
    if (reviews) {
      reviews.innerHTML = '<li class="review-list-item"><p class="review-list-item__text">Điểm trung bình <strong>' +
        p.rating.toFixed(1) + '/5</strong> từ ' + p.reviews + ' đánh giá của khách hàng cho ' + name + '.</p></li>';
    }

    var related = document.querySelector('[data-related-grid]');
    if (related) related.setAttribute('data-exclude-id', p.id);
  }

  /* ---------------------------------------------------------------------
     Product detail page: gallery thumbs, quantity stepper, tabs, related
     --------------------------------------------------------------------- */
  function initGalleryThumbs() {
    var thumbs = document.querySelectorAll('[data-gallery-thumb]');
    if (!thumbs.length) return;
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  }

  function initQtyStepper() {
    var wrap = document.querySelector('[data-qty-stepper]');
    if (!wrap) return;
    var valueEl = wrap.querySelector('[data-qty-value]');
    var inc = wrap.querySelector('[data-qty-inc]');
    var dec = wrap.querySelector('[data-qty-dec]');

    function get() { return parseInt(valueEl.textContent, 10) || 1; }
    function set(n) { valueEl.textContent = String(Math.max(1, n)); }

    if (inc) inc.addEventListener('click', function () { set(get() + 1); });
    if (dec) dec.addEventListener('click', function () { set(get() - 1); });
  }

  function initTabs() {
    var tabButtons = document.querySelectorAll('[data-tab-btn]');
    if (!tabButtons.length) return;
    var panes = document.querySelectorAll('[data-tab-pane]');

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab-btn');
        tabButtons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        panes.forEach(function (pane) {
          pane.classList.toggle('is-active', pane.getAttribute('data-tab-pane') === key);
        });
      });
    });
  }

  function initRelatedProducts() {
    var grid = document.querySelector('[data-related-grid]');
    if (!grid) return;
    var currentId = grid.getAttribute('data-exclude-id');
    var current = findProduct(currentId);
    var others = PRODUCTS.filter(function (p) { return p.id !== currentId; });
    // Same category first (cross-sell), then gift combos (upsell), then the rest.
    function rank(p) {
      if (current && p.cat === current.cat) return 0;
      if (p.cat === 'combo') return 1;
      return 2;
    }
    // Array#sort is stable, so catalog order is kept within each rank.
    var related = others
      .sort(function (a, b) { return rank(a) - rank(b); })
      .slice(0, 4);
    grid.innerHTML = related.map(productCardHTML).join('');
  }

  /* Mobile: once the main price/CTA block has scrolled above the viewport,
     slide in a compact buy bar so the shopper never has to scroll back up. */
  function initStickyBuyBar() {
    var bar = document.querySelector('[data-sticky-buy]');
    var anchor = document.querySelector('.detail-actions');
    if (!bar || !anchor) return;

    // A scroll check rather than IntersectionObserver: a fast fling can jump
    // from "below the fold" to "above the viewport" without any
    // intersection change, and the bar would never appear.
    var ticking = false;
    function update() {
      ticking = false;
      var passed = anchor.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('is-visible', passed);
      document.body.classList.toggle('has-sticky-buy', passed);
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* "Mua N gói là được freeship": counts what is already in the cart, in
     the unit the product is sold in. */
  function initFreeshipNudge() {
    var el = document.querySelector('[data-pdp-freeship]');
    var btn = document.querySelector('.detail-actions [data-add-to-cart]');
    if (!el || !btn) return;

    function update() {
      var p = findProduct(btn.getAttribute('data-product-id'));
      if (!p) return;
      var unit = { mam: 'hũ', combo: 'hộp' }[p.cat] || 'gói';
      var cart = readCart();
      var cartSub = Object.keys(cart).reduce(function (sum, id) {
        var item = findProduct(id);
        return sum + (item ? item.price * cart[id] : 0);
      }, 0);
      if (cartSub >= FREE_SHIPPING_THRESHOLD) {
        el.innerHTML = 'Giỏ hàng của bạn đã được <strong>miễn phí vận chuyển</strong>';
        return;
      }
      // the fewest units of this product that take the order over the threshold
      var packs = Math.ceil((FREE_SHIPPING_THRESHOLD - cartSub) / p.price);
      el.innerHTML = (cartSub ? 'Mua thêm ' : 'Mua ') + '<strong>' + packs + ' ' + unit + '</strong> là đơn được <strong>miễn phí vận chuyển</strong>';
    }
    document.addEventListener('bps:cartchange', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderProduct();
    initFreeshipNudge();
    initGalleryThumbs();
    initQtyStepper();
    initTabs();
    initRelatedProducts();
    initStickyBuyBar();
  });
})();
