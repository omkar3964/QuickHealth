import React, { useContext, useEffect, useRef, useState } from "react";
import { TextField, Badge } from '@mui/material';
import Button from '@mui/material/Button';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import FullscreenExitSharpIcon from '@mui/icons-material/FullscreenExitSharp'
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp'
import ChatIcon from '@mui/icons-material/Chat'
import io from "socket.io-client";
// import styles from "../styles/timepass.module.css"
import { IconButton } from "@mui/material";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { DoctorContext } from "../context/DoctorContext.jsx";


var connections = {}
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}


const VideoComponent = () => {
    const videoRef = useRef([])

    var socketRef = useRef()

    let socketIdRef = useRef()

    let localVideoRef = useRef()

    let [videoAvailable, setVideoAvailable] = useState(true)

    let [audioAvailable, setAudioAvailable] = useState(true)

    let [video, setVideo] = useState([])

    let [audio, setAudio] = useState(true)

    let [screen, setScreen] = useState(false)

    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("hi..");

    let [newMessages, setNewMessages] = useState(0);

    // let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");


    let [videos, setVideos] = useState([])

    const messagesEndRef = useRef(null);

    const [controlsVisible, setControlsVisible] = useState(true);

    let inactivityTimeout = useRef(null);

    const { backendUrl, profileData } = useContext(DoctorContext)



    // for expand and compress screen
    const [expandedId, setExpandedId] = useState(null);
    const toggleExpand = (socketId) => {
        setExpandedId(prev => (prev === socketId ? null : socketId));
    };



    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (stream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

                window.localStream = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            }
        } catch (error) {
            console.log("Permission error:", error);
            setVideoAvailable(false);
            setAudioAvailable(false);
            setScreenAvailable(false);
        }
    };


    const getUserMediaSuccess = (stream) => {

        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.log(error)
        }
        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false)
            setAudio(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())

            } catch (e) {
                console.log(e)
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silance()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        }).catch(e => console.log(e))
                })
            }
        })
    }
    let silance = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()

        let dst = oscillator.connect(ctx.createMediaStreamDestination())

        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })

        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }
        }
    }


    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }


    };

    let connectToSocketServer = () => {

        socketRef.current = io(backendUrl, { transports: ['websocket'], reconnection: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            // console.log("on true", socketRef.current);
            const meetingCode = window.location.pathname.split("/").pop();
            socketRef.current.emit("join-call", meetingCode);
            // socketRef.current.emit("join-call", window.location.href)


            socketIdRef.current = socketRef.current.id
            socketRef.current.on("chat-message", addMessage)

            socketRef.current.on("user-left", (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on("user-joined", (id, clients) => {
                // console.log(id, clients)
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        // console.log("new", id)
                        if (event.candidate != null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId)
                        // console.log("before", videos, videoExists)

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video)
                                videoRef.current = updatedVideos
                                return updatedVideos
                            })
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo]
                                videoRef.current = updatedVideos
                                return updatedVideos
                            })

                        }
                    }
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    }
                    else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silance()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)

                    }
                    if (socketIdRef.current === id) {
                        connections[socketListId].createOffer()
                            .then(offer => connections[socketListId].setLocalDescription(offer))
                            .then(() => {
                                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'sdp': connections[socketListId].localDescription }));
                            })
                            .catch(e => console.error("Offer error", e));
                    }
                })


            })


        })
    }

    let getMedia = () => {
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer()
    }
    let connect = async () => {
        // setAskForUsername(false);

        await getPermissions(); // ensure we set up local video before socket


        getMedia()
    };
    let handelVideo = () => {
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled; // toggle the actual video track
            });
            setVideo(window.localStream.getVideoTracks()[0].enabled); // update UI state
        }
    }
    let handelAudio = () => {
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled; // toggle the actual audio track
            });
            setAudio(window.localStream.getAudioTracks()[0].enabled); // update UI state
        }
    }


    let getDislayMediaSuccess = (stream) => {
        // console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silance()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }



    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia()
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen)
    }
    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username)
        setMessage("")
    }
    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showModal])

    let handleModal = () => {
        setModal(!showModal)
        setNewMessages(0)
    }

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            // getMedia()
        }
    }, [audio, video])



    useEffect(() => {
        getPermissions()
        setUsername(profileData.name)
        connect()
    }, [])// think

    // for display button container when move 


    useEffect(() => {
        const showControls = () => {
            setControlsVisible(true);
            clearTimeout(inactivityTimeout.current);
            inactivityTimeout.current = setTimeout(() => setControlsVisible(false), 3000); // hide after 3s
        };

        // Events to trigger visibility
        const events = ['mousemove', 'mousedown', 'touchstart', 'keydown'];
        events.forEach(event => window.addEventListener(event, showControls));

        return () => {
            events.forEach(event => window.removeEventListener(event, showControls));
            clearTimeout(inactivityTimeout.current);
        };
    }, []);


    // from chatgpt
    useEffect(() => {
        videos.forEach(video => {
            const el = videoRef.current[video.socketId];
            if (el && el.srcObject !== video.stream) {
                el.srcObject = video.stream;
            }
        });
    }, [videos]);



    return (



        // working
        <div className="w-screen h-screen bg-blue-500 flex flex-col overflow-hidden">

            <div className="relative w-full h-full ">
                {showModal && (
                    <div
                        className={`z-50 bg-white border-black   shadow-xl flex flex-col rounded-2xl md:rounded-xl fixed md:absolute right-0 top-0 md:top-2 md:bottom-2 md:right-2 w-full h-full md:w-[30vw] md:h-[96%] transition-all duration-300`}    >
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-blue-400 text-white rounded-2xl md:rounded-t-xl">
                            <h2 className="font-semibold text-lg">Chat</h2>
                            <span className="text-sm">{videos.length} Participants</span>
                            <button onClick={handleModal} className="md:hidden text-white font-bold text-lg"   >  ✕     </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                            {messages.length > 0 ? (messages.map((item, index) => (
                                <div key={index} className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow 
                                        ${item.sender === username
                                        ? 'bg-blue-400 text-white self-end ml-auto'
                                        : 'bg-gray-200 text-black self-start mr-auto'
                                    }`}
                                >
                                    <h6 className="text-xs italic mb-1 opacity-70">{item.sender}</h6>
                                    <p>{item.data}</p>
                                </div>
                            ))
                            ) : (
                                <p className="text-center text-gray-400 italic">No messages yet</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t flex gap-2 items-center bg-white rounded-2xl md:rounded-xl">
                            <TextField value={message} onChange={(e) => setMessage(e.target.value)} label="Type a message"
                                variant="outlined" size="small" fullWidth InputProps={{ classes: { root: 'rounded-full bg-gray-100' }, }}
                            />
                            <button onClick={sendMessage} className="text-blue-600 hover:text-blue-800 transition-colors" >    <SendOutlinedIcon />    </button>
                        </div>
                    </div>
                )}


                {(!showModal || window.innerWidth >= 768) && (
                    <div
                        className="z-50 absolute bottom-2 left-1/2 transform -translate-x-1/2  flex gap-4 transition-opacity duration-300        bg-black/50 backdrop-blur-md p-2 rounded-xl shadow-lg"
                        style={{ opacity: controlsVisible ? 1 : 0 }}
                    >
                        <IconButton onClick={handelVideo}>
                            {video ? <VideocamIcon className="text-white" /> : <VideocamOffIcon className="text-white" />}
                        </IconButton>

                        <IconButton onClick={handleEndCall}>
                            <CallEndIcon className="text-red-600" />
                        </IconButton>

                        <IconButton onClick={handelAudio}>
                            {audio ? <MicIcon className="text-white" /> : <MicOffIcon className="text-white" />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton onClick={handleScreen}>
                                {screen ? <ScreenShareIcon className="text-white" /> : <StopScreenShareIcon className="text-white" />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={999} color="primary">
                            <IconButton onClick={handleModal}>
                                <ChatIcon className="text-white" />
                            </IconButton>
                        </Badge>

                    </div>
                )}


                <video ref={localVideoRef} autoPlay muted className="absolute bottom-4 left-4 max-w-[40vw] max-h-[25vh] w-auto h-auto sm:max-w-[30vw] md:max-w-[25vw] lg:max-w-[20vw] rounded-xl object-contain shadow-lg" />

                <div className="rounded-3xl absolute top-0 left-0 m-1 h-[70%] p-2 overflow-y-auto transition-all duration-300 w-full md:w-[calc(100%-32vw)]"                >
                    <div className={`grid gap-4 auto-rows-fr ${videos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}                    >
                        {videos.map((video) => {
                            const isExpanded = expandedId === video.socketId;
                            const isHidden = expandedId && !isExpanded;

                            return (
                                <div
                                    key={video.socketId}
                                    className={`group relative bg-black rounded-xl overflow-hidden shadow-md aspect-video transition-all duration-300  ${isExpanded ? 'fixed z-40 inset-0 m-auto w-[90vw] h-[50vh] md:w-[70vw] md:h-[70vh] flex items-center justify-center' : ''} ${isHidden ? 'hidden' : ''}`}     >
                                    <video
                                        data-socket={video.socketId}
                                        ref={(el) => {
                                            if (el) videoRef.current[video.socketId] = el;
                                        }}
                                        autoPlay
                                        playsInline
                                        className={`w-full h-full  ${isExpanded ? 'object-contain bg-blue-500 ' : 'object-cover'
                                            }`}
                                    />
                                    <button
                                        onClick={() => isExpanded ? setExpandedId(null) : toggleExpand(video.socketId)}
                                        className="absolute top-2 right-8 text-white rounded p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        {isExpanded ? (<FullscreenExitSharpIcon />) : (<FullscreenSharpIcon />)}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>





            </div>
        </div>





    )
}
export default VideoComponent;