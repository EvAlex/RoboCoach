/* tslint:disable */
import React = require("react");
/* tslint:enable */
import ReactDom = require("react-dom");
import {Router, Route, IndexRoute} from "react-router";
import {createHistory} from "history";
import App from "./App";
import WorkoutPage from "./Components/WorkoutPage/WorkoutPage";
import WorkoutDetails from "./Components/WorkoutDetails/WorkoutDetails";
import WorkoutPlansPage from "./Components/WorkoutPlansPage/WorkoutPlansPage";
import WorkoutPlan from "./Components/WorkoutPlansPage/WorkoutPlan/WorkoutPlan";
import WorkoutPlanDetails from "./Components/WorkoutPlansPage/WorkoutPlanDetails/WorkoutPlanDetails";
import CreateWorkoutPlanForm from "./Components/WorkoutPlansPage/CreateWorkoutPlanForm/CreateWorkoutPlanForm";
import EditWorkoutPlanForm from "./Components/WorkoutPlansPage/EditWorkoutPlanForm/EditWorkoutPlanForm";
import LoginPage from "./Components/LoginPage/LoginPage";
import NotFoundPage from "./Components/NotFoundPage/NotFoundPage";

ReactDom.render(
    <Router history={createHistory()}>
        <Route path="/" component={App}>
            <Route path="workout" component={WorkoutPage}>
                <Route path=":workoutId" component={WorkoutDetails} />
            </Route>
            <Route path="workout-plans" component={WorkoutPlansPage}>
                <Route path="create" component={CreateWorkoutPlanForm} />
                <Route path=":planId" component={WorkoutPlan}>
                    <IndexRoute component={WorkoutPlanDetails} />
                    <Route path="edit" component={EditWorkoutPlanForm} />
                </Route>
            </Route>
            <Route path="login" component={LoginPage} />
            <Route path="*" component={NotFoundPage} />
        </Route>
    </Router>,
    document.getElementById("root"));
