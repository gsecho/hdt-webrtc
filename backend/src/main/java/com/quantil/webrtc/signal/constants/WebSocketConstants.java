package com.quantil.webrtc.signal.constants;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/29 11:28
 */
public class WebSocketConstants {
    private WebSocketConstants(){
        throw new IllegalStateException("Utility class");
    }
    public static final String SERVER_ID = "0";

    public static final String TEST_CHANNEL = "/hello";

    public static final String USER_CHANNEL = "user/channel";
    public static final String CURRENT_MEETING = "currentMeeting";
    public static final String CMD_OFFER = "offer";
    public static final String CMD_SEND_OFFER = "reqSendOffer";
    public static final String CMD_ANSWER = "answer";
    public static final String CMD_CANDIDATE = "candidate";
    public static final String CMD_ENTER = "enter";
    public static final String CMD_LEAVE = "leave";
    public static final String CMD_CLOSE = "close";

    public static final String TOKEN = "token";
    public static final String ROOM_ID = "roomId";
    public static final String PASSWORD = "password";
    public static final String CLIENT_ID = "clientId";
    public static final String MEDIA_VIDEO = "video";
    public static final String MEDIA_AUDIO = "audio";

    public static final String UDP_PROTOCOL = "udp";
    public static final String TCP_PROTOCOL = "tcp";

    public static final int CANDIDATE_PROTOCOL = 2;
    public static final int CANDIDATE_IP = 4;
    public static final int CANDIDATE_PORT = 5;
    public static final int CANDIDATE_UFRAG_VALUE = 11;


}
