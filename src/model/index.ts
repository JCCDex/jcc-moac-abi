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

interface IDecodedLog {
    address: string,
    events: IEvent[],
    name: string
}

export type ILogs = ILog[];

export type IDecodedLogs = IDecodedLog[];
