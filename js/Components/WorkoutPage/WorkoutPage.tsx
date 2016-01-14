
import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPage.module.less");
/* tslint:enable:no-any */

export default class WorkoutPage extends React.Component<{}, {}> {

    render(): React.ReactElement<{}> {
        return <div className={styles.container}>
                Start Workout!
            </div>;
    }

}
