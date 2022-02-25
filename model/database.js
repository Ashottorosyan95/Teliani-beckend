const mysql=require('mysql')

class Database{
    constructor(){
        this.db=mysql.createConnection({
            host:'localhost',
            port:3306,
            user:'root',
            password:'',
            database:'shoes-shop'
        })

        // this.db=mysql.createConnection({
        //     host:'localhost',
        //     port:3306,
        //     user:'telianshoes_arsen',
        //     password:'yo42EZb5KMaH',
        //     database:'telianshoes_shop'
        // })
    }
   

    
     findAll(table){
        return new Promise((resolve,reject)=>{
            this.db.query(`select * from ${table}`, (err,data)=>{
                if(err) throw err
                 if(data){
                    resolve(JSON.parse(data))
                }else{
                    resolve(data)
                }
            })
        })
    }
   



    findBy(table,data){
        let query=`select * from ${table} where `
        for(let e in data){
            query+=`${e}='${data[e]}' and `
        }
        query=query.substring(0,query.length-4)
        return new Promise((resolve,reject)=>{
            this.db.query(query,(err,data)=>{
                if(err) throw err;
                resolve(data)
            })
        })
    }
   
}
module.exports=new Database