const clearFilter = (image, filterId) => {
  setFilter(image, "");
  deactive(filterId);
};

const setActive = filterId => {
  if (filterId) {
    document.getElementById(filterId).className = "active";
  }
};

const deactive = filterId => {
  if (filterId) {
    document.getElementById(filterId).className = "";
  }
};

const setFilter = (image, filter) => {
  setActive(filter);

  let filterURL = `url('#${filter.toLowerCase()}')`;

  // save filter to storage
  chrome.storage.sync.set({'filter':filter}, () => {
  });

  // send message to content.js
  chrome.tabs.getSelected(function(tab){
    chrome.tabs.sendMessage(tab.id, {
      action: 'render',
      type: filter
    });
  });
};

const toggleOnOff = () => {
  let off = document.getElementsByClassName("off")[1];
  let on  = document.getElementsByClassName("on")[1];

  if (on.className === "on") {
  console.log(on);
    off.className = "off";
    off.style.backgroundColor = "white";
    on.className += " active";
    on.style.backgroundColor = "green";
  } else if (off.className === "off") {
    on.className = "on";
    on.style.backgroundColor = "white";
    off.className += " active";
    off.style.backgroundColor = "red";
  }
}

const toggleOnOff_a = () => {
  let off = document.getElementsByClassName("off")[0];
  let on  = document.getElementsByClassName("on")[0];

  if (on.className === "on") {
  console.log(on);
    off.className = "off";
    off.style.backgroundColor = "white";
    on.className += " active";
    on.style.backgroundColor = "green";
  } else if (off.className === "off") {
    on.className = "on";
    on.style.backgroundColor = "white";
    off.className += " active";
    off.style.backgroundColor = "red";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let list = document.getElementsByTagName('li');
  let image = document.getElementsByTagName('body')[1];
  let currentFilter = "적색맹";

  list = Array.prototype.slice.call(list);
  injectSVG();

  chrome.storage.sync.get(["filter"], (savedFilter) => {
    filter = savedFilter.filter;
    if (filter !== "") {
      toggleOnOff();
      currentFilter = filter;
    }
    setFilter(image, filter);
  });

  document.getElementById('about').addEventListener("click", e => {
    e.preventDefault();
    let newURL = "https://imahungrypanda.github.io/Prism/";
    chrome.tabs.create({ url: newURL });
  });

  list.forEach(li => {
    li.addEventListener('click', e => {
      if (document.getElementsByClassName("off")[1].className !== "off") {
        toggleOnOff();
      }
      deactive(currentFilter);
      currentFilter = e.target.textContent;
      setFilter(image, currentFilter);
    });
  });

  document.getElementsByClassName("on")[1].addEventListener("click", () => {
    toggleOnOff();
    if (!currentFilter) {
      currentFilter = "적색맹";
    }
    setFilter(image, currentFilter);
  });

  document.getElementsByClassName("off")[1].addEventListener("click", () => {
    toggleOnOff();
    clearFilter(image, currentFilter);
  });

  document.getElementsByClassName("on")[0].addEventListener("click", () => {
    toggleOnOff_a();
  });

  document.getElementsByClassName("off")[0].addEventListener("click", () => {
    toggleOnOff_a();
  });
});
