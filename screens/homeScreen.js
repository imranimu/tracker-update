import React, { Component } from 'react';

import * as axios from 'axios';

import { 
    StyleSheet, 
    ActivityIndicator,
    Text, 
    View,  
    TouchableHighlight,
    PixelRatio,
    AsyncStorage,
    PermissionsAndroid,
    Image,
    StatusBar,
    Platform, 
    Dimensions
} from 'react-native';

import BackgroundTimer from "react-native-background-timer";

import Geolocation from '@react-native-community/geolocation';

export default class HomeScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            phone: '',
            name: '',
            currentLongitude: '',
            currentLatitude: '',
            success: '',
            second: 0,
            _interval: '',
            Quate: '',
            Author: '',
            Loader: false
        };
    }

    StoreData = async() =>{

        let token = await AsyncStorage.getItem('access_token')  
        let name = await AsyncStorage.getItem('name')  
        let phone = await AsyncStorage.getItem('phone')         
        let Quate = await AsyncStorage.getItem('Quate')
        let Author = await AsyncStorage.getItem('Author')      

        if(name && phone){
            this.setState({token: token, name: name, phone: phone, Quate: Quate, Author: Author })
        }         
    }

    componentDidMount(){ 

        this.StoreData() 
    }

    SetCustomTimer(){

        this.GetLocation(this)         

        this._interval = BackgroundTimer.setInterval(() => {

            this.GetLocation(this)

            this.setState({
                second: this.state.second + 1,
            })

        },900000);
    }

    GetLocation(){
        
        var that =this;
        
        //Checking for the permission just after component loaded

        if(Platform.OS === 'ios'){
            
            this.callLocation(that);

        }else{
            async function requestLocationPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                        'title': 'Location Access Required',
                        'message': 'This App needs to Access your location'
                        }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        that.callLocation(that);                       

                    } else {

                        alert("Permission Denied");

                    }
                } catch (err) {
                    alert("err",err);
                    console.warn(err)
                }
            }
            requestLocationPermission();    
        }
    }

    callLocation(that){
        //alert("callLocation Called");
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                that.setState({ currentLongitude:currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                that.setState({ currentLatitude:currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text

                that.callApi(currentLongitude, currentLatitude);   
            },

            (error) => alert(error.message),

            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        that.watchID = Geolocation.watchPosition((position) => {
            //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            
            //getting the Latitude from the location json
            
            that.setState({ currentLongitude:currentLongitude });
            
            //Setting state Longitude to re re-render the Longitude Text
            
            that.setState({ currentLatitude:currentLatitude });
            //Setting state Latitude to re re-render the Longitude Text

            that.callApi(currentLongitude, currentLatitude);  
        });    
    }

    componentWillUnmount = () => {
        Geolocation.clearWatch(this.watchID);
    }

    callApi(currentLongitude, currentLatitude){
        
        let Token = this.state.token
        let Longitude = currentLongitude
        let Latitude = currentLatitude
        
        if(Token && Longitude && Latitude){

            this.setState({Loader : true })

            let data = JSON.stringify({
                latitude: Latitude,
                longitude: Longitude
            })

            axios.post('https://tracking-service.kpstone.org/api/v1/location', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer '+Token
                } 
            }).then(res => {                

                console.log(res.data);   

                var massage = 'Congtras, you are all set.';
                
                this.setState({Loader : false, success: massage })

                this.GetApiUserData()                

            }).catch(error => {

                console.log( error );

                this.setState({Loader : false })

            });
        } 
    }

    LogOut(){           
        AsyncStorage.setItem('access_token', '')
        AsyncStorage.setItem('name', '')
        AsyncStorage.setItem('phone', '')           
        AsyncStorage.setItem('Quate', '')           
        AsyncStorage.setItem('Author', '') 
        this.props.navigation.navigate('Login')      
    }

    GetApiUserData(){

        this.setState({Loader : true })        

        axios.get('https://favqs.com/api/qotd', {
            headers: {
                'Content-Type': 'application/json', 
            } 
        }).then(res => {                

            console.log(res.data);  

            var Quate = res.data.quote.body

            var Author = res.data.quote.author

            AsyncStorage.setItem('Quate', Quate) 
            AsyncStorage.setItem('Author', Author)

            this.setState({Loader : false, Quate: Quate, Author: Author })

        }).catch(error => {

            console.log( error );

            this.setState({Loader : false })
        });
    }

    render() {
        
        const ShowingLoader = <View style={styles.LoadingIcon}><ActivityIndicator size="large" color="black" /></View>;
        const HideLoader = <Text></Text>;        
        return (  
            <>          
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.1)" barStyle="dark-content"/>                 

                {this.state.Author ? <> 
                    <View style={styles.QuateWrap}>
                        <Image
                            source={
                            __DEV__
                                ? require('../assets/002.png')
                                : require('../assets/002.png')
                            }
                            style={styles.QuateImage}
                        />
                        
                        <Text style={styles.QuateTitle}>Quote to Inspire</Text> 

                        <Text style={styles.QuateBody}>"{this.state.Quate}"</Text> 

                        {/* <Text style={styles.contentText}>{this.state.second}</Text>

                        <View style={styles.fixToText}>          
                            <TouchableHighlight onPress={() => { this.LogOut(); }}>
                                <View style={styles.ButtonStyle}>                   
                                    <Text style={styles.ButtonText}>Log Out</Text>
                                </View>
                            </TouchableHighlight>
                        </View>*/}
                    </View> 
                    <Text style={styles.QuateAuthor}>- {this.state.Author}</Text>
                    </> : 
                    <>
                        <Text style={styles.TitleText}>Welcome to KPS Tracker</Text>

                        <Text style={styles.contentText}>{this.state.name}</Text>  

                        {/* <Text style={styles.contentText}>{this.state.second}</Text> */}

                        {this.state.success ? 
                            <Text style={styles.successMessage}>{this.state.success}</Text> : <Text></Text>
                        }

                        {/* {this.state.currentLongitude ? 
                            <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
                                Longitude: {this.state.currentLongitude}
                            </Text> : <Text></Text>
                        }

                        {this.state.currentLatitude ? 
                        <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
                            Latitude: {this.state.currentLatitude}
                        </Text> : <Text></Text>
                        } */}

                        <View style={styles.fixToText}>
                            <TouchableHighlight
                                style={styles.ButtonStyle}
                                onPress={this.SetCustomTimer.bind(this)}                                                
                                underlayColor='#fff'>
                                <Text style={styles.ButtonText}>START</Text>
                            </TouchableHighlight>
                        </View>

                        {/* <View style={styles.fixToText}>
                            <TouchableHighlight
                                style={styles.ButtonStyle}
                                onPress={this.GetApiUserData.bind(this)}
                                underlayColor='#fff'>
                                <Text style={styles.ButtonText}>User Data</Text>
                            </TouchableHighlight>
                        </View> */}

                        {/* <View style={styles.fixToText}>          
                            <TouchableHighlight onPress={() => { this.LogOut(); }}>
                                <View style={styles.ButtonStyle}>                   
                                    <Text style={styles.ButtonText}>Log Out</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View style={styles.fixToText}>          
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('TestScreen')}>
                                <View style={styles.ButtonStyle}>                   
                                    <Text style={styles.ButtonText}>Test Screen</Text>
                                </View>
                            </TouchableHighlight>
                        </View> */}

                        <View>
                            { this.state.Loader ? ShowingLoader : HideLoader }                      
                        </View>
                    </>
                }
            </View>

            {this.state.Author ? 
                <View style={styles.FooterSection}>                    
                    
                    { this.state.Loader ?                        
                        <ActivityIndicator size="large" color="black" />
                        : 
                        <TouchableHighlight onPress={() => { this.GetApiUserData(); }}>
                            <Image 
                                source={
                                __DEV__
                                    ? require('../assets/003.png')
                                    : require('../assets/003.png')
                                }
                                style={styles.RefreshIcon}
                            />
                        </TouchableHighlight> 
                    }
                </View>   : 
                HideLoader
            }
            </>
        );
    }
}
 
var FullWidth = Dimensions.get('window').width - 40;
var MainTitleSize = 40;
var ButtonStyleWidth = 185; 
var ButtonTextSize = 16;

if (PixelRatio.get() <= 2) { 
    MainTitleSize = 32;
    ButtonStyleWidth = 165;
    ButtonTextSize = 16; 
}
const styles = StyleSheet.create({         
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },  
    QuateTitle:{
        fontSize: 24, 
        marginBottom: 20,
    },
    QuateImage:{
        marginBottom: 20,
        width: 80,
        height: 80,
    },
    QuateWrap:{
        paddingHorizontal: 40,
        alignItems: 'center',        
    },
    QuateBody:{
        textAlign: "center",
        fontSize: 20,
        lineHeight: 30,
        marginBottom: 20
    },
    QuateAuthor:{
        fontSize: 18,
        color: "#e75e5c",
        fontStyle: "italic",
        width: "80%",
        textAlign: "right"
    },
    FooterSection:{
        justifyContent: "center", 
        alignItems: "center",
        marginBottom: 15
    },
    RefreshIcon:{
        width: 35,
        height: 35,        
    },
    TitleText:{
        fontSize: 22,
        fontFamily: "Blob",
        marginBottom: 20
    },
    contentText:{
        fontSize: 18,
        marginBottom: 10
    },
    fixToText:{
        marginTop: 20,
    },
    ButtonStyle:{    
        backgroundColor: "#e75e5c",    
        width: ButtonStyleWidth,                
        paddingHorizontal: 30,
        paddingVertical: 12,    
        borderRadius: 10,  
    },
    ButtonText:{
        color: "#fff",
        fontSize: ButtonTextSize,
        textAlign: "center",
    },
    LoadingIcon:{  
        bottom: 40,  
        width: FullWidth,  
        justifyContent: 'center',
        alignItems: 'center',        
        zIndex: 9999      
    },
    LoadingImage:{
        height: 100,
        width: 100,     
    },
    successMessage:{
        color: "green",
        fontSize: 18
    }
})