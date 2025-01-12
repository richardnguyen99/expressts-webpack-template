import * as path from "path";
import { engine } from "express-handlebars";
import {
  getCountryDataList,
  getEmojiFlag,
  type TCountryCode,
} from "countries-list";

const hbsEngine = (config: { manifest: Record<string, object> }) =>
  engine({
    partialsDir: [path.join(__dirname, "views", "partials")],
    extname: "hbs",
    defaultLayout: path.join(
      __dirname,
      "views",
      "partials",
      "layouts",
      "main.hbs",
    ),
    layoutsDir: path.join(__dirname, "views", "partials", "layouts"),
    helpers: {
      manifest(assetPath: string) {
        if (config.manifest[assetPath]) {
          return config.manifest[assetPath];
        }

        if (process.env.NODE_ENV === "test") {
          return assetPath;
        }

        throw new Error(`Asset path '${assetPath}' not found in manifest.json`);
      },

      concat: (...args: unknown[]) => args.slice(0, -1).join(""),
      flag: (countryCode: TCountryCode) => getEmojiFlag(countryCode),
      countryName: (countryCode: TCountryCode) => {
        const country = getCountryDataList().find(
          (c) => c.iso2 === countryCode,
        );

        return country?.name;
      },
      eq: (a: unknown, b: unknown) => a === b,
      neq: (a: unknown, b: unknown) => a !== b,
      uppercase: (str: string) => str.toUpperCase(),
      lowercase: (str: string) => str.toLowerCase(),
      capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
      len: (arr: unknown[]) => arr.length,
      fullname: (firstName: string, lastName: string) =>
        `${firstName} ${lastName}`,
      isoDatetime: (timestamp: number) => {
        const date = new Date(timestamp);

        return date.toISOString();
      },
      date: (
        format: Intl.DateTimeFormatOptions["dateStyle"],
        timestamp: number,
      ) => {
        const date = new Date(timestamp);

        return new Intl.DateTimeFormat("en-US", {
          dateStyle: format,
        }).format(date);
      },
    },
  });

export default hbsEngine;
