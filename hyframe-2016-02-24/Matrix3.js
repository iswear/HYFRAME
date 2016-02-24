function Matrix3(){
    this.matrix = [
        1 , 0 , 0 ,
        0 , 1 , 0 ,
        0 , 0 , 1
    ];
}
Matrix3.prototype.multiply = function(mat3_1,mat3_2){
    var newMat = [];
    newMat[0] = mat3_1[0] * mat3_2[0] + mat3_1[1] * mat3_2[3] + mat3_1[2] * mat3_2[6];
    newMat[1] = mat3_1[0] * mat3_2[1] + mat3_1[1] * mat3_2[4] + mat3_1[2] * mat3_2[7];
    newMat[2] = mat3_1[0] * mat3_2[2] + mat3_1[1] * mat3_2[5] + mat3_1[2] * mat3_2[8];
    newMat[3] = mat3_1[3] * mat3_2[0] + mat3_1[4] * mat3_2[3] + mat3_1[5] * mat3_2[6];
    newMat[4] = mat3_1[3] * mat3_2[1] + mat3_1[4] * mat3_2[4] + mat3_1[5] * mat3_2[7];
    newMat[5] = mat3_1[3] * mat3_2[2] + mat3_1[4] * mat3_2[5] + mat3_1[5] * mat3_2[8];
    newMat[6] = mat3_1[6] * mat3_2[0] + mat3_1[7] * mat3_2[3] + mat3_1[8] * mat3_2[6];
    newMat[7] = mat3_1[6] * mat3_2[1] + mat3_1[7] * mat3_2[4] + mat3_1[8] * mat3_2[7];
    newMat[8] = mat3_1[6] * mat3_2[2] + mat3_1[7] * mat3_2[5] + mat3_1[8] * mat3_2[8];
    return newMat;
}
Matrix3.prototype.identity = function(){
    this.matrix =  [
        1 , 0 , 0 ,
        0 , 1 , 0 ,
        0 , 0 , 1
    ];
}
Matrix3.prototype.translate = function(x,y){
    var translateMat = [
        1 , 0 , x ,
        0 , 1 , y ,
        0 , 0 , 1
    ];
    this.matrix = this.multiply(this.matrix, translateMat);
}
Matrix3.prototype.rotate = function(angle){
    var rotateMat = [
        Math.cos(angle) , -Math.sin(angle) , 0 ,
        Math.sin(angle) , Math.cos(angle) , 0 ,
        0 , 0 , 1
    ];
    this.matrix = this.multiply(this.matrix,rotateMat);
}
Matrix3.prototype.scale = function(scalex,scaley){
    var scaleMat = [
        scalex , 0 , 0 ,
        0 , scaley , 0 ,
        0 , 0 , 1
    ];
    this.matrix = this.multiply(this.matrix,scaleMat);
}
Matrix3.prototype.offset = function(offsetx,offsety){
    var offsetMat = [
        1 , offsetx , 0 ,
        offsety , 1 , 1 ,
        0 , 0 , 1
    ];
    this.matrix = this.multiply(this.matrix, offsetMat);
}
Matrix3.prototype.getMatrixArray = function(){
    return this.matrix;
}

/*
var Matrix3 = {};
Matrix3.multiply = function(mat3_1,mat3_2){
    var newMat = [];
    newMat[0] = mat3_1[0] * mat3_2[0] + mat3_1[1] * mat3_2[3] + mat3_1[2] * mat3_2[6];
    newMat[1] = mat3_1[0] * mat3_2[1] + mat3_1[1] * mat3_2[4] + mat3_1[2] * mat3_2[7];
    newMat[2] = mat3_1[0] * mat3_2[2] + mat3_1[1] * mat3_2[5] + mat3_1[2] * mat3_2[8];
    newMat[3] = mat3_1[3] * mat3_2[0] + mat3_1[4] * mat3_2[3] + mat3_1[5] * mat3_2[6];
    newMat[4] = mat3_1[3] * mat3_2[1] + mat3_1[4] * mat3_2[4] + mat3_1[5] * mat3_2[7];
    newMat[5] = mat3_1[3] * mat3_2[2] + mat3_1[4] * mat3_2[5] + mat3_1[5] * mat3_2[8];
    newMat[6] = mat3_1[6] * mat3_2[0] + mat3_1[7] * mat3_2[3] + mat3_1[8] * mat3_2[6];
    newMat[7] = mat3_1[6] * mat3_2[1] + mat3_1[7] * mat3_2[4] + mat3_1[8] * mat3_2[7];
    newMat[8] = mat3_1[6] * mat3_2[2] + mat3_1[7] * mat3_2[5] + mat3_1[8] * mat3_2[8];
}
Matrix3.translate = function(x,y){

}
Matrix3.rotate = function(angle){

}
Matrix3.scale = function(scalex,scaley){

}
Matrix3.offset = function(offsetx,offsety){

}
*/

/*
var matExample = [
    1,0,0
    0,1,0
    0,0,1
]
*/