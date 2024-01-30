import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const VideoCall = () => {
  const navigate = useNavigate()
  const { roomId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const myMeeting = async (element) => {
    const appID = 1580878491;
    const serverSecret = "c462dc632446b5a3084cef520a32e95a";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userInfo.id,
      userInfo.fullName
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom:()=>{navigate("/messages")},
      showScreenSharingButton: false,
      showPreJoinView:false,
    });
  };
  return <div><div ref={myMeeting}/></div>;
};

export default VideoCall;
