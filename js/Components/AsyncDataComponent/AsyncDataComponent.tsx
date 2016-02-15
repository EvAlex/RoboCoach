import React = require("react");

export abstract class AsyncDataComponent<TWrappedComponent extends React.Component<{}, {}>, TData> extends React.Component<{}, {}> {
    private wrappedComponent: TWrappedComponent;

    constructor(wrappedComponent: TWrappedComponent) {
        super();
        this.wrappedComponent = wrappedComponent;
    }

    abstract findAvailableData(): TData;

    abstract requestData(): void;

    abstract onDataMayBeAvailable(): void;

    render(): React.ReactElement<{}> {
        return this.wrappedComponent.render();
    }

    componentWillMount(): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentWillMount) {
            component.componentWillMount();
        }
    }

    componentDidMount(): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentDidMount) {
            component.componentDidMount();
        }
    }

    componentWillReceiveProps(nextProps: {}, nextContext: any): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentWillReceiveProps) {
            component.componentWillReceiveProps(nextProps, nextContext);
        }
    }

    shouldComponentUpdate(nextProps: {}, nextState: {}, nextContext: any): boolean {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.shouldComponentUpdate) {
            return component.shouldComponentUpdate(nextProps, nextState, nextContext);
        }
    }

    componentWillUpdate(nextProps: {}, nextState: {}, nextContext: any): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentWillUpdate) {
            return component.componentWillUpdate(nextProps, nextState, nextContext);
        }
    }

    componentDidUpdate(prevProps: {}, prevState: {}, prevContext: any): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentDidUpdate) {
            component.componentDidUpdate(prevProps, prevState, prevContext);
        }
    }

    componentWillUnmount(): void {
        var component: React.ComponentLifecycle<{}, {}> = this.wrappedComponent;
        if (component.componentWillUnmount) {
            component.componentWillUnmount();
        }
    }
}
