// trick from thomaswilburn to emulate jquery selector
// https://thomaswilburn.github.io/viz-book/js-jquery.html
var $ = (selector, d = document) =>
  Array.prototype.slice.call(d.querySelectorAll(selector));
$.one = (s, d = document) => d.querySelector(s);

//shim for IE
var matches = document.body.matchesSelector ? 'matchesSelector' : 'matches';

var closest = function(element, selector, root = document) {
  //walk up the tree until we match or run out of elements
  while (!element[matches](selector) && element) {
    element = element.parentElement;
  }
  //if we hit the root, that's not a match
  if (element == root) return null;
  return element;
};

/* Share modal */
const shareListener = e => {
  const $button = closest(e.target, 'button');
  const $menu = $button.parentElement.querySelector('.share-menu');
  $menu.classList.toggle('active');
};

/* Share on Facebook */
const shareFacebook = e => {
  e.preventDefault();
  const uri = encodeURIComponent(window.location.href);
  const href = `https://www.facebook.com/sharer/sharer.php?u=${uri}&t=${
    document.title
  }`;
  window.open(
    href,
    '',
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  );
};

/* Share on Twitter */
const shareTwitter = e => {
  e.preventDefault();
  const uri = encodeURIComponent(window.location.href);
  const href = `https://twitter.com/share?url=${uri}&via=${
    window.siteTwitter
  }&text=${window.tweetText}`;
  window.open(
    href,
    '',
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  );
};

/* Share on email */
const shareEmail = e => {
  e.preventDefault();
  const uri = encodeURIComponent(window.location.href);
  const href = `mailto:?subject=${document.title}, by ${window.siteName}&body=${
    window.tweetText
  } Read: ${uri}`;
  window.open(href);
};

/* Print page */
const sharePrint = () => {
  window.print();
  return false;
};

/* Our main function */
function initSocial() {
  $('button.share').forEach(el => el.addEventListener('click', shareListener));
  $('.share--facebook').forEach(el =>
    el.addEventListener('click', shareFacebook)
  );
  $('.share--twitter').forEach(el =>
    el.addEventListener('click', shareTwitter)
  );
  $('.share--email').forEach(el => el.addEventListener('click', shareEmail));
  $('.share--print').forEach(el => el.addEventListener('click', sharePrint));
}

window.onload = initSocial;
