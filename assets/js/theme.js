/* ============================================================================
   主题切换

   首屏的主题判定已经在 layouts/partials/head.html 的内联脚本里完成
   （必须早于样式表，否则暗色用户会看到一闪的白屏）
   这里只做两件事：显示按钮、处理点击
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  // 取消 hidden —— 只有 JS 可用时才显示按钮（渐进增强）
  // 若脚本加载失败，用户不会看到一个点了没反应的死按钮
  btn.hidden = false;

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* 隐私模式 / 禁用存储时 localStorage 会抛错，忽略即可 */
    }
  });

  // 用户没有手动选过时，跟随系统偏好实时变化
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function onSystemChange(e) {
    var stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (err) {}
    if (stored === 'dark' || stored === 'light') return; // 已显式选择，不覆盖用户意图
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', onSystemChange);
  } else if (mq.addListener) {
    mq.addListener(onSystemChange); // 老版 Safari
  }
})();
