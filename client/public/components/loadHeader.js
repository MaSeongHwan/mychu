// /src/components/loadHeader.js
export async function loadHeader() {
  const res = await fetch('/components/header.html');
  const html = await res.text();

  const temp = document.createElement('div');
  temp.innerHTML = html;

  // header 삽입
  const headerElement = temp.querySelector('header');
  if (headerElement) {
    document.body.insertBefore(headerElement, document.body.firstChild);
  }

  // CSS도 동적으로 로딩 (중복 방지)
  const cssPath = '/components/header.css';
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssPath;
    document.head.appendChild(css);
  }
}
