import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const check = rooms.find((x) => x.roomId === roomId);
    if (check === undefined)
      return res.status(400).json({ ok: false, message: "Invalid room id" });

    //find room and return
    return res.status(200).json({ ok: true, messages: check.messages });
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const check = rooms.find((x) => x.roomId === roomId);
    if (check === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const addText = {
      messageId: uuidv4(),
      text: req.body.text,
      username: user.username,
    };

    check.messages.push(addText);
    writeChatRoomsDB(rooms);

    return res.status(200).json({
      ok: true,
      messages: addText,
    });
  }
}
