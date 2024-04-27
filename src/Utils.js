/**
 * Changes the favicon of the tab to the given image link.
 * @param href
 */
export const changeFavicon = (href) => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
        link.href = href;
    } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = href;
        document.head.appendChild(newLink);
    }
};