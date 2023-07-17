import React, { Component } from 'react';
import {View, Text, Button, Platform} from 'react-native';

import BackgroundTimer from "react-native-background-timer";

class testScreen extends Component {

    //static defaultProps: any

    constructor(props) {
        super(props);
        this.state = {
            second: 0,
            _interval: ''
        };
    }

    //_interval: any;
    componentDidMount = () => {        
        this.onStart();
    }

    onStart = () => {

        /*if (Platform.OS =="ios") {
            BackgroundTimer.start();
        }*/    

        this._interval = BackgroundTimer.setInterval(() => {
            this.setState({
                second: this.state.second + 1,
            })
        },1000);
    }

    render() {
        return (
            <View>
                <Text>Test Timer</Text>                
                <Text>{this.state.second}</Text>
            </View>
        );
    }
}

export default testScreen;
