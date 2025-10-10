// js
/**
 * =====================================
 * 📦 Bootstrap Alert Helper
 * Author: KienVu (2025)
 * Description: Hiển thị alert Bootstrap tự động biến mất sau thời gian chỉ định.
 * Dependencies: Bootstrap 5+ (bundle.js có sẵn component Alert)
 * =====================================
 *
 * ✅ Cách sử dụng:
 *
 * // Hiển thị alert thành công
 * AlertHelper.show('Tạo contest thành công!', 'success', 4000);
 *
 * // Hiển thị alert lỗi
 * AlertHelper.show('Có lỗi xảy ra khi lưu dữ liệu', 'danger', 5000);
 *
 * // Các loại alert hợp lệ:
 *  - success (màu xanh)
 *  - danger  (màu đỏ)
 *  - warning (màu vàng)
 *  - info    (màu xanh nhạt)
 *
 * Tham số:
 * @param {string} message  - Nội dung thông báo.
 * @param {('success'|'danger'|'warning'|'info')} [type='success'] - Kiểu alert.
 * @param {number} [duration=3000] - Thời gian tồn tại (ms) trước khi tự tắt.
 */

const AlertHelper = (() => {
  /**
   * Đảm bảo container alert tồn tại trong DOM.
   * Nếu chưa có, tự tạo ở góc phải trên màn hình.
   * @returns {HTMLElement} container - Phần tử chứa alert.
   */
  function ensureContainer() {
    let container = document.getElementById('alert-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'alert-container';
      container.className = 'position-fixed top-0 end-0 p-3';
      container.style.zIndex = 1055;
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Hiển thị một alert bootstrap.
   * @param {string} message - Nội dung thông báo.
   * @param {string} [type='success'] - Kiểu alert (success, danger, warning, info).
   * @param {number} [duration=3000] - Thời gian tự động ẩn (ms).
   */
  function show(message, type = 'success', duration = 3000) {
    const container = ensureContainer();
    const alertId = 'alert-' + Date.now();

    const alertHtml = `
      <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show shadow-sm mb-2" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', alertHtml);

    setTimeout(() => {
      const alertEl = document.getElementById(alertId);
      if (alertEl) {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
        bsAlert.close();
      }
    }, duration);
  }

  return { show };
})();

