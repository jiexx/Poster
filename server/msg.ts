
const express = require('express');
import { email } from 'email';

const server = express();

export const taskEmail = async () => {
    await email({
        from: 'amdin@finra.org',
        to: 'gamerroger@163.com',
        subject: '新工单',
        html: '你有待处理的工单,请去查看'
    })
}
server.use('email', async (req, res)=>{
    try{
        await taskEmail();
    }catch(e){
        res.json({code: 'ERR', data:{msg: ` err at exception ${new Date().toLocaleString()}`}});
    }
})
let inter = null;
server.listen(6602, async () => {
    console.log('msg server at：6602');
    inter = setInterval(async () => {
        await taskEmail().catch(e=>{
            console.log(e);
        });
    }, 1800000);
});
process.on('exit', function () {
    console.log('msg server close：6602');
    if (inter) {
        clearInterval(inter);
    }
});


