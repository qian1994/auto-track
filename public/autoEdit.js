window.onload = function () {
  window.parent.postMessage(document.querySelector('#root').innerHTML, 'http://easinote-dev.test.seewo.com:3000')
  window.addEventListener('message', (event) => {
    if (!event.origin.includes('http://easinote-dev.test.seewo.com') || !event.data) {
      return
    }
    const id = event.data
    if (id === 'getSelectXpath') {
      const dom = document.querySelector('.auto-edit-select')
      const className = dom.className
      let text = ''
      dom.className = dom.className.replace('auto-edit-select', '')
      let selector = window.OptimalSelect.getSingleSelector(dom, {
        root: document,
        priority: ['id', 'class', 'href', 'src', 'value', 'data-*'],
      })
      if (dom.childElementCount < 3) {
        text = dom.textContent.substring(0, 10)
      }
      selector = encodeURIComponent(selector.replace(/\(\d+\)/g, "").replace(/:nth-of-type/g, ''))
      window.parent.postMessage(`selectId&&${selector}&&${text}`, 'http://easinote-dev.test.seewo.com:3000');
      dom.className = className
      return;
    }
    if (document && typeof id === 'string' && document.querySelector(id)) {
      document.querySelectorAll('.auto-edit-select').forEach(item => {
        item.className = item.className.replace('auto-edit-select', '')
      })
      const className = document.querySelector(id).className
      document.querySelector(id).className = className ? `${className} auto-edit-select` : 'auto-edit-select'
    }
  })
  document.addEventListener('DOMNodeInserted',function(){
    setTimeout(() => {
      window.parent.postMessage(document.querySelector('#root').innerHTML, 'http://easinote-dev.test.seewo.com:3000')
    }, 300)
  },false);
  document.addEventListener('DOMNodeRemoved',function(){
    setTimeout(() => {
      window.parent.postMessage(document.querySelector('#root').innerHTML, 'http://easinote-dev.test.seewo.com:3000')

    }, 300)
    console.log(document.querySelector('#root').innerHTML)
  },false);
}