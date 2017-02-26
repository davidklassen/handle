export function walk(dir, fs) {
    let i = 0;
    const results = [];
    const list = fs.readdirSync(dir);

    (function next() {
        let file = list[i++];
        if (!file) return;
        file = (dir === '/' ? '/' : (dir + '/')) + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results.push(...walk(file));
            next();
        } else {
            results.push(file);
            next();
        }
    })();

    return results;
}
