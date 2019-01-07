import { Container } from 'unstated';
import { ok, equal } from 'assert';

class Filterable extends Container {
    constructor() {
        super();
        const filters = new WeakMap();

        const isFn = (fn) => 
            equal(typeof fn, 'function', `expected argument 'fn' `+
            `to be of type 'function', instead got ${typeof fn}`);

        this.withFilters = (fn, filter) => {
            isFn(fn);
            ok(filter != null, `argument 'filter' is required`);

            filters.set(fn, filter);
            return fn;
        };

        this.filter = classifier => {
            const fns = Object.keys(this)
                .filter(key => 
                    typeof this[key] === 'function' && 
                    ['withFilters', 'filter'].indexOf(key) === -1)
                .map(key => ({ fn: this[key], name: key }));

            const selected = {};

            fns.forEach(descriptor => {
                const { fn, name } = descriptor;
                if (!filters.has(fn)) 
                    return;

                const filter = filters.get(fn);
                if (classifier(filter)) {
                    selected[name] = fn;
                }

            })

            return selected;
        };
       
        this.remove = fn => (isFn(fn), filters.delete(fn));
    }
}
