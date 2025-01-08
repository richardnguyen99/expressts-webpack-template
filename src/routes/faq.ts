import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the purpose of this site?",
    answer: /* html */ `This site is a demo site for the template <strong>Express
&hyphen;Webpack Starter</strong>. It is a simple and easy&hyphen;to&hyphen;use
template for building full stack web applications with Express and Webpack.`,
  },
  {
    question: "What does Express - Webpack Starter provide?",
    answer: /* html */ `The template provides a full stack web application that
includes a server&hyphen;side application built with Express and serves static
requests bundled with Webpack.`,
  },
  {
    question: "What does ExpressJS do?",
    answer: /* html */ `ExpressJS is a web library written in NodeJS that
provides simple and minimalistic features to serve HTML pages, JSON data and
other asset files over HTTP. Unlike other web frameworks that are shipped with a
lot of bloated features, ExpressJS is lightweight and allows developers to
tailor their applications to their needs.`,
  },
  {
    question: "What does Webpack do?",
    answer: /* html */ `Webpack is a module bundler for asset files. First, it
minifies JavaScript and CSS files to provide a more efficient and faster file
loading. Second, it bundles all the asset files including vendors and
user-defined files. Finally, it provide cache busting by hashing the content
of the files. It optimizes caching and reduces the load time of the web.`,
  },
  {
    question: "What styling does this site use?",
    answer: /* html */ `This site uses <a href="https://getbootstrap.com/">
Bootstrap</a> as the main styling system. Asides from Bootstrap, it also uses
SCSS for writing some custom styles. Combining with Webpack, they are bundled
and minified into CSS files for the site.`,
  },
  {
    question: "How are the data generated?",
    answer: /* html */ `The data are generated using <a href="https://fakerjs.dev/">
<code>faker.js</code></a> to create random data and entities. Generated data are
written to JSON files <code>src/fake-data.json</code>. Upon starting, the server
will read the JSON files and serve as requested.`,
  },
];

const faqHandler: RequestHandler = (_req: Request, res: Response) => {
  res.render("faq", {
    page: "/faq",
    title: "FAQ",
    env: process.env.NODE_ENV,
    faqs: faqs,
    meta: Object.entries(
      getMeta({
        title: "FAQ | ExWt",
        description: "Frequently Asked Questions",
        url: `${process.env.BASE_URL}/faq`,
        "og:url": `${process.env.BASE_URL}/faq`,
        "og:title": "FAQ | ExWt",
        "og:description": "Frequently Asked Questions",
      }),
    ),
  });
};

export default faqHandler;
