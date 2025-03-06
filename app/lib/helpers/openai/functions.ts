import { TransferFunction } from "./function"
import SessionManager from "./openCommunication"

export const toolFunctions = (SessionManager:SessionManager) => {


    return  [
        new TransferFunction(SessionManager).transferFunction
    ]
}