"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMetaProps = void 0;
exports.default = Meta;
const head_1 = __importDefault(require("next/head"));
exports.defaultMetaProps = {
    title: 'MongoDB Starter Kit',
    description: 'MongoDB Starter Kit built with Next.js, Vercel, and MongoDB Atlas.',
    ogImage: `https://assets.vercel.com/image/upload/v1654626375/twitter-cards/mongo-integration-starter.png`,
    ogUrl: 'https://mongodb.vercel.app'
};
function Meta({ props }) {
    return (<head_1.default>
      <title>{props.title}</title>
      <link rel="icon" href="/favicon.ico"/>
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico"/>
      <meta name="theme-color" content="#7b46f6"/>

      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>

      <meta itemProp="name" content={props.title}/>
      <meta itemProp="description" content={props.description}/>
      <meta itemProp="image" content={props.ogImage}/>
      <meta name="description" content={props.description}/>
      <meta property="og:title" content={props.title}/>
      <meta property="og:description" content={props.description}/>
      <meta property="og:url" content={props.ogUrl}/>
      <meta property="og:image" content={props.ogImage}/>
      <meta property="og:type" content="website"/>

      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content="@Vercel"/>
      <meta name="twitter:creator" content="@StevenTey"/>
      <meta name="twitter:title" content={props.title}/>
      <meta name="twitter:description" content={props.description}/>
      <meta name="twitter:image" content={props.ogImage}/>
    </head_1.default>);
}
