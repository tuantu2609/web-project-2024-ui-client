export const setBodySectionMarginTop = () => {
    const header = document.querySelector(".header-section");
    const bodySection = document.querySelector(".body-section");
  
    if (header && bodySection) {
      const headerHeight = header.offsetHeight;
      bodySection.style.marginTop = `${headerHeight}px`;
    }
  };
  