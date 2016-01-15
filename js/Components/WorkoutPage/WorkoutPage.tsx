
import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPage.module.less");
/* tslint:enable:no-any */

interface IWorkoutPageState {
    isStarted: boolean;
}

export default class WorkoutPage extends React.Component<{}, IWorkoutPageState> {

    constructor() {
        super();
        this.state = {
            isStarted: false
        };
    }

    render(): React.ReactElement<{}> {
        return      <div className={styles.container}> { this.state.isStarted ?
                        <span>Workout is started.</span> :
                        <button className="btn btn-lg btn-success" onClick={(e: React.MouseEvent) => this.onStartWorkoutClick(e)}>
                            <span className="glyphicon glyphicon-fire"></span> Start Workout
                        </button> }
                    </div>;
    }

    onStartWorkoutClick(e: React.MouseEvent): void {
        this.setState({ isStarted: true });
    }

}
