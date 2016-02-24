var hy = hy || {};
hy.geometry = {};
/*{x:,y:}*/
hy.geometry.vector = {};
hy.geometry.vector.getAngle = function(vector){
    try{
        if(this.x == 0 && this.y == 0){
            return 0;
        }else{
            return Math.atan2(vector.y, vector.x);
        }
    }catch (err){
        throw "this param is not vector";
    }
}
hy.geometry.vector.normalize = function(vector){
    try{
        var mold = hy.geometry.vector.mold(vector);
        vector.x = vector.x / mold;
        vector.y = vector.y / mold;
    }catch(err){
        throw "this param is not vector";
    }
}
hy.geometry.vector.moldSquare = function(vector){
    try{
        return vector.x*vector.x+vector.y*vector.y;
    }catch (err){
        throw "this param is not vector";
    }
}
hy.geometry.vector.mold = function(vector){
    try{
        return Math.sqrt(hy.geometry.vector.moldSquare(vector));
    }catch (err){
        throw "this param is not vector";
    }
}
/*{x:,y:,width:,height:}*/
hy.geometry.rect = {};
/*{width:, height:}*/
hy.geometry.size = {};
/*{x:,y:,radius:}*/
hy.geometry.circle = {};
/*[{x:,y:},{x:,y:}]*/
hy.geometry.line = {};
/*[{x:,y:},{x:,y:}]*/
hy.geometry.polygon = {};
