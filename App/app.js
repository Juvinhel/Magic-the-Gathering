Array.prototype.removeIf = function (callback) {
    let i = this.length;
    while (i--)
        if (callback(this[i], i))
            this.splice(i, 1);
    return this;
};
Array.prototype.removeAt = function (index) {
    return this.splice(index, 1)[0];
};
Array.prototype.remove = function (element) {
    this.removeIf(x => x == element);
};
Array.prototype.removeAll = function (elements) {
    let i = this.length;
    while (i--) {
        if (elements.includes(this[i]))
            this.splice(i, 1);
    }
};
Array.prototype.insertAt = function insertAt(index, ...elements) {
    this.splice(index, 0, ...elements);
};
Array.prototype.drawRandom = function () {
    if (this.length == 0)
        return null;
    const i = Math.floor(Math.random() * this.length);
    const element = this.removeAt(i);
    return element;
};
Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
Array.prototype.clone = function () {
    const clone = [];
    this.forEach(x => clone.push(x));
    return clone;
};
Array.prototype.repeat = function (times) {
    const clone = [];
    for (let i = 0; i < times; ++i)
        clone.push(...this);
    return clone;
};
Array.prototype.first = function (predicate) {
    if (predicate) {
        for (const item of this)
            if (predicate(item))
                return item;
    }
    else
        return this[0];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};
Array.prototype.min = function (selector) {
    let min = Number.MAX_VALUE;
    let index = 0;
    for (const element of this) {
        const no = selector(element, index++);
        if (no < min)
            min = no;
    }
    return min;
};
Array.prototype.max = function (selector) {
    let max = Number.MIN_VALUE;
    let index = 0;
    for (const element of this) {
        const no = selector(element, index++);
        if (no > max)
            max = no;
    }
    return max;
};
Array.prototype.largest = function (selector) {
    let currentNo;
    let currentItem;
    for (const item of this) {
        const no = selector(item);
        if (currentNo == null || no > currentNo) {
            currentNo = no;
            currentItem = item;
        }
    }
    return currentItem;
};
Array.prototype.smallest = function (selector) {
    let currentNo;
    let currentItem;
    for (const item of this) {
        const no = selector(item);
        if (currentNo == null || no < currentNo) {
            currentNo = no;
            currentItem = item;
        }
    }
    return currentItem;
};
Array.prototype.mapMany = function (converter) {
    const ret = [];
    for (const item of this) {
        for (const result of converter(item))
            ret.push(result);
    }
    return ret;
};
Array.prototype.groupBy = function (func) {
    const ret = [];
    for (const item of this) {
        const key = func(item);
        let record = ret.first(x => x.key == key);
        if (record)
            record.items.push(item);
        else {
            record = {
                key: key,
                items: [item]
            };
            ret.push(record);
        }
    }
    return ret;
};
Array.prototype.skip = function (count) {
    return this.slice(count);
};
Array.prototype.take = function (count) {
    return this.slice(0, count);
};
Array.prototype.until = function (predicate) {
    const index = this.findIndex(predicate);
    return {
        start: this.slice(0, index),
        end: this.slice(index)
    };
};
Array.prototype.sortBy = function (selector, comparer) {
    // Schwartzian transform in place sort
    for (var i = this.length; i;) {
        var o = this[--i];
        this[i] = [].concat(selector.call(o, o, i), o);
    }
    this.sort(function (a, b) {
        for (var i = 0, len = a.length; i < len; ++i) {
            if (a[i] != b[i])
                return a[i] < b[i] ? -1 : 1;
        }
        return 0;
    });
    for (var i = this.length; i;) {
        this[--i] = this[i][this[i].length - 1];
    }
    return this;
};
Array.prototype.orderBy = function (selector, comparer) {
    const intermediate = this.map(x => [selector(x), x]);
    intermediate.sort(comparer ?
        function (a, b) {
            const ae = a[0];
            const be = b[0];
            return comparer(ae, be);
        } :
        function (a, b) {
            const ae = a[0];
            const be = b[0];
            if (ae == be)
                return 0;
            return ae > be ? 1 : -1;
        });
    return intermediate.map(e => e[1]);
};
Array.prototype.orderByThenBy = function (...selectors) {
    const intermediate = this.clone();
    intermediate.sort(function (a, b) {
        for (const selector of selectors) {
            const ae = selector(a);
            const be = selector(b);
            if (ae != be)
                return ae > be ? 1 : -1;
        }
        return 0;
    });
    return intermediate;
};
Array.prototype.sum = function (selector) {
    let ret = 0;
    selector ??= (item) => item;
    for (const item of this)
        ret += selector(item);
    return ret;
};
Array.prototype.distinct = function () {
    return this.filter((value, index, array) => array.indexOf(value) === index);
};
Array.prototype.mapAndFilter = function (callbackfn, excludeNull) {
    return this.reduce((filtered, item) => {
        const newItem = callbackfn(item);
        if (newItem === undefined)
            return filtered;
        if (excludeNull && newItem == null)
            return filtered;
        filtered.push(newItem);
        return filtered;
    }, []);
};
class ArrayHelper {
    static Create2Dimensional(w, h) {
        const ret = new Array(w);
        for (let i = 0; i < w; ++i)
            ret[i] = new Array(h);
        return ret;
    }
    static GetOrDefault2Dimensional(array, x, y) {
        if (x < 0)
            return null;
        if (y < 0)
            return null;
        if (x > array.length)
            return null;
        const row = array[x];
        if (y > row.length)
            return null;
        return row[y];
    }
    static IndexOf(array, predicate) {
        if (typeof predicate != "function") {
            const checkItem = predicate;
            predicate = (item, index) => item == checkItem;
        }
        for (let i = 0; i < array.length; ++i)
            if (predicate(array[i], i))
                return i;
        return -1;
    }
    static First(array, predicate) {
        if (!predicate)
            return array[0];
        for (let i = 0; i < array.length; ++i)
            if (predicate(array[i], i))
                return array[i];
        return null;
    }
}
Array.make = function (items) {
    return Array.isArray(items) ? items : [items];
};
Array.flatten = function (items, exclude) {
    const ret = [];
    flatten(ret, items, exclude);
    return ret;
};
// flattens possibly endless stacked iterables
function flatten(array, items, exclude) {
    if (items == null)
        return;
    if (exclude && exclude(items))
        array.push(items);
    else if (typeof items == "string" || items instanceof String)
        array.push(items);
    else if (typeof items == "object" && Symbol.iterator in items)
        for (const item of items)
            flatten(array, item, exclude);
    else
        array.push(items);
}
Array.repeat = function (count) {
    return Array.from({ length: count }, (_, i) => i);
};
Array.repeatFromTo = function (from, to) {
    return Array.from({ length: to - from }, (_, i) => i + from);
};
Array.create = function (count, ...items) {
    const ret = Array(count);
    for (let i = 0; i < count && i < items.length; ++i)
        ret[i] = items[i];
    return ret;
};
//@ts-expect-error
Array.createFixed = function (count, ...items) {
    const ret = Array.create(count, ...items);
    Object.seal(ret);
    return ret;
};
class AsyncIterablePromise {
    constructor(iterable) {
        this.iterable = iterable;
    }
    iterable;
    [Symbol.asyncIterator]() {
        return this.iterable[Symbol.asyncIterator]();
    }
    then(onfulfilled, onrejected) {
        return this.getIterable().then(onfulfilled, onrejected);
    }
    async getIterable() {
        const ret = [];
        for await (const item of this.iterable)
            ret.push(item);
        return ret;
    }
}
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
function readDataUri(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject();
        };
        reader.readAsDataURL(blob);
    });
}
class ClassObserver {
    constructor(element, classToWatch, classAddedCallback, classRemovedCallback) {
        this.element = element;
        this.classToWatch = classToWatch;
        this.classAddedCallback = classAddedCallback;
        this.classRemovedCallback = classRemovedCallback;
        this.observer = null;
        this.lastClassState = this.element.classList.contains(this.classToWatch);
        this.Observe();
    }
    element;
    classToWatch;
    classAddedCallback;
    classRemovedCallback;
    observer;
    lastClassState;
    Observe() {
        if (!this.observer)
            this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe(this.element, { attributes: true });
    }
    Disconnect() {
        this.observer.disconnect();
    }
    mutationCallback = (mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                let currentClassState = this.element.classList.contains(this.classToWatch);
                if (this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState;
                    if (currentClassState) {
                        this.classAddedCallback?.(this.element);
                    }
                    else {
                        this.classRemovedCallback?.(this.element);
                    }
                }
            }
        }
    };
}
class Comparer {
    static equals(object1, object2) {
        if (object1?._original)
            object1 = object1._original;
        if (object2?._original)
            object2 = object2._original;
        return object1 == object2;
    }
}
const ConfigHelper = new class ConfigHelper {
    async load(url = "config.json", defaults) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const result = JSON.parse(text);
            this.loadDefaults(result, defaults);
            return result;
        }
        catch {
            return this.clone(defaults);
        }
    }
    /* private */ loadDefaults(config, defaultConfig) {
        for (const key of Object.keys(defaultConfig)) {
            if (config[key] == null)
                config[key] = this.clone(defaultConfig[key]);
            else if (typeof config[key] === "object") {
                if (Array.isArray(config[key]))
                    continue;
                if (config[key] instanceof RegExp)
                    continue;
                this.loadDefaults(config[key], defaultConfig[key]);
            }
        }
    }
    /* private */ clone(obj) {
        if (typeof obj === "object") {
            if (obj instanceof RegExp) {
                return new RegExp(obj.source, obj.flags);
            }
            else if (Array.isArray(obj)) {
                const ret = [];
                for (const item of obj)
                    ret.push(this.clone(item));
                return ret;
            }
            else {
                const ret = {};
                for (const key of Object.keys(obj))
                    ret[key] = this.clone(obj[key]);
                return ret;
            }
        }
        else
            return JSON.clone(obj);
    }
}();
class Cookie {
    static Parse(text) {
        if (!text)
            return {};
        return text
            .split(";")
            .map(v => v.split("="))
            .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
    }
    static Get() {
        return this.Parse(document.cookie);
    }
}
DOMRect.prototype.getCenterX = function () {
    return (this.left + this.right) / 2;
};
DOMRect.prototype.getCenterY = function () {
    return (this.top + this.bottom) / 2;
};
DOMRect.prototype.intersects = function (rect) {
    return this.bottom > rect.top && this.right > rect.left && this.top < rect.bottom && this.left < rect.right;
};
DOMRectReadOnly.prototype.getCenterX = function () {
    return (this.left + this.right) / 2;
};
DOMRectReadOnly.prototype.getCenterY = function () {
    return (this.top + this.bottom) / 2;
};
DOMRectReadOnly.prototype.intersects = function (rect) {
    return this.bottom > rect.top && this.right > rect.left && this.top < rect.bottom && this.left < rect.right;
};
DOMTokenList.prototype.any = function (func) {
    for (const token of this)
        if (func(token))
            return true;
    return false;
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const DirectoryListing = new (class {
    deepScan(url) {
        //@ts-ignore
        return new AsyncIterablePromise(this.constructor.deepScan(url));
    }
    scan(url) {
        //@ts-ignore
        return new AsyncIterablePromise(this.constructor.scan(url));
    }
    static async *deepScan(url) {
        url = new URL(url, location.toString()).toString();
        const urls = new LinkedStack();
        const done = new LinkedStack();
        urls.unshift(url);
        while (urls.length) {
            const current = urls.shift();
            done.unshift(current);
            try {
                for await (const href of this.scan(current)) {
                    if (!href.startsWith(url))
                        continue;
                    if (done.includes(href))
                        continue;
                    // isFolder
                    if (href.endsWith("/"))
                        urls.unshift(href);
                    yield href;
                }
            }
            catch { }
        }
    }
    static async *scan(url) {
        url = new URL(url, location.toString()).toString().trimEnd("/") + "/";
        try {
            const response = await fetch(url); // folders end with /
            const text = await response.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(text, "text/html");
            const links = html.querySelectorAll("a");
            for (const link of links) {
                const hrefAttribute = link.getAttribute("href");
                if (hrefAttribute.startsWith("..") || hrefAttribute.endsWith(".."))
                    continue;
                const href = new URL(hrefAttribute, url + "index.html").toString().trimEnd("/"); // make rooted based on url
                if (hrefAttribute.endsWith("/")) // check untrimmed url
                 { // IIS Folder
                    yield href + "/";
                    continue;
                }
                if (link.classList.values().some(c => c.includes("directory"))) { // Live Server Folder
                    yield href + "/";
                    continue;
                }
                yield href; // File
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
})();
class LinkedStack {
    constructor() { }
    firstNode;
    length = 0;
    unshift(...items) {
        for (let i = items.length - 1; i >= 0; --i)
            this.singleUnshift(items[i]);
    }
    singleUnshift(item) {
        this.firstNode = { value: item, next: this.firstNode };
        ++this.length;
    }
    shift() {
        const item = this.firstNode.value;
        this.firstNode = this.firstNode.next;
        --this.length;
        return item;
    }
    includes(item) {
        for (const i of this)
            if (i == item)
                return true;
        return false;
    }
    *[Symbol.iterator]() {
        let current = this.firstNode;
        while (current?.value) {
            yield current.value;
            current = current.next;
        }
    }
}
class DownloadHelper {
    static downloadData(fileName, data, mimetype) {
        if (data instanceof String)
            data = data.toString();
        if (!mimetype)
            mimetype = typeof data == "string" ? "text/plain" : "text/json";
        data = typeof data == "string" ? data : JSON.stringify(data);
        const uri = "data:" + mimetype + "," + encodeURIComponent(data);
        const link = document.createElement('a');
        link.setAttribute('href', uri);
        link.setAttribute('download', fileName);
        link.click();
    }
    static downloadUrl(fileName, url) {
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.click();
    }
}
class Enum {
    static has(eenum, value) {
        return Object.values(eenum).includes(value);
    }
}
class DataError extends Error {
    constructor(message, data, options) {
        super(message, options);
        this.name = this.constructor.name;
        if (data)
            for (const entry of Object.entries(data))
                this[entry[0]] = entry[1];
    }
}
HTMLElement.prototype.getEvents = function () {
    return this._eventMap ?? [];
};
const addEventListenerOld = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.addEventListener = function (type, listener, options) {
    if (!this._eventMap)
        this._eventMap = [];
    this._eventMap.push({ type, listener, options });
    addEventListenerOld.bind(this)(...arguments);
    addedEventListener?.(this, type, listener, options);
};
let addedEventListener = null;
class FixedMatrix {
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.values = Array.create(width * height);
        if (data)
            for (let y = 0; y < height; ++y)
                for (let x = 0; x < width; ++x)
                    this.set(x, y, data[y][x]);
    }
    values;
    width;
    height;
    get length() { return this.width * this.height; }
    ;
    get(x, y) { return this.values[(y * this.width) + x]; }
    set(x, y, value) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.values[(y * this.width) + x] = value;
    }
    [Symbol.iterator]() {
        const matrix = this;
        let i = -1;
        return {
            next() {
                if (++i < matrix.length)
                    return { value: { x: i % matrix.width, y: Math.floor(i / matrix.width), value: matrix.values[i] }, done: false };
                return { value: undefined, done: true };
            }
        };
    }
    map(mappingFunction) {
        const ret = new FixedMatrix(this.width, this.height);
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                ret.set(x, y, mappingFunction(x, y, this.get(x, y)));
        return ret;
    }
}
class GUID {
    static Regex = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
    static Create() {
        //@ts-ignore
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
    static Validate(guid) {
        return this.Regex.test(guid);
    }
}
Element.prototype.clearChildren = function () {
    while (this.firstChild)
        this.removeChild(this.lastChild);
};
Element.prototype.findParents = function* findParents() {
    let currentElement = this;
    while (currentElement) {
        yield currentElement;
        currentElement = currentElement.parentElement;
    }
};
Element.prototype.getScrollOffset = function () {
    let top = 0, left = 0;
    let element = this;
    do {
        top += element.scrollTop ?? 0;
        left += element.scrollLeft ?? 0;
        element = element.parentElement;
    } while (element);
    return new DOMPoint(left, top);
};
Element.prototype.isInViewport = function () {
    return isInViewport(this);
};
Element.prototype.isVisible = function () {
    return isVisible(this);
};
Element.prototype.isOverflown = function () {
    return this.scrollHeight > this.clientHeight || this.scrollWidth > this.clientWidth;
};
Node.prototype.clone = function () {
    const myClone = this.cloneNode();
    for (const child of this.childNodes)
        myClone.appendChild(child.clone());
    if (this["getEvents"] == HTMLElement.prototype.getEvents) {
        let events = this.getEvents();
        for (const event of events)
            myClone.addEventListener(event.type, event.listener, event.options);
    }
    return myClone;
};
Node.prototype.insertAt = function (index, ...nodes) {
    if (index == 0 || this.childNodes.length == 0)
        this.prepend(...nodes);
    while (index < 0)
        index = this.childNodes.length + index;
    if (index > 0) {
        const nextNode = this.childNodes[index] ?? this.childNodes[this.childNodes.length - 1];
        nextNode.before(...nodes);
    }
};
HTMLCollection.prototype.cast = function () {
    return this;
};
Document.prototype.parseHTML = function* (html, executeScripts) {
    var t = this.createElement("template");
    t.innerHTML = html;
    for (const element of t.content.childNodes)
        if (element && executeScripts && "querySelectorAll" in element) {
            for (const script of element.querySelectorAll("script")) {
                const code = script.innerText;
                const scriptElement = document.createElement("script");
                var codeElement = document.createTextNode(code);
                scriptElement.appendChild(codeElement);
                script.replaceWith(scriptElement);
            }
            yield element;
        }
};
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowRect = new DOMRect(0, 0, window.innerWidth || document.documentElement.clientWidth, window.innerHeight || document.documentElement.clientHeight);
    return rect.intersects(windowRect);
}
function isVisible(element) {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.display !== "none" && computedStyle.visibility === "visible";
}
//todo: maybe used later
function applyMixins(derivedCtor, constructors) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null));
        });
    });
}
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const Integer = new class Integer {
    parse(text) {
        if (text == "NaN")
            return Number.NaN;
        if (text == "Infinity" || text == "∞")
            return Number.POSITIVE_INFINITY;
        if (text == "-Infinity" || text == "-∞")
            return Number.NEGATIVE_INFINITY;
        return parseInt(text);
    }
    toString(number) {
        if (Number.isNaN(number))
            return "NaN";
        if (number == Number.POSITIVE_INFINITY)
            return "∞";
        if (number == Number.NEGATIVE_INFINITY)
            return "-∞";
        return number.toFixed();
    }
}();
const Iterable = new class IterableHelper {
    isIterable(obj) {
        if (obj == null)
            return false;
        return typeof obj[Symbol.iterator] === "function";
    }
}();
JSON.clone = function (object) {
    if (object == null)
        return null;
    return JSON.parse(JSON.stringify(object));
};
class EasyJSON {
    constructor(reviver, replacer) {
        this.reviver = reviver;
        this.replacer = replacer;
    }
    reviver;
    replacer;
    clone(object) {
        if (object == null)
            return null;
        return this.parse(this.stringify(object));
    }
    parse(text) {
        return JSON.parse(text, this.reviver);
    }
    stringify(value) {
        return JSON.stringify(value, this.replacer);
    }
}
class Link {
    static Resolve(link, base) {
        if (!base)
            return "/" + link.trim("/");
        const result = link.startsWith("/") ? link.trim("/") : base.trim("/") + "/" + link.trim("/");
        return "/" + result;
    }
}
Location.prototype.getBase = function () {
    return this.protocol.trimEnd(":") + "://" + this.host.trimEnd("/");
};
Math.calculateHumanReadableFileSize = function (bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return bytes.toFixed(dp) + ' ' + units[u];
};
Object.getInheritedPropertyDescriptor = function findPrototypeProperty(o, p) {
    while (o && o.constructor && o.constructor.name !== 'Object') {
        let desc = Object.getOwnPropertyDescriptor(o, p);
        if (desc)
            return desc;
        o = Object.getPrototypeOf(o);
    }
    return null;
};
Object.findPath = function (tree, item) {
    for (const [key, value] of Object.entries(tree)) {
        if (value == item)
            return typeof key == "number" ? "[" + key + "]" : key;
        else if (value && typeof value === "object") {
            const path = Object.findPath(value, item);
            if (path)
                return key + "." + path;
        }
    }
    return null;
};
Object.getByPath = function (tree, path) {
    const p = path.splitFirst(".");
    let propertyName = p[0];
    if (propertyName[0] == "[" && propertyName[propertyName.length - 1] == "]")
        propertyName = parseInt(propertyName.substring(0, propertyName.length - 2));
    let propertyValue = tree[propertyName];
    if (propertyValue === undefined)
        return null;
    if (p[1])
        return Object.getByPath(propertyValue, p[1]);
    return propertyValue;
};
Object.mutate = function mutate(source, properties) {
    if (!source)
        source = {};
    if (properties)
        for (const prop in properties)
            //@ts-ignore
            source[prop] = properties[prop];
    //@ts-ignore
    return source;
};
Object.assignOwn = function (source, properties) {
    if (!source)
        return null;
    if (!properties)
        return source;
    for (const key of Object.keys(properties)) {
        if (key in source) {
            source[key] = properties[key];
        }
    }
    return source;
};
Object.isConstructor = function (value) {
    return !!value && !!value.prototype && !!value.prototype.constructor;
};
Object.isClass = function (obj) {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === "class";
    if (obj.prototype === undefined) {
        return isCtorClass;
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === "class";
    return isCtorClass || isPrototypeCtorClass;
};
Object.clone = function (obj, includePrototype) {
    if (obj === null)
        return null;
    if (obj instanceof String)
        return obj.valueOf();
    if (obj instanceof Number)
        return obj.valueOf();
    if (obj instanceof Boolean)
        return obj.valueOf();
    if (Array.isArray(obj)) {
        const ret = [];
        for (const value of obj) {
            const clonedValue = Object.clone(value, includePrototype);
            if (typeof clonedValue !== undefined)
                ret.push(clonedValue);
        }
        return ret;
    }
    if (typeof obj === "object") {
        let ret;
        if (includePrototype && obj.constructor != Object) {
            const prototype = Object.getPrototypeOf(obj);
            ret = Object.create(prototype);
            Object.defineProperties(ret, Object.getOwnPropertyDescriptors(obj));
        }
        ret ??= {};
        for (const [key, value] of Object.entries(obj)) {
            const clonedValue = Object.clone(value, includePrototype);
            if (typeof clonedValue !== undefined)
                ret[key] = clonedValue;
        }
        return ret;
    }
    switch (typeof obj) {
        case "string":
        case "number":
        case "boolean":
        case "bigint":
            return obj;
    }
    return undefined;
};
class PrefixedStorage {
    constructor(prefix) {
        this.Prefix = prefix;
    }
    Prefix;
    getItem(key) {
        return localStorage.getItem(this.Prefix + "-" + key);
    }
    removeItem(key) {
        localStorage.removeItem(this.Prefix + "-" + key);
    }
    setItem(key, value) {
        localStorage.setItem(this.Prefix + "-" + key, value);
    }
    get(key) {
        return localStorage.get(this.Prefix + "-" + key);
    }
    set(key, item) {
        localStorage.set(this.Prefix + "-" + key, item);
    }
    init(key, item) {
        localStorage.init(this.Prefix + "-" + key, item);
    }
    update(key, item) {
        localStorage.update(this.Prefix + "-" + key, item);
    }
    delete(key) {
        localStorage.delete(this.Prefix + "-" + key);
    }
    get keys() {
        return this.kkeys();
    }
    *kkeys() {
        const prefix = this.Prefix + "-";
        for (const key in localStorage.keys)
            if (key.startsWith(prefix))
                yield key.substring(prefix.length);
    }
    get length() { return [...this.keys].length; }
    clear() {
        const prefix = this.Prefix + "-";
        for (let i = 0; i < localStorage.length; ++i) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                localStorage.delete(key);
                --i;
            }
        }
    }
    key(index) { return [...this.keys][index]; }
}
class Rand {
    static Chance(chance) {
        const r = Math.random();
        chance /= 100;
        return r <= chance;
    }
    static GaussDeviation(max) {
        const v = max;
        let r = 0;
        for (let i = v; i > 0; i--) {
            r += Math.random();
        }
        return r / v;
    }
    static FromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static Pick(array) {
        if (Array.isArray(array)) {
            const rand = Math.floor(Math.random() * array.length);
            return array[rand];
        }
        else
            return this.pickWeightedList(array);
    }
    static pickWeightedList(array) {
        let total = 0;
        for (const value of array.values())
            total += value;
        const weights = [];
        let currentWeight = 0;
        for (const value of array.values()) {
            const weight = value / total;
            currentWeight += weight;
            weights.push(currentWeight);
        }
        const rand = Math.random();
        let index = weights.length - 1;
        for (let i = 0; i < weights.length; ++i) {
            const weight = weights[i];
            if (rand <= weight) {
                index = i;
                break;
            }
        }
        for (const key of array.keys()) {
            if (index == 0)
                return key;
            --index;
        }
    }
}
async function SwitchCase(key, cases) {
    const func = cases[key];
    if (!func)
        return null;
    return await Promise.resolve(func());
}
function SwitchCaseSync(key, cases) {
    const func = cases[key];
    if (!func)
        return null;
    return func();
}
RegExp.prototype.testExact = function (string) {
    const match = string.match(this);
    return match && string === match[0];
};
RegExp.escape = function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
RegExp.parse = function (string, modifiers) {
    if (!string.startsWith("/"))
        throw new Error("string has to be a javascript like regex expression \"/.../modifiers\"");
    string = string.substring(1);
    const [pattern, patternModifiers] = string.splitLast("/");
    const s = new Set(patternModifiers + modifiers);
    const a = Array.from(s);
    const t = a.join("");
    return new RegExp(pattern, t);
};
class RessourceDictionary {
    constructor(name, extensions) {
        this.name = name;
        this.extensions = extensions ? [...extensions] : [];
    }
    name;
    files;
    get length() { return Object.keys(this.files).length; }
    extensions;
    async initialize() {
        this.files = {};
        const root = new URL(this.name, document.baseURI).href;
        for await (const file of this.crawlDirectoryListing(root)) {
            const path = file.substring(root.length).trimLeft("/");
            if (this.extensions.length > 0)
                if (!this.extensions.some(e => path.toLowerCase().endsWith("." + e.toLowerCase())))
                    continue;
            this.files[path] = file;
        }
    }
    crawlDirectoryListing(root) {
        const urls = [];
        const done = [];
        urls.unshift(root);
        async function* scanForFiles() {
            while (urls.length) {
                const current = urls.shift();
                done.unshift(current);
                try {
                    const { folders, files } = await scanFolder(current);
                    urls.unshift(...folders);
                    for (const file of files)
                        yield file;
                }
                catch { }
            }
        }
        async function scanFolder(url) {
            const folders = [];
            const files = [];
            try {
                const response = await fetch(url + "/"); // folders end with /
                const text = await response.text();
                const parser = new DOMParser();
                const html = parser.parseFromString(text, "text/html");
                const links = html.querySelectorAll("a");
                for (const link of links) {
                    const href = new URL(link.getAttribute("href"), url).toString(); // make rooted based on url
                    if (!href.startsWith(root))
                        continue;
                    if (done.includes(href))
                        continue;
                    if (link.href.endsWith("/")) // check untrimmed url
                     { // IIS
                        folders.push(href);
                        continue;
                    }
                    if (link.classList.values().some(c => c.includes("directory"))) { // Live Server
                        folders.push(href);
                        continue;
                    }
                    files.push(href);
                }
            }
            catch (exception) {
                console.log(exception);
            }
            return { folders, files };
        }
        return scanForFiles();
    }
}
function evalWithScope(scope, script) {
    return Function('"use strict";return (' + script + ')').bind(scope)();
}
function evalInContext(code, context) {
    //@ts-ignore
    with (context)
        return eval(code);
}
HTMLSelectElement.prototype.getValues = function getSelectValues() {
    let results = [];
    let options = this.options;
    for (const option of options)
        if (option.selected)
            results.push(option.value || option.text);
    return results;
};
class Serializer {
    Types = {};
    TypeProperty = "$type";
    GetConstructor(type) {
        let constructor = undefined;
        if (type) {
            for (const name of Object.keys(this.Types)) {
                if (type == name) {
                    constructor = this.Types[name];
                    break;
                }
            }
            ;
            if (!constructor)
                constructor = this.Types.GetConstructor?.(type);
        }
        return constructor;
    }
    GetType(constructor) {
        let type = undefined;
        if (constructor) {
            for (const name of Object.keys(this.Types)) {
                if (constructor == this.Types[name]) {
                    type = name;
                    break;
                }
            }
            if (!type)
                type = this.Types.GetType?.(constructor);
        }
        return type;
    }
    CreateObject;
    constructor(...types) {
        for (const type of types)
            this.Types[type.name] = type;
    }
    nestedCalls = 0;
    Serialize(item) {
        const self = this;
        this.nestedCalls++;
        //@ts-ignore
        Object.prototype.toJSON = function () { return self.serialize(this); };
        const result = JSON.stringify(item);
        this.nestedCalls--;
        if (this.nestedCalls == 0) { //only remove if no more nested call are active
            //@ts-ignore
            Object.prototype.toJSON = undefined;
        }
        return result;
    }
    Deserialize(json) {
        const self = this;
        const reviver = function reviver(key, value) { return self.deserialize(value); };
        const ret = JSON.parse(json, reviver);
        return ret;
    }
    serialize(value) {
        const constructor = value.constructor;
        const type = this.GetType(constructor);
        const ret = {};
        if (type)
            ret[this.TypeProperty] = type;
        for (const key of Object.keys(value))
            ret[key] = value[key];
        return ret;
    }
    deserialize(value) {
        let type = value[this.TypeProperty];
        let ret = this.CreateObject?.(type, value);
        if (ret)
            return ret;
        const constructor = this.GetConstructor(type);
        if (constructor) {
            ret = new constructor();
            for (const key of Object.keys(value))
                if (key != this.TypeProperty)
                    ret[key] = value[key];
        }
        else
            ret = value;
        return ret;
    }
    Clone(item) {
        const text = this.Serialize(item);
        const clonedItem = this.Deserialize(text);
        return clonedItem;
    }
}
class Signal {
    handlers = [];
    add(handler) {
        this.handlers.push(handler);
    }
    remove(handler) {
        this.handlers.remove(handler);
    }
    call(...parameters) {
        for (const handler of this.handlers)
            handler(...parameters);
    }
}
class EventSignal {
    handlers = [];
    add(handler) {
        this.handlers.push(handler);
    }
    remove(handler) {
        this.handlers.remove(handler);
    }
    call(sender, args) {
        for (const handler of this.handlers)
            if (!args.handled)
                handler(sender, args);
    }
}
Storage.prototype.get = function (key) {
    return JSON.parse(this.getItem(key));
};
Storage.prototype.set = function (key, item) {
    this.setItem(key, JSON.stringify(item));
};
Storage.prototype.init = function (key, item) {
    const object = this.get(key) ?? {};
    for (const propKey in item)
        if (!(propKey in object))
            object[propKey] = item[propKey];
    this.set(key, object);
};
Storage.prototype.update = function (key, item) {
    const object = this.get(key) ?? {};
    for (const propKey in item)
        object[propKey] = item[propKey];
    this.set(key, object);
};
Storage.prototype.delete = function (key) {
    this.removeItem(key);
};
Object.defineProperty(Storage.prototype, "keys", {
    get: function* () {
        for (let i = 0; i < this.length; ++i)
            yield this.key(i);
    }
});
String.prototype.padLeft = function (fill, size) {
    let ret = this;
    while (ret.length < size)
        ret = fill + ret;
    return ret;
};
String.prototype.padRight = function (fill, size) {
    let ret = this;
    while (ret.length < size)
        ret = ret + fill;
    return ret;
};
String.prototype.startsWithAny = function (searches) {
    if (typeof (searches) === "string")
        searches = [searches];
    for (const search of searches)
        if (this.startsWith(search))
            return search;
    return null;
};
String.prototype.endsWithAny = function (searches) {
    if (typeof (searches) === "string")
        searches = [searches];
    for (const search of searches)
        if (this.endsWith(search))
            return search;
    return null;
};
String.prototype.splitAtIndex = function (index) {
    return [
        index < 0 ? this.toString() : this.substring(0, index),
        index < 0 ? null : this.substring(index).toString()
    ];
};
String.prototype.splitFirst = function (splitter) {
    const index = this.indexOf(splitter);
    return [
        index < 0 ? this.toString() : this.substring(0, index),
        index < 0 ? null : this.substring(index + splitter.length)
    ];
};
String.prototype.splitLast = function (splitter) {
    const index = this.lastIndexOf(splitter);
    return [
        index < 0 ? this.toString() : this.substring(0, index),
        index < 0 ? null : this.substring(index + splitter.length)
    ];
};
String.prototype.splitLines = function () {
    return this.split(/\r\n|\r|\n/g);
};
String.prototype.substrEnd = function (length) {
    return this.substr(0, this.length - length);
};
String.prototype.replaceAll = function (searchValue, replacer) {
    if (typeof searchValue == "string")
        searchValue = new RegExp(RegExp.escape(searchValue), "g");
    if (!searchValue.global)
        searchValue = new RegExp(searchValue.source, searchValue.flags + "g");
    if (typeof replacer == "string")
        return this.replace(searchValue, replacer);
    else
        return this.replace(searchValue, replacer);
};
String.prototype.equals = function (text, caseSensitive) {
    if (caseSensitive)
        return this.toString() == text;
    else
        return this.toLowerCase() == text.toLowerCase();
};
String.prototype.dissect = function (splitters) {
    let text = this;
    const ret = [];
    for (let i = 0; i < this.length; ++i) {
        for (const splitter of splitters)
            if (text.startsWith(splitter, i)) {
                const split1 = text.substring(0, i);
                const splitter = text.substr(i, 1);
                const restText = text.substr(i + 1);
                ret.push(split1);
                ret.push(splitter);
                text = restText;
                i = 0;
            }
    }
    if (text.length > 0)
        ret.push(text);
    return ret;
};
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.lowerFirstLetter = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
};
String.prototype.toCapitalCase = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
String.prototype.trimChar = function (characters) {
    return this.trimLeft(characters).trimRight(characters);
};
const trimOriginal = String.prototype.trim;
String.prototype.trim = function (characters) {
    if (characters == null)
        return trimOriginal.apply(this);
    return this.trimStart(characters).trimEnd(characters);
};
const trimLeftOriginal = String.prototype.trimLeft;
String.prototype.trimLeft = function (characters) {
    if (characters == null)
        return trimLeftOriginal.apply(this);
    if (typeof characters === "string")
        characters = [characters];
    let ret = this.toString();
    let start = null;
    while ((start = ret.startsWithAny(characters)))
        ret = ret.substring(start.length);
    return ret;
};
const trimStartOriginal = String.prototype.trimStart;
String.prototype.trimStart = function (characters) {
    if (characters == null)
        return trimStartOriginal.apply(this);
    return this.trimLeft(characters);
};
const trimRightOriginal = String.prototype.trimRight;
String.prototype.trimRight = function (characters) {
    if (characters == null)
        return trimRightOriginal.apply(this);
    if (typeof characters === "string")
        characters = [characters];
    let ret = this.toString();
    let end = null;
    while ((end = ret.endsWithAny(characters)))
        ret = ret.substring(0, ret.length - end.length);
    return ret;
};
const trimEndOriginal = String.prototype.trimEnd;
String.prototype.trimEnd = function (characters) {
    if (characters == null)
        return trimEndOriginal.apply(this);
    return this.trimRight(characters);
};
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined"
            ? args[number].toString()
            : match;
    });
};
String.prototype.formatReplace = function (args) {
    let ret = this;
    for (const prop in args)
        ret = ret.replace("{" + prop + "}", args[prop]);
    return ret;
};
String.prototype.count = function (text) {
    let count;
    let index;
    for (count = -1, index = -2; index != -1; count++, index = this.indexOf(text, index + 1))
        ;
    return count;
};
String.prototype.containsOnlyWhitespace = function () {
    return !/\S/.test(this);
};
String.prototype.contains = function contains(text) {
    return this.includes(text);
};
String.prototype.containsAny = function containsAny(...texts) {
    for (const text of texts)
        if (this.includes(text))
            return true;
    return false;
};
String.prototype.containsAll = function containsAll(...texts) {
    for (const text of texts)
        if (!this.includes(text))
            return false;
    return true;
};
;
String.localeCompare = function (a, b, locales, options) {
    if (a == null && b == null)
        return 0;
    if (a == null)
        return -1;
    return a.localeCompare(b, locales, options);
};
class TreectionaryHelper {
    static Find(tree, path, base) {
        path = Link.Resolve(path, base);
        try {
            let value = tree;
            for (const part of path.trimLeft("/").split("/")) {
                const key = Object.keys(value).find((key) => key.toLowerCase() === part.toLowerCase());
                value = value[key];
            }
            return typeof value !== "object" ? value : null;
        }
        catch {
            return null;
        }
    }
    static DeepFind(tree, path, base) {
        path = Link.Resolve(path, base);
        try {
            let nodes = [];
            nodes.push(tree);
            while (nodes.length > 0) {
                let node = nodes.pop();
                const result = this.Find(node, path);
                if (result)
                    return result;
                for (const subNode of Object.values(node))
                    if (typeof subNode === "object")
                        nodes.push(subNode);
            }
            return null;
        }
        catch {
            return null;
        }
    }
    static MergeWith(base, merger) {
        for (const key of Object.keys(merger)) {
            if (!(key in base))
                base[key] = merger[key];
            else {
                const baseValue = base[key];
                const mergerValue = merger[key];
                if (typeof baseValue !== "object" || typeof (mergerValue) !== "object")
                    throw "Cannot merge the leaves of a tree!";
                else
                    this.MergeWith(baseValue, mergerValue);
            }
        }
    }
}
class WebClient {
    constructor(url, username, password) {
        this.url = url;
        if (username && password)
            this.authorization = { type: "basic", username: username, password: password };
        if (!username && password)
            this.authorization = { type: "bearer", token: password };
    }
    url;
    authorization;
    catch;
    defaultHeaders;
    abortController = new AbortController();
    abort(reason) {
        const controller = this.abortController;
        this.abortController = new AbortController();
        controller.abort(reason);
    }
    constructUrl(url) {
        return new URL(url, this.url).toString();
    }
    initializeHeaders(headers) {
        const resultHeaders = JSON.clone(headers ?? {});
        if (this.defaultHeaders)
            for (const key of Object.getOwnPropertyNames(this.defaultHeaders))
                if (!(key in resultHeaders))
                    resultHeaders[key] = this.defaultHeaders[key];
        return resultHeaders;
    }
    initializeAuthorization(headers) {
        const resultHeaders = JSON.clone(headers ?? {});
        if (this.authorization) {
            if (this.authorization.type == "basic") {
                const basicAuthorization = this.authorization;
                resultHeaders["Authorization"] = "Basic " + btoa(basicAuthorization.username + ":" + (basicAuthorization.password ?? ""));
            }
            if (this.authorization.type == "bearer") {
                const bearerAuthorization = this.authorization;
                resultHeaders["Authorization"] = "Token " + bearerAuthorization.token;
            }
        }
        return resultHeaders;
    }
    request(url, requestInit) {
        if (url === null)
            throw new Error("Null Url");
        if (!requestInit)
            requestInit = {};
        requestInit.headers = this.initializeHeaders(requestInit.headers);
        requestInit.headers = this.initializeAuthorization(requestInit.headers);
        requestInit.signal ??= this.abortController.signal;
        const requestUrl = this.constructUrl(url);
        return { url: requestUrl, init: requestInit };
    }
    async fetch(url, requestInit) {
        const request = (typeof url == "string" || url instanceof String) ?
            this.request(url.toString(), requestInit) :
            url;
        const response = await fetch(request.url, request.init);
        if (this.catch && (response.status < 200 || response.status > 399)) {
            if (this.catch(request.url, request.init, response))
                return response;
            throw new Error("Fetch error: " + response.status);
        }
        return response;
    }
    async get(url, headers) {
        return await this.fetch(url, { method: "GET", headers: headers });
    }
    async post(url, body, headers) {
        return await this.fetch(url, { method: "POST", headers: headers, body: body });
    }
    async fetchJSON(url, requestInit) {
        const response = await this.fetch(url, requestInit);
        return await response.json();
    }
    async fetchText(url, requestInit) {
        const response = await this.fetch(url, requestInit);
        return await response.text();
    }
    async download(url, progress, requestInit) {
        if (!requestInit)
            requestInit = {};
        const response = await this.fetch(url, requestInit);
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0; // received that many bytes at the moment
        let chunks = []; // array of received binary chunks (comprises the body)
        const signal = requestInit.signal;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            chunks.push(value);
            receivedLength += value.length;
            const prog = (receivedLength / contentLength) * 100;
            progress(contentLength, receivedLength, prog);
            if (signal?.aborted)
                throw new DOMException(signal?.reason ?? " signal is aborted without reason in download with async call.", "AbortError");
        }
        let chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }
        const blob = new Blob([chunksAll]);
        return blob;
    }
}
var Query;
(function (Query) {
    function CreateAnd(left, right) {
        return { operator: "AND", left, right };
    }
    Query.CreateAnd = CreateAnd;
    function CreateOr(left, right) {
        return { operator: "OR", left, right };
    }
    Query.CreateOr = CreateOr;
    function CreateNot(child) {
        return { operator: "NOT", child };
    }
    Query.CreateNot = CreateNot;
    function CreateLiteral(literal) {
        const ret = Query.LiteralParser.parse(literal);
        ret.operator = "LEAF";
        return ret;
    }
    Query.CreateLiteral = CreateLiteral;
})(Query || (Query = {}));
var Query;
(function (Query) {
    class LiteralParser {
        static parse(literal) {
            const splitted = this.split(literal);
            const exact = splitted[1]?.includes("\"");
            splitted[0] = splitted[0]?.replaceAll("\"", "")?.trim()?.toLowerCase();
            splitted[1] = splitted[1]?.replaceAll("\"", "")?.trim();
            //empty to null
            if (!splitted[0])
                splitted[0] = null;
            if (!splitted[1])
                splitted[1] = null;
            return { key: splitted[0], value: splitted[1], exact };
        }
        static split(literal) {
            let escaped = false;
            let i = 0;
            for (; i < literal.length; ++i) {
                if (literal[i] == "\"") {
                    escaped = !escaped;
                    continue;
                }
                if (!escaped && literal[i] == ":") {
                    break;
                }
            }
            if (i == literal.length)
                return [null, literal];
            else
                return [literal.substring(0, i), literal.substring(i + 1)];
        }
    }
    Query.LiteralParser = LiteralParser;
})(Query || (Query = {}));
var Query;
(function (Query) {
    function parse(input) {
        try {
            const tokens = Query.Tokenizer.run(input);
            const pTokens = transformToPolishNotation(tokens);
            const iterator = pTokens.values();
            const expression = make(iterator);
            return { input, tokens, expression };
        }
        catch (error) {
            const ret = new Error("Cannot Parse input: '" + input + "'");
            error.name = "QueryParserError";
            ret.error = error;
            throw ret;
        }
    }
    Query.parse = parse;
    function transformToPolishNotation(infixTokenList) {
        const outputQueue = [];
        const stack = [];
        let index = 0;
        while (index < infixTokenList.length) {
            const t = infixTokenList[index];
            switch (t.type) {
                case "LITERAL":
                    outputQueue.push(t);
                    break;
                case "BINARY_OP":
                case "UNARY_OP":
                case "OPEN_PAREN":
                    stack.push(t);
                    break;
                case "CLOSE_PAREN":
                    while (stack[stack.length - 1].type !== "OPEN_PAREN") {
                        outputQueue.push(stack.pop());
                    }
                    stack.pop();
                    if (stack.length > 0 && stack[stack.length - 1].type === "UNARY_OP") {
                        outputQueue.push(stack.pop());
                    }
                    break;
                default:
                    break;
            }
            index++;
        }
        while (stack.length > 0) {
            outputQueue.push(stack.pop());
        }
        return outputQueue.reverse();
    }
    function make(polishNotationTokensEnumerator) {
        const current = polishNotationTokensEnumerator.next().value;
        if (current.type === "LITERAL") {
            const lit = Query.CreateLiteral(current.value);
            return lit;
        }
        else if (current.value === "!") {
            const operand = make(polishNotationTokensEnumerator);
            return Query.CreateNot(operand);
        }
        else if (current.value === "&") {
            const left = make(polishNotationTokensEnumerator);
            const right = make(polishNotationTokensEnumerator);
            return Query.CreateAnd(left, right);
        }
        else if (current.value === "|") {
            const left = make(polishNotationTokensEnumerator);
            const right = make(polishNotationTokensEnumerator);
            return Query.CreateOr(left, right);
        }
        return null;
    }
})(Query || (Query = {}));
var Query;
(function (Query) {
    Query.TokenTypes = ["OPEN_PAREN", "CLOSE_PAREN", "UNARY_OP", "BINARY_OP", "LITERAL", "EXPR_END"];
    class Tokenizer {
        static run(input) {
            if (!input)
                return [];
            input = this.fixDoubles(input);
            input = this.fixWhitespace(input);
            input = this.fixParentheses(input);
            let tokens = this.split(input);
            tokens = this.insertDefault(tokens);
            return this.tokenize(tokens);
        }
        static fixDoubles(input) {
            let ret = "";
            let escaped = false;
            for (let i = 0; i < input.length; ++i) {
                let c = input[i];
                let last = ret.length > 0 ? ret[ret.length - 1] : ' ';
                if (c === '"') {
                    escaped = !escaped;
                }
                // prevent doubling
                if (!escaped && c === '&') {
                    while (input.length > i + 1 && (input[i + 1] === '&' || /\s/.test(input[i + 1]))) {
                        ++i;
                    }
                }
                if (!escaped && c === '|') {
                    while (input.length > i + 1 && (input[i + 1] === '|' || /\s/.test(input[i + 1]))) {
                        ++i;
                    }
                }
                ret += c;
            }
            return ret;
        }
        static fixWhitespace(input) {
            function isWhitespace(char) {
                return /\s/.test(char);
            }
            let ret = "";
            let escaped = false;
            for (let i = 0; i < input.length; ++i) {
                let current = input[i];
                let last = ret.length > 0 ? ret[ret.length - 1] : ' ';
                if (current === '"') {
                    escaped = !escaped;
                    ret += current;
                    continue;
                }
                if (escaped) {
                    ret += current;
                    continue;
                }
                // insert whitespace before
                if (!isWhitespace(last) && (current === '(' || current === '&' || current === '|' || current === '!'))
                    ret += " ";
                // insert whitespace after
                if (!isWhitespace(current) && (last === ')' || last === '&' || last === '|' || last === '!'))
                    ret += " ";
                // no whitespace after : or (
                if (ret.length > 0 && isWhitespace(current) && (ret[ret.length - 1] === ':' || ret[ret.length - 1] === '('))
                    continue;
                // no whitespace before : or )
                if (ret.length > 0 && isWhitespace(ret[ret.length - 1]) && (current === ':' || current === ')'))
                    ret = ret.slice(0, -1); // remove last character
                // remove empty pharentheses
                if (last === '(' && current === ')') {
                    ret = ret.slice(0, -1); // remove last character
                    continue;
                }
                // dont double whitespace
                if (ret.length > 0 && isWhitespace(ret[ret.length - 1]) && isWhitespace(current))
                    continue;
                // all whitespace is simple whitespace
                if (isWhitespace(current))
                    ret += " ";
                else
                    ret += current;
            }
            return ret;
        }
        static fixParentheses(input) {
            input = input.trim();
            let escaped = false;
            let open = 0;
            let close = 0;
            for (let i = 0; i < input.length; ++i) {
                const c = input[i];
                if (c === '"') {
                    escaped = !escaped;
                    continue;
                }
                if (!escaped) {
                    if (c === '(')
                        ++open;
                    if (c === ')')
                        ++close;
                }
            }
            if (open > close) {
                input += ')'.repeat(open - close);
            }
            if (close > open) {
                input = '('.repeat(close - open) + input;
            }
            return input;
        }
        static split(input) {
            let tokens = [];
            let token = "";
            let escaped = false;
            for (let i = 0; i < input.length; ++i) {
                let c = input[i];
                if (c === '"') {
                    token += '"';
                    escaped = !escaped;
                    continue;
                }
                if (escaped) {
                    token += c;
                    continue;
                }
                if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
                    if (token.length > 0) {
                        tokens.push(token);
                        token = "";
                    }
                    continue;
                }
                if (c === '&' || c === '|' || c === '!' || c === '(' || c === ')') {
                    if (token.length > 0) {
                        tokens.push(token);
                        token = "";
                    }
                    tokens.push(c);
                    continue;
                }
                token += c;
            }
            if (token.length > 0) {
                tokens.push(token);
                token = "";
            }
            return tokens;
        }
        static insertDefault(tokens) {
            const defaultOp = "&";
            const ret = [];
            for (let i = 0; i < tokens.length; ++i) {
                const current = tokens[i];
                const next = (i + 1 < tokens.length) ? tokens[i + 1] : defaultOp;
                ret.push(current);
                if (current !== "&" && current !== "|" && current !== "!" && current !== "(") {
                    if (next !== "&" && next !== "|" && next !== ")") {
                        ret.push(defaultOp);
                    }
                }
            }
            return ret;
        }
        static tokenize(splitted) {
            const tokens = [];
            for (const s of splitted) {
                switch (s.toLowerCase()) {
                    case '&':
                    case '&&':
                    case '|':
                    case '||':
                        tokens.push({ type: "BINARY_OP", value: s[0].toString() });
                        break;
                    case '!':
                        tokens.push({ type: "UNARY_OP", value: s[0].toString() });
                        break;
                    case '(':
                        tokens.push({ type: "OPEN_PAREN", value: s[0].toString() });
                        break;
                    case ')':
                        tokens.push({ type: "CLOSE_PAREN", value: s[0].toString() });
                        break;
                    default:
                        tokens.push({ type: "LITERAL", value: s });
                        break;
                }
            }
            tokens.push({ type: "EXPR_END", value: null });
            return tokens;
        }
    }
    Query.Tokenizer = Tokenizer;
})(Query || (Query = {}));
var UI;
(function (UI) {
    UI.ContextMenu = new class ContextMenuImpl {
        show(position, ...content) {
            const contextMenu = new UI.Elements.ContextMenu();
            contextMenu.append(...content.filter(c => c));
            if (position instanceof MouseEvent) {
                contextMenu.style.marginLeft = position.clientX + "px";
                contextMenu.style.marginTop = position.clientY + "px";
            }
            else {
                contextMenu.style.marginLeft = position.x + "px";
                contextMenu.style.marginTop = position.y + "px";
            }
            contextMenu.addEventListener(UI.Elements.closeEventName, (event) => contextMenu.remove());
            document.body.append(contextMenu);
            return contextMenu.showDialog();
        }
    }();
})(UI || (UI = {}));
var UI;
(function (UI) {
    class DOM {
        /** @deprecated */
        static Insert(target, view) {
            if (typeof target == "string")
                target = document.getElementById(target);
            target.clearChildren();
            if (view) {
                let elements = Symbol.iterator in view ? view : [view];
                for (const element of elements) {
                    target.appendChild(element);
                    //legacy
                    const insertedEvent = element.InsertedIntoDOM;
                    if (insertedEvent && typeof insertedEvent === "function") {
                        insertedEvent(target, element);
                    }
                }
                return elements;
            }
        }
    }
    UI.DOM = DOM;
})(UI || (UI = {}));
var UI;
(function (UI) {
    class DialogImpl {
        confirm(options) {
            const confirmDialog = new UI.Elements.ConfirmDialog();
            if ("mode" in options)
                confirmDialog.mode = options.mode;
            if ("title" in options)
                confirmDialog.title = options.title;
            if ("icon" in options)
                confirmDialog.icon = options.icon;
            confirmDialog.text = options.text;
            if ("ok" in options)
                confirmDialog.ok = options.ok;
            if ("cancel" in options)
                confirmDialog.cancel = options.cancel;
            return confirmDialog.showDialog(options?.parent);
        }
        error(error, options) {
            const errorDialog = new UI.Elements.ErrorDialog();
            if ("message" in error || error instanceof Error)
                options ??= { title: error.name ?? "Unknown Error", text: error.message ?? "Unknown Error ocurred!" };
            else
                options = error;
            if ("mode" in options)
                errorDialog.mode = options.mode;
            if ("title" in options)
                errorDialog.title = options.title;
            if ("icon" in options)
                errorDialog.icon = options.icon;
            errorDialog.text = options.text;
            if ("ok" in options)
                errorDialog.ok = options?.ok;
            if (options.log || options.log == null)
                console.error(errorDialog.title, error ?? { name: options.title, message: options.text });
            return errorDialog.showDialog(options.parent);
        }
        message(options) {
            const messageDialog = new UI.Elements.MessageDialog();
            if ("mode" in options)
                messageDialog.mode = options.mode;
            if ("title" in options)
                messageDialog.title = options.title;
            messageDialog.text = options?.text;
            if ("ok" in options)
                messageDialog.ok = options?.ok;
            return messageDialog.showDialog(options?.parent);
        }
        async show(viewOrElement, options, ...args) {
            try {
                const element = typeof viewOrElement === "function" ?
                    (await UI.renderView(viewOrElement, ...args)) :
                    viewOrElement;
                if (!element)
                    throw new Error("viewOrElement cannot be null!");
                const containerDialog = new UI.Elements.ContainerDialog();
                if (options && "title" in options)
                    containerDialog.title = options.title;
                if (options?.mode)
                    containerDialog.mode = options.mode;
                if (options?.allowClose != null)
                    containerDialog.allowClose = options.allowClose;
                if (options?.icon)
                    containerDialog.icon = options.icon;
                UI.DOM.Insert(containerDialog, element);
                await containerDialog.showDialog(options?.parent);
                return element;
            }
            catch (error) {
                if (typeof error == "string")
                    error = { name: "Error", message: error };
                if (error instanceof Error)
                    if (!error.name)
                        error.name = "Error";
                if (!("name" in error && "message" in error))
                    error = { name: "Unknown", message: "Unknown error happened!", data: error };
                console.error("Error:", error);
                alert(error.message);
            }
        }
        async options(options) {
            const optionsSelectDialog = new UI.Elements.OptionSelectDialog();
            if (options.mode)
                optionsSelectDialog.mode = options.mode;
            if ("title" in options)
                optionsSelectDialog.title = options.title;
            optionsSelectDialog.options = options.options.map(o => (typeof o === "object" && "title" in o && "value" in o) ? o : { title: o.toString(), value: o });
            if (options.checkedValue != null)
                optionsSelectDialog.checkedIndex = optionsSelectDialog.options.findIndex(x => x.value == options.checkedValue);
            if (options.allowEmpty != null)
                optionsSelectDialog.allowEmpty = options.allowEmpty;
            return await optionsSelectDialog.showDialog();
        }
        async upload(options) {
            const uploadDialog = new UI.Elements.UploadDialog();
            if (options.mode)
                uploadDialog.mode = options.mode;
            if ("title" in options)
                uploadDialog.title = options.title;
            if ("allowClose" in options)
                uploadDialog.allowClose = options.allowClose;
            if ("accept" in options)
                uploadDialog.accept = options.accept;
            if ("multiple" in options)
                uploadDialog.multiple = options.multiple;
            return await uploadDialog.showDialog();
        }
        async download(options) {
            const downloadDialog = new UI.Elements.DownloadDialog();
            if (options.mode)
                downloadDialog.mode = options.mode;
            if ("title" in options)
                downloadDialog.title = options.title;
            if ("allowClose" in options)
                downloadDialog.allowClose = options.allowClose;
            if ("files" in options)
                downloadDialog.files = options.files;
            if ("zipName" in options)
                downloadDialog.zipName = options.zipName;
            return await downloadDialog.showDialog();
        }
        async progress(options) {
            const progressDialog = new UI.Elements.ProgressDialog();
            if ("title" in options)
                progressDialog.title = options.title;
            if (options.mode)
                progressDialog.mode = options.mode;
            if ("max" in options)
                progressDialog.max = options.max;
            if ("value" in options)
                progressDialog.value = options.value;
            if ("displayType" in options)
                progressDialog.displayType = options.displayType;
            if ("allowClose" in options)
                progressDialog.allowClose = options.allowClose;
            else
                progressDialog.allowClose = false;
            progressDialog.show();
            return progressDialog;
        }
        lightBox(options) {
            const lightBoxDialog = new UI.Elements.LightBoxDialog();
            if ("title" in options)
                lightBoxDialog.title = options.title;
            if (options.mode)
                lightBoxDialog.mode = options.mode;
            lightBoxDialog.pages = options.pages;
            if ("initialIndex" in options)
                lightBoxDialog.goto(options.initialIndex);
            return lightBoxDialog.showDialog(options?.parent);
        }
        close(self) {
            let parent = self.parentElement;
            while (parent && !(parent instanceof UI.Elements.ContainerDialog))
                parent = parent.parentElement;
            parent?.close();
        }
    }
    ;
    UI.Dialog = new DialogImpl();
})(UI || (UI = {}));
var UI;
(function (UI) {
    class LazyLoad {
        static GetImage;
        static ErrorImageUrl;
        static LoadingImageUrl;
        static interval = 100;
        static isRunning;
        static get IsRunning() {
            return this.isRunning;
        }
        static set IsRunning(value) {
            if (value == this.isRunning)
                return;
            this.isRunning = value;
            if (this.isRunning) {
                this.setupGenerator();
                setTimeout(this.run.bind(this), this.interval);
            }
        }
        static Start() {
            this.IsRunning = true;
        }
        static Stop() {
            this.IsRunning = false;
        }
        static async run() {
            if (!this.IsRunning)
                return;
            try {
                let nextImage;
                while (nextImage = this.findVisibleImage()) {
                    if (!this.IsRunning)
                        return;
                    await this.Load(nextImage);
                }
            }
            catch { }
            setTimeout(this.run.bind(this), this.interval);
        }
        static async Load(img) {
            const url = img.getAttribute("lazy-image");
            if (!url) {
                img.src = LazyLoad.ErrorImageUrl;
                img.setAttribute("lazy-load", "error");
                return;
            }
            if (this.GetImage) {
                img.setAttribute("lazy-load", "running");
                img.onerror = () => img.src = LazyLoad.ErrorImageUrl;
                try {
                    const dataUri = await this.GetImage(url);
                    img.src = dataUri;
                    img.setAttribute("lazy-load", "done");
                }
                catch {
                    img.src = LazyLoad.ErrorImageUrl;
                    img.setAttribute("lazy-load", "error");
                }
            }
            else {
                img.src = url;
                img.setAttribute("lazy-load", "done");
            }
        }
        static findVisibleImage() {
            let nextImage;
            for (const img of document.querySelectorAll("img[lazy-image]:not([lazy-load])"))
                if (isInViewport(img)) {
                    nextImage = img;
                    break;
                }
            return nextImage;
        }
        static setupGeneratorDone = false;
        static setupGenerator() {
            if (!this.setupGeneratorDone) {
                this.setupGeneratorDone = true;
                UI.Renderer.customAttributes["lazy-image"] = (dom, attribute, value) => {
                    const img = dom;
                    img.setAttribute("lazy-image", value);
                    if (!img.src)
                        img.src = LazyLoad.LoadingImageUrl;
                };
            }
        }
    }
    UI.LazyLoad = LazyLoad;
})(UI || (UI = {}));
// Fix for overlapping bottom bar in mobile browsers
function fixVH() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}
fixVH();
// We listen to the resize event
window.addEventListener("resize", () => {
    fixVH();
});
setTimeout(() => {
    fixVH();
}, 1000);
var UI;
(function (UI) {
    UI.Navigator = new (class {
        async navigateMain(view, ...args) {
            const main = document.querySelector("main");
            return this.navigate(main, view, ...args);
        }
        async navigate(target, view, ...args) {
            try {
                const result = await UI.renderView(view, ...args);
                return UI.DOM.Insert(target, result)[0];
            }
            catch (error) {
                const errorInfo = { target, view, error };
                if (error instanceof DOMException && error.name == "AbortError") {
                    console.error("Navigation Aborted!", errorInfo);
                    return;
                }
                if (typeof error == "string")
                    error = { name: "Error", message: error };
                if (error instanceof Error)
                    if (!error.name)
                        error.name = "Error";
                if (!("name" in error && "message" in error))
                    error = { name: "Unknown", message: "Unknown error happened!", data: error };
                errorInfo.error;
                console.error("Navigation Error:", errorInfo);
                UI.Dialog.error(error, { log: false, title: error.name, text: error.message });
            }
        }
    })();
})(UI || (UI = {}));
var UI;
(function (UI) {
    class RouterImpl {
        initialize(container, views, defaultView) {
            this.container = container;
            this.views = views;
            if (typeof (defaultView) === "string")
                defaultView = this.getView(defaultView);
            this.defaultView = defaultView;
        }
        start(container, views, defaultView) {
            if (container && views)
                this.initialize(container, views, defaultView);
            window.addEventListener("hashchange", this.hashChange);
        }
        stop() {
            window.removeEventListener("hashchange", this.hashChange);
        }
        container;
        views;
        defaultView;
        routing = new EventSignal();
        routed = new EventSignal();
        routingError = new EventSignal();
        stringify = JSON.stringify;
        navigate(route, ...args) {
            //build hash
            let path = typeof route === "string" ? route : this.getRoute(route);
            path = path.trim("/");
            while (path.includes("//"))
                path.replace("//", "/");
            let view = typeof route === "string" ? this.getView(path) : route;
            if (!path)
                throw new Error("Cannot find path for: " + route);
            if (!view)
                throw new Error("Cannot find route for: '" + path + "'");
            const argNames = this.getFunctionArgNames(view);
            let parameters;
            if (argNames.length == 1 && argNames[0] == "args" && args.length == 1 && typeof args[0] === "object")
                parameters = args[0];
            else {
                parameters = {};
                if (args && args.length > 0) {
                    for (let i = 0; i < args.length; ++i)
                        if (args.length >= i && args[i] != null) {
                            parameters[argNames[i]] = args[i];
                        }
                }
            }
            this.navigateWithParameters(view, parameters);
        }
        navigateWithParameters(route, parameters) {
            //build hash
            let path = typeof route === "string" ? route : this.getRoute(route);
            path = path.trim("/");
            while (path.includes("//"))
                path.replace("//", "/");
            let view = typeof route === "string" ? this.getView(path) : route;
            if (!path)
                throw new Error("Cannot find path for: " + route);
            if (!view)
                throw new Error("Cannot find route for: '" + path + "'");
            let query = "";
            if (parameters)
                for (const entry of Object.entries(parameters))
                    if (entry[1] != null) {
                        if (query.length > 0)
                            query += "&";
                        query += encodeURIComponent(entry[0]) + "=" + encodeURIComponent(this.stringify(entry[1]));
                    }
            if (query.length > 0)
                query = "?" + query;
            const hash = path + query;
            if (window.location.hash == hash)
                this.reload();
            else
                window.location.hash = hash;
        }
        reload() {
            this.go(location.hash);
        }
        currentView;
        get currentRoute() {
            return this.getRoute(this.currentView);
        }
        currentParameters;
        currentError;
        hashChange = function (event) {
            const url = new URL(event.newURL);
            this.go(url.hash).then((result) => { if (!result)
                history.back(); });
        }.bind(this);
        async go(hash) {
            try {
                this.currentView = null;
                this.currentParameters = null;
                this.currentError = null;
                hash = hash ?? "";
                hash = hash.trimLeft("#");
                let route;
                let view;
                let parameters;
                if (!hash) {
                    route = null;
                    view = this.defaultView;
                    parameters = null;
                }
                else {
                    const [start, end] = hash.splitFirst("?");
                    view = this.getView(start);
                    parameters = this.parseParameters(end);
                }
                this.currentView = view;
                this.currentParameters = parameters;
                const routingArgs = { route, view, parameters };
                this.routing.call(this, routingArgs);
                if (!routingArgs.handled)
                    await this.renderView(view, parameters);
                this.routed.call(this, { route, view, parameters });
                return true;
            }
            catch (error) {
                this.handleNavigationError(error);
                return false;
            }
        }
        async renderView(view, parameters) {
            this.closeOnRouting();
            const args = this.compileArgs(view, parameters) ?? []; // object to array
            const result = await UI.renderView(view, ...args);
            UI.DOM.Insert(this.container, result);
        }
        getFunctionArgNames(func) {
            return (func + "")
                .replace(/[/][/].*$/mg, "") // strip single-line comments
                .replace(/\s+/g, "") // strip white space
                .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments  
                .split("){", 1)[0].replace(/^[^(]*[(]/, "") // extract the parameters  
                .replace(/=[^,]+/g, "") // strip any ES6 defaults  
                .split(",").filter(Boolean); // split & filter [""]
        }
        getRoute(view) {
            return Object.findPath(this.views, view)?.replace(".", "/");
        }
        getView(route) {
            const path = route.split("/").map(x => decodeURIComponent(x));
            let current = this.views;
            while (path.length > 0)
                current = current[path.shift()];
            return current;
        }
        compileArgs(view, parameters) {
            const functionParameters = this.getFunctionArgNames(view);
            if (!parameters)
                return new Array(functionParameters.length);
            const args = [];
            if (functionParameters.length == 1 && functionParameters[0] == "args")
                return [parameters];
            else {
                for (const arg of functionParameters)
                    args.push(parameters[arg]);
                return args;
            }
        }
        parseParameters(parameters) {
            if (!parameters)
                return null;
            if (parameters.startsWith("?"))
                parameters = parameters.substring(1);
            const ret = {};
            if (parameters.length > 0)
                for (const parameter of parameters.split("&")) {
                    let [start, end] = parameter.splitFirst("=");
                    end = decodeURIComponent(end);
                    if (end.length > 0)
                        ret[start] = JSON.parse(end);
                }
            return ret;
        }
        handleNavigationError(error) {
            this.currentError = error;
            const routingErrorArgs = { error: error };
            this.routingError.call(this, routingErrorArgs);
            if (!routingErrorArgs.handled) {
                const errorInfo = { view: this.currentView, parameters: this.currentParameters, error };
                if (error instanceof DOMException && error.name == "AbortError") {
                    console.error("Routing Aborted!", errorInfo);
                    return;
                }
                if (typeof error == "string")
                    error = { name: "Error", message: error };
                if (error instanceof Error)
                    if (!error.name)
                        error.name = "Error";
                if (!("name" in error && "message" in error))
                    error = { name: "Unknown", message: "Unknown error happened!", data: error };
                errorInfo.error = error;
                console.error("Routing Error:", errorInfo);
                UI.Dialog.error(error, { log: false, title: error.name, text: error.message });
            }
        }
        closeOnRouting(container) {
            for (const closeOnRouting of (container ?? document).querySelectorAll("[close-on-routing], [close-on-routing]"))
                closeOnRouting.close?.();
        }
    }
    ;
    UI.Router = new RouterImpl();
})(UI || (UI = {}));
var UI;
(function (UI) {
    function MakeStyle(styleRules) {
        const style = document.createElement("style");
        style.innerText = MakeStyleCode(styleRules);
        return style;
    }
    UI.MakeStyle = MakeStyle;
    function MakeStyleCode(styleRules) {
        let code = "";
        for (const selector of Object.keys(styleRules)) {
            let rule = selector + " { " + "\r";
            const styleRule = styleRules[selector];
            for (const key of Object.keys(styleRule))
                rule += key + ": " + styleRule[key].toString() + "; " + "\r";
            rule += " }" + "\n";
            code += rule;
        }
        return code;
    }
    UI.MakeStyleCode = MakeStyleCode;
    function MergeStyle(...styleRules) {
        const ret = {};
        for (const item of styleRules)
            for (const key of Object.keys(item))
                ret[key] = item[key];
        return ret;
    }
    UI.MergeStyle = MergeStyle;
    function MapStylePropertyName(propertyName) {
        if (propertyName in specialCSSPropertyMappings)
            return specialCSSPropertyMappings[propertyName];
        const replacer = /-(.)/g;
        propertyName = propertyName.replaceAll(replacer, (substring, letter) => {
            return letter.toUpperCase();
        });
        return propertyName;
    }
    UI.MapStylePropertyName = MapStylePropertyName;
    ;
    ;
    let specialCSSPropertyMappings = {
        "float": "cssFloat",
    };
})(UI || (UI = {}));
var UI;
(function (UI) {
    async function renderView(view, ...args) {
        if (!view)
            return null;
        let result = view?.(...args);
        result = await Promise.resolve(result);
        return result;
    }
    UI.renderView = renderView;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ColorIcon extends HTMLElement {
            static get observedAttributes() {
                return ["src"];
            }
            connectedCallback() {
                this.style.setProperty("--src", "url(" + this.getAttribute("src") + ")");
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name === "src")
                    this.style.setProperty("--src", "url(" + newValue + ")");
            }
            get src() {
                return this.getAttribute("src");
            }
            set src(value) {
                this.setAttribute("src", value);
            }
        }
        Elements.ColorIcon = ColorIcon;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("color-icon", UI.Elements.ColorIcon);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class CustomElement extends HTMLElement {
            static shadowStyleSelector = ".shadow-style";
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                for (const element of document.querySelectorAll(CustomElement.shadowStyleSelector)) {
                    const style = element.cloneNode();
                    this.shadowRoot.appendChild(style);
                }
                const style = this.constructor["shadow-style"] ??= this.extractRules();
                if (style) {
                    const styleElement = document.createElement("style");
                    styleElement.textContent = style;
                    this.shadowRoot.appendChild(styleElement);
                }
            }
            extractRules() {
                const tagName = customElements.getName(this.constructor);
                const hostSelector = tagName + ":host";
                let styleText = "";
                for (const styleSheet of document.querySelectorAll(CustomElement.shadowStyleSelector))
                    if (styleSheet instanceof HTMLStyleElement || styleSheet instanceof HTMLLinkElement) {
                        for (const rule of styleSheet.sheet.cssRules)
                            if (rule instanceof CSSStyleRule) {
                                let newSelector = "";
                                const selectors = rule.selectorText.split(",").map(s => s.trim());
                                for (const selector of selectors)
                                    if (selector.startsWith(hostSelector))
                                        newSelector += (newSelector ? ", " : "") + ":host" + selector.substring(hostSelector.length);
                                if (newSelector) {
                                    const styleBody = "{" + rule.cssText.splitFirst("{")[1];
                                    styleText += newSelector + " " + styleBody + "\n";
                                }
                            }
                    }
                return styleText;
            }
        }
        Elements.CustomElement = CustomElement;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.closeEventName = "close";
        Elements.openEventName = "open";
        class DropDown extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.addEventListener("toggle", this.toggled);
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("slot", null));
            }
            static get observedAttributes() {
                return ["open"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "open":
                        if (oldValue != newValue)
                            this.onOpenChanged(oldValue, newValue);
                        break;
                }
            }
            static dropDowns = [];
            connectedCallback() {
                DropDown.dropDowns.push(this);
                if (!this.getAttribute("popover"))
                    this.setAttribute("popover", "manual");
                if (!this.controlParent)
                    this.controlParent = this.parentElement;
            }
            disconnectedCallback() {
                DropDown.dropDowns.remove(this);
            }
            onOpenChanged(oldValue, newValue) {
                const newOpen = newValue != null;
                if (newOpen)
                    this.show();
                else
                    this.close();
            }
            get open() { return UI.Helper.GetFlagAttribute(this, "open"); }
            set open(value) { UI.Helper.SetFlagAttribute(this, "open", value); }
            get placement() { return this.getAttribute("placement"); }
            set placement(value) { this.setAttribute("placement", value); }
            controlParent;
            showDialog() {
                return new Promise((resolve, reject) => {
                    this.addEventListener("close", () => resolve(), { once: true });
                    this.show();
                });
            }
            show() {
                this.toggle(true);
            }
            close() {
                this.toggle(false);
            }
            toggle(force) {
                return this.togglePopover(force);
            }
            toggled = function (event) {
                if (event.newState == "open") {
                    window.addEventListener("click", this.clickedOutside);
                    UI.Helper.SetFlagAttribute(this, "open", true);
                    this.dispatchEvent(new Event(Elements.openEventName));
                    // close other dropdowns
                    for (const dropDown of DropDown.dropDowns)
                        if (dropDown.open && dropDown != this && !dropDown.contains(this))
                            dropDown.close();
                }
                if (event.newState == "closed") {
                    window.removeEventListener("click", this.clickedOutside);
                    UI.Helper.SetFlagAttribute(this, "open", false);
                    this.dispatchEvent(new Event(Elements.closeEventName));
                }
            }.bind(this);
            internal_onclose;
            get onclose() { return this.internal_onclose; }
            set onclose(value) {
                if (this.internal_onclose)
                    this.removeEventListener(Elements.closeEventName, this.internal_onclose);
                this.internal_onclose = value;
                this.addEventListener(Elements.closeEventName, this.internal_onclose);
            }
            internal_onopen;
            get onopen() { return this.internal_onopen; }
            set onopen(value) {
                if (this.internal_onopen)
                    this.removeEventListener(Elements.openEventName, this.internal_onopen);
                this.internal_onopen = value;
                this.addEventListener(Elements.openEventName, this.internal_onopen);
            }
            clickedOutside = function (event) {
                if (event.composedPath().includes(this))
                    return;
                if (event.composedPath().includes(this.controlParent))
                    return;
                if (this.open)
                    this.open = false;
            }.bind(this);
            static closeAll() {
                for (const dropDown of this.dropDowns)
                    dropDown.close();
            }
        }
        Elements.DropDown = DropDown;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("drop-down", UI.Elements.DropDown);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class Fragment extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                const shadowStyle = document.createElement("style");
                const styleText = ":host { display: contents; }";
                shadowStyle.textContent = styleText;
                this.shadowRoot.appendChild(shadowStyle);
            }
            connectedCallback() {
                if (this.parentNode) {
                    this.before(...this.childNodes);
                    this.remove();
                }
            }
            *[Symbol.iterator]() {
                for (const child of [...this.childNodes])
                    yield child;
            }
        }
        Elements.Fragment = Fragment;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("jsx-fragment", UI.Elements.Fragment);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.Badge = new (class {
            setBadge(element, value) {
                let badge;
                for (const child of element.children)
                    if (child instanceof Elements.StickyBadge) {
                        badge = child;
                        break;
                    }
                if (!badge) {
                    badge = new Elements.StickyBadge();
                    element.appendChild(badge);
                }
                let span;
                if (!(badge.firstChild instanceof HTMLSpanElement)) {
                    badge.clearChildren();
                    badge.appendChild(span = document.createElement("span"));
                }
                else
                    span = badge.firstChild;
                span.textContent = value;
            }
        })();
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
//! cannot react to attribute changes
Object.defineProperty(HTMLElement.prototype, "badge", {
    get: function () {
        return this.getAttribute("badge");
    },
    set: function (value) {
        if (value == null)
            this.removeAttribute("badge");
        else
            this.setAttribute("badge", value);
        UI.Elements.Badge.setBadge(this, value);
    }
});
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class StickyBadge extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
            }
            build() {
                return (UI.Generator.Hyperscript("div", { id: "sticky-badge-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
        }
        Elements.StickyBadge = StickyBadge;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("sticky-badge", UI.Elements.StickyBadge);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class IconButton extends UI.Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("icon-button-root");
                this.iconDiv = this.shadowRoot.getElementById("icon-button-icon");
                this.textSpan = this.shadowRoot.getElementById("icon-button-text");
            }
            root;
            iconDiv;
            textSpan;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "icon-button-root" },
                    UI.Generator.Hyperscript("div", { id: "icon-button-icon" }),
                    UI.Generator.Hyperscript("span", { id: "icon-button-text" }),
                    UI.Generator.Hyperscript("slot", null)));
            }
            static get observedAttributes() { return ["text", "icon"]; }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue == newValue)
                    return;
                switch (name) {
                    case "text":
                        this.textSpan.textContent = newValue;
                        break;
                    case "icon":
                        this.iconDiv.style.backgroundImage = "url('" + newValue + "')";
                        break;
                }
            }
            get text() { return this.getAttribute("text"); }
            set text(value) { this.setAttribute("text", value); }
            get icon() { return this.getAttribute("icon"); }
            set icon(value) { this.setAttribute("icon", value); }
        }
        Elements.IconButton = IconButton;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("icon-button", UI.Elements.IconButton);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class MenuButton extends Elements.CustomElement {
            constructor() {
                super();
                this.anchorName = "--drop-down-" + GUID.Create();
                this.shadowRoot.append(...this.build());
                this.addEventListener("click", this.clicked);
                this.addEventListener(UI.Events.childrenChangedEventName, this.childrenChanged);
            }
            anchorName;
            build() {
                return [UI.Generator.Hyperscript("slot", null), UI.Generator.Hyperscript("slot", { name: "drop-down" })];
            }
            static get observedAttributes() {
                return ["open"];
            }
            connectedCallback() {
                this.style.setProperty("anchor-name", this.anchorName);
                this.dropDown = this.querySelector(":scope > drop-down");
                if (this.dropDown)
                    this.dropDown.slot = "drop-down";
            }
            disconnectedCallback() {
                this.dropDown = null;
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "open":
                        if (oldValue != newValue && this.internalDropDown)
                            this.internalDropDown.open = this.open;
                        break;
                }
            }
            get open() { return UI.Helper.GetFlagAttribute(this, "open"); }
            set open(value) { UI.Helper.SetFlagAttribute(this, "open", value); }
            internalDropDown;
            get dropDown() { return this.internalDropDown; }
            set dropDown(dropDown) {
                if (this.internalDropDown) {
                    this.internalDropDown.style.setProperty("position-anchor", null);
                    this.internalDropDown.removeEventListener(Elements.openEventName, this.dropDownOpen);
                    this.internalDropDown.removeEventListener(Elements.closeEventName, this.dropDownClose);
                }
                this.internalDropDown = dropDown;
                if (this.internalDropDown) {
                    this.internalDropDown.style.setProperty("position-anchor", this.anchorName);
                    this.internalDropDown.open = this.open;
                    this.internalDropDown.addEventListener(Elements.openEventName, this.dropDownOpen);
                    this.internalDropDown.addEventListener(Elements.closeEventName, this.dropDownClose);
                }
            }
            dropDownOpen = function (event) {
                this.open = true;
            }.bind(this);
            dropDownClose = function (event) {
                this.open = false;
            }.bind(this);
            childrenChanged = function (event) {
                this.dropDown = this.querySelector(":scope > drop-down");
            }.bind(this);
            clicked = function (event) {
                if (this.dropDown)
                    this.dropDown.toggle();
                else {
                    let parent = this.parentElement;
                    do {
                        if (parent instanceof Elements.DropDown)
                            parent.close();
                    } while (parent = parent.parentElement);
                }
                event.preventDefault();
                event.stopPropagation();
            }.bind(this);
        }
        Elements.MenuButton = MenuButton;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("menu-button", UI.Elements.MenuButton);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class RepeatButton extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("repeat-button-root");
                this.addEventListener("mousedown", this.mouseDown);
                this.addEventListener("mouseup", this.mouseUp);
                this.addEventListener("mouseleave", this.mouseLeave);
                this.addEventListener("mouseenter", this.mouseEnter);
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "repeat-button-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
            static defaultInitialInterval = 200;
            get initialInterval() { return this.hasAttribute("initial-interval") ? parseInt(this.getAttribute("initial-interval")) : RepeatButton.defaultInitialInterval; }
            set initialInterval(value) { value == null ? this.removeAttribute("initial-interval") : this.setAttribute("initial-interval", value.toString()); }
            static defaultInterval = 25;
            get interval() { return this.hasAttribute("interval") ? parseInt(this.getAttribute("interval")) : RepeatButton.defaultInterval; }
            set interval(value) { value == null ? this.removeAttribute("interval") : this.setAttribute("interval", value.toString()); }
            clicks;
            timeout;
            mouseDown = function (e) {
                this.clicks = 0;
                const event = new CustomEvent("repeatclick");
                event.clicks = this.clicks;
                this.dispatchEvent(event);
                this.timeout = setTimeout(this.repeatClick, this.initialInterval);
            }.bind(this);
            mouseUp = function (e) {
                clearTimeout(this.timeout);
            }.bind(this);
            mouseLeave = function (e) {
                clearTimeout(this.timeout);
            }.bind(this);
            mouseEnter = function (e) {
                if (this.clicks > 0) {
                    this.clicks++;
                    const event = new CustomEvent("repeatclick");
                    event.clicks = this.clicks;
                    this.dispatchEvent(event);
                    this.timeout = setTimeout(this.repeatClick, this.interval);
                }
            }.bind(this);
            repeatClick = function () {
                this.clicks++;
                const event = new CustomEvent("repeatclick");
                event.clicks = this.clicks;
                this.dispatchEvent(event);
                this.timeout = setTimeout(this.repeatClick, this.interval);
            }.bind(this);
        }
        Elements.RepeatButton = RepeatButton;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("repeat-button", UI.Elements.RepeatButton);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class SwitchButton extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("switch-button-root");
                this.addEventListener("click", this.clicked);
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "switch-button-root" }));
            }
            static get observedAttributes() {
                return ["options", "checked-index"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "options":
                        try {
                            this.options = JSON.parse(newValue).map(x => typeof (x) == "string" ? { title: x, value: x } : x);
                        }
                        catch (error) {
                            console.error("Error setting options!", error, this, newValue);
                        }
                        break;
                    case "checked-index":
                        if (oldValue != newValue) {
                            this.refreshCheckedOption();
                            this.dispatchEvent(new Event("change"));
                        }
                        break;
                }
            }
            internal_options = [];
            get options() { return this.internal_options; }
            set options(values) { this.internal_options = values ?? []; this.refreshCheckedOption(); }
            get checkedIndex() { return this.hasAttribute("checked-index") ? parseInt(this.getAttribute("checked-index")) : 0; }
            set checkedIndex(value) { if (this.checkedIndex != value)
                this.setAttribute("checked-index", value.toString()); }
            get checkedOption() { return this.internal_options[this.checkedIndex]; }
            set checkedOption(value) { this.checkedIndex = this.internal_options.indexOf(value); }
            get value() { return this.checkedOption?.value; }
            set value(value) { this.checkedIndex = this.options.findIndex(x => x.value == value); }
            refreshCheckedOption() {
                this.root.clearChildren();
                this.root.appendChild(this.buildCheckedOption());
            }
            buildCheckedOption() {
                return (UI.Generator.Hyperscript("div", { "index-attribute": this.checkedIndex }, this.checkedOption?.title));
            }
            clicked = function (e) {
                let newIndex = this.checkedIndex + 1;
                if (newIndex >= this.options.length)
                    newIndex = 0;
                this.checkedIndex = newIndex;
            }.bind(this);
        }
        Elements.SwitchButton = SwitchButton;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("switch-button", UI.Elements.SwitchButton);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ToggleButton extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("toggle-button-root");
                this.addEventListener("click", this.clicked);
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "toggle-button-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
            static get observedAttributes() {
                return ["checked"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "checked":
                        this.dispatchEvent(new Event("change"));
                        break;
                }
            }
            get checked() { return UI.Helper.GetFlagAttribute(this, "checked"); }
            set checked(value) { UI.Helper.SetFlagAttribute(this, "checked", value); }
            clicked = function (e) {
                this.checked = !this.checked;
            }.bind(this);
        }
        Elements.ToggleButton = ToggleButton;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("toggle-button", UI.Elements.ToggleButton);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class PaneContainer extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.addEventListener("sizechanged", this.sizeChanged);
                this.addEventListener("mousedown", this.mouseDown);
            }
            build() {
                return (UI.Generator.Hyperscript("slot", null));
            }
            connectedCallback() {
            }
            disconnectedCallback() {
            }
            calcAvailableWidth() {
                const totalWidth = this.getBoundingClientRect().width;
                const columnGap = parseFloat(getComputedStyle(this).columnGap.replace(/[^\d]/g, ''));
                const columnCount = this.children.length - 1;
                return totalWidth - (columnCount * columnGap);
            }
            previousPane;
            nextPane;
            mouseDown = function (event) {
                const x = event.clientX;
                const children = [...this.children];
                this.previousPane = null;
                this.nextPane = null;
                for (const child of children) {
                    const childBounds = child.getBoundingClientRect();
                    const childLeft = childBounds.left;
                    const childRight = childBounds.right;
                    if (childLeft <= x && childRight >= x)
                        return; // clicked on pane
                    if (childRight < x)
                        this.previousPane = child;
                    if (childLeft > x && !this.nextPane)
                        this.nextPane = child;
                }
                this.addEventListener("mousemove", this.mouseMove);
                this.addEventListener("mouseup", this.mouseReset);
                ;
                this.addEventListener("mouseleave", this.mouseReset);
                event.preventDefault();
                event.stopPropagation();
            }.bind(this);
            mouseMove = function (event) {
                const oldPreviousPaneWidth = this.previousPane.getBoundingClientRect().width;
                const oldNextPaneWidth = this.nextPane.getBoundingClientRect().width;
                let x = event.movementX;
                if (oldPreviousPaneWidth + x < 0)
                    x = -oldPreviousPaneWidth;
                if (oldNextPaneWidth - x < 0)
                    x = oldNextPaneWidth;
                const newPreviousPaneWidth = oldPreviousPaneWidth + x;
                const newnextPaneWidth = oldNextPaneWidth - x;
                this.previousPane.style.width = newPreviousPaneWidth + "px";
                this.nextPane.style.width = newnextPaneWidth + "px";
            }.bind(this);
            mouseReset = function (event) {
                this.removeEventListener("mousemove", this.mouseMove);
                this.removeEventListener("mouseup", this.mouseReset);
                this.removeEventListener("mouseleave", this.mouseReset);
            }.bind(this);
            sizeChanged = function (event) {
                const children = [...this.children];
                const availableWidth = this.calcAvailableWidth();
                if (event.oldSize.width == 0) {
                    for (const child of children)
                        child.style.width = (availableWidth / children.length) + "px";
                }
                else {
                    const oldAvailableWidth = children.sum(x => x.getBoundingClientRect().width);
                    const widths = children.map(x => [x, x.getBoundingClientRect().width / oldAvailableWidth]);
                    for (const [child, percent] of widths)
                        child.style.width = (percent * availableWidth) + "px";
                }
            }.bind(this);
        }
        Elements.PaneContainer = PaneContainer;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("pane-container", UI.Elements.PaneContainer);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class SwipeContainer extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("swipe-container-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "swipe-container-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
            static get observedAttributes() {
                return ["index"];
            }
            connectedCallback() {
                const indexText = this.getAttribute("index");
                if (indexText) {
                    const index = parseInt(indexText);
                    const width = this.root.getBoundingClientRect().width;
                    // only works with delay
                    setTimeout(() => this.root.scrollLeft = width * index, 0);
                }
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "index":
                        const index = parseInt(newValue ?? "0");
                        const realIndex = Math.round(this.index);
                        if (realIndex != index) {
                            const width = this.root.getBoundingClientRect().width;
                            this.root.scrollLeft = width * index;
                        }
                        break;
                }
            }
            get index() {
                const offset = this.root.scrollLeft;
                const width = this.root.getBoundingClientRect().width;
                return offset / width;
            }
            set index(value) {
                this.setAttribute("index", Math.round(value).toFixed(0));
            }
        }
        Elements.SwipeContainer = SwipeContainer;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("swipe-container", UI.Elements.SwipeContainer);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ContextMenu extends Elements.DropDown {
            constructor() {
                super();
                const clickOutside = (event) => {
                    if (event.composedPath().includes(this))
                        return;
                    event.stopPropagation();
                    event.preventDefault();
                    this.close();
                };
                this.addEventListener(Elements.openEventName, (event) => {
                    const bounds = this.getBoundingClientRect();
                    if (bounds.right > window.innerWidth) {
                        const outside = bounds.right - window.innerWidth;
                        this.style.marginLeft = (bounds.left - outside) + "px";
                    }
                    if (bounds.bottom > window.innerHeight) {
                        const outside = bounds.bottom - window.innerHeight;
                        this.style.marginTop = (bounds.top - outside) + "px";
                    }
                    if (bounds.left < 0)
                        this.style.marginLeft = "0px";
                    if (bounds.top < 0)
                        this.style.marginTop = "0px";
                    window.addEventListener("click", clickOutside);
                });
                this.addEventListener(Elements.closeEventName, (event) => {
                    window.removeEventListener("click", clickOutside);
                });
            }
        }
        Elements.ContextMenu = ContextMenu;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("context-menu", UI.Elements.ContextMenu);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class OverlayDialog extends Elements.CustomElement {
            constructor() {
                super();
                this.addEventListener("animationend", this.animationEnd);
            }
            static get observedAttributes() {
                return [];
            }
            attributeChangedCallback(name, oldValue, newValue) {
            }
            connectedCallback() {
                UI.Helper.SetFlagAttribute(this, "dialog", true);
                UI.Helper.SetFlagAttribute(this, "close-on-routing", true);
            }
            get closeOnRouting() { return UI.Helper.GetFlagAttribute(this, "close-on-routing"); }
            set closeOnRouting(value) { UI.Helper.SetFlagAttribute(this, "close-on-routing", value); }
            showDialog(parent) {
                return new Promise((resolve, reject) => {
                    this.addEventListener("close", () => resolve(), { once: true });
                    this.show(parent);
                });
            }
            show(parent) {
                (parent ?? document.body).appendChild(this);
                this.setAttribute("state", "open");
                this.dispatchEvent(new Event("open"));
                OverlayDialog.opened.call(this, {});
            }
            close() {
                this.setAttribute("state", "closing");
                this.dispatchEvent(new Event("close"));
                OverlayDialog.closed.call(this, {});
            }
            animationEnd = function (event) {
                if (event.animationName == "dialog-fade-out" && this.getAttribute("state") == "closing") {
                    this.remove();
                    this.setAttribute("state", null);
                }
            }.bind(this);
            static closeTop(element) {
                const closeOnRouting = (element ?? document).querySelector("[dialog]");
                closeOnRouting?.close?.();
            }
            static closeAll(element) {
                for (const closeOnRouting of (element ?? document).querySelectorAll("[dialog]"))
                    closeOnRouting.close?.();
            }
            static opened = new EventSignal();
            static closed = new EventSignal();
        }
        Elements.OverlayDialog = OverlayDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("overlay-dialog", UI.Elements.OverlayDialog);
/// <reference path="OverlayDialog.ts" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ContainerDialog extends Elements.OverlayDialog {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("container-dialog-root");
                this.closeButton = this.shadowRoot.getElementById("container-dialog-close-button");
                this.iconImage = this.shadowRoot.getElementById("container-dialog-icon");
                this.titleSpan = this.shadowRoot.getElementById("container-dialog-title");
                this.mode = "center";
                this.addEventListener("open", this.selfOpen.bind(this));
            }
            root;
            closeButton;
            iconImage;
            titleSpan;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "container-dialog-root" },
                    UI.Generator.Hyperscript("div", { id: "container-dialog-container" },
                        UI.Generator.Hyperscript("slot", null),
                        UI.Generator.Hyperscript("img", { id: "container-dialog-icon" }),
                        UI.Generator.Hyperscript("span", { id: "container-dialog-title" }),
                        UI.Generator.Hyperscript("button", { id: "container-dialog-close-button", style: "visibility: hidden;", onclick: this.close.bind(this) },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" }))),
                    UI.Generator.Hyperscript("div", { id: "container-dialog-backdrop" })));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "allow-close", "title", "icon"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "allow-close":
                        this.closeButton.style.visibility = this.allowClose ? "visible" : "hidden";
                        break;
                    case "title":
                        this.titleSpan.textContent = this.title;
                        break;
                    case "icon": this.iconImage.src = newValue;
                }
            }
            get icon() { return this.getAttribute("icon"); }
            set icon(value) { this.setAttribute("icon", value); }
            get allowClose() { return UI.Helper.GetFlagAttribute(this, "allow-close"); }
            set allowClose(value) { UI.Helper.SetFlagAttribute(this, "allow-close", value); }
            internal_mode;
            get mode() { return this.internal_mode; }
            set mode(value) {
                this.internal_mode = value;
                this.root.classList.toggle("center", this.internal_mode == "center");
                this.root.classList.toggle("fill", this.internal_mode == "fill");
                this.root.classList.toggle("full", this.internal_mode == "full");
            }
            selfOpen() {
                const slot = this.root.querySelector("slot");
                slot?.assignedElements()[0]?.focus();
            }
            static close(self) {
                const containerDialog = self.closest("container-dialog");
                containerDialog?.close();
            }
        }
        Elements.ContainerDialog = ContainerDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("container-dialog", UI.Elements.ContainerDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ConfirmDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Confirm";
                this.icon = "img/icons/confirm.svg";
                this.appendChild(this.build1());
                this.textSpan = this.querySelector("#confirm-dialog-text");
                this.okButton = this.querySelector("#confirm-dialog-ok-button");
                this.cancelButton = this.querySelector("#confirm-dialog-cancel-button");
            }
            textSpan;
            okButton;
            cancelButton;
            build1() {
                document.createElement;
                return (UI.Generator.Hyperscript("div", { id: "confirm-dialog" },
                    UI.Generator.Hyperscript("span", { id: "confirm-dialog-text" }, "Text"),
                    UI.Generator.Hyperscript("button", { id: "confirm-dialog-ok-button", onclick: this.okClick.bind(this) }, "OK"),
                    UI.Generator.Hyperscript("button", { id: "confirm-dialog-cancel-button", onclick: this.cancelClick.bind(this) }, "Cancel")));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "text", "ok", "cancel"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "text":
                        this.textSpan.textContent = newValue;
                        break;
                    case "ok":
                        this.okButton.textContent = newValue;
                        break;
                    case "cancel":
                        this.cancelButton.textContent = newValue;
                        break;
                }
            }
            get text() { return this.getAttribute("text"); }
            set text(value) { value == null ? this.removeAttribute("text") : this.setAttribute("text", value); }
            get ok() { return this.getAttribute("ok"); }
            set ok(value) { value == null ? this.removeAttribute("ok") : this.setAttribute("ok", value); }
            get cancel() { return this.getAttribute("cancel"); }
            set cancel(value) { value == null ? this.removeAttribute("cancel") : this.setAttribute("cancel", value); }
            okClick() {
                this.result = true;
                this.close();
            }
            cancelClick() {
                this.result = false;
                this.close();
            }
            async showDialog(parent) {
                await super.showDialog(parent);
                return this.result;
            }
            result = false;
        }
        Elements.ConfirmDialog = ConfirmDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("confirm-dialog", UI.Elements.ConfirmDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class DownloadDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Download";
                this.icon = "img/icons/upload.svg";
                this.appendChild(this.build1());
            }
            fileList;
            totalFileCountElement;
            totalFileSizeElement;
            downloadListElement;
            downloadZipButton;
            downloadBatchButton;
            downloadProgressElement;
            downloadProgressTextElement;
            build1() {
                return (UI.Generator.Hyperscript("div", { id: "download-dialog" },
                    this.fileList = UI.Generator.Hyperscript("ul", { id: "download-dialog-file-list" }),
                    UI.Generator.Hyperscript("span", { id: "download-dialog-counters" },
                        this.totalFileCountElement = UI.Generator.Hyperscript("span", null, "Total Files: 0"),
                        this.totalFileSizeElement = UI.Generator.Hyperscript("span", null, "Total Size: 0b")),
                    UI.Generator.Hyperscript("div", { id: "download-dialog-actions" },
                        this.downloadZipButton = UI.Generator.Hyperscript("button", { id: "download-dialog-download-zip", onclick: this.downloadZip }, "Download Zip"),
                        this.downloadBatchButton = UI.Generator.Hyperscript("button", { id: "download-dialog-download-batch", onclick: this.downloadBatch }, "Download Batch"),
                        this.downloadListElement = UI.Generator.Hyperscript("a", { id: "download-dialog-download-list", download: "list.txt" }, "Download List")),
                    UI.Generator.Hyperscript("div", { id: "download-dialog-progress" },
                        this.downloadProgressElement = UI.Generator.Hyperscript("progress", { value: 0, max: 0 }),
                        this.downloadProgressTextElement = UI.Generator.Hyperscript("span", null, "0%"))));
            }
            files;
            zipName = "files.zip";
            build2() {
                let i = 0;
                for (const file of this.files) {
                    let readableSize = file.size ? Math.calculateHumanReadableFileSize(file.size) : "? kB";
                    this.fileList.append(UI.Generator.Hyperscript("li", null,
                        UI.Generator.Hyperscript("span", null, ++i),
                        UI.Generator.Hyperscript("a", { class: "download-item link", href: file.url, download: file.name + "." + file.extension, title: file.name + "." + file.extension }, file.name),
                        UI.Generator.Hyperscript("span", { title: file.size?.toString() ?? "unknown size" }, readableSize),
                        UI.Generator.Hyperscript("span", { title: file.date?.toString() ?? "unknown date" }, file.date?.toLocaleDateString())));
                }
                this.totalFileCountElement.textContent = "Total Files: " + this.files.length;
                this.totalFileSizeElement.textContent = "Total Size: " + (this.files.some(x => x.size == null) ? "? kB" : Math.calculateHumanReadableFileSize(this.files.sum(x => x.size)));
                this.downloadListElement.href = "data:text/plain;base64," + btoa(this.files.map(f => f.url).join("\n"));
            }
            downloadZip = async function () {
                try {
                    this.downloadZipButton.classList.toggle("disabled");
                    this.downloadBatchButton.classList.toggle("disabled");
                    this.downloadProgressTextElement.textContent = "0%";
                    this.downloadProgressElement.value = 0;
                    this.downloadProgressElement.max = this.files.length;
                    //@ts-ignore
                    const zip = new JSZip();
                    for (const file of this.files) {
                        const url = file.url;
                        const fileName = file.name + "." + file.extension;
                        const response = await fetch(url);
                        if (!response.ok)
                            throw response.status + " " + response.statusText;
                        const data = await response.blob();
                        zip.file(fileName, data);
                        this.downloadProgressElement.value++;
                        this.downloadProgressTextElement.textContent = (this.downloadProgressElement.value / this.files.length).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 });
                    }
                    this.downloadProgressTextElement.textContent = "Compressing";
                    const base64 = await zip.generateAsync({ type: "base64" });
                    const dataUrl = "data:application/zip;base64," + base64;
                    DownloadHelper.downloadUrl(this.zipName, dataUrl);
                    this.downloadProgressTextElement.textContent = "Finished!";
                    this.downloadZipButton.classList.toggle("disabled");
                    this.downloadBatchButton.classList.toggle("disabled");
                }
                catch (error) {
                    UI.Dialog.error(error);
                }
                if (!this.allowClose)
                    this.close();
            }.bind(this);
            downloadBatch = async function () {
                try {
                    this.downloadZipButton.classList.toggle("disabled");
                    this.downloadBatchButton.classList.toggle("disabled");
                    this.downloadProgressTextElement.textContent = "0%";
                    this.downloadProgressElement.value = 0;
                    this.downloadProgressElement.max = this.files.length;
                    for (const file of this.files) {
                        const url = file.url;
                        const fileName = file.name + "." + file.extension;
                        const response = await fetch(url);
                        if (!response.ok)
                            throw response.status + " " + response.statusText;
                        const data = await response.blob();
                        const dataUrl = await readDataUri(data);
                        DownloadHelper.downloadUrl(fileName, dataUrl);
                        this.downloadProgressElement.value++;
                        this.downloadProgressTextElement.textContent = (this.downloadProgressElement.value / this.files.length).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 });
                    }
                    this.downloadProgressTextElement.textContent = "Finished!";
                    this.downloadZipButton.classList.toggle("disabled");
                    this.downloadBatchButton.classList.toggle("disabled");
                }
                catch (error) {
                    UI.Dialog.error(error);
                }
                if (!this.allowClose)
                    this.close();
            }.bind(this);
            async showDialog(parent) {
                this.build2();
                await super.showDialog(parent);
            }
            result;
        }
        Elements.DownloadDialog = DownloadDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("download-dialog", UI.Elements.DownloadDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ErrorDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Error";
                this.icon = "img/icons/error.svg";
                this.appendChild(this.build1());
                this.textSpan = this.querySelector("#error-dialog-text");
                this.okButton = this.querySelector("#error-dialog-ok-button");
            }
            textSpan;
            okButton;
            build1() {
                return (UI.Generator.Hyperscript("div", { id: "error-dialog" },
                    UI.Generator.Hyperscript("span", { id: "error-dialog-text" }, "Text"),
                    UI.Generator.Hyperscript("button", { id: "error-dialog-ok-button", onclick: this.okClick.bind(this) }, "OK")));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "text", "ok"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "text":
                        this.textSpan.textContent = newValue;
                        break;
                    case "ok":
                        this.okButton.textContent = newValue;
                        break;
                }
            }
            get text() { return this.getAttribute("text"); }
            set text(value) { value == null ? this.removeAttribute("text") : this.setAttribute("text", value); }
            get ok() { return this.getAttribute("ok"); }
            set ok(value) { value == null ? this.removeAttribute("ok") : this.setAttribute("ok", value); }
            okClick() {
                this.close();
            }
        }
        Elements.ErrorDialog = ErrorDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("error-dialog", UI.Elements.ErrorDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class LightBoxDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = true;
                this.mode = "fill";
                this.appendChild(this.lightBox = new Elements.LightBox());
                this.lightBox.id = "light-box-dialog";
            }
            lightBox;
            get pages() { return this.lightBox.pages; }
            set pages(values) { this.lightBox.pages = values; }
            get currentIndex() { return this.lightBox.currentIndex; }
            set currentIndex(value) { this.lightBox.currentIndex = value; }
            get currentPage() { return this.lightBox.currentPage; }
            previous() {
                this.lightBox.previous();
            }
            next() {
                this.lightBox.next();
            }
            goto(index) {
                this.lightBox.goto(index);
            }
        }
        Elements.LightBoxDialog = LightBoxDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("light-box-dialog", UI.Elements.LightBoxDialog);
/// <reference path="OverlayDialog.ts" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class MessageDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Info";
                this.icon = "img/icons/message.svg";
                this.appendChild(this.build1());
                this.textSpan = this.querySelector("#message-dialog-text");
                this.okButton = this.querySelector("#message-dialog-ok-button");
            }
            textSpan;
            okButton;
            build1() {
                return (UI.Generator.Hyperscript("div", { id: "message-dialog" },
                    UI.Generator.Hyperscript("span", { id: "message-dialog-text" }, "Text"),
                    UI.Generator.Hyperscript("button", { id: "message-dialog-ok-button", onclick: this.okClick.bind(this) }, "OK")));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "text", "ok"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "text":
                        this.textSpan.textContent = newValue;
                        break;
                    case "ok":
                        this.okButton.textContent = newValue;
                        break;
                }
            }
            get text() { return this.getAttribute("text"); }
            set text(value) { value == null ? this.removeAttribute("text") : this.setAttribute("text", value); }
            get ok() { return this.getAttribute("ok"); }
            set ok(value) { value == null ? this.removeAttribute("ok") : this.setAttribute("ok", value); }
            okClick() {
                this.close();
            }
        }
        Elements.MessageDialog = MessageDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("message-dialog", UI.Elements.MessageDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class OptionSelectDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.title = "Select";
                this.appendChild(this.build1());
                this.optionsList = this.querySelector("#option-select-dialog-options-list");
                this.addEventListener("open", () => {
                    const checkedOption = this.optionsList.querySelector(".checked");
                    if (checkedOption)
                        checkedOption.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
                });
            }
            optionsList;
            build1() {
                document.createElement;
                return (UI.Generator.Hyperscript("div", { id: "option-select-dialog" },
                    UI.Generator.Hyperscript("div", { id: "option-select-dialog-options-list" })));
            }
            static get observedAttributes() {
                return [...super.observedAttributes];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
            }
            get allowEmpty() { return this.allowClose; }
            set allowEmpty(value) { this.allowClose = value; }
            internal_options = [];
            get options() { return this.internal_options; }
            set options(values) { this.internal_options = values ?? []; this.refreshOptions(); }
            internal_checkedIndex;
            get checkedIndex() { return this.internal_checkedIndex; }
            set checkedIndex(value) {
                if (this.internal_checkedIndex != value) {
                    this.internal_checkedIndex = value;
                    this.refreshSelectedOptions();
                }
            }
            get checkedOption() { return this.internal_options[this.internal_checkedIndex]; }
            set checkedOption(value) { this.checkedIndex = this.internal_options.indexOf(value); }
            get result() { return this.checkedOption?.value; }
            set result(value) { this.checkedIndex = this.options.findIndex(x => x.value == value); }
            refreshOptions() {
                this.optionsList.clearChildren();
                let i = 0;
                for (const option of this.options) {
                    const optionButton = this.buildOptionButton(option, i++);
                    this.optionsList.appendChild(optionButton);
                }
                this.refreshSelectedOptions();
            }
            refreshSelectedOptions() {
                for (const optionButton of this.optionsList.children) {
                    const index = parseInt(optionButton.getAttribute("index"));
                    optionButton.classList.toggle("checked", index == this.checkedIndex);
                }
            }
            buildOptionButton(option, index) {
                return (UI.Generator.Hyperscript("button", { "index-attribute": index, onclick: () => {
                        this.checkedOption = option;
                        this.close();
                    } }, option.title));
            }
            async showDialog(parent) {
                await super.showDialog(parent);
                return this.result;
            }
        }
        Elements.OptionSelectDialog = OptionSelectDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("option-select-dialog", UI.Elements.OptionSelectDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ProgressDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Progress";
                this.icon = "img/icons/progress.svg";
                this.appendChild(this.build1());
                this.progress = this.querySelector("#progress-dialog-progress");
                this.textSpan = this.querySelector("#progress-dialog-text");
                this.displayType = "Percent";
                this.max = 100;
                this.value = 0;
            }
            progress;
            textSpan;
            build1() {
                return (UI.Generator.Hyperscript("div", { id: "progress-dialog" },
                    UI.Generator.Hyperscript("progress", { id: "progress-dialog-progress" }),
                    UI.Generator.Hyperscript("span", { id: "progress-dialog-text" })));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "max", "value", "display-type"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "max":
                        this.progress.max = parseFloat(newValue);
                        this.refreshText();
                        break;
                    case "value":
                        this.progress.value = parseFloat(newValue);
                        this.refreshText();
                        break;
                    case "display-type":
                        this.refreshText();
                        break;
                }
            }
            refreshText() {
                switch (this.displayType) {
                    case "Percent":
                        const percent = (this.value / this.max) * 100;
                        this.textSpan.textContent = percent.toFixed(2).toString() + "%";
                        break;
                    case "Absolute":
                        this.textSpan.textContent = this.value.toString() + " / " + this.max.toString();
                        break;
                }
            }
            get max() { return parseFloat(this.getAttribute("max")); }
            set max(value) { value == null ? this.removeAttribute("max") : this.setAttribute("max", value.toString()); }
            get value() { return parseFloat(this.getAttribute("value")); }
            set value(value) { value == null ? this.removeAttribute("value") : this.setAttribute("value", value.toString()); }
            get displayType() { const value = this.getAttribute("display-type"); return !["Percent", "Absolute"].includes(value) ? "Percent" : value; }
            set displayType(value) { value == null ? this.removeAttribute("display-type") : this.setAttribute("display-type", value.toString()); }
            async showDialog(parent) {
                await super.showDialog(parent);
            }
        }
        Elements.ProgressDialog = ProgressDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("progress-dialog", UI.Elements.ProgressDialog);
/// <reference path="ContainerDialog.tsx" />
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class UploadDialog extends Elements.ContainerDialog {
            constructor() {
                super();
                this.allowClose = false;
                this.title = "Upload";
                this.icon = "img/icons/upload.svg";
                this.appendChild(this.build1());
                this.fileInput = this.querySelector("#upload-dialog-input");
                this.okButton = this.querySelector("#upload-dialog-ok-button");
                this.cancelButton = this.querySelector("#upload-dialog-cancel-button");
            }
            fileInput;
            okButton;
            cancelButton;
            build1() {
                return (UI.Generator.Hyperscript("div", { id: "upload-dialog" },
                    UI.Generator.Hyperscript("input", { id: "upload-dialog-input", type: "file", name: "file", onchange: () => this.okButton.classList.remove("disabled") }),
                    UI.Generator.Hyperscript("button", { id: "upload-dialog-ok-button", class: "disabled", onclick: this.okClick.bind(this) }, "OK"),
                    UI.Generator.Hyperscript("button", { id: "upload-dialog-cancel-button", onclick: this.cancelClick.bind(this) }, "Cancel")));
            }
            static get observedAttributes() {
                return [...super.observedAttributes, "ok", "cancel", "accept", "multiple"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback(name, oldValue, newValue);
                switch (name) {
                    case "ok":
                        this.okButton.textContent = newValue;
                        break;
                    case "cancel":
                        this.cancelButton.textContent = newValue;
                        break;
                    case "accept":
                        this.fileInput.accept = newValue;
                        break;
                    case "multiple":
                        this.fileInput.multiple = newValue != null;
                        break;
                }
            }
            get ok() { return this.getAttribute("ok"); }
            set ok(value) { value == null ? this.removeAttribute("ok") : this.setAttribute("ok", value); }
            get cancel() { return this.getAttribute("cancel"); }
            set cancel(value) { value == null ? this.removeAttribute("cancel") : this.setAttribute("cancel", value); }
            get accept() { return this.getAttribute("accept"); }
            set accept(value) { value == null ? this.removeAttribute("accept") : this.setAttribute("accept", value); }
            get multiple() { return UI.Helper.GetFlagAttribute(this, "multiple"); }
            set multiple(value) { UI.Helper.SetFlagAttribute(this, "multiple", value); }
            okClick() {
                this.result = this.fileInput.files;
                this.close();
            }
            cancelClick() {
                this.result = null;
                this.close();
            }
            async showDialog(parent) {
                await super.showDialog(parent);
                return this.result;
            }
            result;
        }
        Elements.UploadDialog = UploadDialog;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("upload-dialog", UI.Elements.UploadDialog);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class VerticalDivider extends Elements.CustomElement {
            constructor() {
                super();
                this.addEventListener("mousedown", this.mouseDown);
                this.addEventListener("dblclick", this.doubleClicked);
            }
            x = 0;
            initialWidth;
            mouseDown = function (e) {
                const previousSibling = this.previousElementSibling;
                if (!previousSibling)
                    return;
                document.body.style.setProperty("cursor", "col-resize", "important");
                this.x = e.clientX;
                this.initialWidth = previousSibling.getBoundingClientRect().width;
                document.addEventListener("mousemove", this.mouseMove);
                document.addEventListener("mouseup", this.mouseUp);
            }.bind(this);
            mouseMove = function (e) {
                const amount = e.clientX - this.x;
                this.resizePreviousSibling(amount);
            }.bind(this);
            mouseUp = function (e) {
                document.body.style.cursor = null;
                document.removeEventListener("mousemove", this.mouseMove);
                document.removeEventListener("mouseup", this.mouseUp);
            }.bind(this);
            resizePreviousSibling(amount) {
                let newWidth = this.initialWidth + amount;
                if (newWidth < 0)
                    newWidth = 0;
                this.previousElementSibling.style.width = newWidth.toString() + "px";
            }
            doubleClicked = function (e) {
                const prev = this.previousElementSibling;
                if (prev)
                    prev.style.width = prev.style.width ? null : "100%";
            }.bind(this);
        }
        Elements.VerticalDivider = VerticalDivider;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("vertical-divider", UI.Elements.VerticalDivider);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.pageChangedEventName = "pagechanged";
        class LightBox extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("light-box-root");
                this.container = this.shadowRoot.getElementById("light-box-container");
                this.titleHeading = this.shadowRoot.getElementById("light-box-title");
                this.previousButton = this.shadowRoot.getElementById("light-box-previous-button");
                this.nextButton = this.shadowRoot.getElementById("light-box-next-button");
                this.nav = this.shadowRoot.getElementById("light-box-nav");
                this.tabIndex = 0; // needed for focus
                this.addEventListener("keydown", this.keyDown.bind(this));
                this.addEventListener("keyup", this.keyUp.bind(this));
            }
            root;
            container;
            titleHeading;
            previousButton;
            nextButton;
            nav;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "light-box-root" },
                    UI.Generator.Hyperscript("div", { id: "light-box-container", onclick: this.previous.bind(this) }),
                    UI.Generator.Hyperscript("h2", { id: "light-box-title" }),
                    UI.Generator.Hyperscript("button", { id: "light-box-previous-button", onclick: this.previous.bind(this) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-left.svg" })),
                    UI.Generator.Hyperscript("button", { id: "light-box-next-button", onclick: this.next.bind(this) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-right.svg" })),
                    UI.Generator.Hyperscript("div", { id: "light-box-nav" })));
            }
            internal_pages = [];
            get pages() { return this.internal_pages; }
            set pages(values) { this.internal_pages = values; this.pagesChanged(); }
            internal_currentIndex = -1;
            get currentIndex() { return this.internal_currentIndex; }
            set currentIndex(value) { this.setCurrent(value); }
            get currentPage() { return this.internal_pages[this.internal_currentIndex]; }
            pagesChanged() {
                this.container.clearChildren();
                this.nav.clearChildren();
                if (this.internal_pages.length == 0)
                    return;
                let i = 0;
                for (const page of this.internal_pages) {
                    const index = i;
                    const pageContainer = this.buildPageContainer(++i, page);
                    this.container.appendChild(pageContainer);
                    const navButton = document.createElement("button");
                    navButton.title = index.toFixed(0);
                    navButton.onclick = () => this.goto(index);
                    this.nav.appendChild(navButton);
                }
                if (this.internal_pages.length <= 1) {
                    this.previousButton.style.visibility = "hidden";
                    this.nextButton.style.visibility = "hidden";
                    this.nav.style.visibility = "hidden";
                }
                else {
                    this.previousButton.style.visibility = "visible";
                    this.nextButton.style.visibility = "visible";
                    this.nav.style.visibility = "visible";
                }
                const firstPage = this.container.querySelectorAll(":scope > *")[0];
                firstPage.style.left = "0";
                this.setCurrent(0);
            }
            buildPageContainer(index, page) {
                const container = document.createElement("div");
                container.setAttribute("index", index.toFixed(0));
                container.style.left = "calc(100% + 1px)";
                const content = page.content;
                if (content instanceof Element)
                    container.appendChild(content);
                else if (typeof content === "function") {
                    container.setAttribute("lazy", "true");
                    container.loader = content;
                }
                else {
                    container.setAttribute("lazy", "true");
                    container.loader = () => {
                        const img = document.createElement("img");
                        img.src = content;
                        return img;
                    };
                }
                if (container.getAttribute("lazy") == "true") {
                    if (page.thumbnail) {
                        const thumbnail = page.thumbnail;
                        if (thumbnail instanceof Element)
                            container.appendChild(thumbnail);
                        else if (typeof thumbnail === "function") {
                            const result = thumbnail();
                            if ("then" in result)
                                result.then((element) => container.appendChild(element));
                            else
                                container.appendChild(result);
                        }
                        else {
                            const img = document.createElement("img");
                            img.src = thumbnail;
                            container.appendChild(img);
                        }
                    }
                    else {
                        const img = document.createElement("img");
                        img.src = "img/icons/spinner.svg";
                        container.appendChild(img);
                    }
                }
                return container;
            }
            setCurrent(newIndex) {
                const oldIndex = this.internal_currentIndex;
                const slideDirection = oldIndex <= newIndex ? "left" : "right";
                if (newIndex < 0)
                    newIndex = this.internal_pages.length - 1;
                if (newIndex >= this.internal_pages.length)
                    newIndex = 0;
                if (newIndex == oldIndex)
                    return;
                const newPage = this.pages[newIndex];
                const oldPage = this.pages[oldIndex];
                this.internal_currentIndex = newIndex;
                this.titleHeading.textContent = this.title = newPage.title ?? "";
                let i = 0;
                for (const navButton of this.nav.children)
                    navButton.classList.toggle("checked", i++ == newIndex);
                const pageContainers = this.container.querySelectorAll(":scope > *");
                const oldPageContainer = pageContainers[oldIndex];
                const newPageContainer = pageContainers[newIndex];
                if (newPageContainer.getAttribute("lazy") == "true" && newPageContainer.getAttribute("loaded") != "true") {
                    const result = newPageContainer.loader();
                    if (result instanceof Element) {
                        newPageContainer.clearChildren();
                        newPageContainer.appendChild(result);
                    }
                    else
                        result.then((r) => {
                            newPageContainer.clearChildren();
                            newPageContainer.appendChild(r);
                        });
                    newPageContainer.setAttribute("loaded", "true");
                }
                this.slidePageIn(newPageContainer, oldPageContainer, slideDirection);
                const pageChangedEvent = new CustomEvent(Elements.pageChangedEventName, { bubbles: false });
                pageChangedEvent.oldIndex = oldIndex;
                pageChangedEvent.oldPage = oldPage;
                pageChangedEvent.newIndex = newIndex;
                pageChangedEvent.newPage = newPage;
                this.dispatchEvent(pageChangedEvent);
            }
            slidePageIn(page, oldPage, direction) {
                //@ts-ignore
                if (!anime) { // not yet attached to DOM
                    if (oldPage)
                        oldPage.style.left = "calc(100% + 1px)";
                    if (page)
                        page.style.left = "0";
                    return;
                }
                //@ts-ignore
                anime({
                    targets: page,
                    left: [direction == "left" ? "100%" : "-100%", 0],
                    easing: "easeInOutQuad",
                    duration: 250,
                });
                //@ts-ignore
                anime({
                    targets: oldPage,
                    left: [0, direction == "left" ? "-100%" : "100%"],
                    easing: "easeInOutQuad",
                    duration: 250,
                });
            }
            previous() {
                this.currentIndex--;
            }
            next() {
                this.currentIndex++;
            }
            goto(index) {
                this.currentIndex = index;
            }
            keyDown(e) {
                if (e.repeat)
                    switch (e.code) {
                        case "ArrowLeft":
                            this.previous();
                            e.stopPropagation();
                            break;
                        case "ArrowRight":
                            this.next();
                            e.stopPropagation();
                            break;
                    }
            }
            keyUp(e) {
                if (!e.repeat)
                    switch (e.code) {
                        case "ArrowLeft":
                            this.previous();
                            e.stopPropagation();
                            break;
                        case "ArrowRight":
                            this.next();
                            e.stopPropagation();
                            break;
                    }
            }
            internal_onpagechanged;
            get onpagechanged() { return this.internal_onpagechanged; }
            set onpagechanged(value) {
                if (this.internal_onpagechanged)
                    this.removeEventListener(Elements.selectedTabChangedEventName, this.internal_onpagechanged);
                this.internal_onpagechanged = value;
                this.addEventListener(Elements.selectedTabChangedEventName, this.internal_onpagechanged);
            }
        }
        Elements.LightBox = LightBox;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("light-box", UI.Elements.LightBox);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        //TODO:
        class BreadcrumbNavigation extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("breadcrumb-navigation-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "breadcrumb-navigation-root" }));
            }
            static get observedAttributes() {
                return ["path"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "path":
                        try {
                            this.path = newValue.split(">").map(x => x.trim()).map(x => ({ title: x, value: x }));
                        }
                        catch (error) {
                            console.error("Error setting path!", error, this, newValue);
                        }
                        break;
                }
            }
            internal_path = [];
            get path() { return this.internal_path; }
            set path(values) { this.internal_path = values ?? []; this.refreshPath(); }
            refreshPath() {
                this.root.clearChildren();
                for (const pathSegment of this.internal_path)
                    this.root.appendChild(this.buildPathSegment(pathSegment));
            }
            buildPathSegment(pathSegment) {
                return (UI.Generator.Hyperscript("button", { onclick: () => { } }, pathSegment.title));
            }
        }
        Elements.BreadcrumbNavigation = BreadcrumbNavigation;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("breadcrumb-navigation", UI.Elements.BreadcrumbNavigation);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class NavBar extends Elements.CustomElement {
            constructor() {
                super();
                NavBar.initializeGlobal();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("nav-bar-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "nav-bar-root" },
                    UI.Generator.Hyperscript("button", { id: "nav-bar-expand", onclick: this.expandClick },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/menu.svg" })),
                    UI.Generator.Hyperscript("slot", { id: "nav-bar-left-slot", name: "left" }),
                    UI.Generator.Hyperscript("slot", { id: "nav-bar-fill-slot", name: "fill" }),
                    UI.Generator.Hyperscript("slot", { id: "nav-bar-right-slot", name: "right" })));
            }
            static get observedAttributes() {
                return ["expanded"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "expanded":
                        this.onExpandedChanged(oldValue, newValue);
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get expanded() { return UI.Helper.GetFlagAttribute(this, "expanded"); }
            set expanded(value) { UI.Helper.SetFlagAttribute(this, "expanded", value); }
            onExpandedChanged(oldValue, newValue) {
                const oldOpen = oldValue != null;
                const newOpen = newValue != null;
                if (oldOpen != newOpen) {
                    if (newOpen) {
                        this.root.popover = "manual";
                        this.root.togglePopover(true);
                    }
                    else {
                        this.root.togglePopover(false);
                        this.root.popover = null;
                    }
                }
            }
            expandClick = function (event) {
                this.expanded = !this.expanded;
            }.bind(this);
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this.currentButton || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
            static globalInitialized = false;
            static initializeGlobal() {
                if (!this.globalInitialized) {
                    this.globalInitialized = true;
                    UI.Router.routed.add(() => document.querySelector("nav-bar").expanded = false);
                    UI.Elements.ContainerDialog.opened.add(() => {
                        const navBar = document.querySelector("nav-bar");
                        if (navBar)
                            navBar.expanded = false;
                    });
                }
            }
        }
        Elements.NavBar = NavBar;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("nav-bar", UI.Elements.NavBar);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class PaginationNavigation extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("pagination-navigation-root");
                this.firstButton = this.shadowRoot.getElementById("pagination-navigation-first-button");
                this.prev2Button = this.shadowRoot.getElementById("pagination-navigation-prev2-button");
                this.prev1Button = this.shadowRoot.getElementById("pagination-navigation-prev1-button");
                this.currentButton = this.shadowRoot.getElementById("pagination-navigation-current-button");
                this.next1Button = this.shadowRoot.getElementById("pagination-navigation-next1-button");
                this.next2Button = this.shadowRoot.getElementById("pagination-navigation-next2-button");
                this.lastButton = this.shadowRoot.getElementById("pagination-navigation-last-button");
                this.dropDown = this.shadowRoot.getElementById("pagination-navigation-drop-down");
                this.dropDownList = this.shadowRoot.getElementById("pagination-navigation-drop-down-list");
            }
            root;
            firstButton;
            prev2Button;
            prev1Button;
            currentButton;
            next1Button;
            next2Button;
            lastButton;
            dropDown;
            dropDownList;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "pagination-navigation-root", onkeydown: (e) => this.onKeyDown(e) },
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-first-button", onclick: this.buttonClick, title: "first page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-prev2-button", onclick: this.buttonClick, title: "previous -2 page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-prev1-button", onclick: this.buttonClick, title: "previous page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-current-button", onclick: this.buttonClick, title: "current page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-next1-button", onclick: this.buttonClick, title: "next page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-next2-button", onclick: this.buttonClick, title: "next +2 page" }),
                    UI.Generator.Hyperscript("button", { id: "pagination-navigation-last-button", onclick: this.buttonClick, title: "last page" }),
                    UI.Generator.Hyperscript("drop-down", { id: "pagination-navigation-drop-down", placement: "above", onopen: (e) => this.refreshDropDownSelection() },
                        UI.Generator.Hyperscript("ul", { id: "pagination-navigation-drop-down-list" }))));
            }
            static get observedAttributes() {
                return ["pages", "page", "drop-down-placement"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "pages":
                        this.refreshPages();
                        break;
                    case "page":
                        this.refreshPages();
                        const event = new CustomEvent("change");
                        event.page = this.page;
                        this.dispatchEvent(event);
                        break;
                    case "drop-down-placement":
                        this.dropDown.placement = newValue;
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get pages() { return UI.Helper.GetIntAttribute(this, "pages", 7); }
            set pages(value) { UI.Helper.SetIntAttribute(this, "pages", value); }
            get page() { return UI.Helper.GetIntAttribute(this, "page", 0); }
            set page(value) { UI.Helper.SetIntAttribute(this, "page", value); }
            get dropdownPlacement() { return (this.getAttribute("drop-down-placement") ?? "above"); }
            set dropdownPlacement(value) { this.setAttribute("drop-down-placement", value); }
            refreshPages() {
                const pageCount = this.pages;
                let currentPage = this.page;
                if (currentPage < 0)
                    currentPage = 0;
                if (currentPage > this.pages - 1)
                    currentPage = this.pages - 1;
                this.firstButton.setAttribute("page", "0");
                this.prev2Button.setAttribute("page", (currentPage - 2).toFixed());
                this.prev1Button.setAttribute("page", (currentPage - 1).toFixed());
                this.currentButton.setAttribute("page", currentPage.toFixed());
                this.next1Button.setAttribute("page", (currentPage + 1).toFixed());
                this.next2Button.setAttribute("page", (currentPage + 2).toFixed());
                this.lastButton.setAttribute("page", (pageCount - 1).toFixed());
                for (const button of this.root.getElementsByTagName("button"))
                    button.textContent = (parseInt(button.getAttribute("page")) + 1).toFixed();
                this.firstButton.style.display = currentPage <= 0 ? "none" : "";
                this.prev2Button.style.display = currentPage <= 2 ? "none" : "";
                this.prev1Button.style.display = currentPage <= 1 ? "none" : "";
                this.next1Button.style.display = (pageCount - currentPage - 1) <= 1 ? "none" : "";
                this.next2Button.style.display = (pageCount - currentPage - 1) <= 2 ? "none" : "";
                this.lastButton.style.display = (pageCount - currentPage - 1) <= 0 ? "none" : "";
            }
            buttonClick = async function (e) {
                const button = e.currentTarget;
                const page = parseInt(button.getAttribute("page"));
                if (page != this.page)
                    this.page = page;
                else
                    this.toggleDropDown();
            }.bind(this);
            get open() { return this.dropDown.open; }
            set open(value) { this.toggleDropDown(value); }
            get detached() { return window.innerWidth < 600 || window.innerHeight < 600; }
            toggleDropDown(force) {
                const newOpen = force ?? !this.open;
                const event = new CustomEvent(newOpen ? "open" : "close", { cancelable: true });
                this.dispatchEvent(event);
                if (event.defaultPrevented)
                    return;
                if (newOpen == this.open)
                    return; // nothing changed
                this.refreshDropDownList();
                this.refreshDropDownSelection();
                this.dropDown.placement = "above"; // this.detached ? "outside" : "above";
                this.dropDown.open = newOpen;
                let scrollItem = this.dropDownList.children[this.selectedIndex];
                if (!scrollItem)
                    scrollItem = this.dropDownList.querySelector(".checked");
                scrollItem.scrollIntoView({ block: "center", behavior: "instant" });
            }
            refreshDropDownList() {
                const pageCount = this.pages;
                let currentPage = this.page;
                if (currentPage < 0)
                    currentPage = 0;
                if (currentPage > this.pages - 1)
                    currentPage = this.pages - 1;
                this.dropDownList.clearChildren();
                for (let page = 0; page < pageCount; ++page) {
                    const li = document.createElement("li");
                    li.classList.toggle("checked", page == currentPage);
                    li.setAttribute("page", page.toFixed());
                    li.textContent = (page + 1).toFixed();
                    li.addEventListener("click", (e) => {
                        this.dropDown.close();
                        this.page = parseInt(e.currentTarget.getAttribute("page"));
                    });
                    this.dropDownList.appendChild(li);
                }
            }
            onKeyDown(e) {
                if (e.key == "ArrowDown" && this.open) { // down
                    e.preventDefault();
                    ++this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if (e.key == "ArrowUp" && this.open) { // up
                    e.preventDefault();
                    --this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if (e.key == "ArrowLeft") {
                    if (this.page > 0)
                        --this.page;
                }
                else if (e.key == "ArrowRight") {
                    if (this.page < this.pages - 1)
                        ++this.page;
                }
                else if ((e.key == "Tab" || e.key == "Enter") && this.open) { // tab or enter on non empty list
                    e.preventDefault();
                    const selectedLi = this.dropDownList.children[this.selectedIndex];
                    selectedLi?.click();
                }
                else if (e.key == "Tab" && !this.open)
                    this.dropDown.toggle();
                else if (e.key == "Escape" && this.open)
                    this.dropDown.toggle(false);
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.dropDownList.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.dropDownList.children.length - 1;
                if (value > this.dropDownList.children.length - 1)
                    value = 0;
                this.internal_selectedIndex = value;
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == value);
            }
            refreshDropDownSelection() {
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == this.selectedIndex);
                const scrollItem = this.dropDownList.children[this.selectedIndex];
                scrollItem?.scrollIntoView({ block: "center", behavior: "instant" });
            }
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this.currentButton || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
        }
        Elements.PaginationNavigation = PaginationNavigation;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("pagination-navigation", UI.Elements.PaginationNavigation);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class SimplePaging extends UI.Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("simple-paging-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "simple-paging-root" }));
            }
            static get observedAttributes() { return ["current", "max"]; }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue == newValue)
                    return;
                switch (name) {
                    case "current":
                        this.createPageLinks();
                        break;
                    case "max":
                        this.createPageLinks();
                        break;
                }
            }
            get current() { return parseInt(this.getAttribute("current")); }
            set current(value) { this.setAttribute("current", value.toFixed()); }
            get max() { return parseInt(this.getAttribute("max")); }
            set max(value) { this.setAttribute("max", value.toFixed()); }
            createPageLinks() {
                this.root.clearChildren();
                if (this.max <= 1)
                    return;
                if (this.current < 1)
                    return;
                if (this.current > 1)
                    this.root.append(UI.Generator.Hyperscript("a", { class: "page", onclick: () => this.navigate(this.current - 1) }, "<"));
                if (this.current - 2 > 1)
                    this.root.append(UI.Generator.Hyperscript("a", { class: "page", onclick: () => this.navigate(1) }, "1"));
                for (let p = this.current - 2; p <= this.current + 2; ++p) {
                    const page = p;
                    if (page < 1)
                        continue;
                    if (page > this.max)
                        continue;
                    this.root.append(UI.Generator.Hyperscript("a", { class: ["page", page == this.current ? "selected" : null], onclick: () => this.navigate(page) }, page));
                }
                if (this.current + 2 < this.max)
                    this.root.append(UI.Generator.Hyperscript("a", { class: "page", onclick: () => this.navigate(this.max) }, this.max));
                if (this.current < this.max)
                    this.root.append(UI.Generator.Hyperscript("a", { class: "page", onclick: () => this.navigate(this.current + 1) }, ">"));
            }
            navigate(page) {
                if (page < 0)
                    page = 0;
                if (page > this.max)
                    page = this.max;
                if (page == this.current)
                    return;
                const event = new Event("pagingchanged", { bubbles: true });
                event.page = page;
                this.dispatchEvent(event);
            }
            navigatePrevious() {
                this.navigate(this.current - 1);
            }
            navigateNext() {
                this.navigate(this.current + 1);
            }
        }
        Elements.SimplePaging = SimplePaging;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("simple-paging", UI.Elements.SimplePaging);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class LazyPlaceholder extends HTMLElement {
            connectedCallback() {
                this.beginLoad().catch(error => this.showError(error));
            }
            async beginLoad() {
                let result = this.load?.();
                if (!result)
                    return;
                if ("then" in result)
                    result = await result;
                if (!result)
                    return;
                this.doLoad(result);
            }
            async doLoad(content) {
                if (Array.isArray(content)) {
                    this.replaceWith(...content);
                }
                else {
                    this.replaceWith(content);
                }
            }
            showError(error) {
                UI.Dialog.error(error);
            }
            load;
        }
        Elements.LazyPlaceholder = LazyPlaceholder;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("lazy-placeholder", UI.Elements.LazyPlaceholder);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class OverflowContainer extends Elements.CustomElement {
            constructor() {
                super();
                const rootStyle = document.createElement("style");
                rootStyle.textContent = ":host { height: 100%; width: 100%; }";
                this.shadowRoot.appendChild(rootStyle);
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("overflow-container-root");
                this.expandButton = this.shadowRoot.getElementById("overflow-container-expand-button");
                this.expandButton.onclick = () => this.expand(!this.isExpanded);
                this.childContainer = this.shadowRoot.getElementById("overflow-container-child-container");
                this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
            }
            resizeObserver;
            root;
            expandButton;
            childContainer;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "overflow-container-root" },
                    UI.Generator.Hyperscript("slot", { id: "overflow-container-child-container" }),
                    UI.Generator.Hyperscript("a", { id: "overflow-container-expand-button", style: "visibility: hidden;" }, "...")));
            }
            connectedCallback() {
                this.resizeObserver.observe(this);
                this.onResize(null, null);
            }
            disconnectedCallback() {
                this.resizeObserver.unobserve(this);
            }
            onResize(entries, observer) {
                this.refreshExpandButton();
            }
            get hasExpanded() { return this.classList.contains("expanded"); }
            set hasExpanded(value) { this.classList.toggle("expanded", value); }
            expandMe(state) {
                // default expand action
                this.hasExpanded = state;
                this.refreshExpandButton();
            }
            ;
            overflowPopupElement;
            async popupMe(state) {
                if (state)
                    this.overflowPopupElement = await UI.Dialog.show(overflowPopup, { allowClose: true }, this.firstElementChild.clone());
                else
                    UI.Dialog.close(this.overflowPopupElement);
            }
            expanding = this.expandMe;
            refreshExpandButton() {
                const hasOverflow = this.root?.isOverflown();
                this.expandButton.style.visibility = (hasOverflow || this.hasExpanded) ? "visible" : "hidden";
            }
            meIsExpanded = false;
            get isExpanded() { return this.meIsExpanded; }
            set isExpanded(value) { this.meIsExpanded = value; this.expanding(value); }
            expand(force) {
                if (force == null)
                    this.isExpanded = !this.isExpanded;
                else
                    this.isExpanded = !!force;
            }
            get expandAction() {
                if (this.expand == this.expandMe)
                    return "expand";
                if (this.expand == this.popupMe)
                    return "popup";
                return null;
            }
            set expandAction(value) {
                switch (value) {
                    case "expand":
                        this.expand = this.expandMe;
                        break;
                    case "popup":
                        this.expand = this.popupMe;
                        break;
                    default:
                        this.expand = value;
                        break;
                }
            }
        }
        Elements.OverflowContainer = OverflowContainer;
        function overflowPopup(element) {
            return (UI.Generator.Hyperscript("div", { id: "overflow-popup" }, element));
        }
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("overflow-container", UI.Elements.OverflowContainer);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.textSubmitEventName = "textsubmit";
        class QueryBox extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("query-box-root");
                this.input = this.shadowRoot.getElementById("query-box-input-input");
                this.dropDownButton = this.shadowRoot.getElementById("query-box-drop-down-button");
                this.dropDown = this.shadowRoot.getElementById("query-box-select-drop-down");
                this.dropDownContent = this.shadowRoot.getElementById("query-box-select-drop-down-content");
                this.dropDownList = this.shadowRoot.getElementById("query-box-select-drop-down-list");
                this.dropDown.addEventListener("toggle", (e) => {
                    this.dropDownButton.firstChild.src = this.open ? "img/icons/chevron-up.svg" : "img/icons/chevron-down.svg";
                });
            }
            root;
            input;
            dropDownButton;
            dropDown;
            dropDownContent;
            dropDownList;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "query-box-root", onkeydown: (e) => this.onKeyDown(e) },
                    UI.Generator.Hyperscript("div", { id: "query-box-input" },
                        UI.Generator.Hyperscript("input", { id: "query-box-input-input", type: "text", spellcheck: false, placeholder: "...", oninput: (e) => this.onInput(e) }),
                        UI.Generator.Hyperscript("button", { id: "query-box-drop-down-button", onclick: () => this.toggleDropDown() },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-down.svg" })),
                        UI.Generator.Hyperscript("button", { id: "query-box-submit-button", onclick: () => this.submit() },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/search.svg" }))),
                    UI.Generator.Hyperscript("drop-down", { id: "query-box-select-drop-down" },
                        UI.Generator.Hyperscript("div", { id: "query-box-select-drop-down-content" },
                            UI.Generator.Hyperscript("ul", { id: "query-box-select-drop-down-list" })))));
            }
            static get observedAttributes() {
                return ["words"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "options":
                        try {
                            this.words = JSON.parse(newValue);
                        }
                        catch (error) {
                            console.error("Error setting words!", error, this, newValue);
                        }
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get placeholder() { return this.input.placeholder; }
            set placeholder(value) { this.input.placeholder = value; }
            internal_words = [];
            get words() { return this.internal_words; }
            set words(values) { this.internal_words = values ?? []; this.refreshDropDownList(); }
            get value() { return this.input.value; }
            set value(value) { this.input.value = value; }
            onInput(e) {
                this.toggleDropDown(false);
                if (this.words.length == 0)
                    return;
                const lastWord = this.getLastWord();
                const search = lastWord.word.toLowerCase();
                this.refreshDropDownList(search, lastWord.index, lastWord.length);
                //if (!this.detached)
                this.toggleDropDown(this.dropDownList.children.length > 0);
            }
            get open() { return this.dropDown.open; }
            set open(value) { this.toggleDropDown(value); }
            get detached() { return window.innerWidth < 600 || window.innerHeight < 600; }
            toggleDropDown(force) {
                const newOpen = force ?? !this.open;
                if (newOpen == this.open)
                    return; // nothing changed
                this.refreshDropDownList();
                this.dropDown.placement = "below"; // this.detached ? "outside" : "below";
                this.dropDown.open = newOpen;
            }
            refreshDropDownList(search, index, length) {
                if (index == null || length == null) {
                    index = this.input.value.length;
                    length = 0;
                }
                const words = search ? this.words.filter(w => w.toLowerCase().contains(search)) : this.words;
                this.dropDownList.clearChildren();
                for (const word of words) {
                    const replacement = word.contains(" ") ? '"' + word + '"' : word;
                    const li = document.createElement("li");
                    li.innerText = word;
                    li.title = word;
                    li.onclick = () => {
                        let value = this.input.value.substring(0, index) +
                            replacement +
                            this.input.value.substring(index + length);
                        this.input.value = value;
                        this.input.selectionStart = this.input.selectionEnd = this.input.selectionStart = index + replacement.length + 1;
                        if (this.input.selectionEnd == this.input.value.length) {
                            this.input.value += " ";
                            this.input.selectionStart = this.input.selectionEnd += 1;
                        }
                        this.toggleDropDown(false);
                    };
                    this.dropDownList.append(li);
                }
            }
            getLastWord() {
                const caret = this.input.selectionStart;
                const isEscaped = (this.input.value.substring(0, caret).count('"') % 2) == 1;
                let index;
                let word = "";
                const breaker = isEscaped ? /"/ : /\s/;
                for (index = caret; index >= 1; --index) {
                    const char = this.input.value[index - 1];
                    if (!char)
                        continue;
                    if (breaker.test(char))
                        break;
                    word = char + word;
                }
                if (isEscaped)
                    return { word, index: index - 1, length: (caret - index) + 1, isEscaped };
                else
                    return { word, index, length: caret - index, isEscaped };
            }
            onKeyDown(e) {
                if (e.key == "ArrowDown" && this.open) { // down
                    e.preventDefault();
                    ++this.selectedIndex;
                    this.select();
                }
                else if (e.key == "ArrowUp" && this.open) { // up
                    e.preventDefault();
                    --this.selectedIndex;
                    this.select();
                }
                else if ((e.key == "Tab" || e.key == "Enter") && this.open) { // tab or enter on non empty list
                    e.preventDefault();
                    const selectedLi = this.dropDownList.children[this.selectedIndex];
                    selectedLi?.click();
                }
                else if (e.key == "Tab" && !this.open)
                    this.toggleDropDown();
                else if (e.key == "Enter" && (!this.open || this.selectedIndex == -1))
                    this.submit();
                else if (e.key == "Escape") {
                    if (this.open)
                        this.toggleDropDown(false);
                    else
                        this.input.value = "";
                }
            }
            submit() {
                this.dropDown.close();
                const autoCompleteSubmit = new CustomEvent(Elements.textSubmitEventName, { bubbles: false });
                autoCompleteSubmit.text = this.value;
                this.dispatchEvent(autoCompleteSubmit);
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.dropDownList.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.dropDownList.children.length - 1;
                if (value > this.dropDownList.children.length - 1)
                    value = 0;
                this.internal_selectedIndex = value;
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == value);
            }
            select() {
                const selectedLi = this.dropDownList.children[this.selectedIndex];
                selectedLi?.scrollIntoView({ block: "center", behavior: "instant" });
            }
            internal_ontextsubmit;
            get ontextsubmit() { return this.internal_ontextsubmit; }
            set ontextsubmit(value) {
                if (this.internal_ontextsubmit)
                    this.removeEventListener(Elements.textSubmitEventName, this.internal_ontextsubmit);
                this.internal_ontextsubmit = value;
                this.addEventListener(Elements.textSubmitEventName, this.internal_ontextsubmit);
            }
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
        }
        Elements.QueryBox = QueryBox;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("query-box", UI.Elements.QueryBox);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ComboSelect extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("combo-select-root");
                this.inputContainer = this.shadowRoot.getElementById("combo-select-input-container");
                this.inputPlaceholderSpan = this.shadowRoot.getElementById("combo-select-input-placeholder");
                this.inputClearButton = this.shadowRoot.getElementById("combo-select-input-clear-button");
                this.dropDownButton = this.shadowRoot.getElementById("combo-select-drop-down-button");
                this.dropDown = this.shadowRoot.getElementById("combo-select-drop-down");
                this.dropDownContent = this.shadowRoot.getElementById("combo-select-drop-down");
                this.dropDownSearch = this.shadowRoot.getElementById("combo-select-drop-down-search");
                this.dropDownSearchInput = this.shadowRoot.getElementById("combo-select-drop-down-search-input");
                this.dropDownList = this.shadowRoot.getElementById("combo-select-drop-down-list");
                this.dropDown.addEventListener("toggle", (e) => {
                    this.dropDownButton.firstChild.src = this.open ? "img/icons/chevron-up.svg" : "img/icons/chevron-down.svg";
                });
            }
            root;
            inputContainer;
            inputPlaceholderSpan;
            inputClearButton;
            dropDownButton;
            dropDown;
            dropDownContent;
            dropDownSearch;
            dropDownSearchInput;
            dropDownList;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "combo-select-root", onkeydown: (e) => this.onKeyDown(e) },
                    UI.Generator.Hyperscript("div", { id: "combo-select-input" },
                        UI.Generator.Hyperscript("input", { id: "combo-select-input-container", onchange: (e) => this.inputContainerTextChanged(e), oninput: (e) => this.inputContainerInput(e) }),
                        UI.Generator.Hyperscript("span", { id: "combo-select-input-placeholder" }, "..."),
                        UI.Generator.Hyperscript("button", { id: "combo-select-input-clear-button", onclick: (e) => this.value = null },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })),
                        UI.Generator.Hyperscript("button", { id: "combo-select-drop-down-button", onclick: () => this.toggleDropDown() },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-down.svg" }))),
                    UI.Generator.Hyperscript("drop-down", { id: "combo-select-drop-down" },
                        UI.Generator.Hyperscript("div", { id: "combo-select-drop-down-content" },
                            UI.Generator.Hyperscript("div", { id: "combo-select-drop-down-search" },
                                UI.Generator.Hyperscript("img", { src: "img/icons/chevron-right.svg" }),
                                UI.Generator.Hyperscript("input", { id: "combo-select-drop-down-search-input", type: "text", placeholder: "...", oninput: () => this.refreshDropDownOptions(), spellcheck: false })),
                            UI.Generator.Hyperscript("ul", { id: "combo-select-drop-down-list" })))));
            }
            static get observedAttributes() {
                return ["options"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "options":
                        try {
                            this.options = JSON.parse(newValue).map(x => typeof (x) == "string" ? { title: x, value: x } : x);
                        }
                        catch (error) {
                            console.error("Error setting options!", error, this, newValue);
                        }
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get placeholder() { return this.inputPlaceholderSpan.textContent; }
            set placeholder(value) { this.inputPlaceholderSpan.textContent = value; }
            get allowSearch() { return this.dropDownSearch.style.display != "none"; }
            set allowSearch(value) { this.dropDownSearch.style.display = value ? "" : "none"; }
            internal_options = [];
            get options() { return this.internal_options; }
            set options(values) { this.internal_options = values ?? []; this.refreshDropDownOptions(); }
            get value() {
                return this.inputContainer.value;
            }
            set value(value) {
                this.inputContainer.value = value;
                this.inputContainerTextChanged(null);
            }
            inputContainerTextChanged(e) {
                this.refreshDropDownOptions();
                this.refreshDropDownSelection();
                this.refreshPlaceholder();
                this.dispatchEvent(new Event("change"));
            }
            inputContainerInput(e) {
                this.refreshPlaceholder();
            }
            get open() { return this.dropDown.open; }
            set open(value) { this.toggleDropDown(value); }
            get detached() { return window.innerWidth < 600 || window.innerHeight < 600; }
            toggleDropDown(force) {
                const newOpen = force ?? !this.open;
                if (newOpen == this.open)
                    return; // nothing changed
                this.refreshDropDownOptions();
                this.refreshDropDownSelection();
                this.dropDown.placement = "below"; // this.detached ? "outside" : "below";
                this.dropDown.open = newOpen;
            }
            refreshDropDownOptions() {
                this.dropDownList.clearChildren();
                const filter = this.dropDownSearchInput.value?.toLowerCase();
                for (const option of this.options)
                    if (!filter || option.title.toLowerCase().includes(filter)) {
                        const index = this.options.indexOf(option);
                        const li = this.buildOption(option, index);
                        this.dropDownList.appendChild(li);
                    }
                this.refreshDropDownChecked();
            }
            buildOption(option, index) {
                return (UI.Generator.Hyperscript("li", { "index-attribute": index, title: option.title, onclick: (e) => {
                        const li = e.currentTarget;
                        if (li.classList.toggle("checked")) {
                            this.value = option.value;
                            this.toggleDropDown(false);
                        }
                        else
                            this.value = null;
                    } }, option.title));
            }
            refreshDropDownChecked() {
                for (const li of this.dropDownList.children.cast()) {
                    const index = parseInt(li.getAttribute("index"));
                    const option = this.options[index];
                    li.classList.toggle("checked", this.value == option?.value);
                }
            }
            refreshPlaceholder() {
                this.inputPlaceholderSpan.style.visibility = this.value ? "hidden" : "visible";
            }
            onKeyDown(e) {
                if (e.key == "ArrowDown" && this.open) { // down
                    e.preventDefault();
                    ++this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if (e.key == "ArrowUp" && this.open) { // up
                    e.preventDefault();
                    --this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if ((e.key == "Tab" || e.key == "Enter") && this.open) { // tab or enter on non empty list
                    e.preventDefault();
                    const selectedLi = this.dropDownList.children[this.selectedIndex];
                    selectedLi?.click();
                }
                else if (e.key == "Tab" && !this.open)
                    this.toggleDropDown();
                else if (e.key == "Escape") {
                    if (this.open)
                        this.toggleDropDown(false);
                }
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.dropDownList.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.dropDownList.children.length - 1;
                if (value > this.dropDownList.children.length - 1)
                    value = 0;
                this.internal_selectedIndex = value;
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == value);
            }
            refreshDropDownSelection() {
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == this.selectedIndex);
                const selectedLi = this.dropDownList.children[this.selectedIndex];
                selectedLi?.scrollIntoView({ block: "center", behavior: "instant" });
            }
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
        }
        Elements.ComboSelect = ComboSelect;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("combo-select", UI.Elements.ComboSelect);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class MultiSelect extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("multi-select-root");
                this.inputContainer = this.shadowRoot.getElementById("multi-select-input-container");
                this.inputPlaceholderSpan = this.shadowRoot.getElementById("multi-select-input-placeholder");
                this.dropDownButton = this.shadowRoot.getElementById("multi-select-drop-down-button");
                this.dropDown = this.shadowRoot.getElementById("multi-select-drop-down");
                this.dropDownContent = this.shadowRoot.getElementById("multi-select-drop-down-content");
                this.dropDownSearch = this.shadowRoot.getElementById("multi-select-drop-down-search");
                this.dropDownSearchInput = this.shadowRoot.getElementById("multi-select-drop-down-search-input");
                this.dropDownList = this.shadowRoot.getElementById("multi-select-drop-down-list");
                this.dropDown.addEventListener("toggle", (e) => {
                    this.dropDownButton.firstChild.src = this.open ? "img/icons/chevron-up.svg" : "img/icons/chevron-down.svg";
                });
            }
            root;
            inputContainer;
            inputPlaceholderSpan;
            dropDownButton;
            dropDown;
            dropDownContent;
            dropDownSearch;
            dropDownSearchInput;
            dropDownList;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "multi-select-root", onkeydown: (e) => this.onKeyDown(e) },
                    UI.Generator.Hyperscript("div", { id: "multi-select-input" },
                        UI.Generator.Hyperscript("ul", { id: "multi-select-input-container", onclick: (e) => this.inputContainerClick(e) }),
                        UI.Generator.Hyperscript("span", { id: "multi-select-input-placeholder" }, "..."),
                        UI.Generator.Hyperscript("button", { id: "multi-select-input-clear-button", onclick: (e) => this.values = null },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })),
                        UI.Generator.Hyperscript("button", { id: "multi-select-drop-down-button", onclick: () => this.toggleDropDown() },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-down.svg" }))),
                    UI.Generator.Hyperscript("drop-down", { id: "multi-select-drop-down" },
                        UI.Generator.Hyperscript("div", { id: "multi-select-drop-down-content" },
                            UI.Generator.Hyperscript("div", { id: "multi-select-drop-down-search" },
                                UI.Generator.Hyperscript("img", { src: "img/icons/chevron-right.svg" }),
                                UI.Generator.Hyperscript("input", { id: "multi-select-drop-down-search-input", type: "text", placeholder: "...", oninput: () => this.refreshDropDownOptions(), spellcheck: false })),
                            UI.Generator.Hyperscript("ul", { id: "multi-select-drop-down-list" })))));
            }
            static get observedAttributes() {
                return ["options"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "options":
                        try {
                            this.options = JSON.parse(newValue).map(x => typeof (x) == "string" ? { title: x, value: x } : x);
                        }
                        catch (error) {
                            console.error("Error setting options!", error, this, newValue);
                        }
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get placeholder() { return this.inputPlaceholderSpan.textContent; }
            set placeholder(value) { this.inputPlaceholderSpan.textContent = value; }
            get allowSearch() { return this.dropDownSearch.style.display != "none"; }
            set allowSearch(value) { this.dropDownSearch.style.display = value ? "" : "none"; }
            internal_options = [];
            get options() { return this.internal_options; }
            set options(values) { this.internal_options = values ?? []; this.refreshDropDownOptions(); }
            internal_checkedIndexes = [];
            get checkedIndexes() { return this.internal_checkedIndexes; }
            set checkedIndexes(values) {
                values ??= [];
                if (this.internal_checkedIndexes != values) {
                    this.internal_checkedIndexes = values;
                    this.refreshDropDownOptions();
                    this.refreshDropDownSelection();
                    this.refreshInputContainer();
                    this.dispatchEvent(new Event("change"));
                }
            }
            get checkedOptions() { return this.internal_checkedIndexes.map(x => this.options[x]); }
            set checkedOptions(options) { this.checkedIndexes = (options ?? []).map(x => this.options.indexOf(x)); }
            get values() { return this.checkedOptions.map(x => x?.value); }
            set values(values) { this.checkedIndexes = values?.map(value => this.options.findIndex(x => x.value == value)); }
            inputContainerClick(e) {
                if (e.currentTarget == e.target) // only direct click
                    this.toggleDropDown();
            }
            get open() { return this.dropDown.open; }
            set open(value) { this.toggleDropDown(value); }
            get detached() { return window.innerWidth < 600 || window.innerHeight < 600; }
            toggleDropDown(force) {
                const newOpen = force ?? !this.open;
                if (newOpen == this.open)
                    return; // nothing changed
                this.refreshDropDownOptions();
                this.refreshDropDownSelection();
                this.dropDown.placement = "below"; // this.detached ? "outside" : "below";
                this.dropDown.open = newOpen;
            }
            refreshDropDownOptions() {
                this.dropDownList.clearChildren();
                const filter = this.dropDownSearchInput.value?.toLowerCase();
                for (const option of this.options)
                    if (!filter || option.title.toLowerCase().includes(filter)) {
                        const index = this.options.indexOf(option);
                        const li = this.buildOption(option, index);
                        this.dropDownList.appendChild(li);
                    }
                this.refreshDropDownChecked();
            }
            buildOption(option, index) {
                return (UI.Generator.Hyperscript("li", { "index-attribute": index, title: option.title, onclick: (e) => {
                        const li = e.currentTarget;
                        if (li.classList.toggle("checked"))
                            this.checkedOptions = [...this.checkedOptions, option];
                        else
                            this.checkedOptions = this.checkedOptions.filter(x => x.value != option.value);
                    } }, option.title));
            }
            refreshDropDownChecked() {
                for (const li of this.dropDownList.children.cast()) {
                    const index = parseInt(li.getAttribute("index"));
                    li.classList.toggle("checked", this.checkedIndexes.includes(index));
                }
            }
            refreshInputContainer() {
                this.inputContainer.clearChildren();
                for (const index of this.checkedIndexes) {
                    const option = this.options[index];
                    const selectedOptionElement = this.buildCheckedOptionElement(option, index);
                    this.inputContainer.appendChild(selectedOptionElement);
                }
                this.inputPlaceholderSpan.style.visibility = this.inputContainer.firstChild ? "hidden" : "visible";
            }
            buildCheckedOptionElement(option, index) {
                return (UI.Generator.Hyperscript("li", { "index-attribute": index, onclick: (e) => {
                        this.checkedIndexes = this.checkedIndexes.filter(x => x == index);
                    }, title: option.title },
                    UI.Generator.Hyperscript("span", null, option.title),
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })));
            }
            onKeyDown(e) {
                if (e.key == "ArrowDown" && this.open) { // down
                    e.preventDefault();
                    ++this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if (e.key == "ArrowUp" && this.open) { // up
                    e.preventDefault();
                    --this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if ((e.key == "Tab" || e.key == "Enter") && this.open) { // tab or enter on non empty list
                    e.preventDefault();
                    const selectedLi = this.dropDownList.children[this.selectedIndex];
                    selectedLi?.click();
                }
                else if (e.key == "Tab" && !this.open)
                    this.toggleDropDown();
                else if (e.key == "Escape") {
                    if (this.open)
                        this.toggleDropDown(false);
                }
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.dropDownList.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.dropDownList.children.length - 1;
                if (value > this.dropDownList.children.length - 1)
                    value = 0;
                this.internal_selectedIndex = value;
            }
            refreshDropDownSelection() {
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == this.selectedIndex);
                const selectedLi = this.dropDownList.children[this.selectedIndex];
                selectedLi?.scrollIntoView({ block: "center", behavior: "instant" });
            }
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
        }
        Elements.MultiSelect = MultiSelect;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("multi-select", UI.Elements.MultiSelect);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class SingleSelect extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("single-select-root");
                this.inputContainer = this.shadowRoot.getElementById("single-select-input-container");
                this.inputPlaceholderSpan = this.shadowRoot.getElementById("single-select-input-placeholder");
                this.inputClearButton = this.shadowRoot.getElementById("single-select-input-clear-button");
                this.dropDownButton = this.shadowRoot.getElementById("single-select-drop-down-button");
                this.dropDown = this.shadowRoot.getElementById("single-select-drop-down");
                this.dropDownContent = this.shadowRoot.getElementById("single-select-drop-down-content");
                this.dropDownSearch = this.shadowRoot.getElementById("single-select-drop-down-search");
                this.dropDownSearchInput = this.shadowRoot.getElementById("single-select-drop-down-search-input");
                this.dropDownList = this.shadowRoot.getElementById("single-select-drop-down-list");
                this.dropDown.addEventListener("toggle", (e) => {
                    this.dropDownButton.firstChild.src = this.open ? "img/icons/chevron-up.svg" : "img/icons/chevron-down.svg";
                });
            }
            root;
            inputContainer;
            inputPlaceholderSpan;
            inputClearButton;
            dropDownButton;
            dropDown;
            dropDownContent;
            dropDownSearch;
            dropDownSearchInput;
            dropDownList;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "single-select-root", onkeydown: (e) => this.onKeyDown(e) },
                    UI.Generator.Hyperscript("div", { id: "single-select-input" },
                        UI.Generator.Hyperscript("ul", { id: "single-select-input-container", onclick: (e) => this.inputContainerClick(e) }),
                        UI.Generator.Hyperscript("span", { id: "single-select-input-placeholder" }, "..."),
                        UI.Generator.Hyperscript("button", { id: "single-select-input-clear-button", onclick: (e) => this.checkedIndex = -1 },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })),
                        UI.Generator.Hyperscript("button", { id: "single-select-drop-down-button", onclick: () => this.toggleDropDown() },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-down.svg" }))),
                    UI.Generator.Hyperscript("drop-down", { id: "single-select-drop-down" },
                        UI.Generator.Hyperscript("div", { id: "single-select-drop-down-content" },
                            UI.Generator.Hyperscript("div", { id: "single-select-drop-down-search" },
                                UI.Generator.Hyperscript("img", { src: "img/icons/chevron-right.svg" }),
                                UI.Generator.Hyperscript("input", { id: "single-select-drop-down-search-input", type: "text", placeholder: "...", oninput: () => this.refreshDropDownOptions(), spellcheck: false })),
                            UI.Generator.Hyperscript("ul", { id: "single-select-drop-down-list" })))));
            }
            static get observedAttributes() {
                return ["options", "checked-index"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "options":
                        try {
                            this.options = JSON.parse(newValue).map(x => typeof (x) == "string" ? { title: x, value: x } : x);
                        }
                        catch (error) {
                            console.error("Error setting options!", error, this, newValue);
                        }
                        break;
                    case "checked-index":
                        if (oldValue != newValue) {
                            this.refreshDropDownOptions();
                            this.refreshDropDownSelection();
                            this.refreshInputContainer();
                            this.dispatchEvent(new Event("change"));
                        }
                        break;
                }
            }
            connectedCallback() {
                document.addEventListener("click", this.clickedOutside);
            }
            disconnectedCallback() {
                document.removeEventListener("click", this.clickedOutside);
            }
            get placeholder() { return this.inputPlaceholderSpan.textContent; }
            set placeholder(value) { this.inputPlaceholderSpan.textContent = value; }
            get allowSearch() { return this.dropDownSearch.style.display != "none"; }
            set allowSearch(value) { this.dropDownSearch.style.display = value ? "" : "none"; }
            internal_allowEmpty = true;
            get allowEmpty() { return this.internal_allowEmpty; }
            set allowEmpty(value) {
                this.internal_allowEmpty = value;
                this.refreshInputContainer();
            }
            internal_options = [];
            get options() { return this.internal_options; }
            set options(values) { this.internal_options = values ?? []; this.refreshDropDownOptions(); }
            get checkedIndex() { return this.hasAttribute("checked-index") ? parseInt(this.getAttribute("checked-index")) : 0; }
            set checkedIndex(value) { if (this.checkedIndex != value)
                this.setAttribute("checked-index", value.toString()); }
            get checkedOption() { return this.internal_options[this.checkedIndex]; }
            set checkedOption(value) { this.checkedIndex = this.internal_options.indexOf(value); }
            get value() { return this.checkedOption?.value; }
            set value(value) { this.checkedIndex = this.options.findIndex(x => x.value == value); }
            inputContainerClick(e) {
                if (e.currentTarget == e.target) // only direct click
                    this.toggleDropDown();
            }
            get open() { return this.dropDown.open; }
            set open(value) { this.toggleDropDown(value); }
            get detached() { return window.innerWidth < 600 || window.innerHeight < 600; }
            toggleDropDown(force) {
                const newOpen = force ?? !this.open;
                if (newOpen == this.open)
                    return; // nothing changed
                this.refreshDropDownOptions();
                this.refreshDropDownSelection();
                this.dropDown.placement = "below"; // this.detached ? "outside" : "below";
                this.dropDown.open = newOpen;
            }
            refreshDropDownOptions() {
                this.dropDownList.clearChildren();
                const filter = this.dropDownSearchInput.value?.toLowerCase();
                for (const option of this.options)
                    if (!filter || option.title.toLowerCase().includes(filter)) {
                        const index = this.options.indexOf(option);
                        const li = this.buildOption(option, index);
                        this.dropDownList.appendChild(li);
                    }
                this.refreshDropDownChecked();
            }
            buildOption(option, index) {
                return (UI.Generator.Hyperscript("li", { "index-attribute": index, title: option.title, onclick: (e) => {
                        const li = e.currentTarget;
                        if (!this.internal_allowEmpty && li.classList.contains("checked"))
                            return;
                        if (li.classList.toggle("checked")) {
                            this.checkedIndex = index;
                            this.toggleDropDown(false);
                        }
                        else
                            this.checkedIndex = -1;
                    } }, option.title));
            }
            refreshDropDownChecked() {
                for (const li of this.dropDownList.children.cast()) {
                    const index = parseInt(li.getAttribute("index"));
                    li.classList.toggle("checked", this.checkedIndex == index);
                }
            }
            refreshInputContainer() {
                this.inputPlaceholderSpan.style.visibility = this.checkedOption ? "hidden" : "visible";
                this.inputClearButton.style.display = this.internal_allowEmpty ? "" : "none";
                this.inputContainer.clearChildren();
                if (this.checkedOption) {
                    const selectedOptionElement = this.buildCheckedOption(this.checkedOption, this.checkedIndex);
                    this.inputContainer.appendChild(selectedOptionElement);
                }
            }
            buildCheckedOption(option, index) {
                return (UI.Generator.Hyperscript("li", { "index-attribute": index, onclick: (e) => {
                        if (this.internal_allowEmpty)
                            this.checkedIndex = -1;
                    }, title: option.title },
                    UI.Generator.Hyperscript("span", null, option.title),
                    this.internal_allowEmpty ? UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" }) : null));
            }
            onKeyDown(e) {
                if (e.key == "ArrowDown" && this.open) { // down
                    e.preventDefault();
                    ++this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if (e.key == "ArrowUp" && this.open) { // up
                    e.preventDefault();
                    --this.selectedIndex;
                    this.refreshDropDownSelection();
                }
                else if ((e.key == "Tab" || e.key == "Enter") && this.open) { // tab or enter on non empty list
                    e.preventDefault();
                    const selectedLi = this.dropDownList.children[this.selectedIndex];
                    selectedLi?.click();
                }
                else if (e.key == "Tab" && !this.open)
                    this.toggleDropDown();
                else if (e.key == "Escape") {
                    if (this.open)
                        this.toggleDropDown(false);
                }
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.dropDownList.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.dropDownList.children.length - 1;
                if (value > this.dropDownList.children.length - 1)
                    value = 0;
                this.internal_selectedIndex = value;
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == value);
            }
            refreshDropDownSelection() {
                let i = 0;
                for (const li of this.dropDownList.querySelectorAll(":scope > li"))
                    li.classList.toggle("selected", (i++) == this.selectedIndex);
                const selectedLi = this.dropDownList.children[this.selectedIndex];
                selectedLi?.scrollIntoView({ block: "center", behavior: "instant" });
            }
            clickedOutside = function (event) {
                if (this.open) {
                    const inside = event.composedPath().some(x => x == this || x == this.dropDown);
                    if (!inside)
                        this.dropDown.close();
                }
            }.bind(this);
        }
        Elements.SingleSelect = SingleSelect;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("single-select", UI.Elements.SingleSelect);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.selectedTabItemChangedEventName = "selectedtabitemchanged";
        class LazyTabControl extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tab-control-root");
                this.tabs = this.shadowRoot.getElementById("tab-control-tabs");
                this.content = this.shadowRoot.getElementById("tab-control-content");
            }
            root;
            tabs;
            content;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tab-control-root" },
                    UI.Generator.Hyperscript("ul", { id: "tab-control-tabs" }),
                    UI.Generator.Hyperscript("div", { id: "tab-control-content" },
                        UI.Generator.Hyperscript("slot", null))));
            }
            internal_tabItems = [];
            get tabItems() { return this.internal_tabItems; }
            set tabItems(values) { this.internal_tabItems = values; this.refreshTabs(); }
            get storeContent() { return UI.Helper.GetFlagAttribute(this, "store-content"); }
            set storeContent(value) { UI.Helper.SetFlagAttribute(this, "store-content", value); }
            refreshTabs() {
                this.tabs.clearChildren();
                let i = 0;
                for (const tabItem of this.internal_tabItems) {
                    const index = i++;
                    const tab = document.createElement("li");
                    if (tabItem.icon)
                        tab.appendChild(UI.Generator.Hyperscript("img", { src: tabItem.icon }));
                    if (tabItem.title)
                        tab.appendChild(UI.Generator.Hyperscript("span", null, tabItem.title));
                    tab.addEventListener("click", () => this.selectedIndex = index);
                    this.tabs.appendChild(tab);
                }
                if (this.tabs.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (this.internal_selectedIndex < 0)
                    this.internal_selectedIndex = 0;
                if (this.internal_selectedIndex > this.tabs.children.length - 1)
                    this.internal_selectedIndex = this.tabs.children.length - 1;
                this.refreshSelectedTab();
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.tabs.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.tabs.children.length - 1;
                if (value > this.tabs.children.length - 1)
                    value = 0;
                if (this.internal_selectedIndex != value) {
                    this.internal_selectedIndex = value;
                    this.refreshSelectedTab();
                }
            }
            get selectedTabItem() { return this.internal_tabItems[this.internal_selectedIndex]; }
            async refreshSelectedTab() {
                let i = 0;
                for (const tab of this.tabs.children)
                    tab.classList.toggle("selected", i++ == this.internal_selectedIndex);
                const currentSelectedIndex = this.internal_selectedIndex;
                const tabItem = this.internal_tabItems[this.internal_selectedIndex];
                const contentNode = tabItem.content instanceof Node ? tabItem.content : await Promise.resolve(tabItem.content());
                if (this.storeContent)
                    tabItem.content = contentNode;
                if (currentSelectedIndex == this.internal_selectedIndex) { // index did not change while promise got resolved
                    this.clearChildren();
                    this.appendChild(contentNode);
                }
                const selectedTabItemChanged = new Event(Elements.selectedTabItemChangedEventName);
                selectedTabItemChanged.selectedTabItem = this.selectedTabItem;
                this.dispatchEvent(selectedTabItemChanged);
            }
            internal_onselectedtabitemchanged;
            get onselectedtabchanged() { return this.internal_onselectedtabitemchanged; }
            set onselectedtabchanged(value) {
                if (this.internal_onselectedtabitemchanged)
                    this.removeEventListener(Elements.selectedTabChangedEventName, this.internal_onselectedtabitemchanged);
                this.internal_onselectedtabitemchanged = value;
                if (this.internal_onselectedtabitemchanged)
                    this.addEventListener(Elements.selectedTabChangedEventName, this.internal_onselectedtabitemchanged);
            }
        }
        Elements.LazyTabControl = LazyTabControl;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("lazy-tab-control", UI.Elements.LazyTabControl);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.selectedTabChangedEventName = "selectedtabchanged";
        class TabControl extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tab-control-root");
                this.tabs = this.shadowRoot.getElementById("tab-control-tabs");
            }
            root;
            tabs;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tab-control-root" },
                    UI.Generator.Hyperscript("ul", { id: "tab-control-tabs" }),
                    UI.Generator.Hyperscript("div", { id: "tab-control-content" },
                        UI.Generator.Hyperscript("slot", null))));
            }
            childrenObserver = new MutationObserver(this.childrenChanged);
            connectedCallback() {
                // Watch the Light DOM for child node changes
                this.childrenObserver.observe(this, {
                    childList: true
                });
                this.childrenChanged();
            }
            disconnectedCallback() {
                this.childrenObserver.disconnect();
            }
            childrenChanged() {
                this.refreshTabs();
            }
            refreshTabs() {
                this.tabs.clearChildren();
                let i = 0;
                for (const child of this.children) {
                    const index = i++;
                    const tab = document.createElement("li");
                    const title = child.title;
                    tab.innerText = title ? title : "Tab " + index;
                    tab.addEventListener("click", () => this.selectedIndex = index);
                    this.tabs.appendChild(tab);
                }
                if (this.tabs.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (this.internal_selectedIndex < 0)
                    this.internal_selectedIndex = 0;
                if (this.internal_selectedIndex > this.tabs.children.length - 1)
                    this.internal_selectedIndex = this.tabs.children.length - 1;
                this.refreshSelectedTab();
            }
            internal_selectedIndex = -1;
            get selectedIndex() { return this.internal_selectedIndex; }
            set selectedIndex(value) {
                if (this.tabs.children.length == 0) {
                    this.internal_selectedIndex = -1;
                    return;
                }
                if (value < 0)
                    value = this.tabs.children.length - 1;
                if (value > this.tabs.children.length - 1)
                    value = 0;
                if (this.internal_selectedIndex != value) {
                    this.internal_selectedIndex = value;
                    this.refreshSelectedTab();
                }
            }
            get selectedTab() { return this.children[this.internal_selectedIndex]; }
            refreshSelectedTab() {
                let i = 0;
                for (const tab of this.tabs.children)
                    tab.classList.toggle("selected", i++ == this.internal_selectedIndex);
                i = 0;
                for (const content of this.children)
                    content.classList.toggle("selected", i++ == this.internal_selectedIndex);
                const selectedTabChanged = new Event(Elements.selectedTabChangedEventName);
                selectedTabChanged.selectedTab = this.selectedTab;
                this.dispatchEvent(selectedTabChanged);
            }
            internal_onselectedtabchanged;
            get onselectedtabchanged() { return this.internal_onselectedtabchanged; }
            set onselectedtabchanged(value) {
                if (this.internal_onselectedtabchanged)
                    this.removeEventListener(Elements.selectedTabChangedEventName, this.internal_onselectedtabchanged);
                this.internal_onselectedtabchanged = value;
                if (this.internal_onselectedtabchanged)
                    this.addEventListener(Elements.selectedTabChangedEventName, this.internal_onselectedtabchanged);
            }
        }
        Elements.TabControl = TabControl;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tab-control", UI.Elements.TabControl);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.selectedIndexChangedEventName = "selectedindexchanged";
        class TabHeader extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tab-header-root");
                this.tabs = this.shadowRoot.getElementById("tab-header-tabs");
                this.tabs.addEventListener("click", this.clicked.bind(this));
            }
            root;
            tabs;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tab-header-root" },
                    UI.Generator.Hyperscript("div", { id: "tab-header-tabs" },
                        UI.Generator.Hyperscript("slot", null))));
            }
            static get observedAttributes() {
                return ["selected-index"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "selected-index":
                        const oldIndex = oldValue ? parseInt(oldValue) : -1;
                        const newIndex = newValue ? parseInt(newValue) : -1;
                        this.selectedIndexChanged(oldIndex, newIndex);
                        break;
                }
            }
            connectedCallback() {
                this.selectedIndexChanged(-1, this.selectedIndex);
            }
            get selectedIndex() { return this.hasAttribute("selected-index") ? parseInt(this.getAttribute("selected-index")) : 0; }
            set selectedIndex(value) { this.setAttribute("selected-index", value.toString()); }
            selectedIndexChanged(oldIndex, newIndex) {
                this.refreshHeader(newIndex);
                const event = new Event(Elements.selectedIndexChangedEventName, { bubbles: true, cancelable: false });
                event.oldIndex = oldIndex;
                event.newIndex = newIndex;
                this.dispatchEvent(event);
            }
            refreshHeader(newIndex) {
                const s = newIndex;
                for (let i = 0; i < this.children.length; ++i)
                    this.children[i].classList.toggle("selected", i == s);
            }
            clicked(e) {
                if (e.defaultPrevented)
                    return;
                let target;
                for (const t of e.composedPath())
                    if (t instanceof Element && t.parentElement == this) {
                        target = t;
                        break;
                    }
                const index = Array.from(this.children).indexOf(target);
                if (index != -1)
                    this.selectedIndex = index;
            }
            internal_onselectedindexchanged;
            get onselectedindexchanged() { return this.internal_onselectedindexchanged; }
            set onselectedindexchanged(value) {
                if (this.internal_onselectedindexchanged)
                    this.removeEventListener(Elements.selectedIndexChangedEventName, this.internal_onselectedindexchanged);
                this.internal_onselectedindexchanged = value;
                if (this.internal_onselectedindexchanged)
                    this.addEventListener(Elements.selectedIndexChangedEventName, this.internal_onselectedindexchanged);
            }
        }
        Elements.TabHeader = TabHeader;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tab-header", UI.Elements.TabHeader);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class TagList extends UI.Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tag-list-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tag-list-root" }));
            }
            static get observedAttributes() { return ["tags"]; }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue == newValue)
                    return;
                switch (name) {
                    case "tags":
                        this.tagsChanged(newValue);
                        break;
                }
            }
            get tags() { return this.getAttribute("tags")?.split(",").map(t => t.trim()).filter(t => t) ?? []; }
            set tags(value) { this.setAttribute("tags", value?.join(", ")); }
            tagsChanged(value) {
                this.root.clearChildren();
                for (const tag of this.tags)
                    this.root.append(UI.Generator.Hyperscript("span", { title: tag, onclick: this.tagClicked }, tag));
            }
            tagClicked = function (event) {
                const span = event.currentTarget;
                const tag = span.title;
                const tagClickedEvent = new Event("tagclicked", { bubbles: true });
                tagClickedEvent.tag = tag;
                this.dispatchEvent(tagClickedEvent);
            }.bind(this);
        }
        Elements.TagList = TagList;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tag-list", UI.Elements.TagList);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class ToolTip extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tool-tip-root");
                this.addEventListener("toggle", this.toggled);
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tool-tip-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
            static get observedAttributes() {
                return ["open"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "open":
                        if (oldValue != newValue)
                            this.onOpenChanged(oldValue, newValue);
                        break;
                }
            }
            connectedCallback() {
                this.targetParentChanged();
                if (!this.getAttribute("popover"))
                    this.setAttribute("popover", "auto");
            }
            disconnectedCallback() {
                this.targetParentChanged();
            }
            targetParent;
            targetParentChanged() {
                if (this.parentElement != this.targetParent) {
                    if (this.targetParent) {
                        this.targetParent.removeEventListener("mouseenter", parent_mouseenter);
                        this.targetParent.removeEventListener("mouseleave", parent_mouseleave);
                    }
                    this.targetParent = this.parentElement;
                    if (this.targetParent) {
                        this.targetParent.addEventListener("mouseenter", parent_mouseenter);
                        this.targetParent.addEventListener("mouseleave", parent_mouseleave);
                    }
                }
            }
            onOpenChanged(oldValue, newValue) {
                const newOpen = newValue != null;
                UI.Helper.SetFlagAttribute(this.root, "open", newOpen);
                if (newOpen)
                    this.show();
                else
                    this.close();
            }
            get open() { return UI.Helper.GetFlagAttribute(this, "open"); }
            set open(value) { UI.Helper.SetFlagAttribute(this, "open", value); }
            show() {
                this.togglePopover(true);
            }
            close() {
                this.togglePopover(false);
            }
            toggle(force) {
                return this.togglePopover(force);
            }
            toggled = function (e) {
                if (e.newState == "open") {
                    UI.Helper.SetFlagAttribute(this, "open", true);
                    this.dispatchEvent(new Event("open"));
                }
                if (e.newState == "closed") {
                    UI.Helper.SetFlagAttribute(this, "open", false);
                    this.dispatchEvent(new Event("close"));
                }
            }.bind(this);
        }
        Elements.ToolTip = ToolTip;
        function parent_mouseenter(e) {
            const tooltip = e.currentTarget.querySelector(":scope > tool-tip");
            tooltip.show();
        }
        function parent_mouseleave(e) {
            const tooltip = e.currentTarget.querySelector(":scope > tool-tip");
            tooltip.close();
        }
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tool-tip", UI.Elements.ToolTip);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        Elements.TooltipHandler = new (class {
            setTooltip(element, value) {
                let tooltip;
                for (const child of element.children)
                    if (child instanceof Elements.ToolTip) {
                        tooltip = child;
                        break;
                    }
                if (value == null) {
                    tooltip?.remove();
                    return;
                }
                if (!tooltip) {
                    tooltip = new Elements.ToolTip();
                    element.appendChild(tooltip);
                    const anchorName = element.style.getPropertyValue("anchor-name") || ("--tooltip-anchor-" + Math.random().toString(36).substring(2));
                    element.style.setProperty("anchor-name", anchorName);
                    tooltip.style.setProperty("position-anchor", anchorName);
                }
                let span;
                if (!(tooltip.firstChild instanceof HTMLSpanElement)) {
                    tooltip.clearChildren();
                    tooltip.appendChild(span = document.createElement("span"));
                }
                else
                    span = tooltip.firstChild;
                span.textContent = value;
            }
        })();
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
//! cannot react to property changes
Object.defineProperty(HTMLElement.prototype, "tooltip", {
    get: function () {
        return this.getAttribute("tooltip");
    },
    set: function (value) {
        if (value == null)
            this.removeAttribute("tooltip");
        else
            this.setAttribute("tooltip", value);
        UI.Elements.TooltipHandler.setTooltip(this, value);
    }
});
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class TreeNode extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tree-node-root");
                this.titleElement = this.shadowRoot.getElementById("tree-node-title");
                this.subNodesElement = this.shadowRoot.getElementById("tree-node-sub-nodes");
            }
            root;
            titleElement;
            subNodesElement;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tree-node-root" },
                    UI.Generator.Hyperscript("div", { id: "tree-node-title", onclick: this.clicked.bind(this) },
                        UI.Generator.Hyperscript("slot", { name: "title" })),
                    UI.Generator.Hyperscript("div", { id: "tree-node-sub-nodes" },
                        UI.Generator.Hyperscript("slot", null))));
            }
            static get observedAttributes() { return ["expanded"]; }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "expanded":
                        this.root.classList.toggle("expanded", UI.Helper.GetFlagAttribute(this, "expanded"));
                        break;
                }
            }
            childrenObserver;
            connectedCallback() {
                this.childrenObserver = new MutationObserver(this.childrenChanged.bind(this));
                this.childrenObserver.observe(this, { childList: true });
                this.childrenChanged();
            }
            disconnectedCallback() {
                this.childrenObserver.disconnect();
            }
            get expanded() { return UI.Helper.GetFlagAttribute(this, "expanded"); }
            set expanded(value) { UI.Helper.SetFlagAttribute(this, "expanded", value); }
            get hasSubNodes() { return this.root.classList.contains("has-sub-nodes"); }
            clicked(e) {
                if (e.defaultPrevented)
                    return;
                this.expanded = this.hasSubNodes ? !this.expanded : false;
            }
            childrenChanged() {
                let childCount = 0;
                for (const child of this.children)
                    if (child.slot != "title")
                        ++childCount;
                this.root.classList.toggle("has-sub-nodes", childCount > 0);
                if (this.expanded && !this.hasSubNodes)
                    this.expanded = false;
            }
        }
        Elements.TreeNode = TreeNode;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tree-node", UI.Elements.TreeNode);
var UI;
(function (UI) {
    var Elements;
    (function (Elements) {
        class TreeView extends Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("tree-view-root");
            }
            root;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "tree-view-root" },
                    UI.Generator.Hyperscript("slot", null)));
            }
        }
        Elements.TreeView = TreeView;
    })(Elements = UI.Elements || (UI.Elements = {}));
})(UI || (UI = {}));
customElements.define("tree-view", UI.Elements.TreeView);
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.childrenChangedEventName = "childrenchanged";
        function observeChildList(element) {
            if (element["childListObserver"] == null) {
                const mutationObserver = new MutationObserver((mutationList) => {
                    for (const mutationRecord of mutationList) {
                        const event = new Event(Events.childrenChangedEventName);
                        event.addedNodes = mutationRecord.addedNodes;
                        event.removedNodes = mutationRecord.removedNodes;
                        element.dispatchEvent(event);
                    }
                });
                mutationObserver.observe(element, { childList: true });
                element["childListObserver"] = mutationObserver;
            }
        }
        Events.observeChildList = observeChildList;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.clickedOutsideEventName = "clickedoutside";
        Events.notifyClickedOutsideAttribute = "notify-clicked-outside";
        let globalEventAttached = false;
        function ensureClickedOutsideEventActive() {
            if (!globalEventAttached) {
                globalEventAttached = true;
                document.addEventListener("click", (e) => {
                    const elements = document.querySelectorAll("*[" + Events.notifyClickedOutsideAttribute + "]");
                    for (const element of elements)
                        if (!e.composedPath().includes(element))
                            element.dispatchEvent(new CustomEvent(Events.clickedOutsideEventName, { bubbles: false, }));
                });
            }
        }
        Events.ensureClickedOutsideEventActive = ensureClickedOutsideEventActive;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.connectedEventName = "connected";
        Events.notifyConnectedAttribute = "notify-connected";
        function onConnected(element, listener) {
            element.addEventListener(Events.connectedEventName, listener);
        }
        Events.onConnected = onConnected;
        let notifyElementsAddedObserver;
        function startNotifyElementsAddedObserver() {
            notifyElementsAddedObserver = new MutationObserver(function (mutations) {
                mutations.forEach(mutation => notifyConnected(mutation.addedNodes));
            });
            notifyElementsAddedObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
        function notifyConnected(nodes) {
            for (const node of nodes)
                if (node instanceof Element && node.getAttribute(Events.notifyConnectedAttribute) != null)
                    node.dispatchEvent(new CustomEvent(Events.connectedEventName, { bubbles: false, cancelable: false }));
        }
        startNotifyElementsAddedObserver();
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
addedEventListener = (sender, type, listener, options) => {
    switch (type) {
        case UI.Events.childrenChangedEventName:
            UI.Events.observeChildList(sender);
            break;
        case UI.Events.clickedOutsideEventName:
            UI.Events.ensureClickedOutsideEventActive();
            sender.setAttribute(UI.Events.notifyClickedOutsideAttribute, "");
            break;
        case UI.Events.connectedEventName:
            sender.setAttribute(UI.Events.notifyConnectedAttribute, "");
            break;
        case UI.Events.insertedEventName:
            UI.Events.ensureInsertedEventActive();
            sender.setAttribute(UI.Events.notifyInsertedAttribute, "");
            break;
        case UI.Events.longTouchEventName:
            UI.Events.prepareLongTouch(sender);
            break;
        case UI.Events.renderedEventName:
            sender.setAttribute(UI.Events.notifyRenderedAttribute, "");
            break;
        case UI.Events.rightClickEventName:
            UI.Events.prepareRightClick(sender);
            break;
        case UI.Events.sizeChangedEventName:
            UI.Events.prepareSizeChanged(sender);
            break;
    }
};
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.insertedEventName = "inserted";
        Events.notifyInsertedAttribute = "notify-inserted";
        function hasInsertedEvent(element) {
            return element.getAttribute(Events.notifyInsertedAttribute) != null;
        }
        Events.hasInsertedEvent = hasInsertedEvent;
        let globalEventAttached = false;
        function ensureInsertedEventActive() {
            if (!globalEventAttached) {
                globalEventAttached = true;
                document.addEventListener("animationstart", function inserted(e) {
                    //@ts-ignore
                    if (e.animationName == "inserted" && e.target && "dispatchEvent" in e.target) {
                        const element = e.target;
                        if (hasInsertedEvent(element))
                            element.dispatchEvent(new CustomEvent(Events.insertedEventName, { bubbles: false, }));
                    }
                }, false);
                var styleSheet = document.createElement("style");
                styleSheet.textContent = insertedStyleSheet;
                document.head.appendChild(styleSheet);
            }
        }
        Events.ensureInsertedEventActive = ensureInsertedEventActive;
        const insertedStyleSheet = `*[` + Events.notifyInsertedAttribute + `]` + `
    {
        animation-name: inserted;
    }
    
    @keyframes inserted
    {
        from
        {
            outline-color: transparent;
        }
    
        to
        {
            outline-color: transparent;
        }
    }`;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.longTouchEventName = "longtouch";
        function prepareLongTouch(element) {
            let timer;
            element.addEventListener("touchstart", (e) => {
                //@ts-ignore
                const event = new TouchEvent(Events.longTouchEventName, e);
                timer = setTimeout(() => {
                    timer = null;
                    element.dispatchEvent(event);
                }, 500);
            });
            function cancel() {
                clearTimeout(timer);
            }
            element.addEventListener("touchend", cancel);
            element.addEventListener("touchmove", cancel);
        }
        Events.prepareLongTouch = prepareLongTouch;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.renderedEventName = "rendered";
        Events.notifyRenderedAttribute = "notify-rendered";
        function hasRenderedEvent(element) {
            return element.getAttribute(Events.notifyRenderedAttribute) != null;
        }
        Events.hasRenderedEvent = hasRenderedEvent;
        function dispatchRendered(element) {
            if (hasRenderedEvent(element))
                element.dispatchEvent(new CustomEvent(Events.renderedEventName, { bubbles: false }));
        }
        Events.dispatchRendered = dispatchRendered;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.rightClickEventName = "rightclick";
        function prepareRightClick(element) {
            element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                const event = new PointerEvent(Events.rightClickEventName, e);
                element.dispatchEvent(event);
                return false;
            });
        }
        Events.prepareRightClick = prepareRightClick;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Events;
    (function (Events) {
        Events.sizeChangedEventName = "sizechanged";
        function prepareSizeChanged(element) {
            element["oldSize"] = element.getBoundingClientRect();
            const resizeObserver = new ResizeObserver((resizeList) => {
                const oldSize = element["oldSize"];
                const newSize = element.getBoundingClientRect();
                element["oldSize"] = newSize;
                const event = new Event(Events.sizeChangedEventName);
                event.oldSize = oldSize;
                event.newSize = newSize;
                element.dispatchEvent(event);
            });
            resizeObserver.observe(element);
            element["resizeObserver"] = resizeObserver;
        }
        Events.prepareSizeChanged = prepareSizeChanged;
    })(Events = UI.Events || (UI.Events = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Generator;
    (function (Generator) {
        function Hyperscript(nodeName, attributes, ...childElements) {
            const children = Array.flatten(childElements, item => item instanceof Node);
            return UI.Renderer.render(nodeName, attributes, ...children);
        }
        Generator.Hyperscript = Hyperscript;
        function Fragment(attributes, ...childElements) {
            const children = Array.flatten(childElements, item => item instanceof Node);
            return UI.Renderer.render(UI.Elements.Fragment, null, ...children);
        }
        Generator.Fragment = Fragment;
    })(Generator = UI.Generator || (UI.Generator = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Helper;
    (function (Helper) {
        function GetFlagAttribute(element, attribute) {
            return element.getAttribute(attribute) != null;
        }
        Helper.GetFlagAttribute = GetFlagAttribute;
        function SetFlagAttribute(element, attribute, value) {
            if (value)
                element.setAttribute(attribute, "");
            else
                element.removeAttribute(attribute);
        }
        Helper.SetFlagAttribute = SetFlagAttribute;
        function GetIntAttribute(element, attribute, defaultValue) {
            return element.hasAttribute(attribute) ? parseInt(element.getAttribute(attribute)) : defaultValue;
        }
        Helper.GetIntAttribute = GetIntAttribute;
        function SetIntAttribute(element, attribute, value) {
            element.setAttribute(attribute, value?.toFixed());
        }
        Helper.SetIntAttribute = SetIntAttribute;
    })(Helper = UI.Helper || (UI.Helper = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Helper;
    (function (Helper) {
        function getClassList(classList) {
            if (!classList)
                return [];
            if (typeof classList == "object" && classList instanceof String)
                classList = classList.toString();
            if (typeof classList == "string")
                return classList.split(" ").filter(x => x);
            if (Array.isArray(classList))
                return classList.map(x => x.toString());
            throw new Error("ClassList not parsable");
        }
        Helper.getClassList = getClassList;
    })(Helper = UI.Helper || (UI.Helper = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Helper;
    (function (Helper) {
        function AddAttributeProperty(element, name, value) {
            Object.defineProperty(element, name, {
                get: function () { return this.getAttribute(name.toLowerCase()); },
                set: function (value) { this.setAttribute(name.toLowerCase(), value); }
            });
            element[name] = value;
        }
        Helper.AddAttributeProperty = AddAttributeProperty;
        function AddFlagAttributeProperty(element, name, value) {
            Object.defineProperty(element, name, {
                get: function () { return this.hasAttribute(name.toLowerCase()) ? true : false; },
                set: function (value) { if (value)
                    this.setAttribute(name.toLowerCase(), "");
                else
                    this.removeAttribute(name.toLowerCase()); }
            });
            element[name] = value;
        }
        Helper.AddFlagAttributeProperty = AddFlagAttributeProperty;
        function SetFlag(element, name, value) {
            if (name in element) {
                element[name] = value;
                return true;
            }
            return false;
        }
        Helper.SetFlag = SetFlag;
    })(Helper = UI.Helper || (UI.Helper = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Renderer;
    (function (Renderer) {
        Renderer.customAttributes = {
            "/.*-attribute/": (dom, attribute, value) => {
                dom.setAttribute(attribute.substring(0, attribute.length - "-attribute".length), value?.toString());
                return true;
            },
            "class": (dom, attribute, values) => {
                for (const c of splitClassArray(values))
                    dom.classList.add(c);
                return true;
            },
            "innerhtml": (dom, attribute, value) => {
                if (value)
                    dom.innerHTML = value;
                return true;
            },
            "/(child)|(children)/": (dom, attribute, value) => {
                if (value == null)
                    return;
                if (!(Symbol.iterator in value))
                    value = [value];
                dom.append(...value);
                return true;
            },
            "style": (dom, attribute, value) => {
                if (dom instanceof HTMLElement) {
                    if (typeof value === "string")
                        dom.setAttribute("style", value);
                    else if (typeof value === "object")
                        for (const entry of Object.entries(value)) {
                            let key = entry[0];
                            for (let i = 0; i < key.length; ++i)
                                if (key[i].match(/[A-Z]/)) // uppercase ascii letter
                                    key = key.substring(0, i) + "-" + key[i].toLowerCase() + key.substring(i + 1);
                            let v = entry[1];
                            let priority = undefined;
                            if (typeof v === "string" && v.endsWith("!important")) {
                                priority = "important";
                                v = v.substrEnd("!important".length).trim();
                            }
                            dom.style.setProperty(key, v.toString(), priority);
                        }
                    return true;
                }
            },
            "/(style-element)|(styleelement)/": (dom, attribute, value) => {
                if (Array.isArray(value))
                    value = UI.MergeStyle(...value);
                const rules = value;
                const style = UI.MakeStyle(rules);
                dom.appendChild(style);
                return true;
            },
            /** @deprecated */
            "insertedintodom": (dom, attribute, value) => {
                dom.InsertedIntoDOM = value;
                return true;
            },
            "image": (dom, attribute, value) => {
                if (dom instanceof HTMLElement) {
                    const imageSource = value.toString();
                    if (imageSource.includes("/")) //path
                     {
                        dom.classList.add("image");
                        dom.style.backgroundImage = `url(\"${imageSource}\")`;
                    }
                    else // img class
                     {
                        dom.classList.add("image-" + imageSource);
                    }
                    return true;
                }
            },
            "/(selected)|(checked)|(multiple)/": (dom, attribute, value) => {
                return UI.Helper.SetFlag(dom, attribute, !!value);
            },
            "disabled": (dom, attribute, value) => {
                UI.Helper.AddFlagAttributeProperty(dom, attribute, !!value);
                //disable default action for a -> like button behaviour
                if (dom.nodeName.toLowerCase() == "a")
                    dom.addEventListener("click", (e) => {
                        //@ts-ignore
                        if (e.currentTarget.disabled) {
                            e.preventDefault();
                            return false;
                        }
                    });
                return true;
            },
            "/^on.*$/": (dom, attribute, value) => {
                const event = attribute.substring(2);
                if (typeof value === "string")
                    value = new Function("event", value);
                const listeners = Array.isArray(value) ? value : [value];
                for (const listener of listeners) {
                    switch (event.toLowerCase()) {
                        case "click":
                            dom.addEventListener(event, (e) => {
                                if (!e.currentTarget.disabled)
                                    return listener(e);
                                else
                                    return false;
                            });
                            break;
                        default:
                            dom.addEventListener(event, listener);
                            break;
                    }
                }
                return true;
            },
        };
        function* splitClassArray(values) {
            if (values == null)
                return;
            if (typeof values === "string" || values instanceof String) {
                for (const v of values.trim().split(/\s+/))
                    yield v;
                return;
            }
            for (const value of values)
                if (value) {
                    if (typeof value === "string" || value instanceof String)
                        for (const v of value.trim().split(/\s+/))
                            yield v;
                    else if (Iterable.isIterable(value))
                        for (const v of splitClassArray(value))
                            yield v;
                }
        }
    })(Renderer = UI.Renderer || (UI.Renderer = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Renderer;
    (function (Renderer) {
        Renderer.customNodes = {};
    })(Renderer = UI.Renderer || (UI.Renderer = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Renderer;
    (function (Renderer) {
        function renderMany(vdom) {
            if (vdom == null)
                return [];
            if (Symbol.iterator in vdom) {
                const ret = [];
                for (const item of vdom)
                    ret.push(render(item));
                return ret;
            }
            return [render(vdom)];
        }
        Renderer.renderMany = renderMany;
        function render(nodeName, attributes, ...children) {
            if (typeof nodeName == "object" && "nodeName" in nodeName)
                return render(nodeName.nodeName, nodeName.attributes, ...nodeName.children);
            if (nodeName == null)
                return null;
            const subNodes = createSubNodes(children);
            attributes ??= {};
            return renderNode(nodeName, attributes, subNodes);
        }
        Renderer.render = render;
        function renderNode(nodeName, attributes, children) {
            const self = attributes?.self;
            let dom;
            if (self) {
                const name = (nodeName + "-" + self.name).toLowerCase();
                if (!customElements.getName(self))
                    customElements.define(name, self, { extends: nodeName });
                dom = new self();
                delete attributes.self;
            }
            else if (typeof nodeName === "function" || (typeof nodeName == "object" && "render" in nodeName)) {
                if (typeof nodeName == "object" && "render" in nodeName)
                    dom = renderClassComponentInstance(nodeName);
                //@ts-ignore
                else if (customElements.getName(nodeName))
                    //@ts-ignore
                    dom = new nodeName();
                else
                    return renderComponent(nodeName, attributes, children);
            }
            else if (nodeName.trim().startsWith("<")) { // is full dom text
                dom = document.parseHTML(nodeName).next()?.value;
            }
            else { // is only nodeName
                dom = createNode(nodeName, attributes);
            }
            setAttributes(dom, attributes);
            appendNodes(dom, children);
            if (dom instanceof Element)
                UI.Events.dispatchRendered(dom);
            return dom;
        }
        function renderComponent(nodeName, attributes, children) {
            let result;
            if (Object.isClass(nodeName)) {
                result = renderClassComponent(nodeName, attributes, children);
            }
            else //just try
                try {
                    // function
                    result = renderFunctionComponent(nodeName, attributes, children);
                }
                catch {
                    // constructor
                    result = renderClassComponent(nodeName, attributes, children);
                }
            return result;
        }
        function renderFunctionComponent(nodeName, attributes, children) {
            const result = nodeName(attributes, children);
            return result;
        }
        function renderClassComponent(nodeName, attributes, children) {
            const component = new nodeName(attributes, children);
            const result = component.render();
            return result;
        }
        function renderClassComponentInstance(nodeName) {
            const result = nodeName.render();
            return result;
        }
        function createNode(nodeName, attributes) {
            for (const entry of Object.entries(Renderer.customNodes)) {
                const key = entry[0];
                const handler = entry[1];
                const match = key.startsWith("/") ? RegExp.parse(key, "i").testExact(nodeName) : key.equals(nodeName, false);
                if (match) {
                    const result = handler(nodeName, attributes);
                    if (result)
                        return result;
                }
            }
            if (nodeName.startsWith("svg-"))
                return document.createElementNS("http://www.w3.org/2000/svg", nodeName.substring("svg-".length));
            if (nodeName.startsWith("mathml-"))
                return document.createElementNS("http://www.w3.org/1998/Math/MathML", nodeName.substring("mathml-".length));
            return document.createElement(nodeName);
        }
        function setAttributes(dom, attributes) {
            if (dom instanceof Element)
                for (const key of Object.keys(attributes)) {
                    const value = attributes[key];
                    if (value === undefined)
                        continue;
                    setAttribute(dom, key, value);
                }
        }
        function setAttribute(dom, attribute, value) {
            for (const entry of Object.entries(Renderer.customAttributes)) {
                const key = entry[0];
                const handler = entry[1];
                const match = key.startsWith("/") ? RegExp.parse(key, "i").testExact(attribute) : key.equals(attribute, false);
                if (match && handler?.(dom, attribute, value))
                    return;
            }
            if (attribute in dom && Object.getInheritedPropertyDescriptor(dom, attribute).set)
                dom[attribute] = value;
            else if (typeof value == "function" || typeof value == "object")
                dom[attribute] = value;
            else
                dom.setAttribute(attribute, value);
        }
        function createSubNodes(children) {
            if (!children)
                return [];
            const ret = [];
            for (const child of children) {
                if (child == null)
                    continue;
                let element = child;
                if (typeof element == "string" ||
                    typeof element == "number" ||
                    typeof element == "boolean" ||
                    typeof element == "bigint" ||
                    element instanceof String)
                    element = document.createTextNode(element.toString());
                ret.push(element);
            }
            return ret;
        }
        function appendNodes(dom, children) {
            for (const node of children)
                dom.appendChild(node);
        }
    })(Renderer = UI.Renderer || (UI.Renderer = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Dashboard(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const InsertedIntoDOM = args?.InsertedIntoDOM;
            return (UI.Generator.Hyperscript("div", { class: ["dashboard", ...classList], InsertedIntoDOM: InsertedIntoDOM }, children));
        }
        Components.Dashboard = Dashboard;
        Dashboard.TileGroup = (...args) => Components.TileGroup.apply(null, args);
        Dashboard.Tile = (...args) => Components.Tile.apply(null, args);
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Tile(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const title = args?.title;
            HTMLButtonElement;
            const icon = args?.icon;
            const onclick = args?.onclick;
            return (UI.Generator.Hyperscript("button", { class: ["tile", ...classList], onclick: onclick },
                UI.Generator.Hyperscript("span", { class: "title", title: title }, title),
                UI.Generator.Hyperscript("color-icon", { class: "icon", src: icon })));
        }
        Components.Tile = Tile;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function TileGroup(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const title = args?.title;
            return (UI.Generator.Hyperscript("div", { class: ["tile-group", ...classList] },
                UI.Generator.Hyperscript("h3", { class: "title", title: title }, title),
                children));
        }
        Components.TileGroup = TileGroup;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Download(args) {
            let { files, zipName, client } = args;
            if (!zipName.endsWith(".zip"))
                zipName += ".zip";
            if (!client)
                client = new WebClient("");
            const fileList = files.map(f => f.url).join("\n");
            let i = 0;
            return (UI.Generator.Hyperscript("div", { id: "download" },
                UI.Generator.Hyperscript("div", { class: "files" },
                    UI.Generator.Hyperscript("ul", null, files.map(file => {
                        const { fileName, url, size } = file;
                        let readableSize = size ? Math.calculateHumanReadableFileSize(size) : "? kB";
                        return (UI.Generator.Hyperscript("li", null,
                            UI.Generator.Hyperscript("span", null, ++i),
                            UI.Generator.Hyperscript("a", { class: "download-item link", href: url, download: fileName }, fileName),
                            UI.Generator.Hyperscript("span", { title: size?.toString() ?? "unknown size" },
                                readableSize,
                                "b")));
                    }))),
                UI.Generator.Hyperscript("span", { id: "download-counter" },
                    UI.Generator.Hyperscript("span", null,
                        "Files: ",
                        files.length),
                    UI.Generator.Hyperscript("span", null,
                        "Total Size: ",
                        files.some(x => x.size == null) ? "? kB" : Math.calculateHumanReadableFileSize(files.sum(x => x.size)))),
                UI.Generator.Hyperscript("div", { id: "actions" },
                    UI.Generator.Hyperscript("button", { id: "download-zip", onclick: () => downloadZip(client, zipName) }, "Download zip"),
                    UI.Generator.Hyperscript("button", { id: "download-batch", onclick: () => downloadBatch(client) }, "Download batch"),
                    UI.Generator.Hyperscript("a", { id: "download-list", href: "data:text/plan;base64," + btoa(fileList), download: "list.txt" }, "Download list")),
                UI.Generator.Hyperscript("div", { id: "progress" },
                    UI.Generator.Hyperscript("progress", { value: 0, max: 0 }),
                    UI.Generator.Hyperscript("span", { id: "progress-text" }, "0%"))));
        }
        Components.Download = Download;
        function generateDownloadList(urls) {
            let ret = "";
            for (const url of urls)
                ret += url;
            return ret;
        }
        async function downloadZip(client, zipName) {
            try {
                //@ts-ignore
                const zip = new JSZip();
                const downloadZipButton = document.querySelector("#download #download-zip");
                const downloadBatchButton = document.querySelector("#download #download-batch");
                const progress = document.querySelector("#download progress");
                const progressText = document.querySelector("#download #progress-text");
                downloadZipButton.classList.toggle("disabled");
                downloadBatchButton.classList.toggle("disabled");
                const elements = [...document.querySelectorAll("#download .download-item")];
                progressText.textContent = "0%";
                progress.value = 0;
                progress.max = elements.length;
                for (const element of elements) {
                    const url = element.href;
                    const path = element.innerText;
                    const response = await client.get(url, { connection: "close" });
                    if (!response.ok)
                        throw response.status + " " + response.statusText;
                    const data = await response.blob();
                    zip.file(path, data);
                    progress.value++;
                    progressText.textContent = (progress.value / elements.length).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 });
                }
                progressText.textContent = "Compressing";
                const base64 = await zip.generateAsync({ type: "base64" });
                const dataUrl = "data:application/zip;base64," + base64;
                downloadUrl(dataUrl, zipName);
                progressText.textContent = "Finished!";
                downloadZipButton.classList.toggle("disabled");
                downloadBatchButton.classList.toggle("disabled");
            }
            catch (error) {
                alert(error);
                throw error;
            }
        }
        function downloadUrl(dataUrl, fileName) {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = fileName;
            link.click();
        }
        async function downloadBatch(client) {
            const downloadZipButton = document.querySelector("#download #download-zip");
            const downloadBatchButton = document.querySelector("#download #download-batch");
            const progress = document.querySelector("#download progress");
            const progressText = document.querySelector("#download #progress-text");
            downloadZipButton.classList.toggle("disabled");
            downloadBatchButton.classList.toggle("disabled");
            const elements = [...document.querySelectorAll("#download .download-item")];
            progressText.textContent = "0%";
            progress.value = 0;
            progress.max = elements.length;
            for (const element of elements) {
                const url = element.href;
                const path = element.innerText;
                const response = await client.get(url, { connection: "close" });
                if (!response.ok)
                    throw response.status + " " + response.statusText;
                const data = await response.blob();
                const dataUrl = await readDataUri(data);
                downloadUrl(dataUrl, path);
                progress.value++;
                progressText.textContent = (progress.value / elements.length).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 });
            }
            progressText.textContent = "Finished!";
            downloadZipButton.classList.toggle("disabled");
            downloadBatchButton.classList.toggle("disabled");
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        Components.pageChangedEventName = "pagechanged";
        Components.requestCloseEventName = "requestclose";
        class GalleryViewer extends UI.Elements.CustomElement {
            constructor() {
                super();
                this.shadowRoot.appendChild(this.build());
                this.root = this.shadowRoot.getElementById("gallery-viewer-root");
                this.contentContainer = this.shadowRoot.getElementById("gallery-viewer-content-container");
                this.navigationContainer = this.shadowRoot.getElementById("gallery-viewer-navigation-container");
                this.fullScreenButton = this.shadowRoot.getElementById("gallery-viewer-full-screen-button");
                this.closeButton = this.shadowRoot.getElementById("gallery-viewer-close-button");
                this.previousButton = this.shadowRoot.getElementById("gallery-viewer-previous-button");
                this.nextButton = this.shadowRoot.getElementById("gallery-viewer-next-button");
                this.currentButton = this.shadowRoot.getElementById("gallery-viewer-current-button");
                this.currentSpan = this.shadowRoot.getElementById("gallery-viewer-current-span");
            }
            root;
            contentContainer;
            navigationContainer;
            fullScreenButton;
            closeButton;
            previousButton;
            nextButton;
            currentButton;
            currentSpan;
            build() {
                return (UI.Generator.Hyperscript("div", { id: "gallery-viewer-root", onmousemove: () => this.showButtons(), onmouseup: () => this.showButtons() },
                    UI.Generator.Hyperscript("div", { id: "gallery-viewer-content-container" }),
                    UI.Generator.Hyperscript("dialog", { id: "gallery-viewer-navigation-container" }),
                    UI.Generator.Hyperscript("button", { id: "gallery-viewer-full-screen-button", onclick: () => this.toggleFullScreen() },
                        UI.Generator.Hyperscript("div", { class: "inactive-hide" },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/fullscreen.svg" }))),
                    UI.Generator.Hyperscript("button", { id: "gallery-viewer-close-button", onclick: () => this.close() },
                        UI.Generator.Hyperscript("div", { class: "inactive-hide" },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" }))),
                    UI.Generator.Hyperscript("button", { id: "gallery-viewer-previous-button", onclick: () => this.previous() },
                        UI.Generator.Hyperscript("div", { class: "inactive-hide" },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-left.svg" }))),
                    UI.Generator.Hyperscript("button", { id: "gallery-viewer-next-button", onclick: () => this.next() },
                        UI.Generator.Hyperscript("div", { class: "inactive-hide" },
                            UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-right.svg" }))),
                    UI.Generator.Hyperscript("button", { id: "gallery-viewer-current-button", onclick: () => this.toggleDialog() },
                        UI.Generator.Hyperscript("div", { class: "inactive-hide" },
                            UI.Generator.Hyperscript("span", { id: "gallery-viewer-current-span" }, "0")))));
            }
            connectedCallback() {
                this.interval = setInterval(() => this.hideTimer(), 100);
                document.addEventListener("fullscreenchange", this.fullScreenChanged);
                this.fullScreenChanged();
            }
            disconnectedCallback() {
                clearInterval(this.interval);
                document.removeEventListener("fullscreenchange", this.fullScreenChanged);
            }
            internal_pages;
            get pages() { return this.internal_pages; }
            set pages(value) { this.internal_pages = value; this.loadPages(); }
            internal_index;
            get index() { return this.internal_index; }
            set index(value) { if (this.internal_index != value)
                this.goto(value); }
            loadPages() {
                this.contentContainer.clearChildren();
                let i = 0;
                for (const page of this.internal_pages) {
                    const index = i;
                    const container = document.createElement("div");
                    this.contentContainer.appendChild(container);
                    container.style.left = "calc(100% + 1px)";
                    const element = page.page;
                    if (element instanceof HTMLElement)
                        container.appendChild(element);
                    else {
                        const img = document.createElement("img");
                        img.src = "img/icons/spinner.svg";
                        container.appendChild(img);
                        container.setAttribute("lazy", "true");
                        container.loader = element;
                    }
                    const navigationButton = document.createElement("button");
                    navigationButton.onclick = () => this.goto(index);
                    navigationButton.setAttribute("page", index.toString());
                    const thumbnail = page.thumbnail;
                    if (!thumbnail)
                        navigationButton.innerText = (index + 1).toString();
                    else if (thumbnail instanceof HTMLElement) {
                        navigationButton.appendChild(thumbnail);
                    }
                    else {
                        const span = document.createElement("span");
                        span.textContent = (index + 1).toString();
                        navigationButton.appendChild(span);
                        navigationButton.setAttribute("lazy", "true");
                        navigationButton.loader = thumbnail;
                    }
                    this.navigationContainer.appendChild(navigationButton);
                    ++i;
                }
                const firstPage = this.contentContainer.querySelectorAll(":scope > *")[0];
                firstPage.style.left = "0";
                this.setCurrent(0);
            }
            next() {
                this.closeDialog();
                let newIndex = this.internal_index;
                const oldIndex = this.internal_index;
                const pages = this.contentContainer.querySelectorAll(":scope > *");
                const count = pages.length;
                ++newIndex;
                if (newIndex >= count)
                    newIndex = 0;
                const oldPage = pages[oldIndex];
                const newPage = pages[newIndex];
                this.slidePageIn(newPage, oldPage, "left");
                this.setCurrent(newIndex);
            }
            previous() {
                this.closeDialog();
                let newIndex = this.internal_index;
                const oldIndex = this.internal_index;
                const pages = this.contentContainer.querySelectorAll(":scope > *");
                const count = pages.length;
                --newIndex;
                if (newIndex < 0)
                    newIndex = count - 1;
                const oldPage = pages[oldIndex];
                const newPage = pages[newIndex];
                this.slidePageIn(newPage, oldPage, "right");
                this.setCurrent(newIndex);
            }
            goto(newIndex) {
                this.closeDialog();
                const oldIndex = this.internal_index;
                if (oldIndex == newIndex)
                    return;
                const pages = this.contentContainer.querySelectorAll(":scope > *");
                const count = pages.length;
                if (newIndex < 0)
                    newIndex = 0;
                if (newIndex >= count)
                    newIndex = count - 1;
                const oldPage = pages[oldIndex];
                const newPage = pages[newIndex];
                this.slidePageIn(newPage, oldPage, oldIndex < newIndex ? "left" : "right");
                this.setCurrent(newIndex);
            }
            setCurrent(newIndex) {
                const oldIndex = this.internal_index;
                const oldPage = this.pages[oldIndex];
                this.internal_index = newIndex;
                this.currentSpan.textContent = (newIndex + 1).toString();
                const container = this.contentContainer.querySelectorAll(":scope > div")[newIndex];
                if (container.getAttribute("lazy") == "true") {
                    const result = container.loader();
                    if (result instanceof HTMLElement) {
                        container.clearChildren();
                        container.appendChild(result);
                    }
                    else
                        result.then((r) => {
                            container.clearChildren();
                            container.appendChild(r);
                        });
                    container.setAttribute("lazy", "false");
                }
                for (const button of this.navigationContainer.querySelectorAll(":scope > button"))
                    if (parseInt(button.getAttribute("page")) == newIndex)
                        button.classList.add("selected");
                    else
                        button.classList.remove("selected");
                const pageChangedEvent = new CustomEvent(Components.pageChangedEventName, { bubbles: false });
                pageChangedEvent.oldIndex = oldIndex;
                pageChangedEvent.oldPage = oldPage;
                pageChangedEvent.newIndex = newIndex;
                pageChangedEvent.newPage = this.pages[newIndex];
                this.dispatchEvent(pageChangedEvent);
            }
            slidePageIn(page, oldPage, direction) {
                //@ts-ignore
                if (!anime) { // not yet attached to DOM
                    if (oldPage)
                        oldPage.style.left = "calc(100% + 1px)";
                    if (page)
                        page.style.left = "0";
                    return;
                }
                //@ts-ignore
                anime({
                    targets: page,
                    left: [direction == "left" ? "100%" : "-100%", 0],
                    easing: "easeInOutQuad",
                    duration: 250,
                });
                //@ts-ignore
                anime({
                    targets: oldPage,
                    left: [0, direction == "left" ? "-100%" : "100%"],
                    easing: "easeInOutQuad",
                    duration: 250,
                });
            }
            toggleDialog() {
                if (this.navigationContainer.open)
                    this.closeDialog();
                else {
                    for (const navigationButton of this.navigationContainer.querySelectorAll(":scope > button"))
                        if (navigationButton.getAttribute("lazy") == "true") {
                            const result = navigationButton.loader();
                            if (result instanceof HTMLElement) {
                                navigationButton.clearChildren();
                                navigationButton.appendChild(result);
                            }
                            else
                                result.then((r) => {
                                    navigationButton.clearChildren();
                                    navigationButton.appendChild(r);
                                });
                            navigationButton.setAttribute("lazy", "false");
                        }
                    this.showDialog();
                }
            }
            closeDialog() {
                if (this.navigationContainer.open)
                    //@ts-ignore
                    anime({
                        targets: this.navigationContainer,
                        translateY: ["0", "-100%"],
                        easing: "easeInOutQuad",
                        duration: 250,
                        complete: () => this.navigationContainer.close(),
                    });
            }
            showDialog() {
                if (!this.navigationContainer.open)
                    //@ts-ignore
                    anime({
                        targets: this.navigationContainer,
                        translateY: ["-100%", "0"],
                        easing: "easeInOutQuad",
                        duration: 250,
                        begin: () => this.navigationContainer.show(),
                        complete: () => {
                            const selectedNavigationButton = this.navigationContainer.querySelector(":scope > button.selected");
                            selectedNavigationButton?.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
                        }
                    });
            }
            // inactivity hide
            interval;
            lastActive;
            hideTimer = function () {
                if (!this.parentElement) {
                    clearInterval(this.interval);
                    return;
                }
                if (!this.lastActive)
                    return;
                const duration = Math.abs(this.lastActive.valueOf() - (new Date()).valueOf()); // The unit is millisecond
                if (duration > 3000)
                    this.hideButtons();
            }.bind(this);
            showButtons() {
                const run = !this.lastActive;
                this.lastActive = new Date();
                if (run)
                    //@ts-ignore
                    anime({
                        targets: this.root.querySelectorAll(".inactive-hide"),
                        opacity: 1,
                        easing: "easeInOutQuad",
                        duration: 250
                    });
            }
            hideButtons() {
                const run = !!this.lastActive;
                this.lastActive = null;
                if (run)
                    //@ts-ignore
                    anime({
                        targets: this.root.querySelectorAll(".inactive-hide"),
                        opacity: 0,
                        easing: "easeInOutQuad",
                        duration: 250,
                    });
            }
            toggleFullScreen() {
                if (document.fullscreenElement == this)
                    document.exitFullscreen();
                else if (!document.fullscreenElement)
                    this.requestFullscreen();
            }
            fullScreenChanged = function () {
                if (document.fullscreenElement)
                    this.fullScreenButton.getElementsByTagName("color-icon")[0].src = "img/icons/windowed.svg";
                else
                    this.fullScreenButton.getElementsByTagName("color-icon")[0].src = "img/icons/fullscreen.svg";
            }.bind(this);
            close() {
                if (document.fullscreenElement == this)
                    document.exitFullscreen();
                const closeEvent = new CustomEvent(Components.requestCloseEventName, { bubbles: false });
                this.dispatchEvent(closeEvent);
            }
        }
        Components.GalleryViewer = GalleryViewer;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
customElements.define("gallery-viewer", UI.Components.GalleryViewer);
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Info(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const childs = children;
            const cover = childs.first(x => x instanceof Element && x.classList.contains("info-cover"));
            if (cover)
                childs.remove(cover);
            const title = childs.first(x => x instanceof Element && x.classList.contains("info-title"));
            if (title)
                childs.remove(title);
            const description = childs.first(x => x instanceof Element && x.classList.contains("info-description"));
            if (description)
                childs.remove(description);
            const pane = childs.first(x => x instanceof Element && x.classList.contains("info-pane"));
            if (pane)
                childs.remove(pane);
            const content = childs.first(x => x instanceof Element && x.classList.contains("info-content"));
            if (content)
                childs.remove(content);
            return (UI.Generator.Hyperscript("div", { class: ["info", args.minimized ? "min" : null, ...classList], onrendered: (event) => infoCreated(event.currentTarget, args.minimizeAction) },
                UI.Generator.Hyperscript("div", { class: "info-header" },
                    cover,
                    title,
                    pane,
                    infoMinMax()),
                description,
                content));
        }
        Components.Info = Info;
        Info.Cover = (...args) => Components.InfoCover.apply(null, args);
        Info.Title = (...args) => Components.InfoTitle.apply(null, args);
        Info.Pane = (...args) => Components.InfoPane.apply(null, args);
        Info.Description = (...args) => Components.InfoDescription.apply(null, args);
        Info.Content = (...args) => Components.InfoContent.apply(null, args);
        function infoCreated(info, minimizeAction) {
            refreshIcon(info);
            const observer = new ClassObserver(info, "min", (sender) => minimizeAction?.({ min: true }), (sender) => minimizeAction?.({ min: false }));
            //@ts-ignore
            info.observer = observer;
        }
        function infoMinMax() {
            return (UI.Generator.Hyperscript("a", { class: "info-min-max", onclick: (e) => {
                    const info = e.currentTarget.closest(".info");
                    info.classList.toggle("min");
                    refreshIcon(info);
                } },
                UI.Generator.Hyperscript("color-icon", { src: "img/icons/chevron-up.svg" })));
        }
        function refreshIcon(info) {
            const icon = info.querySelector(".min-max > color-icon");
            if (!icon)
                return;
            if (info.classList.contains("min"))
                icon.src = "img/icons/chevron-down.svg";
            else
                icon.src = "img/icons/chevron-up.svg";
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InfoContent(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("div", { class: ["info-content", ...classList] }, children));
        }
        Components.InfoContent = InfoContent;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InfoCover(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            delete args.class;
            return (UI.Generator.Hyperscript("img", { class: ["info-cover", ...classList], ...args }, children));
        }
        Components.InfoCover = InfoCover;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InfoDescription(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const text = args?.text;
            return (UI.Generator.Hyperscript("overflow-container", { class: ["info-description", ...classList], expandAction: "popup" },
                UI.Generator.Hyperscript("span", null, text)));
        }
        Components.InfoDescription = InfoDescription;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InfoPane(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("div", { class: ["info-pane", "pane", ...classList] }, children));
        }
        Components.InfoPane = InfoPane;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InfoTitle(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("div", { class: ["info-title", ...classList] }, children));
        }
        Components.InfoTitle = InfoTitle;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ListGrid(columnDefinitions, items) {
            let i = 0;
            const tiles = [];
            for (const item of items) {
                const line = UI.Generator.Hyperscript("div", { class: "tile" });
                for (const [key, definition] of Object.entries(columnDefinitions)) {
                    line.appendChild(UI.Generator.Hyperscript("div", { key: key, class: "line-cell", style: { visibility: definition.hidden ? "hidden" : "visible" } }, definition.cell(item, ++i)));
                }
                tiles.push(line);
            }
            return UI.Generator.Hyperscript("div", { class: ["view", "grid"] }, tiles);
        }
        Components.ListGrid = ListGrid;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function List(args, children) {
            const classList = UI.Helper.getClassList(args?.class);
            const columnDefinitions = {};
            for (const node of children) {
                if (node.nodeName == "LIST-COLUMN") {
                    columnDefinitions[node["key"]] = {
                        header: node["header"],
                        cell: node["cell"],
                        hidden: node["hidden"] ?? false
                    };
                }
            }
            const from = args.items.from ?? 0;
            const count = args.items.count ?? 20;
            const total = args.items.total;
            const columnConfiguration = {};
            for (const [key, definition] of Object.entries(columnDefinitions))
                columnConfiguration[key] = !definition.hidden;
            const view = args.view ?? "Table";
            return UI.Generator.Hyperscript("div", { key: args.key, view: view, class: ["peach-list", ...classList] },
                SwitchCaseSync(view, {
                    "Table": () => Components.ListTable(columnDefinitions, args.items.items),
                    "Grid": () => Components.ListGrid(columnDefinitions, args.items.items),
                }),
                UI.Generator.Hyperscript("div", { class: "footer" },
                    UI.Generator.Hyperscript(UI.Components.Pagination, { from: from, count: count, total: total, action: () => { } }),
                    UI.Generator.Hyperscript(UI.Components.ColumnConfiguration, { columns: columnConfiguration, action: () => { } }),
                    UI.Generator.Hyperscript(UI.Components.ItemCount, { count: count, action: () => { } }),
                    UI.Generator.Hyperscript(UI.Components.SemanticZoom, { keys: [], action: () => { } }),
                    UI.Generator.Hyperscript(Components.ListViewSwap, { view: view, allowedViews: ["Table", "Grid"], callback: () => { } }),
                    UI.Generator.Hyperscript(Components.ListSortination, { sorting: args.sorting, keys: args.sortingKeys })));
        }
        Components.List = List;
        function ListColumn(args) {
            //@ts-expect-error
            return UI.Generator.Hyperscript("list-column", { key: args.key, header: args.header, cell: args.cell });
        }
        Components.ListColumn = ListColumn;
        List["Column"] = ListColumn;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ListSortination(args) {
            const sorting = args.sorting ?? { key: args.keys[0].key, direction: args.keys[0].direction ? "Ascending" : null };
            //TODO
            return (UI.Generator.Hyperscript("div", { class: "sortination", title: "sortination" },
                UI.Generator.Hyperscript("button", { onclick: () => { } },
                    UI.Generator.Hyperscript("span", null,
                        sorting?.key ?? "Default",
                        sorting?.direction ? UI.Generator.Hyperscript("color-icon", { src: "img/icons/" + (sorting.direction?.toLowerCase() ?? "sorting") + ".svg" }) : null))));
        }
        Components.ListSortination = ListSortination;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ListTable(columnDefinitions, items) {
            const headers = [];
            for (const [key, definition] of Object.entries(columnDefinitions)) {
                headers.push(UI.Generator.Hyperscript("div", { key: key, class: "header-cell", style: { visibility: definition.hidden ? "hidden" : "visible" } }, definition.header));
            }
            let i = 0;
            const lines = [];
            for (const item of items) {
                const line = UI.Generator.Hyperscript("div", { class: "line" });
                for (const [key, definition] of Object.entries(columnDefinitions)) {
                    line.appendChild(UI.Generator.Hyperscript("div", { key: key, class: "line-cell", style: { visibility: definition.hidden ? "hidden" : "visible" } }, definition.cell(item, ++i)));
                }
                lines.push(line);
            }
            return UI.Generator.Hyperscript("div", { class: ["view", "table"] },
                UI.Generator.Hyperscript("div", { class: "header" }, headers),
                lines);
        }
        Components.ListTable = ListTable;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ListViewSwap(args) {
            const { view, allowedViews, callback } = args;
            return (UI.Generator.Hyperscript("button", { class: ["view-swap", allowedViews.length > 1 ? null : "disabled"], title: "view-swap", value: view, onclick: (event) => apply(event, allowedViews, callback) },
                UI.Generator.Hyperscript("color-icon", { src: "img/icons/" + view.toLowerCase() + ".svg" })));
        }
        Components.ListViewSwap = ListViewSwap;
        function apply(event, allowedViews, callback) {
            const button = event.currentTarget;
            const icon = button.querySelector("color-icon");
            if (allowedViews.length < 2)
                return;
            const view = button.value;
            let index = allowedViews.indexOf(view);
            ++index;
            if (index >= allowedViews.length)
                index = 0;
            const newView = allowedViews[index];
            button.value = newView;
            icon.src = "img/icons/" + newView.toLowerCase() + ".svg";
            callback({ view: newView });
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
;
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        Components.storageKeyServers = "servers";
        Components.storageKeyServer = "server";
        async function Login(config) {
            try {
                config ??= {};
                if (config.prefix && !config.storage)
                    config.storage = new PrefixedStorage(config.prefix);
                config.storage ??= new PrefixedStorage("default");
                await UI.Dialog.show(LoginView, { allowClose: true, mode: "fill" }, config);
                return config.storage.get(Components.storageKeyServer);
            }
            catch {
                // fallback
                config?.storage?.delete(Components.storageKeyServer);
                config?.storage?.delete(Components.storageKeyServers);
                return null;
            }
        }
        Components.Login = Login;
        function LoginView(config) {
            let current = config.storage.get(Components.storageKeyServer);
            if (!current) {
                const address = config.adresses?.first();
                let name = null;
                try {
                    name = new URL(address).host;
                }
                catch { }
                current = { name, address };
            }
            return (UI.Generator.Hyperscript("div", { class: "login", config: config },
                UI.Generator.Hyperscript("h2", { class: "title" }, "Login"),
                UI.Generator.Hyperscript("div", { class: "form" },
                    UI.Generator.Hyperscript("label", null, "Name:"),
                    " ",
                    UI.Generator.Hyperscript("input", { class: "name", type: "text", value: current.name ?? "", onkeydown: keyDown, spellcheck: false }),
                    UI.Generator.Hyperscript("label", null, "Address:"),
                    " ",
                    UI.Generator.Hyperscript("combo-select", { class: "address", value: current.address ?? "", onkeydown: keyDown, options: config.adresses?.map(a => ({ title: a, value: a })), allowSearch: false }),
                    UI.Generator.Hyperscript("label", null, "Username:"),
                    " ",
                    UI.Generator.Hyperscript("input", { class: "username", type: "text", value: current.credentials?.username ?? "", onkeydown: keyDown, spellcheck: false }),
                    UI.Generator.Hyperscript("label", null, "Password:"),
                    " ",
                    UI.Generator.Hyperscript("input", { class: "password", type: "password", value: current.credentials?.password ?? "", onkeydown: keyDown })),
                connectionList(config),
                UI.Generator.Hyperscript("div", { class: "actions" },
                    UI.Generator.Hyperscript("button", { class: "save", onclick: (e) => save(e.currentTarget) }, "Save"),
                    UI.Generator.Hyperscript("button", { class: "delete", onclick: (e) => remove(e.currentTarget) }, "Delete"),
                    UI.Generator.Hyperscript("button", { class: "ok", onclick: (e) => ok(e.currentTarget), key: "confirm" }, "Ok"))));
        }
        function connectionList(config) {
            const servers = config.storage.get(Components.storageKeyServers) ?? [];
            return (UI.Generator.Hyperscript("div", { class: "connection-list" },
                UI.Generator.Hyperscript("button", { onclick: (e) => selectServer(e.currentTarget, { name: "", address: config.adresses?.[0] ?? "", credentials: { username: "", password: "" } }) }, "New"),
                servers.map(s => UI.Generator.Hyperscript("button", { onclick: (e) => selectServer(e.currentTarget, s) }, s.name))));
        }
        function refresh(connect) {
            const config = connect.config;
            const list = connect.querySelector(".connection-list");
            list.replaceWith(connectionList(config));
        }
        function selectServer(sender, server) {
            const connect = sender.closest(".login");
            const current = connect.querySelector(".form");
            current.querySelector(".name").value = server.name;
            current.querySelector(".address").value = server.address;
            current.querySelector(".username").value = server.credentials?.username;
            current.querySelector(".password").value = server.credentials?.password;
        }
        function save(sender) {
            const login = sender.closest(".login");
            const config = login.config;
            const form = login.querySelector(".form");
            const name = form.querySelector(".name").value;
            const address = form.querySelector(".address").value;
            const username = form.querySelector(".username").value;
            const password = form.querySelector(".password").value;
            if (!name)
                return;
            const server = { name, address, credentials: { username, password } };
            updateServer(server, config.storage);
            refresh(login);
        }
        function remove(sender) {
            const login = sender.closest(".login");
            const config = login.config;
            const form = login.querySelector(".form");
            const name = form.querySelector(".name").value;
            removeServer(name, config.storage);
            refresh(login);
        }
        function keyDown(event) {
            if (event.key == "Enter")
                event.currentTarget.closest(".login").querySelector(".ok").click();
            if (event.key == "Escape")
                event.currentTarget.value = "";
        }
        function ok(sender) {
            const login = sender.closest(".login");
            const config = login.config;
            const form = login.querySelector(".form");
            const name = form.querySelector(".name").value;
            const address = form.querySelector(".address").value;
            const username = form.querySelector(".username").value;
            const password = form.querySelector(".password").value;
            const server = { name, address, credentials: { username, password } };
            config.storage.set(Components.storageKeyServer, server);
            UI.Dialog.close(sender);
        }
        function updateServer(server, storage) {
            const servers = storage.get(Components.storageKeyServers) ?? [];
            const old = servers.findIndex(s => s.name == server.name);
            if (old >= 0)
                servers[old] = server;
            else
                servers.push(server);
            storage.set(Components.storageKeyServers, servers);
        }
        function removeServer(name, storage) {
            const servers = storage.get(Components.storageKeyServers) ?? [];
            const newServers = servers.filter(s => s.name != name);
            if (servers.length == newServers.length)
                alert("Server: '" + name + "' not found in saved servers!");
            else
                storage.set(Components.storageKeyServers, newServers);
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Nav(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            if (!children)
                children = [];
            const left = children.filter(x => x instanceof Element && x.classList.contains("left"));
            const right = children.filter(x => x instanceof Element && x.classList.contains("right"));
            return (UI.Generator.Hyperscript("nav", { class: ["nav", ...classList] },
                UI.Generator.Hyperscript("button", { class: "expand-button", onclick: (e) => NavToggleExpand(e.currentTarget) },
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/menu.svg" })),
                UI.Generator.Hyperscript("div", { class: "left" }, ...left),
                UI.Generator.Hyperscript("div", { class: "right" }, ...right)));
        }
        Components.Nav = Nav;
        function NavToggleExpand(navOrChild, force) {
            if (navOrChild.tagName != "NAV")
                navOrChild = navOrChild.closest("nav");
            navOrChild.classList.toggle("expanded", force);
        }
        Components.NavToggleExpand = NavToggleExpand;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function CheckBoxField(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("input", { type: "checkbox", class: [...classList], title: args.title, "key-attribute": args.key, load: (sender, filters) => load(sender, filters), save: (sender, filters) => save(sender, filters) }));
        }
        Components.CheckBoxField = CheckBoxField;
        function load(input, filters) {
            const key = input.getAttribute("key");
            const value = filters[key];
            input.checked = typeof value == "boolean" ? value : false;
        }
        function save(input, filters) {
            const key = input.getAttribute("key");
            if (!input.checked)
                delete filters[key];
            else
                filters[key] = true;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function DateRangeField(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("div", { class: ["date-range-field", ...classList], title: args.title, "key-attribute": args.key, load: (sender, filters) => load(sender, filters), save: (sender, filters) => save(sender, filters) },
                UI.Generator.Hyperscript("input", { type: "date" }),
                UI.Generator.Hyperscript("span", null, " - "),
                UI.Generator.Hyperscript("input", { type: "date" })));
        }
        Components.DateRangeField = DateRangeField;
        function load(input, filters) {
            const key = input.getAttribute("key");
            const value = filters[key]?.toString();
            const inputs = input.getElementsByTagName("input");
            const fromInput = inputs[0];
            const toInput = inputs[1];
            const [start, end] = parseDateRange(value);
            fromInput.value = toInputDate(start);
            toInput.value = toInputDate(end);
        }
        function save(input, filters) {
            const key = input.getAttribute("key");
            const inputs = input.getElementsByTagName("input");
            const fromInput = inputs[0];
            const toInput = inputs[1];
            const dateRange = [null, null];
            if (fromInput.value)
                dateRange[0] = new Date(fromInput.value);
            if (toInput.value)
                dateRange[1] = new Date(toInput.value);
            const value = formatDateRange(dateRange);
            if (value)
                filters[key] = value;
            else
                delete filters[key];
        }
        function parseDateRange(text) {
            text = text?.replaceAll(" ", "");
            if (!text)
                return [null, null];
            const [start, end] = text.splitFirst("..");
            const ret = [null, null];
            if (start)
                ret[0] = parseDate(start);
            if (end)
                ret[1] = parseDate(end);
            return ret;
        }
        Components.parseDateRange = parseDateRange;
        function formatDateRange(dateRange) {
            if (dateRange[0] == null && dateRange[1] == null)
                return null;
            let ret = "";
            if (dateRange[0])
                ret += formatDate(dateRange[0]);
            ret += "..";
            if (dateRange[1])
                ret += formatDate(dateRange[1]);
            return ret;
        }
        Components.formatDateRange = formatDateRange;
        function formatDate(date) {
            if (!date)
                return null;
            return date.getDate().toFixed(0).padLeft("0", 2) + "." + (date.getMonth() + 1).toFixed(0).padLeft("0", 2) + "." + date.getFullYear().toFixed(0).padLeft("0", 4);
        }
        Components.formatDate = formatDate;
        function parseDate(text) {
            text = text?.replaceAll(" ", "");
            const splitted = text.split(".");
            return new Date(parseInt(splitted[2]), parseInt(splitted[1]) - 1, parseInt(splitted[0]));
        }
        Components.parseDate = parseDate;
        function toInputDate(date) {
            if (!date)
                return null;
            const day = date.getDate().toFixed(0).padLeft("0", 2);
            const month = (date.getMonth() + 1).toFixed(0).padLeft("0", 2);
            const year = date.getFullYear().toFixed(0).padLeft("0", 4);
            return year + "-" + month + "-" + day;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function MultiSelectField(args) {
            const values = args.values.map(t => typeof t === "string" ? { title: t, value: t } : t);
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("multi-select", { class: classList, key: args.key, title: args.title, allowSearch: false, placeholder: args.title + " ...", save: save, load: load, options: values }));
        }
        Components.MultiSelectField = MultiSelectField;
        function load(sender, filters) {
            const key = sender.getAttribute("key");
            const value = filters[key];
            const possibleOptions = sender.options;
            const optionValues = Array.isArray(value) ? value.map(x => x.toString()) : [];
            sender.checkedOptions = possibleOptions.filter(pt => optionValues.includes(pt.value));
        }
        function save(sender, filters) {
            const key = sender.getAttribute("key");
            const options = sender.checkedOptions;
            const optionsValues = options.map(x => x.value);
            if (optionsValues.length == 0)
                delete filters[key];
            else
                filters[key] = optionsValues;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function NumberField(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("input", { type: "number", class: [...classList], title: args.title, onkeydown: textFieldInput, "key-attribute": args.key, min: args.min?.toString(), max: args.max?.toString(), step: args.step?.toString(), load: (sender, filters) => load(sender, filters), save: (sender, filters) => save(sender, filters) }));
        }
        Components.NumberField = NumberField;
        function textFieldInput(e) {
            const input = e.currentTarget;
            if (e.key == "Enter") {
                const searchElement = input.closest(".search");
                const goButton = searchElement.querySelector(".go-button");
                goButton.click();
            }
            if (e.key == "Escape")
                input.value = "";
        }
        function load(input, filters) {
            const key = input.getAttribute("key");
            const value = filters[key];
            input.value = (typeof value == "number" ? value : 0).toString();
        }
        function save(input, filters) {
            const key = input.getAttribute("key");
            if (!input.value)
                delete filters[key];
            else
                filters[key] = parseFloat(input.value);
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function QueryBoxField(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("query-box", { class: classList, key: args.key, placeholder: args.title + " ...", save: save, load: load, words: args.words ?? [], title: args.title, ontextsubmit: (e) => {
                    const text = e.text;
                    const sender = e.currentTarget;
                    const searchElement = sender.closest(".search");
                    const goButton = searchElement.querySelector(".go-button");
                    goButton.click();
                } }));
        }
        Components.QueryBoxField = QueryBoxField;
        function load(sender, filters) {
            const key = sender.getAttribute("key");
            const value = filters[key];
            sender.value = typeof value == "string" ? value : "";
        }
        function save(sender, filters) {
            const key = sender.getAttribute("key");
            if (!sender.value)
                delete filters[key];
            else
                filters[key] = sender.value;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Search(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            if (!children)
                children = [];
            const go = args?.go ?? (() => { });
            const filters = args?.filters ?? {};
            return (UI.Generator.Hyperscript("div", { class: ["search", ...classList], onrendered: (e) => initSearch(e, filters) },
                UI.Generator.Hyperscript("div", { class: "fields" }, children.map(child => {
                    const title = child instanceof HTMLElement && child.title;
                    return [
                        title ? UI.Generator.Hyperscript("label", { title: title },
                            title,
                            ":") : null,
                        child
                    ];
                })),
                UI.Generator.Hyperscript("div", { class: "footer" },
                    UI.Generator.Hyperscript("button", { class: "go-button", onclick: (e) => {
                            const newFilters = {};
                            goSearch(e, newFilters);
                            go(newFilters);
                        } }, "Go"))));
        }
        Components.Search = Search;
        function goSearch(e, filters) {
            const searchElement = e.currentTarget.closest(".search");
            for (const element of searchElement.querySelectorAll(":scope > .fields > *"))
                if ("save" in element) {
                    const save = element.save;
                    save(element, filters);
                }
        }
        function initSearch(e, filters) {
            const searchElement = e.currentTarget;
            for (const element of searchElement.querySelectorAll(":scope > .fields > *"))
                if ("load" in element) {
                    const load = element.load;
                    load(element, filters);
                }
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function SelectField(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            if (!children)
                children = [];
            return UI.Generator.Hyperscript("select", { class: [...classList], title: args.title, "key-attribute": args.key, multiple: args.multiple, load: (sender, filters) => load(sender, filters), save: (sender, filters) => save(sender, filters) }, children);
        }
        Components.SelectField = SelectField;
        function load(select, filters) {
            const key = select.getAttribute("key");
            const multiple = select.multiple;
            let values = filters[key];
            if (!Array.isArray(values))
                values = [values];
            if (!multiple && values.length > 0)
                values.length = 1;
            for (const option of select.querySelectorAll(":scope > option"))
                option.selected = values.includes(option.value);
        }
        function save(select, filters) {
            const key = select.getAttribute("key");
            const multiple = select.multiple;
            const values = [];
            for (const option of select.querySelectorAll(":scope > option:checked"))
                values.push(option.value);
            if (!values.length)
                delete filters[key];
            else if (multiple)
                filters[key] = values;
            else
                filters[key] = values[0];
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function SingleSelectField(args) {
            const values = args.values.map(t => typeof t === "string" ? { title: t, value: t } : t);
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            return (UI.Generator.Hyperscript("single-select", { class: classList, key: args.key, title: args.title, allowSearch: false, placeholder: args.title + " ...", save: save, load: load, options: values, allowClear: args?.allowClear ?? true }));
        }
        Components.SingleSelectField = SingleSelectField;
        function load(sender, filters) {
            const key = sender.getAttribute("key");
            const value = filters[key];
            sender.checkedOption = sender.options.first(v => v.value == value);
        }
        function save(sender, filters) {
            const key = sender.getAttribute("key");
            const value = sender.checkedOption?.value;
            if (!value)
                delete filters[key];
            else
                filters[key] = value;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function TextField(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            const dataList = children?.first(x => x.nodeName?.toLowerCase() == "datalist");
            let dataListID = null;
            if (dataList) {
                if (!dataList.attributes)
                    dataList.attributes = {};
                dataList.attributes["id"] = dataListID = "D" + GUID.Create();
            }
            return UI.Generator.Hyperscript(UI.Generator.Fragment, null,
                UI.Generator.Hyperscript("input", { type: "search", "list-attribute": dataListID?.toString(), class: [...classList], title: args.title, placeholder: args.title + " ...", onkeydown: textFieldInput, "key-attribute": args.key, spellcheck: false, load: (sender, filters) => load(sender, filters), save: (sender, filters) => save(sender, filters) }),
                dataList);
        }
        Components.TextField = TextField;
        function textFieldInput(e) {
            const input = e.currentTarget;
            if (e.key == "Enter") {
                const searchElement = input.closest(".search");
                const goButton = searchElement.querySelector(".go-button");
                goButton.click();
            }
            if (e.key == "Escape")
                input.value = "";
        }
        function load(input, filters) {
            const key = input.getAttribute("key");
            const value = filters[key];
            input.value = typeof value == "string" ? value : "";
        }
        function save(input, filters) {
            const key = input.getAttribute("key");
            if (!input.value)
                delete filters[key];
            else
                filters[key] = input.value;
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Swapper(args) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            // init
            if (!args)
                args = { views: {} };
            return (UI.Generator.Hyperscript("div", { id: args.id, class: ["swapper", ...classList], onrendered: (e) => init(e.currentTarget) },
                UI.Generator.Hyperscript("div", { class: "header" }, Object.keys(args.views).map(k => UI.Generator.Hyperscript("button", { onclick: (e) => swapView(e.currentTarget, args.views) }, k))),
                UI.Generator.Hyperscript("div", { class: "content" })));
        }
        Components.Swapper = Swapper;
        function init(sender) {
            const button = sender.querySelector(".header > button");
            if (button)
                button.click();
        }
        async function swapView(sender, views) {
            const swapper = sender.closest(".swapper");
            const viewName = sender.innerText;
            for (const button of swapper.querySelectorAll(".header > button"))
                button.classList.toggle("selected", button.innerText == viewName);
            const content = swapper.querySelector(".content");
            content.clearChildren();
            const viewFunction = views[viewName];
            executeView(viewFunction, content);
        }
        function executeView(viewFunction, target) {
            const view = viewFunction();
            if ("then" in view)
                view.then((v) => target.appendChild(v));
            else
                target.appendChild(view);
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ColumnConfiguration(args) {
            const generateCSS = (table) => {
                args.columns = findColumns(args.columns, table);
                insertCSS(args.columns, table);
            };
            return (UI.Generator.Hyperscript("div", { class: "column-configuration", title: "column-configuration", generateCSS: generateCSS },
                UI.Generator.Hyperscript("button", { onclick: (e) => {
                        const columnConfiguration = e.currentTarget.closest(".column-configuration");
                        const dropDown = columnConfiguration.querySelector("drop-down");
                        if (!dropDown.open)
                            toggleDialog(e.currentTarget);
                    } },
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/column-configuration.svg" })),
                UI.Generator.Hyperscript("drop-down", { placement: "top", popover: "auto", onopen: (e) => {
                        const dropDown = e.currentTarget;
                        if (!dropDown.firstChild) {
                            const dropDownContent = buildDropDown(args);
                            dropDown.appendChild(dropDownContent);
                        }
                    }, ontoggle: (e) => {
                        const dropDown = e.currentTarget;
                        const columnConfiguration = dropDown.closest(".column-configuration");
                        const button = columnConfiguration.querySelector("button");
                        button.classList.toggle("checked", e.newState == "open");
                    }, onclose: (e) => apply(e.currentTarget, args) })));
        }
        Components.ColumnConfiguration = ColumnConfiguration;
        function buildDropDown(args) {
            const { columns } = args;
            return (UI.Generator.Hyperscript("div", null,
                UI.Generator.Hyperscript("div", { class: "drag-container" }, Object.entries(columns).map(column => {
                    const [name, visible] = column;
                    return createColumn(name, visible);
                })),
                UI.Generator.Hyperscript("button", { class: "close", onclick: (e) => toggleDialog(e.currentTarget, false) },
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" }))));
        }
        function createColumn(name, checked) {
            return (UI.Generator.Hyperscript("button", { class: ["column", checked ? "checked" : null], "name-attribute": name, draggable: "true", ondragstart: dragStart, ondragend: dragEnd, ondragenter: dragEnter, ondragover: dragOver, ondragleave: dragLeave, ondrop: drop, onclick: (e) => {
                    const button = e.currentTarget;
                    button.classList.toggle("checked");
                } }, name));
        }
        function toggleDialog(sender, force) {
            const columnConfiguration = sender.closest(".column-configuration");
            const dropDown = columnConfiguration.querySelector("drop-down");
            dropDown.toggle(force);
        }
        function findColumns(configuration, table) {
            const ret = JSON.clone(configuration);
            for (const columnElement of table.querySelectorAll(":scope > .table-view [class*='-cell'], [class$='-cell']")) {
                let column = null;
                for (const className of columnElement.classList)
                    if (className.endsWith("-cell")) {
                        column = className.substring(0, className.length - "-cell".length);
                        break;
                    }
                if (column) {
                    const fixed = columnElement.classList.any(c => c.startsWith("fixed"));
                    if (fixed)
                        delete ret[column];
                    else if (!(column in ret))
                        ret[column] = false;
                }
            }
            return ret;
        }
        function apply(sender, args) {
            const columnConfiguration = sender.closest(".column-configuration");
            const dropDown = columnConfiguration.querySelector("drop-down");
            const table = columnConfiguration.closest(".table");
            const columns = {};
            for (const button of dropDown.querySelectorAll("button.column")) {
                const name = button.getAttribute("name");
                const checked = button.classList.contains("checked");
                columns[name] = checked;
            }
            args.action({ columns });
            insertCSS(columns, table);
        }
        function insertCSS(columns, table) {
            const css = BuildColumnConfigurationCSS(columns);
            const style = table.querySelector("style");
            style.textContent = css;
        }
        function BuildColumnConfigurationCSS(columns) {
            let ret = "";
            let i = 0;
            for (const [name, visible] of Object.entries(columns)) {
                ++i;
                ret += "." + name + "-cell { ";
                if (!visible)
                    ret += "display: none !important; ";
                ret += "order: " + (100 + i) + " !important; ";
                ret += " }";
                ret += "\n";
            }
            return ret;
        }
        Components.BuildColumnConfigurationCSS = BuildColumnConfigurationCSS;
        let dragItem;
        function dragStart(e) {
            const target = e.currentTarget;
            target.addEventListener("click", preventClick, { capture: true });
            dragItem = target;
            // impossible to manipulate dom directly in dragStart
            setTimeout(() => {
                const dragContainer = target.closest(".drag-container");
                addDropTargets(dragContainer);
            }, 10);
        }
        function addDropTargets(dragContainer) {
            const dragItems = [...dragContainer.children];
            for (const dragItem of dragItems)
                dragContainer.insertBefore(buildDropTarget(), dragItem);
            dragContainer.appendChild(buildDropTarget());
        }
        function buildDropTarget() {
            return UI.Generator.Hyperscript("div", { class: "drop-target", ondragenter: dragEnter, ondragover: dragOver, ondragleave: dragLeave, ondrop: drop });
        }
        function dragEnd(e) {
            const target = e.currentTarget;
            target.removeEventListener("click", preventClick, { capture: true });
            const dragContainer = target.closest(".drag-container");
            for (const dropTarget of dragContainer.querySelectorAll(".drop-target"))
                dropTarget.remove();
            dragItem = null;
        }
        function preventClick(e) {
            e.stopPropagation();
        }
        //change style
        function dragEnter(e) {
            const target = e.currentTarget;
            target.classList.add("drag-over");
            e.preventDefault();
        }
        function dragOver(e) {
            const target = e.currentTarget;
            target.classList.add("drag-over");
            e.preventDefault();
        }
        function dragLeave(e) {
            const target = e.currentTarget;
            target.classList.remove("drag-over");
            e.preventDefault();
        }
        function drop(e) {
            const target = e.currentTarget;
            target.classList.remove("drag-over");
            if (target != dragItem) {
                if (target.classList.contains("drop-target")) {
                    target.parentElement.insertBefore(dragItem, target);
                }
                else {
                    swapElements(dragItem, target);
                }
            }
        }
        function swapElements(element1, element2) {
            // create marker element and insert it where obj1 is
            let temp = document.createElement("div");
            element1.parentNode.insertBefore(temp, element1);
            // move obj1 to right before obj2
            element2.parentNode.insertBefore(element1, element2);
            // move obj2 to right before where obj1 used to be
            temp.parentNode.insertBefore(element2, temp);
            // remove temporary marker node
            temp.parentNode.removeChild(temp);
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function GridView(args, children) {
            return (UI.Generator.Hyperscript("div", { class: "grid-view" }, children));
        }
        Components.GridView = GridView;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ItemCount(args) {
            return (UI.Generator.Hyperscript("div", { class: "item-count", title: "item-count" },
                UI.Generator.Hyperscript("button", { onclick: (e) => {
                        const itemCount = e.currentTarget.closest(".item-count");
                        const dropDown = itemCount.querySelector("drop-down");
                        if (!dropDown.open)
                            toggleDialog(e.currentTarget);
                    } },
                    UI.Generator.Hyperscript("span", null, args.count),
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/item-count.svg" })),
                buildDropDown(args)));
        }
        Components.ItemCount = ItemCount;
        function buildDropDown(args) {
            let { count, allowedCounts, action } = args;
            if (!count)
                count = 20;
            if (!allowedCounts)
                allowedCounts = [10, 20, 30, 50, 100];
            return (UI.Generator.Hyperscript("drop-down", { placement: "top", popover: "auto", ontoggle: (e) => {
                    const dropDown = e.currentTarget;
                    const itemCount = dropDown.closest(".item-count");
                    const button = itemCount.querySelector("button");
                    button.classList.toggle("checked", e.newState == "open");
                } },
                UI.Generator.Hyperscript("div", null,
                    allowedCounts?.map(c => itemCountTile(c, c == count, action)),
                    UI.Generator.Hyperscript("button", { class: "close", onclick: (e) => toggleDialog(e.currentTarget, false) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })))));
        }
        function itemCountTile(count, active, action) {
            return (UI.Generator.Hyperscript("button", { class: ["item-count-tile", active ? "checked" : null], onclick: (event) => apply(event.currentTarget, count, action) }, count));
        }
        function toggleDialog(sender, force) {
            const itemCount = sender.closest(".item-count");
            const dropDown = itemCount.querySelector("drop-down");
            dropDown.toggle(force);
        }
        function apply(sender, count, action) {
            toggleDialog(sender, false);
            action({ count: count });
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        ;
        function Pagination(args) {
            let { from, count, total, action } = args;
            if (!from)
                from = 0;
            if (!count)
                count = Components.DefaultCount;
            if (!total || total < count)
                return UI.Generator.Hyperscript("div", { class: "pagination" });
            const pages = [];
            let startFrom = from;
            while (startFrom > 0)
                startFrom -= count;
            let i = 0;
            for (let f = startFrom; f < total; f += count) {
                pages.push({
                    index: i++,
                    from: f,
                    count: count,
                    current: f == from
                });
            }
            const currentPage = pages.find(x => from == x.from);
            return (UI.Generator.Hyperscript("div", { class: "pagination", title: "pagination" },
                UI.Generator.Hyperscript("pagination-navigation", { pages: pages.length, page: currentPage.index, onchange: (e) => action({ from: e.page * count, count }), onopen: (e) => {
                        e.preventDefault(); // prevent default drop-down
                        const pagination = e.currentTarget.closest(".pagination");
                        const dropDown = pagination.querySelector("drop-down");
                        if (!dropDown.open)
                            toggleDialog(e.currentTarget);
                    } }),
                buildDropDown(pages, action)));
        }
        Components.Pagination = Pagination;
        function buildDropDown(pages, action) {
            return (UI.Generator.Hyperscript("drop-down", { placement: "top", popover: "auto", onopen: (e) => {
                    const dropDown = e.currentTarget;
                    const currentPage = dropDown.querySelector(".checked");
                    currentPage?.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
                } },
                UI.Generator.Hyperscript("div", null,
                    pages.map(p => buildPageButton(p, action)),
                    UI.Generator.Hyperscript("button", { class: "close", onclick: (e) => toggleDialog(e.currentTarget, false) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })))));
        }
        function buildPageButton(page, action) {
            return (UI.Generator.Hyperscript("button", { class: ["page-button", page.current ? "checked" : null], onclick: () => action(page) }, (page.index + 1)));
        }
        function toggleDialog(sender, force) {
            const pagination = sender.closest(".pagination");
            const dropDown = pagination.querySelector("drop-down");
            dropDown.toggle(force);
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function RowView(args, children) {
            return (UI.Generator.Hyperscript("div", { class: "row-view" }, children));
        }
        Components.RowView = RowView;
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function SemanticZoom(args) {
            const disabled = !args.keys?.length;
            return (UI.Generator.Hyperscript("div", { class: "semantic-zoom", title: "semantic-zoom" },
                UI.Generator.Hyperscript("button", { class: [disabled ? "disabled" : null], onclick: disabled ? undefined : (e) => {
                        const semanticZoom = e.currentTarget.closest(".semantic-zoom");
                        const dropDown = semanticZoom.querySelector("drop-down");
                        if (!dropDown.open)
                            toggleDialog(e.currentTarget);
                    } },
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/semantic-zoom.svg" })),
                buildDropDown(args)));
        }
        Components.SemanticZoom = SemanticZoom;
        function buildDropDown(args) {
            const { keys, action } = args;
            return (UI.Generator.Hyperscript("drop-down", { placement: "top", popover: "auto", ontoggle: (e) => {
                    const dropDown = e.currentTarget;
                    const columnConfiguration = dropDown.closest(".semantic-zoom");
                    const button = columnConfiguration.querySelector("button");
                    button.classList.toggle("checked", e.newState == "open");
                } },
                UI.Generator.Hyperscript("div", null,
                    keys?.map(z => semanticZoomTile(z, action)),
                    UI.Generator.Hyperscript("button", { class: "close", onclick: (e) => toggleDialog(e.currentTarget, false) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })))));
        }
        function semanticZoomTile(key, action) {
            return (UI.Generator.Hyperscript("button", { class: ["semantic-zoom-key", key.active ? "checked" : null,], disabled: key.disabled, onclick: key.disabled ? undefined : (event) => apply(event.currentTarget, key, action) }, key.name));
        }
        function toggleDialog(sender, force) {
            const semanticZoom = sender.closest(".semantic-zoom");
            const dropDown = semanticZoom.querySelector("drop-down");
            dropDown.toggle(force);
        }
        function apply(sender, key, action) {
            toggleDialog(sender, false);
            action({ from: key.from, count: key.count });
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function Sortination(args) {
            const sortingEvents = setupSortingEvents(args.keys);
            args.keys = sortingEvents;
            if (args.sorting && !args.direction && !sortingEvents.some(x => x.sorting == args.sorting && !x.direction))
                args.direction = sortingEvents.first(x => x.sorting == args.sorting).direction;
            return (UI.Generator.Hyperscript("div", { class: "sortination", title: "sortination" },
                UI.Generator.Hyperscript("button", { onclick: (e) => {
                        const sortination = e.currentTarget.closest(".sortination");
                        const dropDown = sortination.querySelector("drop-down");
                        if (!dropDown.open)
                            toggleDialog(e.currentTarget);
                    } },
                    UI.Generator.Hyperscript("span", null, args.sorting ?? "Default"),
                    UI.Generator.Hyperscript("color-icon", { src: "img/icons/" + (args.direction?.toLowerCase() ?? "sorting") + ".svg" })),
                buildDropDown(args)));
        }
        Components.Sortination = Sortination;
        function buildDropDown(args) {
            let { sorting, direction, keys } = args;
            if (!sorting) {
                const key = keys.first();
                sorting = key.sorting;
                direction = key.direction;
            }
            return (UI.Generator.Hyperscript("drop-down", { placement: "top", popover: "auto", ontoggle: (e) => {
                    const dropDown = e.currentTarget;
                    const sortination = dropDown.closest(".sortination");
                    const button = sortination.querySelector("button");
                    button.classList.toggle("checked", e.newState == "open");
                } },
                UI.Generator.Hyperscript("div", null,
                    keys.map((sortingEvent) => sortingTile(sortingEvent.sorting, sortingEvent.direction, sorting == sortingEvent.sorting && direction == sortingEvent.direction, args.action)),
                    UI.Generator.Hyperscript("button", { class: "close", onclick: (e) => toggleDialog(e.currentTarget, false) },
                        UI.Generator.Hyperscript("color-icon", { src: "img/icons/close.svg" })))));
        }
        function sortingTile(key, direction, checked, action) {
            return (UI.Generator.Hyperscript("button", { class: ["sorting", checked ? "checked" : null], onclick: (event) => apply(event.currentTarget, key, direction, action) },
                UI.Generator.Hyperscript("span", null, key ?? "Default"),
                UI.Generator.Hyperscript("color-icon", { src: "img/icons/" + (direction?.toLowerCase() ?? "sorting") + ".svg" })));
        }
        function setupSortingEvents(keys) {
            const sortingEvents = [];
            for (const key of keys) {
                if (typeof key == "string") {
                    sortingEvents.push({ sorting: key, direction: "Ascending" });
                    sortingEvents.push({ sorting: key, direction: "Descending" });
                }
                else
                    sortingEvents.push(key);
            }
            return sortingEvents;
        }
        function toggleDialog(sender, force) {
            const sortination = sender.closest(".sortination");
            const dropDown = sortination.querySelector("drop-down");
            dropDown.toggle(force);
        }
        function apply(sender, key, direction, action) {
            toggleDialog(sender, false);
            action({ sorting: key, direction: direction });
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function InitializeTableArgs(args, defaults) {
            if (!args)
                args = {};
            args.from ??= defaults?.from ?? 0;
            args.count ??= defaults?.count ?? 20;
            if (args.from < 0)
                args.from = 0;
            args.type ??= defaults?.type ?? "Row";
            args.sorting ??= defaults?.sorting ?? "None";
            args.direction ??= defaults?.direction ?? "Ascending";
            return args;
        }
        Components.InitializeTableArgs = InitializeTableArgs;
        function Table(args, children) {
            const classList = args?.class ? (Array.isArray(args.class) ? args.class : [args.class]) : [];
            // init
            if (!args)
                args = {};
            let { type } = args;
            if (!type)
                type = "Row";
            if (!children)
                children = [];
            //
            //TODO: refactor
            const sortination = children.first(x => x instanceof Element && x.classList.contains("sortination"));
            if (sortination)
                children.remove(sortination);
            const pagination = children.first(x => x instanceof Element && x.classList.contains("pagination"));
            if (pagination)
                children.remove(pagination);
            const columnConfiguration = children.first(x => x instanceof Element && x.classList.contains("column-configuration"));
            if (columnConfiguration)
                children.remove(columnConfiguration);
            const semanticZoom = children.first(x => x instanceof Element && x.classList.contains("semantic-zoom"));
            if (semanticZoom)
                children.remove(semanticZoom);
            const viewSwap = children.first(x => x instanceof Element && x.classList.contains("view-swap"));
            if (viewSwap)
                children.remove(viewSwap);
            const itemCount = children.first(x => x instanceof Element && x.classList.contains("item-count"));
            if (itemCount)
                children.remove(itemCount);
            if (children.length == 0 || (children.length == 1 && children[0] instanceof Element && children[0].classList.contains("header")))
                children.push(UI.Generator.Hyperscript("span", { class: "empty" }, "Empty"));
            const generateCSS = columnConfiguration ? (parent) => {
                const columnConfiguration = parent.getElementsByClassName("column-configuration")[0];
                columnConfiguration.generateCSS(parent);
            } : () => { };
            return (UI.Generator.Hyperscript("div", { class: ["table", ...classList], onrendered: (e) => generateCSS(e.currentTarget), onmouseup: (e) => mouseUp(e.currentTarget, e.target) },
                UI.Generator.Hyperscript("style", null),
                UI.Generator.Hyperscript("div", { class: ["table-view", type.toLowerCase() + "-view"] }, children),
                UI.Generator.Hyperscript("div", { class: "footer" },
                    viewSwap,
                    sortination,
                    columnConfiguration,
                    pagination,
                    itemCount,
                    semanticZoom)));
        }
        Components.Table = Table;
        function mouseUp(table, sender) {
            const dialog = table.querySelector(":scope dialog");
            if (!dialog)
                return;
            const parentDialog = sender.closest("dialog");
            if (!parentDialog)
                dialog.close();
            else if (dialog != parentDialog)
                dialog.close();
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Components;
    (function (Components) {
        function ViewSwap(args) {
            let { type, allowedTypes, action } = args;
            if (!type)
                type = "Row";
            if (!allowedTypes)
                allowedTypes = ["Row", "Grid"];
            return (UI.Generator.Hyperscript("button", { class: ["view-swap", allowedTypes.length > 1 ? null : "disabled"], title: "view-swap", value: type, onclick: (event) => apply(event, allowedTypes, action) },
                UI.Generator.Hyperscript("color-icon", { src: "img/icons/" + type.toLowerCase() + ".svg" })));
        }
        Components.ViewSwap = ViewSwap;
        function apply(event, allowedTypes, action) {
            const button = event.currentTarget;
            const icon = button.querySelector("color-icon");
            if (allowedTypes.length < 2)
                return;
            let index = allowedTypes.indexOf(button.value);
            ++index;
            if (index >= allowedTypes.length)
                index = 0;
            button.value = allowedTypes[index];
            icon.src = "img/icons/" + button.value.toLowerCase() + ".svg";
            action({ type: button.value });
        }
    })(Components = UI.Components || (UI.Components = {}));
})(UI || (UI = {}));
;
var API;
(function (API) {
    async function init() {
        allSuperTypes = await API.Scryfall.catalogue("supertypes");
    }
    API.init = init;
    async function symbology() {
        const scryfallSymbols = await API.Scryfall.symbology();
        const ret = [];
        for (const scryfallSymbol of scryfallSymbols) {
            const code = scryfallSymbol.symbol.substring(1, scryfallSymbol.symbol.length - 1).trim().toUpperCase();
            ret.push({ code, description: scryfallSymbol.english, icon: scryfallSymbol.svg_uri });
        }
        return ret;
    }
    API.symbology = symbology;
    async function typology() {
        return {
            Super: await API.Scryfall.catalogue("supertypes"),
            Card: await API.Scryfall.catalogue("card-types"),
            Artifact: await API.Scryfall.catalogue("artifact-types"),
            Battle: await API.Scryfall.catalogue("battle-types"),
            Creature: await API.Scryfall.catalogue("creature-types"),
            Enchantment: await API.Scryfall.catalogue("enchantment-types"),
            Land: await API.Scryfall.catalogue("land-types"),
            Planeswalker: await API.Scryfall.catalogue("planeswalker-types"),
            Spell: await API.Scryfall.catalogue("spell-types")
        };
    }
    API.typology = typology;
    async function sets() {
        const ret = [];
        const scryfallSets = await API.Scryfall.sets();
        while (scryfallSets.length > 0) {
            for (let i = 0; i < scryfallSets.length; ++i) {
                const scryfallSet = scryfallSets[i];
                if (!scryfallSet.parent_set_code) {
                    ret.push({
                        code: scryfallSet.code,
                        name: scryfallSet.name,
                        icon: scryfallSet.icon_svg_uri,
                        released: scryfallSet.released_at ? new Date(scryfallSet.released_at) : null,
                    });
                    scryfallSets.removeAt(i);
                    --i;
                }
                else {
                    const parentSet = ret.first(x => x.code == scryfallSet.parent_set_code);
                    if (parentSet) {
                        parentSet.subSets ??= [];
                        const set = {
                            code: scryfallSet.code,
                            name: scryfallSet.name,
                            icon: scryfallSet.icon_svg_uri,
                            released: scryfallSet.released_at ? new Date(scryfallSet.released_at) : null,
                            parent: parentSet,
                        };
                        parentSet.subSets.push(set);
                        ret.push(set);
                        scryfallSets.removeAt(i);
                        --i;
                    }
                }
            }
        }
        return ret.filter(x => x.parent == null);
    }
    API.sets = sets;
    async function keywords() {
        const [abilityWords, keywordAbilities, keywordActions] = await Promise.all([
            API.Scryfall.catalogue("ability-words"),
            API.Scryfall.catalogue("keyword-abilities"),
            API.Scryfall.catalogue("keyword-actions")
        ]);
        return [].concat(keywordAbilities, keywordActions, abilityWords);
    }
    API.keywords = keywords;
    async function getIdentifierFromUrl(url) {
        if (typeof url === "string")
            url = URL.parse(url);
        if (url.host == "scryfall.com") {
            const path = url.pathname.trimChar("/").split("/");
            const set = path[1].toString();
            const no = path[2];
            return { set, no };
        }
        else if (url.host == "cards.scryfall.io") {
            const path = url.pathname.trimChar("/").split("/");
            const id = path.last().splitFirst(".")[0].toString();
            return { id };
        }
        else if (url.host == "edhrec.com") {
            const path = url.pathname.trimChar("/").split("/");
            const name = path.last().splitFirst("?")[0].toString();
            return { name };
        }
        else if (url.host == "www.tcgplayer.com") {
            const path = url.pathname.trimChar("/").split("/");
            const id = path[1];
            const card = await API.Scryfall.getCardByTCGPlayerId(id);
            return { set: card.set, no: card.collector_number };
        }
        // make params key case insensitive
        const oldParams = [...url.searchParams];
        for (const [name, value] of oldParams) {
            url.searchParams.delete(name, value);
            url.searchParams.append(name.toLowerCase(), value);
        }
        const name = url.searchParams.get("card");
        if (name)
            return { name };
        const set = url.searchParams.get("set");
        const no = url.searchParams.get("collector_number") ?? url.searchParams.get("collector-number");
        if (set && no)
            return { set, no };
        const scryfallID = url.searchParams.get("scryfall_id") ?? url.searchParams.get("scryfall-id");
        if (scryfallID)
            return { id: scryfallID };
        const oracleID = url.searchParams.get("oracle_id") ?? url.searchParams.get("oracle-id");
        if (oracleID)
            return { id: oracleID };
        const id = url.searchParams.get("id");
        if (id)
            return { id };
        throw new DataError("Unknown Card in url", { url });
    }
    API.getIdentifierFromUrl = getIdentifierFromUrl;
    function search(query) {
        return new AsyncIterablePromise(doSearch(query));
    }
    API.search = search;
    async function* doSearch(query) {
        for await (const scryfallCard of API.Scryfall.search(query))
            yield buildCard(scryfallCard);
    }
    async function getCard(identifier) {
        return (await getCards([identifier]))[0];
    }
    API.getCard = getCard;
    function getCards(identifiers) {
        return new AsyncIterablePromise(doGetCards(identifiers));
    }
    API.getCards = getCards;
    async function* doGetCards(identifiers) {
        const scryfallIdentifiers = identifiers.map(i => {
            if ("no" in i && "set" in i)
                return { set: i.set, collector_number: i.no };
            if ("name" in i)
                return { name: i.name };
            if ("id" in i)
                return { id: i.id };
            throw new DataError("Unknown Identifier", { identifier: i });
        });
        for await (const scryfallCard of API.Scryfall.getCollection(scryfallIdentifiers)) {
            if (!scryfallCard)
                throw new DataError("Identifier not found!");
            yield buildCard(scryfallCard);
        }
    }
    function buildCard(scryfallCard) {
        let card;
        card = {
            name: scryfallCard.name,
            id: scryfallCard.id,
            set: scryfallCard.set,
            no: scryfallCard.collector_number,
            img: getImageURI(scryfallCard.image_uris),
            imgCrop: scryfallCard.image_uris?.art_crop,
            manaCost: scryfallCard.mana_cost,
            manaValue: scryfallCard.cmc,
            typeLine: scryfallCard.type_line,
            type: null,
            keywords: scryfallCard.keywords,
            text: scryfallCard.oracle_text,
            layout: scryfallCard.layout,
            isTransform: API.TransformLayouts.includes(scryfallCard.layout),
            isFlip: API.FlipLayouts.includes(scryfallCard.layout),
            isSplit: API.SplitLayouts.includes(scryfallCard.layout),
            links: {
                Scryfall: scryfallCard.scryfall_uri,
            },
            legalities: {},
            price: scryfallCard.prices.eur ? parseFloat(scryfallCard.prices.eur) : 0,
            producedMana: scryfallCard.produced_mana,
            colorIdentity: scryfallCard.color_identity,
            colorOrder: calcColorOrder(scryfallCard.color_identity),
            //@ts-ignore
            faces: [],
        };
        if (scryfallCard.card_faces && scryfallCard.card_faces.length > 0) {
            for (const cardFace of scryfallCard.card_faces) {
                card.faces.push({
                    name: cardFace.name,
                    img: getImageURI(cardFace.image_uris),
                    manaCost: cardFace.mana_cost,
                    manaValue: cardFace.cmc,
                    text: cardFace.oracle_text,
                    typeLine: cardFace.type_line,
                    type: parseType(cardFace.type_line),
                    loyalty: cardFace.loyalty,
                    power: cardFace.power,
                    toughness: cardFace.toughness,
                });
            }
        }
        if (card.img == null)
            card.img = card.faces[0].img;
        if (card.manaCost == null)
            card.manaCost = card.faces[0].manaCost;
        if (card.text == null)
            card.text = card.faces[0].text;
        if (card.typeLine == null)
            card.typeLine = card.faces[0].typeLine + " // " + card.faces[1].typeLine;
        card.type = parseType(card.typeLine);
        if (scryfallCard.related_uris?.edhrec)
            card.links.EDHREC = scryfallCard.related_uris?.edhrec;
        if (scryfallCard.legalities)
            for (const entry of Object.entries(scryfallCard.legalities)) {
                const mode = entry[0];
                let legality = entry[1];
                if (legality == "not_legal")
                    legality = "non-legal";
                card.legalities[mode] = legality;
            }
        return card;
    }
    function calcColorOrder(colors) {
        const ret = ["_", "_", "_", "_", "_"];
        if (colors.includes("W"))
            ret[0] = "W";
        if (colors.includes("U"))
            ret[1] = "U";
        if (colors.includes("B"))
            ret[2] = "B";
        if (colors.includes("R"))
            ret[3] = "R";
        if (colors.includes("G"))
            ret[4] = "G";
        for (let i = 4; i >= 0; --i)
            if (ret[i] != "_")
                break;
            else
                ret[i] = "+";
        return ret.join("");
    }
    let allSuperTypes;
    function parseType(line) {
        const ret = {};
        if (line.contains(" // "))
            line = line.splitFirst(" // ")[0].trim();
        const [main, sub] = line.splitFirst("—");
        const mainTypes = main.trim().split(/\s+/);
        const subTypes = Array.from(sub?.trim().matchAll(/(Time Lord)|(\w+)/g).map(x => x[0]) ?? []);
        const superTypes = [];
        const cardTypes = [];
        for (const mainType of mainTypes) {
            if (allSuperTypes.includes(mainType))
                superTypes.push(mainType);
            else
                cardTypes.push(mainType);
        }
        ret.super = {
            values: superTypes,
            "Basic": superTypes.includes("Basic"),
            "Legendary": superTypes.includes("Legendary"),
            "Snow": superTypes.includes("Snow"),
            "Token": superTypes.includes("Token"),
        };
        ret.card = {
            values: cardTypes,
            "Artifact": cardTypes.includes("Artifact"),
            "Battle": cardTypes.includes("Battle"),
            "Creature": cardTypes.includes("Creature"),
            "Enchantment": cardTypes.includes("Enchantment"),
            "Instant": cardTypes.includes("Instant"),
            "Kindred": cardTypes.includes("Kindred"),
            "Land": cardTypes.includes("Land"),
            "Planeswalker": cardTypes.includes("Planeswalker"),
            "Sorcery": cardTypes.includes("Sorcery"),
        };
        ret.sub = subTypes;
        return ret;
    }
    function getImageURI(imageURIs) {
        return imageURIs?.png ?? imageURIs?.large ?? imageURIs?.normal ?? imageURIs?.small;
    }
    function isIdentifierOnly(identifier) {
        if ("name" in identifier && Object.entries(identifier).length == 1)
            return true;
        if ("id" in identifier && Object.entries(identifier).length == 1)
            return true;
        if ("set" in identifier && "no" in identifier && Object.entries(identifier).length == 2)
            return true;
        return false;
    }
    API.isIdentifierOnly = isIdentifierOnly;
    API.TransformLayouts = ["transform", "modal", "modal_dfc", "reversible_card"];
    API.FlipLayouts = ["flip"];
    API.SplitLayouts = ["split"];
})(API || (API = {}));
var API;
(function (API) {
    function combineCollections(name, collections) {
        const ret = { name, importDate: null, cards: {} };
        for (const collection of collections) {
            if (ret.importDate == null || collection.importDate > ret.importDate)
                ret.importDate = collection.importDate;
            for (const card of Object.entries(collection.cards)) {
                const name = card[0];
                const quantity = card[1];
                if (!(name in ret.cards))
                    ret.cards[name] = quantity;
                else
                    ret.cards[name] += quantity;
            }
        }
        return ret;
    }
    API.combineCollections = combineCollections;
})(API || (API = {}));
var API;
(function (API) {
    function getEntries(deck) {
        return flattenItems("sections" in deck ? deck.sections : deck.items);
    }
    API.getEntries = getEntries;
    function isEntry(entryOrSection) {
        return "quantity" in entryOrSection;
    }
    API.isEntry = isEntry;
    function isSection(entryOrSection) {
        return "title" in entryOrSection;
    }
    API.isSection = isSection;
    function getColoridentity(deck) {
        if (!deck.commanders)
            return ["B", "G", "R", "U", "W"];
        const entries = getEntries(deck).filter(x => deck.commanders.includes(x.name));
        return entries.mapMany(x => x.colorIdentity).distinct().orderBy(x => x);
    }
    API.getColoridentity = getColoridentity;
    function flattenItems(items) {
        const ret = [];
        for (const item of items)
            if (isEntry(item))
                ret.push(item);
            else if (isSection(item))
                ret.push(...flattenItems(item.items));
        return ret;
    }
    function getSections(deck) {
        return flattenSections("sections" in deck ? deck.sections : deck.items);
    }
    API.getSections = getSections;
    function* flattenSections(items) {
        for (const item of items) {
            if (isSection(item)) { // section
                yield item;
                for (const subSection of flattenSections(item.items))
                    yield subSection;
            }
        }
    }
    function collapse(deck) {
        const entries = Array.isArray(deck) ? deck : getEntries(deck);
        let collapsedEntries = [];
        for (const entry of entries) {
            const collapsedEntry = collapsedEntries.first(x => x.name == entry.name);
            if (collapsedEntry)
                collapsedEntry.quantity += entry.quantity;
            else
                collapsedEntries.push(Object.clone(entry));
        }
        return collapsedEntries;
    }
    API.collapse = collapse;
})(API || (API = {}));
var API;
(function (API) {
    var File;
    (function (File) {
        File.deckFileFormats = [];
        File.collectionFileFormats = [];
        async function saveDeck(deck, format = "YAML") {
            let file;
            if (typeof format == "string")
                file = File.deckFileFormats.first(x => x.name.equals(format, false));
            else
                file = format;
            return { format: file.name, text: await file.save(deck) };
        }
        File.saveDeck = saveDeck;
        async function loadDeck(text, format = "YAML", full = true) {
            text = text?.replaceAll(/(?:\r\n|\r|\n)/, "\n");
            let file;
            if (typeof format == "string")
                file = File.deckFileFormats.first(x => x.name.equals(format, false));
            else
                file = format;
            const deck = await file.load(text);
            if (full)
                await populateEntriesFromIdentifiers(deck);
            return deck;
        }
        File.loadDeck = loadDeck;
        async function populateEntriesFromIdentifiers(deck) {
            const progressDialog = await UI.Dialog.progress({ title: "Gathering card info!", displayType: "Absolute" });
            try {
                const entries = API.getEntries(deck);
                progressDialog.max = entries.length;
                progressDialog.value = 0;
                let i = 0;
                for await (const card of API.getCards(entries.map(entry => { return { name: entry.name }; }))) {
                    const entry = entries[i];
                    Object.assign(entry, card);
                    ++progressDialog.value;
                    ++i;
                }
            }
            finally {
                progressDialog.close();
            }
        }
        File.populateEntriesFromIdentifiers = populateEntriesFromIdentifiers;
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
/// <reference path="File.ts" />
var API;
(function (API) {
    var File;
    (function (File) {
        File.CODFile = new class CODFile {
            name = "COD";
            extensions = ["cod"];
            mimeTypes = ["application/cod"];
            async save(deck) {
                const xmlDoc = document.implementation.createDocument(null, "cockatrice_deck");
                const cockatrice_deck = xmlDoc.getElementsByTagName("cockatrice_deck")[0];
                const deckName = xmlDoc.createElement("deckname");
                deckName.textContent = deck.name;
                cockatrice_deck.append(deckName);
                const comments = xmlDoc.createElement("comments");
                comments.textContent = deck.description;
                cockatrice_deck.append(comments);
                if (deck.commanders && deck.commanders.length >= 1) {
                    const bannerCard = xmlDoc.createElement("bannerCard");
                    bannerCard.setAttribute("providerId", "");
                    bannerCard.textContent = deck.commanders[0];
                    cockatrice_deck.append(bannerCard);
                }
                if (deck.tags && deck.tags.length >= 1) {
                    const tagsElement = xmlDoc.createElement("tags");
                    for (const tag of deck.tags) {
                        const tagElement = xmlDoc.createElement("tag");
                        tagElement.textContent = tag;
                        tagsElement.append(tagElement);
                    }
                    cockatrice_deck.append(tagsElement);
                }
                for (const section of deck.sections) {
                    const zone = xmlDoc.createElement("zone");
                    zone.setAttribute("name", section.title);
                    for (const entry of API.getEntries(section)) {
                        const card = xmlDoc.createElement("card");
                        const name = entry.name.includes(" // ") ? entry.name.splitFirst(" // ")[0].trim() : entry.name;
                        card.setAttribute("number", entry.quantity.toFixed(0));
                        card.setAttribute("name", name);
                        zone.append(card);
                    }
                    cockatrice_deck.append(zone);
                }
                const serializer = new XMLSerializer();
                const text = serializer.serializeToString(xmlDoc);
                return "<?xml version=\"1.0\"?>\n" + text;
            }
            async load(xml) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, "text/xml");
                const root = xmlDoc.getElementsByTagName("cockatrice_deck")[0];
                const deckName = root.getElementsByTagName("deckname")[0]?.textContent ?? "";
                const comments = root.getElementsByTagName("comments")[0]?.textContent;
                const bannerCard = root.getElementsByTagName("bannerCard")[0]?.textContent;
                const tagsElement = root.getElementsByTagName("tags")[0];
                const zones = [...root.getElementsByTagName("zone")];
                const deck = {
                    name: deckName,
                    description: comments,
                    commanders: [],
                    tags: [],
                    sections: [
                        { title: "main", "items": [] },
                        { title: "side", "items": [] },
                        { title: "maybe", "items": [] }
                    ]
                };
                const mainZone = zones.first(x => x.getAttribute("name").equals("main", false));
                if (mainZone) {
                    const mainSection = deck.sections[0];
                    for (const card of mainZone.children) {
                        const quantity = parseInt(card.getAttribute("number") ?? "1");
                        const name = card.getAttribute("name");
                        mainSection.items.push({ quantity, name });
                    }
                }
                const sideZone = zones.first(x => x.getAttribute("name").equals("side", false));
                if (sideZone) {
                    const sideSection = deck.sections[1];
                    for (const card of sideZone.children) {
                        const quantity = parseInt(card.getAttribute("number") ?? "1");
                        const name = card.getAttribute("name");
                        sideSection.items.push({ quantity, name });
                    }
                }
                const maybeZone = zones.first(x => x.getAttribute("name").equals("maybe", false));
                if (maybeZone) {
                    const maybeSection = deck.sections[1];
                    for (const card of maybeZone.children) {
                        const quantity = parseInt(card.getAttribute("number") ?? "1");
                        const name = card.getAttribute("name");
                        maybeSection.items.push({ quantity, name });
                    }
                }
                if (bannerCard)
                    deck.commanders.push(bannerCard);
                if (tagsElement)
                    for (const tagElement of tagsElement.getElementsByTagName("tag"))
                        deck.tags.push(tagElement.textContent);
                return deck;
            }
        }();
        File.deckFileFormats.push(File.CODFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
/// <reference path="File.ts" />
var API;
(function (API) {
    var File;
    (function (File) {
        File.CSVFile = new class CSVFile {
            name = "CSV";
            extensions = ["csv"];
            mimeTypes = ["application/csv", "text/csv"];
            async save(collection) {
                throw new Error("Not implemented yet!");
            }
            async load(text) {
                text = text.replaceAll(/(?:\\r\\n|\\r|\\n)/, "\n");
                const dataset = await CSV.fetch({ data: text });
                const collection = { name: null, cards: {}, importDate: new Date() };
                const header = dataset.fields;
                const nameIndex = findColumn(header, "name");
                const quantityIndex = findColumn(header, "quantity", "qty", "count");
                for (const row of dataset.records) {
                    const name = row[nameIndex];
                    if (!name)
                        continue;
                    const quantity = parseInt(row[quantityIndex]) ?? 1;
                    if (!(name in collection.cards))
                        collection.cards[name] = quantity;
                    else
                        collection.cards[name] += quantity;
                }
                return collection;
            }
            ;
        }();
        function findColumn(header, ...names) {
            for (const name of names) {
                const result = header.findIndex(h => h.toUpperCase() == name.toUpperCase());
                if (result >= 0)
                    return result;
            }
            return -1;
        }
        File.collectionFileFormats.push(File.CSVFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
/// <reference path="File.ts" />
var API;
(function (API) {
    var File;
    (function (File) {
        File.DECFile = new class DECFile {
            name = "DEC";
            extensions = ["dec"];
            mimeTypes = ["application/dec"];
            async save(deck) {
                let ret = "";
                ret += "//Name: " + deck.name + "\n";
                ret += "\n";
                ret += "//Main\n";
                const mainSection = deck.sections.first(x => x.title == "main");
                const addLine = (entry, sideboard) => {
                    if (sideboard)
                        ret += "SB:";
                    ret += entry.quantity + " " + entry.name;
                    if (deck.commanders && deck.commanders.includes(entry.name))
                        ret += " # !Commander";
                    ret += "\n";
                };
                for (const item of mainSection.items)
                    if ("name" in item)
                        addLine(item);
                for (const item of mainSection.items)
                    if ("title" in item) {
                        ret += "\n";
                        ret += "//" + item.title + "\n";
                        for (const entry of API.getEntries(item))
                            addLine(entry);
                    }
                const sideSection = deck.sections.first(x => x.title == "side");
                if (sideSection.items.length > 0) {
                    ret += "\n";
                    ret += "//Sideboard\n";
                    for (const item of sideSection.items)
                        if ("name" in item)
                            addLine(item, true);
                    for (const item of sideSection.items)
                        if ("title" in item) {
                            ret += "\n";
                            ret += "//" + item.title + "\n";
                            for (const entry of API.getEntries(item))
                                addLine(entry, true);
                        }
                }
                return ret;
            }
            async load(text) {
                const lines = text.splitLines().map(x => x.trim());
                let name = null;
                let group = "";
                const groups = {};
                for (const line of lines) {
                    if (!line)
                        continue;
                    const nameMatch = line.match(/^\/\/\s*name:\s*(?<name>.*)$/i);
                    if (nameMatch) {
                        name = nameMatch.groups["name"].trim();
                        continue;
                    }
                    const sectionMatch = line.match(/^\/\/\s*(?<section>.*)$/);
                    if (sectionMatch) {
                        group = sectionMatch.groups["section"].trim();
                        continue;
                    }
                    const arr = groups[group] ??= [];
                    arr.push(line);
                }
                const deck = {
                    name,
                    description: null,
                    commanders: [],
                    tags: [],
                    sections: [
                        { title: "main", items: [] },
                        { title: "side", items: [] },
                        { title: "maybe", items: [] }
                    ]
                };
                for (const group of Object.entries(groups)) {
                    for (const line of group[1]) {
                        const entry = line.match(/^((?<location>[^:]+):\s*)?(?<quantity>[0-9]+)(\s+\[(?<set>[^\\[\\]#]+)\])?\s+(?<name>[^#]*)(?<attributes>#.*)?$/);
                        const location = entry.groups["location"] ?? "";
                        const quantity = parseInt(entry.groups["quantity"].trim());
                        const name = entry.groups["name"].trim();
                        const attributes = entry.groups["attributes"]?.trim();
                        if (attributes && attributes.toLowerCase().includes("commander"))
                            deck.commanders.push(name);
                        const topSection = location?.toLowerCase() == "sb" ? deck.sections.first(x => x.title == "side") : deck.sections.first(x => x.title == "main");
                        let sectionName = group[0];
                        if (topSection.title == "main" && group[0].toLowerCase() == "main")
                            sectionName = null;
                        if (topSection.title == "side" && (group[0].toLowerCase() == "side" || group[0].toLowerCase() == "sideboard"))
                            sectionName = null;
                        if (!sectionName)
                            topSection.items.push({ quantity, name });
                        else {
                            //@ts-ignore
                            let section = topSection.items.first(x => x.title == sectionName);
                            if (!section) {
                                section = { title: sectionName, items: [] };
                                topSection.items.push(section);
                            }
                            section.items.push({ quantity, name });
                        }
                    }
                }
                return deck;
            }
        }();
        File.deckFileFormats.push(File.DECFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
var API;
(function (API) {
    var File;
    (function (File) {
        File.IDECFile = new class IDECFile {
            name = "IDEC";
            extensions = ["idec"];
            mimeTypes = ["application/idec"];
            async save(deck) {
                let ret = "";
                ret += "name: " + deck.name + "\r\n";
                if (deck.description) {
                    const lines = deck.description.splitLines();
                    ret += "description: " + lines[0] + "\r\n";
                    for (const line of lines.skip(1))
                        ret += "# " + line + "\r\n";
                }
                if (deck.commanders && deck.commanders.length > 0) {
                    ret += "commanders: " + "\r\n";
                    for (const commander of deck.commanders)
                        ret += "  - " + commander + "\r\n";
                }
                if (deck.tags && deck.tags.length > 0) {
                    ret += "tags: " + "\r\n";
                    for (const tag of deck.tags)
                        ret += "  - " + tag + "\r\n";
                }
                for (const section of deck.sections)
                    if (section.items && section.items.length > 0)
                        ret += this.writeSection(0, section);
                return ret;
            }
            writeSection(indention, section) {
                let ret = "  ".repeat(indention) + section.title + ":\r\n";
                if (section.comment)
                    for (const commentLine of section.comment.splitLines())
                        ret += "  ".repeat(indention + 1) + "# " + commentLine + "\r\n";
                if (section.items)
                    for (const item of section.items)
                        if (API.isSection(item))
                            ret += this.writeSection(indention + 1, item);
                        else if (API.isEntry(item))
                            ret += this.writeEntry(indention + 1, item);
                return ret;
            }
            writeEntry(indention, entry) {
                let ret = "";
                ret += "  ".repeat(indention) + "- " + entry.quantity + " " + entry.name + "\r\n";
                if (entry.comment)
                    for (const commentLine of entry.comment.splitLines())
                        ret += "  ".repeat(indention + 1) + "# " + commentLine + "\r\n";
                return ret;
            }
            async load(text) {
                const ret = { sections: [] };
                const result = this.parse(text);
                const nameField = getProperty(result, "name");
                if (!nameField || !nameField.value)
                    throw new Error("Deck name is missing");
                ret.name = nameField.value;
                const descriptionField = getProperty(result, "description");
                if (descriptionField && descriptionField.value) {
                    ret.description = descriptionField.value;
                    for (const comment of result.tokens.filter(t => t.type == "comment"))
                        ret.description += "\r\n" + comment.text;
                }
                const commandersField = getProperty(result, "commanders");
                if (commandersField && commandersField.tokens.filter(x => x.type == "item").length)
                    ret.commanders = commandersField.tokens.filter(x => x.type == "item").map(x => x.text);
                const tagsField = getProperty(result, "tags");
                if (tagsField && tagsField.tokens.filter(x => x.type == "item").length)
                    ret.tags = tagsField.tokens.filter(x => x.type == "item").map(x => x.text);
                const mainField = getProperty(result, "main");
                if (mainField)
                    ret.sections.push(this.loadSection(mainField));
                else
                    ret.sections.push({ title: "main", items: [] });
                const sideField = getProperty(result, "side");
                if (sideField)
                    ret.sections.push(this.loadSection(sideField));
                else
                    ret.sections.push({ title: "side", items: [] });
                const maybeField = getProperty(result, "maybe");
                if (maybeField)
                    ret.sections.push(this.loadSection(maybeField));
                else
                    ret.sections.push({ title: "maybe", items: [] });
                return ret;
            }
            sectionRegex = /^\s*(?<title>[^:]+)\s*:\s*$/;
            lineRegex = /^\s*(?<quantity>[0-9]+)?\s*(?<name>[^\(\)]*)\s*((?<set>\(\s*[^\(\)]+\s*\))\s*(?<setno>.*)?)?\s*$/;
            loadSection(p) {
                const ret = { items: [] };
                const section = p.text.match(this.sectionRegex);
                ret.title = section.groups.title.trim();
                const comment = this.getComment(p);
                if (comment)
                    ret.comment = comment;
                for (const token of p.tokens) {
                    switch (token.type) {
                        case "property":
                            ret.items.push(this.loadSection(token));
                            break;
                        case "item":
                            const line = token.text.match(this.lineRegex);
                            const quantity = parseInt(line.groups.quantity?.trim() ?? "1");
                            const name = line.groups.name.trim();
                            const set = line.groups.set?.substring(1).substrEnd(1); // not needed yet
                            const setNo = line.groups.setno; // not needed yet
                            const comment = this.getComment(token);
                            const entry = { quantity, name };
                            if (comment)
                                entry.comment = comment;
                            ret.items.push(entry);
                            break;
                    }
                }
                return ret;
            }
            getComment(token) {
                let ret = "";
                for (const comment of token.tokens.filter(x => x.type == "comment"))
                    ret += comment.text + "\r\n";
                return ret.trim() ?? null;
            }
            parse(text) {
                const ret = { tokens: [] };
                const layers = [];
                for (const line of text.splitLines()) {
                    const [indention, text] = this.getIndention(line);
                    if (!text)
                        continue;
                    let token;
                    if (text.startsWith("#")) { // comment
                        token = { type: "comment", text: text.substring(1).trim(), tokens: [] };
                    }
                    else if (text.startsWith("-")) { // item
                        token = { type: "item", text: text.substring(1).trim(), tokens: [] };
                    }
                    else { // property
                        const [key, value] = text.splitFirst(":");
                        const ptoken = { type: "property", text: text.trim(), tokens: [], key: key.trim() };
                        if (value?.trim())
                            ptoken.value = value.trim();
                        token = ptoken;
                    }
                    if (indention == 0)
                        ret.tokens.push(token);
                    else {
                        const parent = layers[indention - 1];
                        parent.tokens.push(token);
                    }
                    layers.length = indention + 1; // cut off everything that comes after
                    layers[indention] = token;
                }
                return ret;
            }
            getIndention(line) {
                let i = 0;
                while (line[0] == " ") {
                    ++i;
                    line = line.substring(1);
                }
                return [i / 2, line.trimRight()];
            }
        }();
        File.deckFileFormats.push(File.IDECFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
function isProperty(token) {
    return "key" in token;
}
function getProperty(token, key) {
    return token.tokens.first(x => isProperty(x) && x.key == key);
}
var API;
(function (API) {
    var File;
    (function (File) {
        File.JSONFile = new class JSONFile {
            name = "JSON";
            extensions = ["json"];
            mimeTypes = ["application/json", "text/json"];
            async save(deck) {
                deck = this.removeExtendData(deck);
                return JSON.stringify(deck);
            }
            async load(text) {
                text = text.replaceAll(/(?:\r\n|\r|\n)/, "");
                const deck = JSON.parse(text);
                return deck;
            }
            removeExtendData(deck) {
                deck = JSON.clone(deck);
                this.traverse(deck, (entry) => {
                    const ret = { quantity: entry.quantity, name: entry.name };
                    if (entry.comment)
                        ret.comment = entry.comment;
                    return ret;
                });
                return deck;
            }
            traverse(deck, func) {
                for (const section of deck.sections)
                    this.traverseSection(section, func);
            }
            traverseSection(section, func) {
                for (let i = 0; i < section.items.length; ++i) {
                    const item = section.items[i];
                    if ("name" in item)
                        section.items[i] = func(item);
                    else
                        this.traverseSection(item, func);
                }
            }
        }();
        File.deckFileFormats.push(File.JSONFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
var API;
(function (API) {
    var File;
    (function (File) {
        File.TXTFile = new class TXTFile {
            name = "TXT";
            extensions = ["txt"];
            mimeTypes = ["text/plain"];
            async save(deck) {
                return this.create(deck);
            }
            create(deck) {
                const commanders = ("commanders" in deck) ? deck.commanders : [];
                let main;
                let side;
                if ("sections" in deck) {
                    main = API.collapse(deck.sections.first(s => s.title == "main"));
                    side = API.collapse(deck.sections.first(s => s.title == "side"));
                }
                else if ("title" in deck)
                    main = API.collapse(deck);
                else
                    main = deck;
                let textCommanders = "";
                if (commanders.length > 0) {
                    for (const commander of commanders) {
                        textCommanders += "1 " + commander + "\r\n";
                        const entry = main.first(x => x.name == commander);
                        entry.quantity -= 1;
                        if (entry.quantity == 0)
                            main.remove(entry);
                    }
                    textCommanders += "\r\n";
                }
                let text = "";
                for (const entry of main.sortBy(x => x.name))
                    text += entry.quantity.toFixed() + " " + entry.name + "\r\n";
                if (side && side.length > 0) {
                    text += "\r\n";
                    text += "Sideboard\r\n";
                    for (const entry of side.sortBy(x => x.name))
                        text += entry.quantity.toFixed() + " " + entry.name + "\r\n";
                }
                return textCommanders + text;
            }
            async load(text) {
                const lines = text.splitLines().map(x => x.trim());
                let main;
                let side;
                if (lines.some(x => x.equals("Sideboard", false))) {
                    const i = lines.findIndex(x => x.equals("Sideboard", false));
                    main = lines.slice(0, i);
                    side = lines.slice(i + 1);
                }
                else
                    main = lines;
                const deck = {
                    name: null,
                    description: null,
                    commanders: [],
                    tags: [],
                    sections: [
                        { title: "main", items: [] },
                        { title: "side", items: [] },
                        { title: "maybe", items: [] },
                    ],
                };
                const mainSection = deck.sections.first(s => s.title == "main");
                for (const line of main) {
                    const entry = this.parseLine(line);
                    if (entry)
                        mainSection.items.push(entry);
                }
                if (side) {
                    const sideSection = deck.sections.first(s => s.title == "side");
                    for (const line of side) {
                        const entry = this.parseLine(line);
                        if (entry)
                            sideSection.items.push(entry);
                    }
                }
                return deck;
            }
            lineRegex = /^\s*((?<quantity>[0-9]+)\s+)?(?<name>[^#]+)\s*$/;
            parseLine(line) {
                const match = line.match(this.lineRegex);
                if (match) {
                    const quantity = parseInt(match.groups.quantity?.trim() ?? "1");
                    const name = match.groups["name"].trim();
                    return { quantity, name };
                }
                return null;
            }
        }();
        File.deckFileFormats.push(File.TXTFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
var API;
(function (API) {
    var File;
    (function (File) {
        File.YAMLFile = new class YAMLFile {
            name = "YAML";
            extensions = ["yaml", "yml"];
            mimeTypes = ["application/yaml"];
            async save(deck) {
                const data = { name: deck.name };
                if (deck.description)
                    data.description = deck.description;
                if (deck.commanders && deck.commanders.length > 0)
                    data.commanders = deck.commanders;
                if (deck.tags && deck.tags.length > 0)
                    data.tags = deck.tags;
                const addSection = (obj, section) => {
                    obj[section.title] = [];
                    for (const item of section.items)
                        if ("name" in item)
                            obj[section.title].push(item.quantity + " " + item.name);
                        else {
                            const o = {};
                            obj[section.title].push(o);
                            addSection(o, item);
                        }
                };
                for (const section of deck.sections)
                    if (section.items && section.items.length > 0)
                        addSection(data, section);
                return YAML.stringify(data);
            }
            async load(yaml) {
                const data = YAML.parse(yaml);
                const deck = {
                    name: data.name,
                    description: data.description,
                    commanders: [],
                    tags: [],
                    sections: [
                        { title: "main", items: [] },
                        { title: "side", items: [] },
                        { title: "maybe", items: [] }
                    ]
                };
                if (data.commanders)
                    if (typeof data.commanders === "string")
                        deck.commanders = [data.commanders.trim()];
                    else
                        deck.commanders = data.commanders.map(x => x.trim());
                if (data.tags)
                    if (typeof data.tags == "string")
                        deck.tags = data.tags.split(",").map(x => x.trim());
                    else
                        deck.tags = data.tags.map(x => x.trim());
                if ("main" in data) {
                    const main = data["main"];
                    if (main)
                        deck.sections.first(x => x.title == "main").items = main.map(this.createItem);
                }
                if ("side" in data) {
                    const side = data["side"];
                    if (side)
                        deck.sections.first(x => x.title == "side").items = side.map(this.createItem);
                }
                if ("maybe" in data) {
                    const maybe = data["maybe"];
                    if (maybe)
                        deck.sections.first(x => x.title == "maybe").items = maybe.map(this.createItem);
                }
                return deck;
            }
            createItem = function (item) {
                if (typeof item === "string") {
                    const [quantityText, name] = item.splitFirst(" ");
                    return { quantity: parseInt(quantityText), name: name.trim() };
                }
                else {
                    const [title, items] = Object.entries(item).first();
                    const section = { title, items: [] };
                    if (items)
                        for (const item of items)
                            section.items.push(this.createItem(item));
                    return section;
                }
            }.bind(this);
        }();
        File.deckFileFormats.push(File.YAMLFile);
    })(File = API.File || (API.File = {}));
})(API || (API = {}));
var API;
(function (API) {
    var Scryfall;
    (function (Scryfall) {
        const baseUrl = "https://api.scryfall.com";
        async function getCardBySet(set, number) {
            const response = await fetch(`${baseUrl}/cards/${set}/${number}`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            return data;
        }
        Scryfall.getCardBySet = getCardBySet;
        async function getCardByName(name) {
            const response = await fetch(`${baseUrl}/cards/named?exact=${encodeURIComponent(name)}`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            return data;
        }
        Scryfall.getCardByName = getCardByName;
        async function getCardById(id) {
            if (id[0] == "{")
                id = id.substring(1);
            if (id[id.length - 1] == "}")
                id = id.substring(0, id.length - 1);
            const response = await fetch(`${baseUrl}/cards/${id}`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            return data;
        }
        Scryfall.getCardById = getCardById;
        async function getCardByTCGPlayerId(id) {
            if (id[0] == "{")
                id = id.substring(1);
            if (id[id.length - 1] == "}")
                id = id.substring(0, id.length - 1);
            const response = await fetch(`${baseUrl}/cards/tcgplayer/${id}`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            return data;
        }
        Scryfall.getCardByTCGPlayerId = getCardByTCGPlayerId;
        function getMultipleCardsByName(names) {
            return getCollection(names.map(name => { return { name }; }));
        }
        Scryfall.getMultipleCardsByName = getMultipleCardsByName;
        function getCollection(identifiers) {
            return new AsyncIterablePromise(doGetCollection(identifiers));
        }
        Scryfall.getCollection = getCollection;
        async function* doGetCollection(identifiers) {
            const blocks = [];
            // search double faced cards (names contain " // ") only with first part
            identifiers = identifiers.map(x => "name" in x && x.name.includes(" // ") ? { name: x.name.splitFirst(" // ")[0] } : x);
            const ids = [...identifiers];
            while (ids.length)
                blocks.push(ids.splice(0, 50));
            for (const block of blocks) {
                const ids = { identifiers: block };
                const response = await fetch(`${baseUrl}/cards/collection`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ids)
                });
                const data = await response.json();
                if (Scryfall.isScryfallError(data))
                    throw new Error(data.details);
                const result = data;
                const notFound = result.not_found;
                const found = result.data;
                let x = 0;
                for (let i = 0; i < block.length; ++i) {
                    const identifier = identifiers[i];
                    const isNotFound = notFound.some(x => {
                        if ("name" in x)
                            return x["name"] == identifier["name"];
                        if ("id" in x)
                            return x["id"] == identifier["id"];
                        if ("set" in x && "collector_number" in x)
                            return x["set"] == identifier["set"] && x["collector_number"] == identifier["collector_number"];
                        return false;
                    });
                    if (isNotFound)
                        yield null;
                    else {
                        yield found[x];
                        ++x;
                    }
                }
            }
        }
        function search(query) {
            return new AsyncIterablePromise(doSearch(query));
        }
        Scryfall.search = search;
        async function* doSearch(query) {
            let next = `${baseUrl}/cards/search?q=` + encodeURIComponent(query);
            while (next) {
                const response = await fetch(next);
                const data = await response.json();
                if (Scryfall.isScryfallError(data))
                    throw new Error(data.details);
                const result = data;
                for (const d of result.data)
                    yield d;
                if (result.has_more)
                    next = result.next_page;
                else
                    next = null;
            }
        }
        async function symbology() {
            const response = await fetch(`${baseUrl}/symbology`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            const result = data;
            return result.data;
        }
        Scryfall.symbology = symbology;
        async function sets() {
            const response = await fetch(`${baseUrl}/sets`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            const result = data;
            return result.data;
        }
        Scryfall.sets = sets;
        async function catalogue(catalogueName) {
            const response = await fetch(`${baseUrl}/catalog/${catalogueName}`);
            const data = await response.json();
            if (Scryfall.isScryfallError(data))
                throw new Error(data.details);
            const result = data;
            return result.data;
        }
        Scryfall.catalogue = catalogue;
    })(Scryfall = API.Scryfall || (API.Scryfall = {}));
})(API || (API = {}));
var API;
(function (API) {
    var Scryfall;
    (function (Scryfall) {
        function isSingleFacedCard(card) {
            return !("card_faces" in card);
        }
        Scryfall.isSingleFacedCard = isSingleFacedCard;
        function isMultiFacedCard(card) {
            return "card_faces" in card;
        }
        Scryfall.isMultiFacedCard = isMultiFacedCard;
        Scryfall.KnownLanguageCodes = ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "ru", "zhs", "zht", "he", "la", "grc", "ar", "sa", "ph", "qya"];
        Scryfall.CardLayouts = ["normal", "split", "flip", "transform", "modal_dfc", "meld", "leveler", "class", "case", "saga", "adventure", "mutate", "prototype", "battle",
            "planar", "scheme", "vanguard", "token", "double_faced_token", "emblem", "augment", "host", "art_series", "reversible_card"];
        Scryfall.Colors = ["W", "U", "B", "R", "G", "C"];
        Scryfall.CardPartComponents = ["token", "meld_part", "meld_result", "combo_piece"];
        Scryfall.BorderColors = ["black", "white", "borderless", "yellow", "silver", "gold"];
        Scryfall.Finishes = ["foil", "nonfoil", "etched"];
        Scryfall.FrameEffects = ["legendary", "miracle", "enchantment", "draft", "devoid", "tombstone", "colorshifted", "inverted", "sunmoondfc", "compasslanddfc", "originpwdfc", "mooneldrazidfc",
            "waxingandwaningmoondfc", "showcase", "extendedart", "companion", "etched", "snow", "lesson", "shatteredglass", "convertdfc", "fandfc", "upsidedowndfc", "spree"];
        Scryfall.Frames = ["1993", "1997", "2003", "2015", "future"];
        Scryfall.Games = ["paper", "arena", "mtgo"];
        Scryfall.ImageStatuses = ["missing", "placeholder", "lowres", "highres_scan"];
        Scryfall.Rarities = ["common", "uncommon", "rare", "special", "mythic", "bonus"];
        Scryfall.SecurityStamps = ["oval", "triangle", "acorn", "circle", "arena", "heart"];
        Scryfall.SetTypes = ["core", "expansion", "masters", "alchemy", "masterpiece", "arsenal", "from_the_vault", "spellbook", "premium_deck", "duel_deck", "draft_innovation", "treasure_chest",
            "commander", "planechase", "archenemy", "vanguard", "funny", "starter", "box", "promo", "token", "memorabilia", "minigame"];
        function isScryfallError(data) {
            return "object" in data && data.object == "error";
        }
        Scryfall.isScryfallError = isScryfallError;
    })(Scryfall = API.Scryfall || (API.Scryfall = {}));
})(API || (API = {}));
class App {
    static async Start() {
        await API.init();
        App.config = await Data.loadConfig();
        document.querySelector("main").append(new Views.ShelfElement());
    }
    static config;
}
var Data;
(function (Data) {
    const defaultConfig = {};
    async function loadConfig() {
        return ConfigHelper.load("config.json", defaultConfig);
    }
    Data.loadConfig = loadConfig;
})(Data || (Data = {}));
var Views;
(function (Views) {
    class ShelfElement extends HTMLElement {
        constructor() {
            super();
            this.root = App.config.url.trimRight("/");
            this.append(...this.build());
        }
        folderListElement;
        fileListElement;
        build() {
            return [
                UI.Generator.Hyperscript("h1", null, "Shelf"),
                UI.Generator.Hyperscript("div", null,
                    this.folderListElement = UI.Generator.Hyperscript("div", { class: "folder-list" }),
                    this.fileListElement = UI.Generator.Hyperscript("div", { class: "file-list" }))
            ];
        }
        root;
        async connectedCallback() {
            this.loadFolder(this.root);
        }
        deckExtensions = API.File.deckFileFormats.mapMany(x => x.extensions);
        collectionsExtensions = API.File.collectionFileFormats.mapMany(x => x.extensions);
        async loadFolder(url) {
            url = new URL(url, location.toString()).toString().trimChar(["/"]);
            this.folderListElement.clearChildren();
            this.fileListElement.clearChildren();
            const partialPath = url.substring(this.root.length).trimChar(["/"]);
            const depth = partialPath ? partialPath.split("/").length : 0;
            console.log("p", url, partialPath, depth);
            if (depth > 0)
                this.folderListElement.append(this.buildFolder("~", this.root));
            if (depth > 1)
                this.folderListElement.append(this.buildFolder("..", url.splitLast("/")[0]));
            for (let href of (await DirectoryListing.scan(url)).orderBy(x => x)) {
                if (href.endsWith("/")) { // is folder
                    href = href.trimRight("/");
                    const name = decodeURIComponent(href.splitLast("/")[1]);
                    this.folderListElement.append(this.buildFolder(name, href));
                }
                else {
                    const response = await fetch(href);
                    const text = await response.text();
                    const fileName = href.splitLast("/")[1];
                    const extension = fileName.splitLast(".")[1];
                    if (this.deckExtensions.includes(extension.toLowerCase()))
                        try {
                            const deck = await API.File.loadDeck(text, extension, false);
                            const tile = this.buildDeck(href, deck);
                            this.fileListElement.append(tile);
                        }
                        catch { /* file might be malformed */ }
                    else if (this.collectionsExtensions.includes(extension.toLowerCase()))
                        try {
                            this.fileListElement.append(this.buildCollection(href));
                        }
                        catch { /* file might be malformed */ }
                }
            }
            await this.lazyLoad([...this.querySelectorAll("a.deck")]);
        }
        async lazyLoad(tiles) {
            if (!tiles || tiles.length == 0)
                return;
            const cards = await API.getCards(tiles.map(t => {
                let deck = t["deck"];
                let card = deck.commanders?.first();
                if (!card)
                    card = API.collapse(deck)?.[0]?.name;
                if (!card)
                    card = "Plains";
                return { name: card };
            }));
            for (let i = 0; i < tiles.length; ++i) {
                const tile = tiles[i];
                const card = cards[i];
                const img = tile.querySelector("img");
                img.src = card.imgCrop;
            }
        }
        buildFolder(title, url) {
            return UI.Generator.Hyperscript("a", { class: "folder", title: title, ondblclick: () => this.loadFolder(url) },
                UI.Generator.Hyperscript("img", { src: "img/icons/folder.svg" }),
                UI.Generator.Hyperscript("span", null, title));
        }
        buildDeck(url, deck) {
            const fileName = url.splitLast("/")[1];
            const name = decodeURIComponent(fileName.splitLast(".")[0]);
            return UI.Generator.Hyperscript("a", { class: "deck", deck: deck, url: url, title: deck.name ?? name, onrightclick: this.showContextMenu.bind(this), ondblclick: async () => {
                    //TODO:
                } },
                UI.Generator.Hyperscript("img", null),
                UI.Generator.Hyperscript("span", null, deck.name ?? name));
        }
        buildCollection(url) {
            const fileName = url.splitLast("/")[1];
            const name = decodeURIComponent(fileName.splitLast(".")[0]);
            return UI.Generator.Hyperscript("a", { class: "collection", url: url, title: name, ondblclick: async () => {
                    //TODO:
                } },
                UI.Generator.Hyperscript("img", { src: "img/icons/binder.svg" }),
                UI.Generator.Hyperscript("span", null, name));
        }
        showContextMenu(event) {
            const sender = event.currentTarget;
            const deck = sender["deck"];
            UI.ContextMenu.show(event, UI.Generator.Hyperscript("menu-button", { title: "Copy TXT", onclick: async () => {
                    const file = await API.File.saveDeck(deck, API.File.TXTFile);
                    navigator.clipboard.writeText(file.text);
                } },
                UI.Generator.Hyperscript("color-icon", { src: "img/icons/clipboard.svg" }),
                UI.Generator.Hyperscript("span", null, "Copy TXT")));
        }
    }
    Views.ShelfElement = ShelfElement;
    customElements.define("my-shelf", ShelfElement);
})(Views || (Views = {}));
//# sourceMappingURL=app.js.map