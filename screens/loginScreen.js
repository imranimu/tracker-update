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
    AsyncStorage, 
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';

export default class LoginScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            Loader: false,
            WrongMassage: ''
        };
    }

    onLogin() {

        this.setState({Loader : true })

        const { phone, password } = this.state;
  
        const { navigate } = this.props.navigation;

        if(phone && password ){

            let data = JSON.stringify({
                phone: phone,
                password: password
            })

            axios.post('https://tracking-service.kpstone.org/api/v1/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                } 
            }).then(res => {                

                console.log(res.data);

                const access_token = res.data.results.access_token;
                const name = res.data.results.name;
                const phone = res.data.results.phone;

                this.setState({Loader : false })

                AsyncStorage.setItem('access_token', access_token)
                AsyncStorage.setItem('name', name)
                AsyncStorage.setItem('phone', phone) 

                navigate('Home')

            }).catch(error => {

                console.log( error );

                this.setState({ WrongMassage: 'Phone or Password is incorrect' });   

                this.setState({Loader : false })     
               
            });

        }else{

            this.setState({Loader : false })

            this.setState({ WrongMassage: 'All Fields are required.' });
        }
    }    

    render() {
        const ShowingLoader = <View style={styles.LoadingIcon}><ActivityIndicator size="large" color="black" /></View>;
        const HideLoader = <Text></Text>;

        return (
            <>                
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.2)" barStyle="light-content"/>
                <View style={styles.headerWrap}>
                    <Text style={styles.mainTitle}>LOGIN</Text>
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
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                placeholder={'Password'}
                                secureTextEntry={true}                        
                                style={styles.input}
                            />  
                            <View style={styles.fixToText}>
                                <TouchableHighlight
                                    style={styles.ButtonStyle}
                                    onPress={this.onLogin.bind(this)}
                                    underlayColor='#fff'>
                                    <Text style={styles.ButtonText}>LOGIN</Text>
                                </TouchableHighlight>                                 
                            </View>                            
                            <View>
                                { this.state.Loader ? ShowingLoader : HideLoader }                      
                            </View> 
                        </View>
                    </KeyboardAvoidingView>
                    <View style={styles.FooterWrap}>
                        <View style={styles.fixToText}>                                
                            <TouchableHighlight style={styles.TextWrap} onPress={() => this.props.navigation.navigate('Register')} >
                                <Text style={styles.NormalText}>Don't have an account? Sign up</Text>
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

var ButtonTextSize = 16;

if (PixelRatio.get() <= 2) {     
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