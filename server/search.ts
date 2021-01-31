import * as nodejieba from 'nodejieba';
import FlexSearch from 'flexsearch'
import * as path from 'path';
import { __colName, __db, __dbName } from "./db";

export class Search{
    index = null;
    count = 0;
    constructor(){
    }
    async init(){
        if(this.index) {
            return;
        }
        nodejieba.load({
            dict: path.relative(process.cwd(), path.resolve((nodejieba as any).DEFAULT_DICT)).replace(/\\/g,'/'),
            hmmDict: path.relative(process.cwd(), path.resolve((nodejieba as any).DEFAULT_HMM_DICT)).replace(/\\/g,'/'),
            userDict: path.relative(process.cwd(), path.resolve((nodejieba as any).DEFAULT_USER_DICT)).replace(/\\/g,'/'),
            idfDict: path.relative(process.cwd(), path.resolve((nodejieba as any).DEFAULT_IDF_DICT)).replace(/\\/g,'/'),
            stopWordDict: path.relative(process.cwd(), path.resolve((nodejieba as any).DEFAULT_STOP_WORD_DICT)).replace(/\\/g,'/')
        });
        this.index = FlexSearch.create({
            encode: false,
            tokenize: function(str){
                return nodejieba.cutForSearch(str);
            },
            doc: {
                id: "id",
                field: ["solution" , "tagStr", 'content'], 
            }
        })
        /* let solns = await __db.find(__dbName.PLANS, __colName.SOLUTIONS, {}, {id:1, schedid:1, planid:1, solution:1, curr:1, tags:1, datatime:1});
        if(solns.length) {
            solns = solns.map(e=>({...e, ...{end:__planner.isScheduleEnd(e.planid, e.curr)}}));
            solns = groupBy(solns, 'schedid',  (item, sublist) => {
                return item.datatime.getTime() - sublist[0].datatime.getTime() > 0;
            });
        }
        let postSolns = Object.values(solns).map((e:any)=>({id:e[e.length-1].schedid,solution:e[e.length-1].solution,tags:e[e.length-1].tags && e[e.length-1].tags.join ? e[e.length-1].tags.map(e=>e.name).join(',') : e[e.length-1].tags,datatime:e[e.length-1].datatime})); */
        let solns = await __db.find(__dbName.PLANS, __colName.ARTICLES, {flag:{$in:['show','top']}}, {id:1, userid:1, solution:1, content:1, planid:1, planname:1, tags:1, flag:1, datatime:1, attachments:1});
        let postSolns = solns.map(e=>({...e, ...{tagStr:e.tags?e.tags.map(t=>t.name).join(' '): ''}}))
        this.count = postSolns.length;
        this.index.add(postSolns);
    }
    search(keyword:string,  sort:number = 1){
        if(this.index){
            return this.index.search({
                field: [ "solution",  "tagStr", "content" ],
                query: keyword,
                bool: "or",
                sort: function(a, b){
                    return (new Date(a.datatime).getTime() - new Date(b.datatime).getTime() ? sort : -sort);
                }
            });
        }
    }
}