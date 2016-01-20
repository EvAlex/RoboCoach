import React = require("react");
import CommonActionCreators from "./ActionCreators/CommonActionCreators";
require("./Log/ActionLogger");
/* tslint:disable:no-unused-variable */
import Dispatcher = require("./Dispatcher/Dispatcher");
import * as RoboCoachDb from "./BackendApi/RoboCoachDb";
var db: RoboCoachDb.RoboCoachDb = RoboCoachDb.default;
/* tslint:enable:no-unused-variable */

require("bluebird");
require("jquery");
require("bootstrap-webpack!../bootstrap.config.js");
// Fuck require("bootstrap-webpack");

interface IAppProps {
    children: React.ReactElement<{}>[];
}

export default class App extends React.Component<IAppProps, {}> {
    render(): React.ReactElement<{}> {
        return  <div className="container">
                    {this.props.children}
                </div>;
    }

    componentDidMount(): void {
        CommonActionCreators.loadApp();
    }
};
