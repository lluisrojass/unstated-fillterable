import React from 'react';
import { Container, Subscribe } from 'unstated';

class Filterable extends Container {
    constructor() {
        super();
        const filters = new WeakMap();
        const isNotInternal = fnName => 
            ['registerFilter', 'filter', 
            'removeFilter', '_unregistered'].indexOf(fnName) === -1;
        /**
         * Attach filters to a function.
         * Function must be a member of the
         * current instance.
         * @param {Function} fn 
         * @param {Any} filter
         * @returns {Function} function that was given
         */
        this.registerFilter = (fn, filter) => {
            assertFn('fn', fn);
            if (filter == null) 
                throw new TypeError(`argument 'filter' is required`);

            filters.set(fn, filter);
            return fn;
        };
        /**
         * Iterate through registered functions,
         * classifying target functions.
         * @param {Function} classifier invoked with 
         * a registered function's filter value, must 
         * return a boolean.
         * @returns {Object} populated with passing 
         * functions.
         */
        this.filter = classifier => {
            assertFn('classifier', classifier);

            const selected = {};
            const fnKeys = Object.keys(this)
                .filter(isNotInternal)
                .filter(key => typeof this[key] === 'function');

            fnKeys.forEach(key => {
                const fn = this[key];
                const filter = filters.get(fn);

                if (!filter) 
                    return;
                if (classifier(filter))
                    selected[key] = fn;
            });

            return selected;
        };
        /**
         * Remove a registered filter for 
         * a given function.
         * @returns {Boolean} denotes whether 
         * an entry was removed.
         */
        this.removeFilter = fn => {
            assertFn('fn', fn);
            return filters.delete(fn);
        };
        /**
         * Obtain all functions
         * which do not have a 
         * registered filter entry.
         * @returns {Object} contains unregistered
         * functions.
         */
        this._unregistered = () => {
            const selected = {};
            Object.keys(this)
                .filter(isNotInternal)
                .filter(key => 
                    !filters.has(this[key]) && 
                    typeof this[key] === 'function'
                )
                .forEach(key => {
                    selected[key] = this[key];
                });

            return selected;
        }
    }
}
/**
 * Decorate a React Component to Subscribe 
 * to containers.
 * @param {Object[]} filterOptions 
 * @param {React.Component} Component 
 * @returns {React.Component} 
 */
const withFilters = (filterOptions, Component) => {
    let safeOptions;
    if (isObject(filterOptions))
        safeOptions = [filterOptions];
    else if (Array.isArray(filterOptions))
        safeOptions = filterOptions;
    else 
        throw new TypeError(`expected argument 'filterOptions' `+
            `to be of a valid plain object or array, `+
            `instead got '${filterOptions == null ? 
                'null' : typeof filterOptions}'`);

    const containers = safeOptions.map(options => {
        if (!(options.container instanceof Container)) 
            throw new TypeError('filterOption.container must be '+
                'a valid unstated container');

        return options.container;
    });

    return (props) => (
        <Subscribe to={containers}>
        {   
            function() {
                const refined = arguments.map((container, index) => {
                    if (!(container instanceof Filterable))
                        return container;

                    const options = safeOptions[index];
                    if (!options.filter)
                        return container;

                    let { filter } = options;
                    assertFn('filter', filter);
                    let filtered = container.filter(filter);

                    if (options.passState)
                        filtered.state = container.state;

                    if (options.loose) {
                        const inverse = container._unregistered();
                        Object.assign(filtered, inverse);
                    }

                    return filtered;
                });

                return <Component {...refined} {...props} />
            } 
        }
        </Subscribe>
    );
}

function isObject(obj) {
    const toString = Object.prototype.toString;
    return toString.call(obj) === toString.call({});
}

function assertFn(argName, arg){
    if (typeof arg !== 'function') 
        throw new TypeError(`expected argument `+
            `'${argName}' to be of type 'function', `+
            `instead got '${typeof arg}'`);
}

export {
    Filterable,
    withFilters
}
