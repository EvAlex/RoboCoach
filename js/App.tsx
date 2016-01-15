import React = require("react");
import WorkoutPage from "./Components/WorkoutPage/WorkoutPage";
import CommonActionCreators from "./ActionCreators/CommonActionCreators";
require("./Log/ActionLogger");

require("bluebird");
require("jquery");
require("bootstrap-webpack!../bootstrap.config.js");
// Fuck require("bootstrap-webpack");

export default class App extends React.Component<{}, {}> {
    render(): React.ReactElement<{}> {
        return  <div className="container">
                    <WorkoutPage />
                </div>;
    }

    componentDidMount(): void {
        CommonActionCreators.loadApp();
    }
};
