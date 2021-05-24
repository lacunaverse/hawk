import { build } from './util';

const results = document.body.querySelector('#results') as HTMLDivElement;

(() => {
    if (document.body.querySelector('table')) {
        document.body.querySelectorAll<HTMLElement>('td[data-type]').forEach((i) => {
            switch (i.dataset.type) {
                case 'text': {
                    const input = build('input', {
                        type: 'text',
                        pattern: String(i.dataset.validator),
                        placeholder: '...',
                        class: 'user-data user-data-text',
                    });
                    i.appendChild(input);

                    break;
                }
                case 'boolean': {
                    const input = build('input', {
                        type: 'checkbox',
                        checked: 'false',
                        class: 'user-data user-data-boolean',
                    });
                    i.appendChild(input);
                    break;
                }
                case 'number': {
                    const input = build('input', {
                        type: 'number',
                        placeholder: '...',
                        class: 'user-data user-data-number',
                    });
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

document.body.querySelector('#save-btn')?.addEventListener('click', async () => {
    const toSync: [
        {
            name: string;
            updatedValue: string;
        }
    ] = [];
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
