
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./NotFoundPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */
const templateRenderFn: () => React.ReactElement<{}> = require("./NotFoundPage.rt.html");

interface INotFoundPageProps {
}

interface INotFoundPageState {
}

export default class NotFoundPage extends React.Component<INotFoundPageProps, INotFoundPageState> {

    constructor() {
        super();
        this.state = {
            prevLocation: "unknown",
            nextLocation: "unknown"
        };
    }

    render(): React.ReactElement<{}> {
        return templateRenderFn.bind(this)();
    }

}
