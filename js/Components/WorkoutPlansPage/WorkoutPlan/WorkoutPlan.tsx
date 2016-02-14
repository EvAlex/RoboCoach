
import React = require("react");

interface IWorkoutPlanProps extends React.Props<{}> {
}

export default class WorkoutPlan extends React.Component<IWorkoutPlanProps, {}> {
    render(): React.ReactElement<{}> {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
