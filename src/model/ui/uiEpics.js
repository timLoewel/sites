/**
 * Created by tim on 16/03/17.
 */
import { combineEpics } from "redux-observable";
import cameraEpic from "./camera/cameraEpic";
import globalAlertEpic from "./globalAlertEpic";

export default combineEpics(cameraEpic, globalAlertEpic);
