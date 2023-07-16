import { ICommitInfo, ILastCommitByRemote } from ".";
import { StringUtils } from "../utils";

export interface IBranchDetails{
    _id:string;
    name:string;
    commits:ICommitInfo[];
    LastCommitsByRemotes:ILastCommitByRemote[];
    noDerivedCommits:boolean;
    parentCommit?:ICommitInfo;
    serial:number;
    y:number;
    maxRefCount:number;
    // Group uiObj;
}

export function createBranchDetailsObj(){
    const branchDetails:IBranchDetails={
        _id:StringUtils.uuidv4(),
        name:"",
        LastCommitsByRemotes:[],
        commits:[],
        noDerivedCommits:false,
        serial:0,
        y:0,
        maxRefCount:0,
    }
    return branchDetails;
}