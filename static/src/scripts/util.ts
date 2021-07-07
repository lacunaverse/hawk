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

const NUMBER_OF_BATCHES = 25;
export function append(parent: HTMLElement, ...children: (HTMLElement | Element | string)[]) {
    const write = (kids: any[]) => {
        const frag = document.createDocumentFragment();
        kids.forEach((i) => {
            let el;
            if (typeof i == 'string') {
                el = document.createTextNode(i);
            }
            if (el != undefined) {
                frag.appendChild(el);
            } else {
                frag.appendChild(i);
            }
        });
        requestAnimationFrame(() => {
            parent.appendChild(frag);
        });
    };
    if (children.length >= 250) {
        const distance = children.length / NUMBER_OF_BATCHES;
        let i = 0;
        while (i < children.length) {
            const r = i;
            setTimeout(() => write(children.slice(r, r + distance)), 0);
            i += distance;
        }
    } else {
        setTimeout(() => write(children), 0);
    }
    return parent;
}
