
import React = require("react");
/* tslint:disable:no-unused-variable */
const styles: any = require("./LoginPage.module.less");
/* tslint:enable:no-unused-variable */
import dispatcher from "../../Dispatcher/Dispatcher";
import * as AuthActions from "../../Actions/AuthActions";
import UserStore from "../../Stores/UserStore";

interface ILoginPageState {
}

export default class LoginPage extends React.Component<{}, ILoginPageState> {
    private userStoreListenerId: string;

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount(): void {
        this.userStoreListenerId = UserStore.addListener(() => this.onUserStoreChanged());
    }

    componentWillUnmount(): void {
        UserStore.removeListener(this.userStoreListenerId);
    }

    render(): React.ReactElement<{}> {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        { this.isLoggedInWithFacebook()
                            ? (
                                <h3>You are logged in with Facebook.</h3>)
                            : (
                                <button className="btn btn-lg btn-default"
                                    onClick={() => this.onLoginWithFacebookClicked() }>
                                    Log in with Facebook
                                </button>) }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        { this.isLoggedInWithGoogle()
                            ? (
                                <h3>You are logged in with Google.</h3>)
                            : (
                                <button className="btn btn-lg btn-default"
                                    onClick={() => this.onLoginWithGoogleClicked() }>
                                    Log in with Google
                                </button>) }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        { this.isLoggedInWithTwitter()
                            ? (
                                <h3>You are logged in with Twitter.</h3>)
                            : (
                                <button className="btn btn-lg btn-default"
                                    onClick={() => this.onLoginWithTwitterClicked() }>
                                    Log in with Twitter
                                </button>) }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        { this.isLoggedInWithGithub()
                            ? (
                                <h3>You are logged in with Github.</h3>)
                            : (
                                <button className="btn btn-lg btn-default"
                                    onClick={() => this.onLoginWithGithubClicked() }>
                                    Log in with Github
                                </button>) }
                    </div>
                </div>
            </div>
        );
    }

    private onUserStoreChanged(): void {
        this.forceUpdate();
    }

    private onLoginWithFacebookClicked(): void {
        dispatcher.dispatch(new AuthActions.LogInAction(AuthActions.AuthProvider.Facebook));
    }

    private isLoggedInWithFacebook(): boolean {
        return UserStore.isLoggedInWith(AuthActions.AuthProvider.Facebook);
    }

    private onLoginWithGoogleClicked(): void {
        dispatcher.dispatch(new AuthActions.LogInAction(AuthActions.AuthProvider.Google));
    }

    private isLoggedInWithGoogle(): boolean {
        return UserStore.isLoggedInWith(AuthActions.AuthProvider.Google);
    }

    private onLoginWithTwitterClicked(): void {
        dispatcher.dispatch(new AuthActions.LogInAction(AuthActions.AuthProvider.Twitter));
    }

    private isLoggedInWithTwitter(): boolean {
        return UserStore.isLoggedInWith(AuthActions.AuthProvider.Twitter);
    }

    private onLoginWithGithubClicked(): void {
        dispatcher.dispatch(new AuthActions.LogInAction(AuthActions.AuthProvider.Github));
    }

    private isLoggedInWithGithub(): boolean {
        return UserStore.isLoggedInWith(AuthActions.AuthProvider.Github);
    }
}
