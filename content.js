chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse){
      console.log(message.type);
      console.log(message.type);
    if( message.action === 'render' && message.type !== ''){
      addFilter(message.type);
      sendResponse(true);
    }
    else {
      revertColors();
      sendResponse(true);
    }
  }
);

function injectSVG() {
  let injectedCB = document.getElementById('injectedCB');
  if (injectedCB) {
    return;
  }
    let svgFilters = '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="full"> <filter id="적색맹"> <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0" in="SourceGraphic" /> </filter> <filter id="적색약"> <feColorMatrix type="matrix" values="0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="녹색맹"> <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="녹색약"> <feColorMatrix type="matrix" values="0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="청색맹"> <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="청색약"> <feColorMatrix type="matrix" values="0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="색맹"> <feColorMatrix type="matrix" values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> <filter id="색약"> <feColorMatrix type="matrix" values="0.618,0.320,0.062,0,0 0.163,0.775,0.062,0,0 0.163,0.320,0.516,0,0 0,0,0,1,0" in="SourceGraphic" /> </filter> </svg>';

    let div = document.createElement('div');
    div.id = 'injectedCB';
    div.innerHTML = svgFilters;
    document.getElementsByTagName('head')[0].appendChild(div);
}

function addFilter(filter) {
    injectSVG();
    revertColors();

    let cbFilter = `url('#${filter.toLowerCase()}')`;
    applyingStyle(cbFilter);
}

function revertColors() {
    applyingStyle("");
}

function applyingStyle(filter) {
    let page = document.getElementsByTagName('body')[0];

    page.style.filter = filter;
    page.style.webkitFilter = filter;
    page.style.mozFilter = filter;
    page.style.oFilter = filter;
    page.style.msFilter = filter;
}
