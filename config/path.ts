
export enum ENetConf {
    //REST = 'https://z3.shneuro.cn:36021',//192.168.2.168
    REST = 'http://192.168.2.103:5000',
    REST2 = 'http://192.168.2.103:8080',
    FILE = 'http://127.0.0.1:6600',
    // REST = 'http://122.112.251.186:6601', 
    // FILE = 'http://122.112.251.186:6600',
    ASSET = 'http://127.0.0.1:8008',

    PORT = 6600,
    SSLPORT = 443
}

export const _url = (path: EDataPath) => {
    return ENetConf.REST + path;
};
export const _storageurl = (path: string) => { 
    return ENetConf.FILE + '/storage/' + path;
};

export enum EDataPath {
    UPLOAD = '/upload',
    QUERY = '/query',
    SEARCH = '/search'
}

export class UseCase {
}
