
import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPage.module.less");
/* tslint:enable:no-any */

import * as WorkoutStore from "../../Stores/WorkoutStore";

interface IWorkoutPageProps extends ReactRouter.RouteComponentProps<{}, {}> {
    children: React.ReactChildren;
}

interface IWorkoutPageState {
    workoutStatus: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPage extends React.Component<IWorkoutPageProps, IWorkoutPageState> {
    private store: WorkoutStore.WorkoutStore = WorkoutStore.default;
    private storeListenerId: string;

    constructor() {
        super();
        this.state = {
            workoutStatus: this.store.getCurrentWorkoutStatus()
        };
    }

    componentDidMount(): void {
        this.storeListenerId = this.store.addListener(() => this.onStoreChanged());
    }

    componentWillUnmount(): void {
        this.store.removeListener(this.storeListenerId);
    }

    render(): React.ReactElement<{}> {
        return      <div className={styles.container}>
                        {this.props.children}
                    </div>;
    }

    onStoreChanged(): void {
        this.setState({ workoutStatus: this.store.getCurrentWorkoutStatus() });
    }

}
