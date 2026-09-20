/* ============================================================================
   giscus 评论框跟随站点主题

   为什么需要这段：评论框是 giscus.app 上的一个跨域 iframe，本页改不了它
   内部的样式，只能给它发 postMessage，而构建 HTML 的时候无从得知浏览器
   选的是深色还是浅色，data-theme 只能写一个静态初值，所以必须在这里纠正

   两个触发点：

     1. giscus 主动发消息过来，这是它「我活了」的唯一信号 ——
        giscus 没有专门的 ready 事件，而且 data-loading="lazy" 时 iframe
        要等滚动到附近才被创建，靠时机去猜更不可能

        **早于这个时刻发的消息会被直接丢掉**，因为 iframe 里的页面还没
        注册好监听，这是最容易踩的坑：在 DOM 里 querySelector 看到 iframe
        就发消息，以为成功了，其实石沉大海 —— 而且不报任何错

     2. html 的 data-theme 变了（用户点了切换按钮）

        这里用 MutationObserver 盯属性，而不是去 theme.js 里埋钩子：
        改这个属性的地方有三处（head.html 的内联脚本、切换按钮、
        跟随系统偏好的监听），盯属性等于把三条路一次覆盖，
        以后再加第四条也不用回来改这里
   ========================================================================== */
(function () {
  'use strict';

  var ORIGIN = 'https://giscus.app';

  // 没有评论区就直接退出，只有文章页会渲染 .giscus，
  // 但脚本是全站加载的（和 tilt.js 一样）
  if (!document.querySelector('.giscus')) return;

  var root = document.documentElement;
  var sent = null;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // force = true 时不看记录、一定发
  // 用在「iframe 刚活过来」的时候：它可能刚被重建过，之前发的不算数
  function sync(force) {
    var theme = currentTheme();
    if (!force && theme === sent) return;

    var iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme } } },
      ORIGIN
    );
    sent = theme;
  }

  window.addEventListener('message', function (e) {
    // 跨域消息必须同时验来源和结构，缺一不可：
    // 页面上的第三方脚本也能往这里发消息
    if (e.origin !== ORIGIN) return;
    if (!e.data || typeof e.data !== 'object' || !e.data.giscus) return;

    sent = null;
    sync(true);
  });

  new MutationObserver(function () {
    sync(false);
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();
