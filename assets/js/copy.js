/* ============================================================================
   代码块的「复制」按钮

   按钮是 JS 现加的，模板里没有，这么做有两个好处：
     - 不碰 Hugo 的高亮管线，Chroma 输出的那点结构我们原样不动
     - 以后新写的文章自动就有，Markdown 里不用写任何东西

   两个必须绕开的坑：
     1. 按钮要放在 <pre> 外面。<pre> 是横向滚动的容器，
        按钮塞进去会跟着代码一起滚走，所以外面包一层 .code-wrap 定位
     2. 取文本必须用 textContent，不能用 innerText。
        innerText 会按「渲染结果」重新排版，缩进和空行会被吃掉，
        复制出来的代码贴回编辑器层级就全乱了
   ========================================================================== */
(function () {
  'use strict';

  // http 这类非安全上下文下 navigator.clipboard 是 undefined，
  // 这时干脆不加按钮，免得点了一直没反应
  if (!navigator.clipboard) return;

  // 复制成功后按钮显示「已复制」，隔多久变回「复制」
  var RESET_MS = 1600;

  document.querySelectorAll('.post-body pre').forEach(function (pre) {
    var wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制这段代码');

    var timer = 0;

    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.textContent).then(
        function () {
          btn.textContent = '已复制';
          btn.classList.add('is-copied');
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.textContent = '复制';
            btn.classList.remove('is-copied');
          }, RESET_MS);
        },
        function () {
          // 写剪贴板被浏览器拒绝（比如没给权限），保持原样即可
        }
      );
    });

    wrap.appendChild(btn);
  });
})();
