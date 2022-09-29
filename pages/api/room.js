import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  } else {
    const chatrooms = readChatRoomsDB();

    return res.status(200).json({
      ok: true,
      rooms: chatrooms.map((room) => {
        return {
          roomId: room.roomId,
          roomName: room.roomName,
        };
      }),
    });
  }

  //create room data and return response
}
