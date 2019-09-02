interface ILog {
    TxData: string,
    address: string,
    blockHash: string,
    blockNumber: number,
    logIndex: number,
    removed: number,
    topics: string[],
    transactionHash: string,
    transactionIndex: number
}

interface IEvent {
    name: string,
    type: string,
    value: any
}

interface IDecodedLog extends ILog {
    events?: IEvent[],
    name?: string
}

interface IDecoded {
    name: string,
    value: any,
    type: string
}

interface IInput {
    name: string,
    type: string,
    components?: any
}

interface IOutput {
    name: string,
    type: string,
    components?: any
}

// reference: https://solidity.readthedocs.io/en/latest/abi-spec.html#json
export interface IABIItem {
    type?: string,
    name?: string,
    inputs?: IInput[],
    outputs?: IOutput[],
    stateMutability?: string,
    payable?: boolean,
    constant?: boolean
}

export type ILogs = ILog[];

export type IDecodedLogs = IDecodedLog[];

export type IDecodeds = IDecoded[];

export type IABI = IABIItem[];
