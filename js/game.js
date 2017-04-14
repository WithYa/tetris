
/**
 * 方块共有7种，分别以S、Z、J、I、O、T、L这7个字母的形状来命名
 * S（左右）：最多二层，容易造成孔洞
 * Z （左右）：最多二层，容易造成孔洞* I：一次最多消除四层
 * J（左右）：最多消除三层，或消除二层
 *
 * I：一次最多消除四层
 * O：消除一至二层
 * T：最多二层
 * L：最多消除三层，或消除二层
 *
 **/

var tetris = {
    canvas : document.getElementById("canvas"),
    ctx : this.canvas.getContext("2d"),
    width : 600,
    height : 1100,
    logLen: 14,//显示的行数
    mapColor: "rgba(255,255,255,0.2)",
    logColor: "red",
    status: 'ready',
    unit : 50,
    curText : "开始",
    blockData : function(index, row, col){
        var r = row || 1,
            c = col || Math.floor((this.col - 3)/2) + 2,
            block = [
                //方块L右 黄
                [
                    {color: '#ffdb51', status: 1, data: [{x: r, y:c-1}, {x: r+1, y:c-1}, {x: r+1, y:c}, {x: r+1, y:c+1}], center: {x: r, y: c}},
                    {color: '#ffdb51', status: 2, data: [{x: r-1, y:c-1}, {x: r-1, y:c}, {x: r, y:c-1}, {x: r+1, y:c-1}], center: {x: r, y: c}},
                    {color: '#ffdb51', status: 3, data: [{x: r-1, y:c-1}, {x: r-1, y:c}, {x: r-1, y:c+1}, {x: r, y:c+1}], center: {x: r, y: c}},
                    {color: '#ffdb51', status: 4, data: [{x: r-1, y:c+1}, {x: r, y:c+1}, {x: r+1, y:c+1}, {x: r+1, y:c}], center: {x: r, y: c}}
                ],
                //方块L 蓝
                [
                    {color: '#1491fd', status: 1, center: {x: r, y:c}, data: [{x: r, y:c+1}, {x: r+1, y:c-1}, {x: r+1, y:c}, {x: r+1, y:c+1}]},
                    {color: '#1491fd', status: 2, center: {x: r, y:c}, data: [{x: r-1, y:c-1}, {x: r, y:c-1}, {x: r+1, y:c-1}, {x: r+1, y:c}]},
                    {color: '#1491fd', status: 3, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r-1, y:c-1}, {x: r-1, y:c}, {x: r-1, y:c+1}]},
                    {color: '#1491fd', status: 4, center: {x: r, y:c}, data: [{x: r-1, y:c}, {x: r-1, y:c+1}, {x: r, y:c+1}, {x: r+1, y:c+1}]}
                ],
                //方块S左 玫
                [
                    {color: '#ff5fdc', status: 1, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r+1, y:c}, {x: r+1, y:c+1}]},
                    {color: '#ff5fdc', status: 2, center: {x: r, y:c}, data: [{x: r+1, y:c-1}, {x: r, y:c-1}, {x: r, y:c}, {x: r-1, y:c}]}
                ],
                //方块S右 绿
                [
                    {color: '#7cf25d', status: 1, center: {x: r, y:c}, data: [{x: r+1, y:c-1}, {x: r+1, y:c}, {x: r, y:c}, {x: r, y:c+1}]},
                    {color: '#7cf25d', status: 2, center: {x: r, y:c}, data: [{x: r-1, y:c}, {x: r, y:c}, {x: r, y:c+1}, {x: r+1, y:c+1}]}
                ],
                //方块O 橘色
                [
                    {color: '#fa9836', status: 1, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r+1, y:c-1}, {x: r+1, y:c}]}
                ],
                //方块T 青色
                [
                    {color: '#45f7c7', status: 1, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r, y:c+1}, {x: r-1, y:c}]},
                    {color: '#45f7c7', status: 2, center: {x: r, y:c}, data: [{x: r+1, y:c}, {x: r, y:c}, {x: r, y:c+1}, {x: r-1, y:c}]},
                    {color: '#45f7c7', status: 3, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r, y:c+1}, {x: r+1, y:c}]},
                    {color: '#45f7c7', status: 4, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r+1, y:c}, {x: r-1, y:c}]}
                ],
                //方块I 紫色
                [
                    {color: '#a223ee', status: 1, center: {x: r, y:c}, data: [{x: r, y:c-1}, {x: r, y:c}, {x: r, y:c+1}, {x: r, y:c+2}]},
                    {color: '#a223ee', status: 2, center: {x: r, y:c}, data: [{x: r-2, y:c}, {x: r-1, y:c}, {x: r, y:c}, {x: r+1, y:c}]}
                ]
            ]
        return block[index];
    },
    init : function(){
        var self = this;
        self.reset();
        self.addEvent("keydown", window, function(ev){
            var ev = ev || window.event,
                code = ev.keycode || ev.which;
            if(self.handle[code] && self.status === "play"){
                self.handle[code].call(self);
                self.createMap();
                ev.preventDefault();
            }
        })
        self.addEvent("click", document, function(ev){
            self.createMap(ev);
        })
        return this;
    },
    reset: function(){
        var self = this;
        self.score = 0;
        self.speed = 1000;
        self.log = [];
        self.historyBlock = [];
        self.row = Math.floor(self.height/self.unit);
        self.col = Math.floor(self.width/self.unit);
        self.curBlockIndex = Math.round(Math.random()*6);
        self.curBlocks = self.blockData(self.curBlockIndex);
        self.curBlock = self.curBlocks[0];
        self.createNext().createMap();
        return this;
    },
    createNext: function(){
        var self = this;
        self.nextBlockIndex = self.status === "ready" ? self.curBlockIndex : Math.round(Math.random()*6);
        self.nextBlocks = self.blockData(self.nextBlockIndex, 4, self.col+3);
        self.nextBlock = self.nextBlocks[0];
        return this;
    },
    addEvent : function(ev, ele, callback){
        if( ele.addEventListener ){
            ele.addEventListener(ev,callback,false);
        }else{
            ele.attachEvent("on"+ev, callback);
        }
    },
    createMap : function(ev){
        var self = this,
            ctx = self.ctx;
        ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for (var i = 0; i < self.col; i++) {
            for (var j = 0; j < self.row; j++) {
                ctx.save();
                ctx.strokeStyle = self.mapColor;
                ctx.strokeRect(i*self.unit, j*self.unit, self.unit, self.unit);
                ctx.stroke();
                ctx.restore();
            };
        };
        self.showText(ev).createBlock().createLog();
        if(self.status !== "ready"){
            self.drawRect(self.curBlock.data);
        }
        return this;
    },
    createBlock : function(){
        var self = this,
            block = self.curBlock.data;
        self.drawRect(self.historyBlock);
        if(self.collide(40, true)){
            block.map(function(val){
                val.x--;
            })
            setTimeout(function(){
                clearInterval(self.timer);
                if(localStorage.getItem("score") === null){
                    localStorage.setItem("score", self.score);
                }else if(localStorage.getItem("score") - self.score < 0 ){
                    localStorage.setItem("score", self.score);
                    alert("新纪录！"+self.score+"分！");
                    self.printLog({log:"新纪录！"+self.score+"分！", color: 'red'});
                    return;
                }
                self.status = "over";
                self.curText = "重来";
                self.showText();
                self.printLog({log:"GAME OVER", color: 'red'});
            },10)
        }
        return this;
    },
    drawRect : function(block){
        var self = this;
        for (var i = 0; i < block.length; i++) {
            self.ctx.save();
            self.ctx.fillStyle = block[i].color || self.curBlock.color;
            self.ctx.strokeStyle = self.mapColor;
            self.ctx.fillRect((block[i].y - 1)*self.unit, (block[i].x - 1)*self.unit, self.unit, self.unit );
            self.ctx.strokeRect((block[i].y - 1)*self.unit, (block[i].x - 1)*self.unit, self.unit, self.unit );
            self.ctx.restore();
        };
    },
    move : function(){
        var self = this;
        clearInterval(self.timer);
        self.timer = setInterval(function(){
            // 实时刷新数据
            var curBlock = self.curBlock,
                data = self.curBlock.data;
            if( self.collide() || data.some(function(val){
                    return val.x + 1 > self.row;
                }) ){
                clearInterval(self.timer);
                self.historyBlock.push.apply(self.historyBlock, data.map(function(val){
                    val.color = curBlock.color;
                    return val;
                }));
                self.remove();
                self.curBlockIndex = self.nextBlockIndex;
                self.curBlocks = self.blockData(self.curBlockIndex);
                self.curBlock = self.curBlocks[0];
                self.createNext().createMap().move();
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                data[i].x++;
            };
            self.curBlock.center.x++;
            self.createMap();
        }, self.speed)
        return this;
    },
    remove : function(){
        var self = this,
            count = {},
            n = 0,
            maxRow = 0,
            delArr = [],
            block = self.historyBlock;
        for (var i = 0; i < block.length; i++) {
            if(count[block[i].x]){
                count[block[i].x].length += 1;
            }else{
                count[block[i].x] = [1];
            }
        };
        console.log( count )
        for (var attr in count) {
            if(count[attr].length === self.col){
                n++;
                //maxRow = attr > maxRow ? attr : maxRow;
                for (var i = 0; i < block.length; i++) {
                    if(block[i].x == attr){
                        delArr = block.splice(i, 1);
                        i--;
                    }
                };
                count[attr].length = 0;
                block.forEach(function(val){
                    val.x < attr && (val.x += 1);
                })
            }
        };
        // 边消除边下降会死循环
        if(n > 0){
            self.score += n*100;
            self.printLog("得分+"+n*100);
            // 一次消除3行奖励100分
            if(n === 3){
                self.score += 100;
                self.printLog("奖励"+100+"分~");
            }
            // 一次消除4行奖励200分
            if(n === 4){
                self.score += 200;
                self.printLog("奖励"+200+"分~");
            }
            /*block.forEach(function(val){
             val.x < maxRow && (val.x += n);
             })*/
            self.changeSpeed();
        }
    },
    changeSpeed: function(){
        var self = this;
        if( self.score >= 3000 && self.score < 5000 ){
            self.speed = 800;
        }else if( self.score >= 5000 && self.score < 10000 ){
            self.speed = 600;
            self.score += 100;
        }else if( self.score >= 10000 && self.score < 20000 ){
            self.speed = 400;
            self.score += 150;
        }else if( self.score >= 20000 && self.score < 40000 ){
            self.speed = 200;
            self.score += 200;
        }else if( self.score >= 40000 ){
            self.speed = 100;
            self.score += 300;
        }
        return this;
    },
    collide : function(direction, isCreate){
        var block = JSON.parse(JSON.stringify(this.curBlock)),
            result = false,
            self = this;
        direction = direction || 40;
        // direction:碰撞方向，默认下方
        if(direction === 37){
            self.mLeft(block);
        }else if(direction === 38){
            block = self.distortion(block);
        }else if(direction === 39){
            self.mRight(block);
        }else if(direction === 40 && !isCreate){
            // 非新增方块则往下移动一格
            block.data.forEach(function(val){
                val.x++;
            })
        }
        result = block.data.some(function(val){
            return (val.x > self.row || val.y < 1 || val.y > self.col);
        })
        if(result){
            return result;
        }else{
            return block.data.some(function(val){
                return self.historyBlock.some(function(value){
                    return (value.x === val.x && value.y === val.y);
                })
            })
        }
    },
    mLeft : function(block){
        if(block.data.every(function(val){
                return val.y - 1 >= 1;
            })){
            block.data.forEach(function(val){
                val.y--;
            })
            block.center.y--;
        }
    },
    mRight : function(block){
        var self = this;
        if(block.data.every(function(val){
                return val.y + 1 <= self.col;
            })){
            block.data.forEach(function(val){
                val.y++;
            })
            block.center.y++;
        }
    },
    distortion : function(block){
        var self = this,
            curRow = block.center.x,
            curCol = block.center.y,
            status = block.status + 1 > self.curBlocks.length ? 1 : block.status + 1;
        self.curBlocks = self.blockData(self.curBlockIndex, block.center.x, block.center.y);
        return self.curBlocks[status-1];
    },
    // 控制：上（变形）、右（右移）、下（下移）、左（左移）
    handle : {
        // 左键 code 37
        37: function(){
            var self = this;
            if(!self.collide(37)){
                self.mLeft(self.curBlock);
            }
        },
        // 上键 code 38
        38: function(){
            var self = this;
            if(!self.collide(38)){
                self.curBlock = self.distortion(self.curBlock);
            }
        },
        // 右键 code 39
        39: function(){
            var self = this;
            if(!self.collide(39)){
                self.mRight(self.curBlock);
            }
        },
        // 下键 code 40
        40: function(){
            var self = this;
            if(!self.collide()){
                self.curBlock.data.forEach(function(val){
                    val.x++;
                })
                self.curBlock.center.x++;
            }
        }
    },
    showText: function(ev){
        var self = this,
            ctx = self.ctx;
        ctx.clearRect(self.width, 0, self.canvas.width - self.width, self.height);
        ctx.save();
        ctx.beginPath();
        ctx.font = "30px 方正粗圆_GBK";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("下一个:", self.width+50, 80);
        ctx.fillText("分数:", self.width+50, 420);
        ctx.fillText("速度:", self.width+50, 500);
        ctx.fillStyle = "red";
        ctx.fillText(self.score, self.width+50, 460);
        ctx.fillText(self.speed + "毫秒", self.width+50, 540);
        ctx.fillStyle = "rgba(204,204,204,0.8)";//开始按钮背景色
        //设置阴影样式
        ctx.shadowColor = "rgba(22,27,51,1)";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
        ctx.fillRect(self.width + 50, 320, 100, 40);//按钮
        // isPointInPath对fillRect()
        ctx.rect(self.width + 30, 300, 100, 40);
        if( ev && ctx.isPointInPath(ev.layerX, ev.layerY) ){
            switch(self.status){
                //点击开始
                case "ready":
                    self.status = "play";
                    self.curText = "暂停";
                    self.log = ["开始游戏！"];
                    self.createNext().move();
                    break;
                case "play":
                    self.status = "paush";
                    self.curText = "继续";
                    clearInterval(self.timer);
                    self.printLog("暂停");
                    break;
                case "paush":
                    self.status = "play";
                    self.curText = "暂停";
                    self.printLog("继续");
                    self.move();
                    break;
                case "over":
                    self.status = "play";
                    self.curText = "暂停";
                    self.reset().move();
                    self.printLog("开始游戏~");
                    break;
            }
        }
        ctx.fillStyle = "#fff";//开始按钮字的颜色
        ctx.fillText(self.curText, self.width+70, 350);//开始文字位置
        ctx.restore();
        ctx.closePath();
        self.nextBlock.data.forEach(function(val){
            val.color = self.nextBlock.color;
        })
        self.drawRect(self.nextBlock.data);
        return this;
    },
    printLog: function(log){
        var self = this;
        if(log){
            self.log.unshift(log);
            self.log.length > self.logLen && (self.log.length = self.logLen);
        }
        self.createLog();
        return this;
    },
    createLog: function(){
        var self = this,
            ctx = self.ctx;
        // 清除log
        ctx.clearRect(self.width+20, 1000, 136, 170);
        self.log.forEach(function(val, index){
            if(val){
                ctx.save();
                ctx.font = "25px 方正粗圆_GBK";
                ctx.fillStyle = val.color || self.logColor,
                    //设置底部显示区域
                    ctx.fillText(val.log || val, self.width+50, 600+index*30);
                ctx.restore();
            }
        })
        return this;
    }
}
tetris.init();