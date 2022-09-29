import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }

  const rooms = readChatRoomsDB();

  //check if roomId exist
  const checkRoom = rooms.find((x) => x.roomId === roomId);
  if (!checkRoom)
    return res.status(404).json({ ok: false, message: "Invalid room id" });

  //check if messageId exist
  const checkMsg = checkRoom.messages.find((x) => {
    return x.messageId === messageId;
  });
  if (!checkMsg)
    return res.status(404).json({ ok: false, message: "Invalid message id" });

  //check if token owner is admin, they can delete any message

  if (user.isAdmin === false && user.username !== checkMsg.username)
    return res.status(403).json({
      ok: false,
      message: "You do not have permission to access this data",
    });

  if (user.isAdmin === true) {
    const deleted = checkRoom.messages.filter((x) => messageId !== x.messageId);
    checkRoom.messages = deleted;
    writeChatRoomsDB(rooms);
    return res.status(200).json({ ok: true });
  }

  if (user.username === checkMsg.username) {
    const deleted = checkRoom.messages.filter((x) => messageId !== x.messageId);
    checkRoom.messages = deleted;
    writeChatRoomsDB(rooms);
    return res.status(200).json({ ok: true });
  }
  //or if token owner is normal user, they can only delete their own message!
}
