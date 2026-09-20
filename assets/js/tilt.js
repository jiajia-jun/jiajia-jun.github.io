/* ============================================================================
   卡片跟随鼠标的 3D 倾斜

   三重降级（任一命中就直接不启用，卡片保持完全可用）：
     1. 用户在系统里开了「减少动态效果」   → prefers-reduced-motion
     2. 触屏 / 没有真实指针              → (hover: hover) and (pointer: fine)
     3. 浏览器不支持 requestAnimationFrame

   事件用委托挂在 document 上，所以首页几十张卡片也只有一组监听器
   每帧只写 transform 和自定义属性，不触发重排
   ========================================================================== */
(function () {
  'use strict';

  // 卡片倾斜的最大角度。调大更夸张，但超过 15 左右正文就开始难读了
  // 想更猛还可以再压 .card-tilt 的 perspective（900px 改小）
  var MAX_DEG = 12;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!window.requestAnimationFrame) return;

  var active = null;
  var rafId = 0;
  var px = 0;
  var py = 0;

  function reset() {
    if (!active) return;
    active.style.transform = '';
    active.classList.remove('is-tilting');
    active = null;
  }

  function frame() {
    rafId = 0;
    if (!active) return;

    // 每帧重取，避免滚动后缓存失效导致角度算错
    // 这里只含 layout 读取；由于我们只写 transform，不会让布局失效，
    // 因此这次读取命中的是缓存，代价很低
    var rect = active.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var x = (px - rect.left) / rect.width - 0.5;
    var y = (py - rect.top) / rect.height - 0.5;

    active.style.transform =
      'rotateY(' + (x * MAX_DEG).toFixed(2) + 'deg) ' +
      'rotateX(' + (-y * MAX_DEG).toFixed(2) + 'deg)';

    // 高光位置跟随光标（CSS 里用 --mx / --my 画径向渐变）
    active.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
    active.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
  }

  document.addEventListener(
    'pointermove',
    function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      var card = e.target && e.target.closest ? e.target.closest('.card') : null;

      if (card !== active) {
        reset();
        if (card) {
          active = card;
          card.classList.add('is-tilting');
        }
      }
      if (!active) return;

      px = e.clientX;
      py = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(frame);
    },
    { passive: true }
  );

  // 指针移出窗口 / 窗口失焦时复位，否则卡片会卡在倾斜状态
  document.addEventListener('pointerleave', reset, { passive: true });
  window.addEventListener('blur', reset);
})();
