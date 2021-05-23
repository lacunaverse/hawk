export function build<K extends keyof HTMLElementTagNameMap>(
    type: string | K,
    attributes?: { [key: string]: string } | string,
    ...children: (HTMLElement | Element | string)[]
) {
    let element = document.createElement(type);

    if (attributes && typeof attributes == 'string') {
        element.textContent = attributes;
    } else if (attributes && typeof attributes == 'object' && attributes.text) {
        element.textContent = attributes.text;
    }

    if (typeof attributes == 'object' && attributes != null) {
        Object.keys(attributes).forEach((item) => {
            if (item == 'text') return;
            if (element.hasAttribute(item) || item in element) {
                element.setAttribute(item, attributes[item]);
            } else if (item == 'class') {
                element.classList.add(...attributes[item].split(' '));
            } else if (item.startsWith('data_')) {
                element.dataset[item.replace('data_', '')] = attributes[item];
            }
        });
    }

    if (children.length > 0) {
        children.forEach((i) => {
            if (typeof i == 'string') {
                element.appendChild(document.createTextNode(i));
            } else {
                element.appendChild(i);
            }
        });
    }

    return element;
}
