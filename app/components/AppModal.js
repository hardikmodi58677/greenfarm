import React, { useState } from 'react'
import { StyleSheet, FlatList, Modal, View, StatusBar, Alert, Switch, Text, TouchableHighlight } from "react-native";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import AppButton from "../components/AppButton";
import { getMessageList, sendMessage, clearResMessage } from "../actions/admin"
import colors from "../config/colors";
import * as Yup from "yup";



const AppModal = ({ visible, setIsVisible, renderSwitch = () => null, onSubmit, validationSchema, formFields, buttons }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setIsVisible(!visible)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <AppForm
                        initialValues={Object.keys(validationSchema).reduce((acc, val) => { acc[val] = ""; return acc }, {})}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        {
                            formFields.map(props => <AppFormField key={props.name} {...props} />)
                        }
                        {renderSwitch()}
                        <View style={styles.buttonContainer}>
                            <SubmitButton title={buttons?.btn1?.title} style={styles.buttonStyle} />
                            <AppButton title={buttons?.btn2?.title} onPress={() => setIsVisible(!visible)} style={{ ...styles.buttonStyle, backgroundColor: colors.danger }} />
                        </View>
                    </AppForm>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({


    modal: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200
    },
    container: {
        padding: 18,
        marginTop: StatusBar.currentHeight
    },
    detailsContainer: {
        padding: 20,
    },
    price: {
        color: colors.secondary,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 7,
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
    },
    userContainer: {
        marginVertical: 30
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    floatingBtn: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 40,
        backgroundColor: colors.primary,
        borderRadius: 100,
    },
    modalView: {
        margin: 25,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonContainer: {
        display: "flex",
        width: "90%",
        justifyContent: "space-evenly",
        flexDirection: "row"
    },
    buttonStyle: {
        width: "50%",
        margin: 20,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        padding: 10,
        elevation: 7,
    },


});



export default AppModal
