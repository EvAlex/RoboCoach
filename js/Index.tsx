/* tslint:disable */
import React = require("react");
/* tslint:enable */
import ReactDom = require("react-dom");
import {Router, Route} from "react-router";
import {createHistory} from "history";
import App from "./App";
import WorkoutPage from "./Components/WorkoutPage/WorkoutPage";
import WorkoutDetails from "./Components/WorkoutDetails/WorkoutDetails";
import WorkoutPlansPage from "./Components/WorkoutPlansPage/WorkoutPlansPage";
import WorkoutPlanDetails from "./Components/WorkoutPlansPage/WorkoutPlanDetails/WorkoutPlanDetails";
import CreateWorkoutPlan from "./Components/CreateWorkoutPlan/CreateWorkoutPlan";
import LoginPage from "./Components/LoginPage/LoginPage";
import NotFoundPage from "./Components/NotFoundPage/NotFoundPage";

ReactDom.render(
    <Router history={createHistory()}>
        <Route path="/" component={App}>
            <Route path="workout" component={WorkoutPage}>
                <Route path=":workoutId" component={WorkoutDetails}/>
            </Route>
            <Route path="workout-plans" component={WorkoutPlansPage}>
                <Route path="create" component={CreateWorkoutPlan}/>
                <Route path=":planId" component={WorkoutPlanDetails}/>
            </Route>
            <Route path="login" component={LoginPage} />
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>,
    document.getElementById("root"));
