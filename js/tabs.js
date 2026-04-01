(function setupTabs() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  function syncAboutImageHeight() {
    const about = document.getElementById("about");
    if (!about || about.hidden) return;

    const textCol = about.querySelector(".about-layout > div");
    const photoBox = about.querySelector(".about-photo-box");
    const image = about.querySelector(".about-photo");
    if (!textCol || !photoBox || !image) return;

    const textHeight = Math.ceil(textCol.getBoundingClientRect().height);
    photoBox.style.height = `${textHeight}px`;
    image.style.height = "100%";
    image.style.maxHeight = `${textHeight}px`;
  }

  function showTab(tabId) {
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tabId;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.tab === tabId);
    });

    requestAnimationFrame(syncAboutImageHeight);
  }

  function currentTabFromHash() {
    const hash = window.location.hash.replace("#", "").trim();
    const valid = new Set(["about", "publications", "cv", "blog"]);
    return valid.has(hash) ? hash : "about";
  }

  showTab(currentTabFromHash());
  window.addEventListener("hashchange", () => showTab(currentTabFromHash()));
  window.addEventListener("resize", syncAboutImageHeight);

  const aboutImage = document.querySelector(".about-photo");
  if (aboutImage) {
    aboutImage.addEventListener("load", syncAboutImageHeight);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncAboutImageHeight);
  }
})();
