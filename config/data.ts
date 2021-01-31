
import { EDataPath, _url, UseCase, ENetConf } from './path';


export interface IResult {
    code : 'OK' | 'ERR' | 'OKWITHMORE';
    data ?: {[key : string] : any};
}

