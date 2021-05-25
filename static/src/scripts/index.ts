import { build } from './util';

const results = document.body.querySelector('#results') as HTMLDivElement;
const save = document.body.querySelector('#save-btn') as HTMLInputElement;

const search = document.body.querySelector('#search-box') as HTMLInputElement;
const table = document.body.querySelector('table');

interface Query {
    str: string;
    original: string;
    exclude: string[];
    include: string[];
}

const parseQuery = (query: string): Query => {
    const q: Query = {
        str: '',
        original: query,
        exclude: [],
        include: [],
    };
    q.exclude = query.match(/-:(bool|text|number)/gi)?.map((i) => i.slice(2)) as string[];
    query = query.replace(/-:(bool|text|number)/gi, '');

    q.include = query.match(/:(bool|text|number)/gi)?.map((i) => i.slice(1)) as string[];
    query = query.replace(/:(bool|text|number)/gi, '');

    q.str = query;

    return q;
};

function filter(evt: Event) {
    const query = search.value;
    const q = parseQuery(search.value);
    if (table) {
        table.querySelectorAll('tbody tr').forEach((i) => {
            if (query.length != 0 && !i.textContent?.includes(q.str)) {
                i.classList.add('hidden');
                // @ts-expect-error
            } else if (query.length == 0 || evt.inputType == 'deleteContentBackward') {
                i.classList.remove('hidden');
            }

            const $el = i.querySelector<HTMLElement>('td[data-type]');
            if ($el) {
                const type = $el.dataset.type as string;

                if (q.exclude?.includes(type)) {
                    i.classList.add('hidden');
                } else if (q.include?.includes(type)) {
                    i.classList.remove('hidden');
                }
            }
        });
    } else if (table && query.length == 0) {
    }
}

search.addEventListener('input', filter);

(() => {
    function unblur() {
        save.disabled = false;
    }

    if (table) {
        table.querySelectorAll<HTMLElement>('td[data-type]').forEach((i) => {
            switch (i.dataset.type) {
                case 'text': {
                    const input = build('input', {
                        type: 'text',
                        placeholder: '...',
                        class: 'user-data user-data-text',
                    }) as HTMLInputElement;
                    input.addEventListener('input', unblur);
                    if (i.dataset.validator) input.pattern = String(i.dataset.validator);
                    i.appendChild(input);

                    break;
                }
                case 'boolean': {
                    const input = build('input', {
                        type: 'checkbox',
                        checked: 'false',
                        class: 'user-data user-data-boolean',
                    });
                    input.addEventListener('change', unblur);
                    i.appendChild(input);
                    break;
                }
                case 'number': {
                    const input = build('input', {
                        type: 'number',
                        placeholder: '...',
                        class: 'user-data user-data-number',
                    });
                    input.addEventListener('change', unblur);
                    i.appendChild(input);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
})();

save.addEventListener('click', async () => {
    save.disabled = true;
    save.blur();

    const toSync: {
        name: string;
        updatedValue: string;
    }[] = [];
    document.body.querySelectorAll<HTMLInputElement>('td .user-data').forEach((i) => {
        if (i.classList.contains('user-data-text') || i.classList.contains('user-data-number')) {
            toSync.push({
                name: String(i.parentElement?.previousElementSibling?.previousElementSibling?.textContent),
                updatedValue: i.value,
            });
        } else if (i.classList.contains('user-data-boolean')) {
            toSync.push({
                name: String(i.parentElement?.previousElementSibling?.previousElementSibling?.textContent),
                updatedValue: String(i.checked),
            });
        } else {
        }

        i.replaceWith(build('p', 'All set!'));
    });

    try {
        const serialized = JSON.stringify(toSync);
        const resp = await fetch('/log', {
            body: serialized,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (resp.status == 200) {
            results.appendChild(build('p', 'Success! Your data was logged.'));
        } else {
        }
    } catch (err) {}
});
