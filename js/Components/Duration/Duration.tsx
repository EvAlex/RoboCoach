
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./Duration.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import * as Utils from "../../Utils";

export interface IDurationProps {
    ms: number;
    format?: string;
}

interface IDurationParts {
    hh: string;
    h: string;
    mm: string;
    m: string;
    ss: string;
    s: string;
    fff: string;
    ff: string;
    f: string;
    ":": string;
    ".": string;
}

export default class Duration extends React.Component<IDurationProps, {}> {
    private classesForParts: {[key: string]: string} = {
        "h": "hours",
        "hh": "hours",
        "mm": "min",
        "m": "min",
        "ss": "sec",
        "s": "sec",
        "fff": "ms",
        "ff": "ms",
        "f": "ms",
    };

    render(): React.ReactElement<{}> {
        let parts: IDurationParts = this.getDurationParts(this.props.ms),
            requestedParts: string[] = this.getRequestedParts(parts, this.props.format);
        return (
            <span className={styles["duration"]}>
                {requestedParts.map(p =>
                    <span className={styles[this.classesForParts[p]]}
                          key={p}>
                        {parts[p]}
                    </span>)}
            </span>
        );
    }

    private getDurationParts(duration: number): IDurationParts {
        let hr: number = Math.floor(duration / 1000 / 3600),
            min: number = Math.floor(duration / 1000 / 60 - hr * 60),
            sec: number = Math.floor(duration / 1000 - min * 60 - hr * 3600),
            ms: number = this.props.ms - hr * 3600 * 1000 - min * 60 * 1000 - sec * 1000;
        return {
            hh: Utils.padNumber(hr, 2),
            h: hr.toString(),
            mm: Utils.padNumber(min, 2),
            m: min.toString(),
            ss: Utils.padNumber(sec, 2),
            s: sec.toString(),
            fff: Utils.padNumber(ms, 3),
            ff: Utils.padNumber(ms, 2),
            f: ms.toString(),
            ":": ":",
            ".": "."
        };
    }

    private getRequestedParts(parts: IDurationParts, format: string = "mm:ss"): string[] {
        let res: string[] = [];
        while (format.length > 0) {
            let match: string = "";
            for (let key in parts) {
                if (parts.hasOwnProperty(key) && format.indexOf(key) === 0 && key.length > match.length) {
                    match = key;
                }
            }
            if (match.length > 0) {
                res.push(match);
                format = format.substring(match.length);
            } else {
                throw new Error(`Invalid format string for Duration: "${format}".`);
            }
        }
        return res;
    }
}
