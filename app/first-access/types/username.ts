import React, { SetStateAction } from "react";
import IFirstAccess from "./firstAccess";

export default interface IUsername {
    payload: IFirstAccess;
    setPayload: React.Dispatch<SetStateAction<IFirstAccess>>;
}
