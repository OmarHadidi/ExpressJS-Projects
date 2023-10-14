module.exports = {
    /**
     * @param {*} obj
     * @param {*} {exclude, onlyInclude}
     *
     * Provide only one of `excludedAtts` and `onlyInclude`
     * @returns Returns object containing 2 things:
     * - `obj` same as given `obj` but filtered from `excluded` props
     * - `excluded` Array contain removed attributes
     */
    exclude({ ...obj }, { exclude, onlyInclude }) {
        const excluded = [];
        if (onlyInclude && onlyInclude.length)
            for (const k in obj) {
                if (!onlyInclude.includes(k)) {
                    excluded.push(k);
                    delete obj[k];
                }
            }
        else
            for (const ex of exclude) {
                if (!(ex in obj)) continue;
                excluded.push(ex);
                delete obj[ex];
            }
        return { filtered: obj, excluded };
    },
};
