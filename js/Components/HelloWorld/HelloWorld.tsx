
import React = require('react');

var message = 'Hello world'

interface IHelloWorldProps {

}

interface IHelloWorldState {

}

class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {
    constructor() {
        super();
    }

    render() {
        return <div>
                <span>Hello world!</span>
            </div>
    }
}
