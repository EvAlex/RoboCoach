
import React = require("react");
import ReactDOM = require("react-dom");
import {Link} from "react-router";

/* tslint:disable:no-unused-variable */
const styles: any = require("./NavbarLink.module.less");
/* tslint:enable:no-unused-variable */

export interface INavbarLinkProps extends ReactRouter.RouteComponentProps<{}, {}> {
    to: string;
    children?: React.ReactElement<{}>[];
}

interface INavbarLinkState {
    active: boolean;
}

export default class NavbarLink extends React.Component<INavbarLinkProps, INavbarLinkState> {

    constructor() {
        super();
        this.state = { active: false };
    }

    render(): React.ReactElement<{}> {
        return (
            <li className={ this.state.active ? "active" : "" }>
                <Link to={this.props.to} activeClassName="bs-link-active">
                    {this.props.children}
                </Link>
            </li>
        );
    }

    componentDidMount(): void {
        this.syncActiveState();
    }

    componentDidUpdate(prevProps: INavbarLinkProps, prevState: INavbarLinkState): void {
        this.syncActiveState();
    }

    private syncActiveState(): void {
        var li: Element = ReactDOM.findDOMNode(this),
            a: Element = li.getElementsByTagName("a")[0],
            isActive: boolean = a.classList.contains("bs-link-active");
        if (isActive !== this.state.active) {
            this.setState({ active: isActive });
        }
    }
}
