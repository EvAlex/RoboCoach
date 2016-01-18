/* tslint:disable */
import React = require("react");
/* tslint:enable */
import ReactDom = require("react-dom");
import {Router, Route, browserHistory} from "react-router";
import App from "./App";
import WorkoutPage from "./Components/WorkoutPage/WorkoutPage";
import WorkoutPlansPage from "./Components/WorkoutPlansPage/WorkoutPlansPage";
import WorkoutPlanDetails from "./Components/WorkoutPlansPage/WorkoutPlanDetails/WorkoutPlanDetails";
import NotFoundPage from "./Components/NotFoundPage/NotFoundPage";

ReactDom.render(<App />, document.getElementById("root"));

ReactDom.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="workout/:planId" component={WorkoutPage}/>
            <Route path="workout-plans" component={WorkoutPlansPage}>
                <Route path="/workout-plans/:planId" component={WorkoutPlanDetails}/>
            </Route>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>,
    document.getElementById("root"));
