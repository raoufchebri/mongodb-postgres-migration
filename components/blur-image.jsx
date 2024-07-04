"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const react_1 = require("react");
function BlurImage(props) {
    const [isLoading, setLoading] = (0, react_1.useState)(true);
    const [src, setSrc] = (0, react_1.useState)(props.src);
    (0, react_1.useEffect)(() => setSrc(props.src), [props.src]); // update the `src` value when the `prop.src` value changes
    return (<image_1.default {...props} src={src} alt={props.alt} className={`${props.className} transition-all ${isLoading
            ? 'grayscale blur-2xl scale-110'
            : 'grayscale-0 blur-0 scale-100'}`} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg==" onLoadingComplete={async () => {
            setLoading(false);
        }}/>);
}
exports.default = BlurImage;
