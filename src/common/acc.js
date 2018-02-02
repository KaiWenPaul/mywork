// hy add 用于js精确计算
export default {
    //返回值：arg1加上arg2的精确结果
    add:function(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split( ".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split( ".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2))
        return (arg1*m+arg2*m)/m
    },
    //返回值：arg1减上arg2的精确结果
    sub:function(arg1,arg2){
        return this.add(arg1,-arg2);
    },
    //返回值：arg1乘以arg2的精确结果
    mul:function(arg1,arg2){
        var m=0,s1=arg1.toString(),s2=arg2.toString();
        try{m+=s1.split( ".")[1].length}catch(e){}
        try{m+=s2.split( ".")[1].length}catch(e){}
        return Number(s1.replace( ".","" ))*Number(s2.replace(".", ""))/Math.pow(10,m)
    },
    //返回值：arg1除以arg2的精确结果
    div:function(arg1,arg2){
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split( ".")[1].length}catch(e){}
        try{t2=arg2.toString().split( ".")[1].length}catch(e){}
        r1=Number(arg1.toString().replace( ".","" ))
        r2=Number(arg2.toString().replace( ".","" ))
        return (r1/r2)*Math.pow(10,t2-t1);
    }
}
