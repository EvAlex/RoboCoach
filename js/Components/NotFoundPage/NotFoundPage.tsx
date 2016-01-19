
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./NotFoundPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */
const templateRenderFn: () => React.ReactElement<{}> = require("./NotFoundPage.rt.html");
import INotFoundPageState from "./INotFoundPageState";

interface INotFoundPageProps {
    foo: string;
}

export default class NotFoundPage extends React.Component<INotFoundPageProps, INotFoundPageState> {

    constructor() {
        super();
    }

    render(): React.ReactElement<{}> {
        return templateRenderFn.bind(this)();
    }

}
