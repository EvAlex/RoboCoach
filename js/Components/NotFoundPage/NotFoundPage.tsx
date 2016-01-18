
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./NotFoundPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

export default class NotFoundPage extends React.Component<{}, {}> {

    render(): React.ReactElement<{}> {
        return  <div>
                    <h1>Sorry, but I can't find this page.</h1>
                </div>;
    }

}
