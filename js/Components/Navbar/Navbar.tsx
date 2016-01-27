
import React = require("react");
import {Link, IndexLink} from "react-router";
import NavbarLink from "./NavbarLink/NavbarLink";

/* tslint:disable:no-unused-variable */
const styles: any = require("./Navbar.module.less");
/* tslint:enable:no-unused-variable */

export default class Navbar extends React.Component<{}, {}> {
    render(): React.ReactElement<{}> {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container-fluid">
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
                            <NavbarLink to="/workout-plans" />
                            <li className="active">
                                <Link to="/workout-plans">
                                    <span>Workout Plans</span>
                                </Link>
                            </li>
                        </ul>
                    </div>{/* /.navbar-collapse */}
                </div>{/* /.container-fluid */}
            </nav>

            );
    }
}
