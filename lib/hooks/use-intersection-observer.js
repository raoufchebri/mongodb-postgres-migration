"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntersectionObserver = useIntersectionObserver;
const react_1 = require("react");
/**
 * Returns an IntersectionObserver that checks if the provided ref is visible in the window.
 */
function useIntersectionObserver(elementRef, { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }) {
    const [entry, setEntry] = (0, react_1.useState)();
    const frozen = entry?.isIntersecting && freezeOnceVisible;
    const updateEntry = ([entry]) => {
        setEntry(entry);
    };
    (0, react_1.useEffect)(() => {
        const node = elementRef?.current; // DOM Ref
        /* eslint-disable-next-line no-implicit-coercion -- TODO: Fix ESLint Error (#13355) */
        const hasIOSupport = !!window.IntersectionObserver;
        if (!hasIOSupport || frozen || !node)
            return;
        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);
        observer.observe(node);
        return () => observer.disconnect();
    }, [elementRef, threshold, root, rootMargin, frozen]);
    return entry;
}
