import React = require("react");
import Navbar from "./Components/Navbar/Navbar";
import CommonActionCreators from "./ActionCreators/CommonActionCreators";
require("./Log/ActionLogger");
/* tslint:disable:no-unused-variable */
import Dispatcher = require("./Dispatcher/Dispatcher");
import * as RoboCoachDb from "./BackendApi/RoboCoachDb";
import * as GoogleApi from "./BackendApi/GoogleApi";
var db: RoboCoachDb.RoboCoachDb = RoboCoachDb.default;
var googleApi: GoogleApi.GoogleApi = GoogleApi.default;
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
        return (
            <div>
                <Navbar />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }

    componentDidMount(): void {
        CommonActionCreators.loadApp();
    }
};
