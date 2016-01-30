
import React = require("react");
/* tslint:disable:no-unused-variable */
const styles: any = require("./LoginPage.module.less");
/* tslint:enable:no-unused-variable */
import dispatcher from "../../Dispatcher/Dispatcher";
import * as AuthActions from "../../Actions/AuthActions";

export default class LoginPage extends React.Component<{}, {}> {
    render(): React.ReactElement<{}> {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <button className="btn btn-lg btn-default"
                                onClick={() => this.onLoginWithFacebookClicked()}>
                            Log in with Facebook
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private onLoginWithFacebookClicked(): void {
        dispatcher.dispatch(new AuthActions.LogInAction(AuthActions.AuthProvider.Facebook));
    }
}
