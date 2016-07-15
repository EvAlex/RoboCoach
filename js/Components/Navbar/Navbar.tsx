
import React = require("react");
import {IndexLink} from "react-router";
import NavbarLink from "./NavbarLink/NavbarLink";
import dispatcher from "../../Dispatcher/Dispatcher";
import * as AuthActions from "../../Actions/AuthActions";

/* tslint:disable:no-unused-variable */
const styles: any = require("./Navbar.module.less");
/* tslint:enable:no-unused-variable */

import UserStore from "../../Stores/UserStore";

interface INavbarState {
    user: IUser;
}

export default class Navbar extends React.Component<{}, INavbarState> {
    static height: number = 51;

    constructor() {
        super();
        this.state = { user: null };
    }

    componentDidMount(): void {
        UserStore.addListener(() => this.onUserStoreChanged());
        this.onUserStoreChanged();
    }

    render(): React.ReactElement<{}> {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    {/* Brand and toggle get grouped for better mobile display */}
                    <div className="navbar-header">
                        <button type="button"
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navbar-collapse"
                            aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <IndexLink className="navbar-brand" to="/">RoboCoach</IndexLink>
                    </div>
                    {/* Collect the nav links, forms, and other content for toggling */}
                    <div className="collapse navbar-collapse" id="navbar-collapse">
                        <ul className="nav navbar-nav">
                            <NavbarLink to="/workout-plans">
                                <span>Workout Plans</span>
                            </NavbarLink>
                        </ul>
                        {this.state.user
                            ? this.renderAuthPartForLoggedIn()
                            : this.renderAuthPartForNotLoggedIn() }
                    </div>{/* /.navbar-collapse */}
                </div>{/* /.container-fluid */}
            </nav>

        );
    }

    private renderAuthPartForLoggedIn(): React.ReactElement<{}> {
        return (
            <ul className="nav navbar-nav navbar-right">
                <NavbarLink to="/account" className={styles.accountLink}>
                    <div className={styles.profileImageWrap}>
                        <img className={styles.profileImage} src={this.getProfileImageUrl()} />
                    </div>
                    <span className={styles.profileDisplayName}>{this.getProfileDisplayName()}</span>
                </NavbarLink>
                <li>
                    <a href="javascript:void(0);" onClick={() => this.onLogoutClicked() }>
                        <span className="glyphicon glyphicon-log-out"></span>
                        <span> Log out</span>
                    </a>
                </li>
            </ul>
        );
    }

    private renderAuthPartForNotLoggedIn(): React.ReactElement<{}> {
        return (
            <ul className="nav navbar-nav navbar-right">
                <NavbarLink to="/login">
                    <span className="glyphicon glyphicon-log-in"></span>
                    <span> Log in</span>
                </NavbarLink>
            </ul>
        );
    }

    private getProfileImageUrl(): string {
        var res: string,
            authData = this.state.user.authData;
        return authData.photoURL;
    }

    private getProfileDisplayName(): string {
        var res: string,
            authData = this.state.user.authData;
        return authData.displayName;
    }

    private onLogoutClicked(): void {
        dispatcher.dispatch(new AuthActions.LogOutAction(this.state.user));
    }

    private onUserStoreChanged(): void {
        this.setState({ user: UserStore.getCurrentUser() });
    }
}
