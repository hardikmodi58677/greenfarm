import React, { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Linking, Modal, View, Text, TouchableHighlight } from "react-native";
import Screen from "../components/Screen";
import VideoCard from "../components/VideoCard";
import colors from "../config/colors";
import { useDispatch, useSelector } from "react-redux";
import { getUserVideos } from "../actions/user"
import { showMessage } from "react-native-flash-message";
import { FloatingAction } from "react-native-floating-action";
import ListItemDeleteAction from "../ListItemDeleteAction";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import * as Yup from "yup";
import AppButton from "../components/AppButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"







export default function VideosScreen({ navigation, role }) {
    const [videoList, setVideoList] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)
    const { resMessage = "", resStatus, videos } = userState
    const prevProps = useRef({ resMessage, videos }).current
    const [modalVisible, setModalVisible] = useState(false);
    const [floatingBtnVisible, setFloatingBtnVisible] = useState(true);





    const videoRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/
    const validationSchema = Yup.object().shape({
        videoUrl: Yup.string().matches(videoRegex, 'Video url is invalid.').required().label("video url")
    });

    const [formikActions, setFormikActions] = useState(null)





    const handleDelete = (videoKey) => {
        dispatch(deleteVideo(videoKey))
    };


    useEffect(() => {
        if (modalVisible) {
            setFloatingBtnVisible(false)
        }
    }, [modalVisible])


    useEffect(() => {
        setLoading(true)
        dispatch(getUserVideos())
    }, [])

    useEffect(() => {
        if (prevProps.videos !== videos) {
            if (videos && videos.length) {
                setVideoList(videos)
                setLoading(false)
            }
        }

        return () => {
            prevProps.videos = videos
        }
    }, [videos])

    useEffect(() => {
        if (prevProps.resMessage !== resMessage) {
            if (resMessage && !resStatus) {
                setLoading(false)
                showMessage({ message: resMessage, duration: 2000, type: "danger" })
            }
        }
        return () => {
            prevProps.resMessage = resMessage
        }
    }, [resMessage, resStatus])


    return (
        <Screen style={styles.screen}>
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
                data={videoList}
                keyExtractor={data => data.url}
                renderItem={({ item }) => {
                    return (
                        <VideoCard
                            title={item.title}
                            subtitle={item.description}
                            creator={item.creator}
                            thumbnail={item.thumbnail}
                            onPress={async () => await Linking.openURL(item.url)}
                            renderRightActions={role === "admin" ? () => (<ListItemDeleteAction onPress={() => handleDelete(item.key)} />) : null}
                        />
                    )
                }}
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true)
                    dispatch(getUserVideos())
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
                                        onSubmit={async ({ videoUrl }, actions) => {
                                            console.log("videoUrl", videoUrl)
                                            setFormikActions(actions)
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
                                            <AppButton title="Cancel" onPress={() => setModalVisible(!modalVisible)} style={{ ...styles.buttonStyle, backgroundColor: colors.danger }} />
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
        paddingVertical: 10,
        paddingHorizontal: 10,
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
        backgroundColor: colors.secondary,
        borderRadius: 20,
        padding: 10,
        elevation: 7,
    },
});
