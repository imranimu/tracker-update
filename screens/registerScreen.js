import React, { Component } from 'react';

import * as axios from 'axios';

import { 
    StyleSheet, 
    ActivityIndicator, 
    Text, 
    View, 
    TextInput, 
    Image, 
    TouchableHighlight,
    PixelRatio,
    Dimensions,
    StatusBar,
    AsyncStorage,
    ImageBackground,  
    KeyboardAvoidingView
} from 'react-native';

export default class RegisterScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            username: '',
            password: '', 
            confirmPass: '',
            Loader: false,
            WrongMassage: ''
        };
    }

    onClickRegister() {

        this.setState({Loader : true })

        const { username, password, phone, confirmPass } = this.state;
  
        const { navigate } = this.props.navigation;        

        if(username && password && phone && confirmPass){
            
            if(password == confirmPass ){

                let data = JSON.stringify({
                    name: username,
                    phone: phone,
                    password: password,
                    confirm_password: confirmPass                
                })

                //console.log(data);
                
                //this.setState({Loader : false })                        
                
                //navigate('Login')  
                
                axios.post('https://tracking-service.kpstone.org/api/v1/register', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    } 
                }).then(res => {    

                    console.log(res.data);   

                    this.setState({Loader : false, WrongMassage: '' }) 

                    navigate('Login')  

                }).catch(error => {

                    this.setState({ WrongMassage: 'The password must be at least 8 characters.' });   

                    this.setState({Loader : false })
                
                    console.log( error );

                });
                
            }else{
                
                this.setState({Loader : false })
                
                this.setState({ WrongMassage: 'Password and confirm password not match' });
            }

        }else{
            this.setState({Loader : false })

            this.setState({ WrongMassage: 'All Fields are required.' });
        }
    }

    StoreData = async() =>{
        
        let access_token = await AsyncStorage.getItem('access_token')        
        let name = await AsyncStorage.getItem('name')        
        let phone = await AsyncStorage.getItem('phone') 

        const { navigate } = this.props.navigation;

        if(access_token && name && phone){
            navigate('Home') 
        }         
    }

    componentDidMount(){ 
        this.StoreData()      
    }

    render() {

        const ShowingLoader = <View style={styles.LoadingIcon}><ActivityIndicator size="large" color="black"/></View>;

        const HideLoader = <Text></Text>;

        return (
            <>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.2)" barStyle="light-content"/>
                <View style={styles.headerWrap}>
                    <Text style={styles.mainTitle}>SIGNUP</Text>
                </View>
                <View style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : 'position'}>
                        <View style={styles.FromWrap}>
                            <TextInput
                                value={this.state.phone}
                                onChangeText={(phone) => this.setState({ phone })}
                                placeholder={'Phone'}
                                keyboardType={"phone-pad"}               
                                style={styles.input}
                            />

                            <TextInput
                                value={this.state.username}
                                onChangeText={(username) => this.setState({ username })}
                                placeholder={'Name'}             
                                style={styles.input}
                            />

                            <TextInput
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                placeholder={'Password'}
                                secureTextEntry={true}                        
                                style={styles.input}
                            />
                            <TextInput
                                value={this.state.confirmPass}
                                onChangeText={(confirmPass) => this.setState({ confirmPass })}
                                placeholder={'Confirm Password'}
                                secureTextEntry={true}                        
                                style={styles.input}
                            /> 
                            <View style={styles.fixToText}>
                                <TouchableHighlight
                                    style={styles.ButtonStyle}
                                    onPress={this.onClickRegister.bind(this)}
                                    underlayColor='#fff'>
                                    <Text style={styles.ButtonText}>SIGNUP</Text>
                                </TouchableHighlight>                                 
                            </View>                            
                            <View>
                                { this.state.Loader ? ShowingLoader : HideLoader }                      
                            </View> 
                        </View>
                    </KeyboardAvoidingView>
                    <View style={styles.FooterWrap}>
                        <View style={styles.fixToText}>                                
                            <TouchableHighlight style={styles.TextWrap} onPress={() => this.props.navigation.navigate('Login')} >
                                    <Text style={styles.NormalText}>Already have an account? Login</Text>
                                </TouchableHighlight>

                            { this.state.WrongMassage ? 
                                <Text style={styles.WrongMassage}>{this.state.WrongMassage}</Text> : 
                                <Text></Text> 
                            }
                        </View>     
                    </View>
                </View>            
            </>
        );
    }
}

var FullWidth = Dimensions.get('window').width - 40;
var ButtonStyleWidth = Dimensions.get('window').width - 80; 
var ButtonTextSize = 16;

if (PixelRatio.get() <= 2) { 
    MainTitleSize = 32; 
    ButtonTextSize = 16; 
}

const styles = StyleSheet.create({    
    headerWrap:{
        backgroundColor: "#e75e5c",  
    },    
    mainTitle:{
        paddingTop: 45,
        paddingBottom: 20,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22
    },  
    container:{
        flex: 1, 
        paddingHorizontal: 20,
        backgroundColor: "rgba(255,255,255,1)",
        justifyContent: "center"
    }, 
    TitleText:{
        fontSize: 22,
        fontFamily: "Blob",
        marginBottom: 20
    },
    ButtonStyle:{    
        backgroundColor: "#e75e5c",    
        width: '100%',                
        paddingHorizontal: 30,
        paddingVertical: 12,    
        borderRadius: 10,  
    },
    ButtonText:{
        color: "#fff",
        fontSize: ButtonTextSize,
        textAlign: "center",
    },
 
    fixToText:{ 
        marginTop: 10, 
        alignItems: 'center', 
    },
    FromWrap:{    
 
    },
    input:{
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        paddingHorizontal: 15, 
        marginBottom: 15,
        borderRadius: 10,
    },
    LoadingIcon:{ 
        position: "absolute",
        bottom: 5,          
        width: '100%',  
        justifyContent: 'center',
        alignItems: 'center',        
        zIndex: 9999      
    },
    LoadingImage:{
        height: 100,
        width:100,    
        flex: 1
    },
    WrongMassage:{
        color: "red",
        fontSize: 16,
        alignItems: 'center', 
    },
    TextWrap:{
        backgroundColor: 'transparent',
        marginBottom: 15,
    },
    NormalText:{
        backgroundColor: 'transparent',        
        fontSize: 17,
        color: "#e75e5c"
    }
})