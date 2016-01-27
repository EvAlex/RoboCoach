
import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-unused-variable */
const styles: any = require("./NavbarLink.module.less");
/* tslint:enable:no-unused-variable */

export interface INavbarLinkProps extends ReactRouter.RouteComponentProps<{}, {}> {
    to: string;
}

interface IRouter {
    replaceWith(path: string): void;
}

interface IRouterContext {
    router: IRouter;
}

interface ISomeOtherContext {
    somethingElse: any;
}

export default class NavbarLink extends React.Component<INavbarLinkProps, {}> {

    static contextTypes: any = {
        router: React.PropTypes.func.isRequired
    };

    context: IRouterContext & ISomeOtherContext;

    componentDidUpdate(): void {
        console.log("=========> ", this.props.route);
    }

    render(): React.ReactElement<{}> {
        return (
            <li>
                <Link to={this.props.to}>
                    <span>Workout Plans</span>
                </Link>
            </li>
        );
    }
}