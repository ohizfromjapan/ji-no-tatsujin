'use strict';
// スクロール演出：一度表示した内容は隠さない。JavaScript無効時にも全文を表示。
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  // 思いの五文は一括表示せず、各文が画面の読みやすい位置へ来た時に表示。
  // 時間差の自動再生やスクロールの固定は行わず、読者のスクロールに従う。
  const readingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        readingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -15% 0px' });
  document.querySelectorAll('.thought-line').forEach(el => readingObserver.observe(el));
  document.documentElement.classList.add('motion');
}
// モバイルナビ：開閉状態を読み上げ、リンク選択・Escapeキーで閉じる。
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); toggle.focus(); } });
// 作品拡大：画像は添付の原画をそのまま使用。dialogがフォーカスを管理。
const dialog = document.querySelector('#art-dialog');
const expandedImage = document.querySelector('#dialog-image');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const original = button.querySelector('img'); expandedImage.src = original.src; expandedImage.alt = original.alt;
  document.querySelector('#dialog-caption').textContent = original.alt; dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if(e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
// フォームは標準HTML送信を使用。ブラウザの必須項目・メール形式検証を維持する。
// 受信先の変更はindex.htmlのform actionと連絡先表記を合わせて更新してください。
