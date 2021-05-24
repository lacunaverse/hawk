import { build } from './util';

// create a new metric
const name = document.body.querySelector('#metric-name') as HTMLInputElement;
const description = document.body.querySelector('#metric-description') as HTMLInputElement;
const type = document.body.querySelector('#metric-type') as HTMLInputElement;
const frequency = document.body.querySelector('#metric-frequency') as HTMLInputElement;
const submit = document.body.querySelector('#metric-create') as HTMLInputElement;
const results = document.body.querySelector('#results') as HTMLDivElement;

const icons = {
    error: document.body.querySelector('#error-icon')?.cloneNode(true) as HTMLElement,
    close: document.body.querySelector('#close-icon')?.cloneNode(true) as HTMLElement,
};

Object.values(icons).forEach((i) => i.classList.remove('hidden'));

(() => {
    const areValid: { [key: string]: boolean } = {
        name: false,
        description: false,
        type: false,
        frequency: false,
    };

    function validate(this: HTMLInputElement) {
        if (this.validity.valid == true) {
            areValid[this.id.slice(7)] = true;
        } else {
            areValid[this.id.slice(7)] = false;
        }

        if (Object.values(areValid).every((i) => i == true) == true) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    }

    Object.keys(areValid).forEach((i) =>
        validate.call(document.body.querySelector(`#metric-${i}`) as HTMLInputElement)
    );

    const forms = {
        name: name.value,
        description: description.value,
        type: type.value,
        frequency: frequency.value,
    };

    Object.keys(forms).forEach((i) => {
        document.body.querySelector(`#metric-${i}`)?.addEventListener('keydown', validate);
        document.body.querySelector(`#metric-${i}`)?.addEventListener('input', validate);
    });
})();

submit.addEventListener('click', () => {
    const forms = {
        name: name.value,
        description: description.value,
        type: type.value,
        frequency: frequency.value,
    };

    Object.keys(forms).forEach((i) => document.body.querySelector(`#metric-${i}`)?.classList.remove('invalid'));

    const removeResults = () => results.childNodes.forEach((i) => i.remove());
    removeResults();

    const isValid = Object.values(forms).find((i) => i.length <= 0);
    if (isValid == undefined) {
        const serialized = JSON.stringify(forms);
        fetch('/metrics/new', {
            body: serialized,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => {
                if (r.status != 200) {
                    throw r.status;
                } else return r.json();
            })
            .then((_) => {
                const p = build('p', 'Success! Your new metric was created.');

                results.appendChild(p);
            })
            .catch((err) => {
                let errCode: string[] = ['', ''];
                switch (err) {
                    case 409: {
                        errCode = [
                            'A metric with that name already exists!',
                            'Try renaming it and then submit it again.',
                        ];
                        break;
                    }
                    default:
                        errCode = ['Something went wrong while trying to save the metric.', 'Please try again'];
                }

                results.classList.add('error');

                const close = icons.close;
                close.classList.add('close-btn');
                close.addEventListener('click', () => close.parentElement?.remove());

                removeResults();

                results.appendChild(
                    build(
                        'p',
                        {},
                        close,
                        ...errCode.map((i, idx) =>
                            idx == 0 ? build('p', {}, icons.error, build('strong', i)) : build('p', i)
                        )
                    )
                );
            });
    } else {
        Object.entries(forms).forEach(([key, value]) => {
            if (value.length == 0) {
                document.body.querySelector(`#metric-${key}`)?.classList.add('invalid');
            }
        });
    }
});
