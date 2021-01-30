import React, { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Linking, Modal, View, TouchableHighlight } from "react-native";
import Screen from "../components/Screen";
import VideoCard from "../components/VideoCard";
import colors from "../config/colors";
import { useDispatch, useSelector } from "react-redux";
import { addVideo, deleteVideo, getVideos, clearResMessage } from "../actions/admin"
import { showMessage } from "react-native-flash-message";
import ErrorMessage from "../components/forms/ErrorMessage";
import ListItemDeleteAction from "../ListItemDeleteAction";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import * as Yup from "yup";
import AppButton from "../components/AppButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"




export default function VideosScreen({ navigation, role }) {
    const [list, setList] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch()
    const userState = useSelector(state => state.admin)
    const { resMessage = "", resStatus, videoList } = userState
    const prevProps = useRef({ resMessage, videoList }).current
    const [modalVisible, setModalVisible] = useState(false);

    const videoRegex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const validationSchema = Yup.object().shape({
        videoUrl: Yup.string().matches(videoRegex, 'Video url is invalid.').required().label("Video url")
    });




    const handleDelete = (videoKey) => {
        setLoading(true)
        dispatch(deleteVideo(videoKey))
    };

    useEffect(() => {
        setLoading(true)
        dispatch(getVideos())
    }, [])

    useEffect(() => {
        if (prevProps.videoList !== videoList) {
            if (videoList && videoList.length) {
                setList(videoList)
                setErrorMessage("")
                setLoading(false)
                dispatch(clearResMessage())
            }
            else {
                setList([])
                setLoading(false)
                setErrorMessage("No videos available.")
            }
        }
        return () => {
            prevProps.videoList = videoList
        }
    }, [videoList])


    useEffect(() => {
        if (prevProps.resMessage !== resMessage) {
            if (resMessage) {
                if (resStatus) {
                    showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
                    setLoading(false)
                    dispatch(clearResMessage())
                    if (modalVisible) {
                        setModalVisible(false)
                        dispatch(getVideos())
                    }
                }
                else {
                    setLoading(false)
                    showMessage({ message: resMessage, duration: 2000, type: "danger" })
                    dispatch(clearResMessage)
                }
            }
        }
        return () => {
            prevProps.resMessage = resMessage
        }

    }, [resMessage, resStatus])



    return (
        <Screen style={styles.screen}>
            {!!errorMessage && <ErrorMessage error={errorMessage} />}
            {
                loading && (
                    <Modal visible={loading} style={styles.modal} transparent>
                        <LottieView
                            loop={true}
                            autoPlay
                            source={require("../assets/animations/loader.json")}
                        />
                    </Modal>
                )
            }

            <FlatList
                showsVerticalScrollIndicator={false}
                data={list}
                keyExtractor={video => video.sKey}
                renderItem={({ item: video }) => {
                    return (
                        <VideoCard
                            title={video.sTitle}
                            subtitle={video.sDescription}
                            channelTitle={video.sChannelTitle}
                            thumbnail={video.sThumbnail}
                            onPress={async () => await Linking.openURL(video.sUrl)}
                            renderLeftActions={role === "admin" ? () => (<ListItemDeleteAction style={{ height: 150 }} onPress={() => handleDelete(video.sKey)} />) : null}
                        />
                    )
                }}
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true)
                    dispatch(getVideos())
                    setRefreshing(false)
                }}
            />

            {role === "admin" && (
                <Fragment>
                    <TouchableHighlight
                        style={styles.floatingBtn}
                        onPress={() => { setModalVisible(true); }}>
                        <MaterialCommunityIcons name="plus" size={40} />
                    </TouchableHighlight>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(!modalVisible)}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <AppForm
                                        initialValues={{ videoUrl: "" }}
                                        onSubmit={async ({ videoUrl }) => {
                                            ("videoUrl is", videoUrl)
                                            setLoading(true)
                                            dispatch(addVideo({ videoUrl }))
                                        }}
                                        validationSchema={validationSchema}
                                    >
                                        <AppFormField
                                            name="videoUrl"
                                            placeholder="Video url"
                                            iconName="link"
                                            keyboardType="default" //Only for ios
                                        />
                                        <View style={styles.buttonContainer}>
                                            <SubmitButton title="Add video" style={styles.buttonStyle} />
                                            <AppButton title="Cancel" onPress={() => setModalVisible(!modalVisible)} style={{ ...styles.buttonStyle, backgroundColor: colors.secondary }} />
                                        </View>
                                    </AppForm>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </Fragment>
            )

            }

        </Screen>);
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.light
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
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
    buttonContainer: {
        display: "flex",
        width: "90%",
        justifyContent: "space-evenly",
        flexDirection: "row"
    },
    buttonStyle: {
        width: "50%",
        margin: 20,
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 10,
        elevation: 7,
    },
});
