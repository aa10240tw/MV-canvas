// 常數
var SCREEN_WIDTH = document.body.clientWidth;   // 畫面寬度
var SCREEN_HEIGHT = document.body.clientHeight;  // 畫面高度
var FPS = 30;// 1秒間描繪的次數
var StarFPS = 70;// 1秒間描繪的次數
var GRAVITY = 0.4;  // 重力係數
var MaxSnow = 25;
var Otime;

// 變數
var ctx;                // 2D context
var circleList = [];  // 放入建立好的顆粒的陣列
var starList = [];  // 放入建立好的顆粒的陣列
var snowList = [];
var angel = 0;
var mx = null;          // 滑鼠的X座標
var my = null;          // 滑鼠的Y座標

var tmpCanvas = document.createElement('canvas');
var tmpCtx = tmpCanvas.getContext('2d');
var img = new Image();   // Create new img element
img.src = 'sakura.png'; // Set source path
img.onload = function() 
{
    tmpCtx.drawImage(img,0,0,45,45);
};

var treeCanvas = document.createElement('canvas');
var treeCtx = treeCanvas.getContext('2d');
var bgImg = new Image();   // Create new img element
bgImg.src = 'tree.jpg'; // Set source path
bgImg.onload = function() 
{
    treeCtx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    treeCtx.fillStyle = treeCtx.createPattern(bgImg,"repeat");
    treeCtx.fill();
};

var init = function () 
{
    var canvas = document.getElementById("gl-canvas");
    if (!canvas || !canvas.getContext) return false;// 確認canvas元素是否存在

    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    ctx = canvas.getContext("2d");

    // Create a second "buffer" canvas but don't append it to the document

    loop();// 執行主迴圈
};

// 主迴圈
var loop = function () 
{
    SCREEN_WIDTH = document.body.clientWidth;   // 畫面寬度
    SCREEN_HEIGHT = document.body.clientHeight;  // 畫面高度

    if(num == 1) //Sugar
    {
        ctx.fillStyle = "rgba(255, 153, 51, 1)";
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        addC();
        updateC();
        drawC(); 
        setTimeout(loop, 1000 / FPS);
    }
    else if(num == 2) //Stary Stary Night
    {
        Otime = new Date();
        ctx.fillStyle = "rgba(0, 0, 0, .4)";
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        addS();
        updateS();
        drawS();

        setTimeout(loop, 1000 / StarFPS);
    }
    else //a thouthands mile
    {
        ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
        document.getElementById('gl-canvas').style.backgroundImage = "url(tree.jpg)";
        document.getElementById('gl-canvas').style.backgroundSize = "cover";
        addSn();
        drawSn();
        updateSn();

        setTimeout(loop, 1000 / MaxSnow);
    }
    
};

/* Circle  ==================================================*/
// 新增顆粒
var addC = function () 
{
    locX = Math.random();
    locY = Math.random();
    mx = locX * SCREEN_WIDTH;
    my = locY * SCREEN_HEIGHT;
    // 建立實體
    var p = new Circle(mx, my);
    p.create();
    // 將實體收納至陣列中
    circleList.push(p);
};

// 更新顆粒位置
var updateC = function () 
{
    var list = [];
    for (var i = 0; i < circleList.length; i++) 
    {
        circleList[i].update();
        // 若刪除旗標未被立起就收納至陣列中
        if (!circleList[i].isRemove) 
        {
            list.push(circleList[i]);
        }
    }
    circleList = list;
};

// 顆粒的描繪
var drawC = function () 
{
    // 描繪顆粒
    ctx.save();
    for (var i = 0; i < circleList.length; i++) 
    {
        circleList[i].draw();
    }
    ctx.restore();
};


/**
 * Circle 類別
 */
// 建構子
var Circle = function (x, y) 
{
    this.x = x;
    this.y = y;
};

// 屬性與方法
Circle.prototype = 
{
    // 屬性
    x: null,        // X座標
    y: null,        // Y座標
    vx: 0,          // X軸方向的速度
    vy: 0,          // Y軸方向的速度
    radius: 0,      // 半徑
    color: null,    // 顏色
    isRemove: false,// 移除旗標

    // 隨機設定初始速度、尺寸、顏色
    create: function () 
    {
        this.vx = Math.random() * 10 - 3;
        this.vy = Math.random() * (-10) - 2;
        this.radius = Math.random() * 100 + 5;
        var r,g,b = 0;
        var time = Math.random(); 
        if( time < 0.33)//黃
        {
            r = 255;
            g = 255;
            b = Math.floor( 0 + Math.random()* 254 );
        }
        else if(time > 0.66)//紅
        {
            var t = Math.floor( 150 + Math.random()* 104 )
            r = 255
            g = t;
            b = t;
        }
        else//藍
        {
            var t = Math.floor( 150 + Math.random()* 104 )
            r = t;
            g = t;
            b = 255;
        }
        this.color = "rgb(" + r + "," + g + ", " + b + ")";
    },

    // 更新位置
    update: function () 
    {
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.radius *= .97;
        // 顆粒跑出畫面外時設立刪除旗標
        if (this.x < 0 || this.x > SCREEN_WIDTH || this.y > SCREEN_HEIGHT) 
        {
            this.isRemove = true;
        }
    },

    // 描繪
    draw: function () 
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
};

/* Circle  ==================================================*/


/* Star  ==================================================*/
// 新增星星
var addS = function () 
{
    locX = Math.random();
    locY = Math.random();
    mx = locX * SCREEN_WIDTH;
    my = locY * SCREEN_HEIGHT;
    var time = Otime.getTime();
    // 建立實體
    var s = new Star(mx, my,time);
    s.create();
    // 將實體收納至陣列中
    starList.push(s);
};

var updateS = function () 
{
    var list = [];
    for (var i = 0; i < starList.length; i++) 
    {
        starList[i].update();
        // 若刪除旗標未被立起就收納至陣列中
        if (!starList[i].isRemove) 
        {
            list.push(starList[i]);
        }
    }
    starList = list;
};

// 顆粒的描繪
var drawS = function () 
{
    // 描繪顆粒
    ctx.save();

    for (var i = 0; i < starList.length; i++) {
        starList[i].draw();
    }
    ctx.restore();
};


/**
 * Circle 類別
 */
// 建構子
var Star = function (x, y,time) 
{
    this.x = x;
    this.y = y;
    this.time = time;
};

// 屬性與方法
Star.prototype = 
{
    // 屬性
    x: null,        // X座標
    y: null,        // Y座標
    radius: 0,      // 半徑
    color: null,    // 顏色
    time:0,         //時間
    isRemove: false,// 移除旗標

    // 隨機設定初始速度、尺寸、顏色
    create: function () 
    {
        this.radius = Math.random() * 3 + 0.5;
        var time = Math.random(); 
        var h = 0; 
        var s = "100%";
        var t = Math.floor( 50 + Math.random()* 50 );
        var l = t + "%";
        if( time > 0 && time <= 0.2 ) //紅
        {
            h = Math.floor( 341 + Math.random()* 19 );
        }
        else if( time > 0.2 && time <= 0.4 )//橙
        {
            h = Math.floor( 37 + Math.random()* 9 );
        }
        else if( time > 0.4 && time <= 0.6 )//黃
        {
            h = Math.floor( 46 + Math.random()* 16 );
        }
        else if( time > 0.6 && time <= 0.8 )//藍
        {
            h = Math.floor( 188 + Math.random()* 66 );
        }
        else if( time > 0.8 && time <= 1 )//紫
        {
            h = Math.floor( 254 + Math.random()* 34 );
        }
        this.color = "hsl(" + h + "," + s + ", " + l + ")";
    },

    // 更新位置
    update: function () 
    {
        this.radius *= .99;
        // 顆粒跑出畫面外時設立刪除旗標
        if (this.radius < 0.001) 
        {
            this.isRemove = true;
        }
    },

    // 描繪
    draw: function () 
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
};

/* Snow  ==================================================*/

/*Snow ======================================================*/
// 新增顆粒
var addSn = function () 
{
    locX = Math.random() * 2;
    locY = Math.random() - 0.75;
    mx = locX * SCREEN_WIDTH;
    my = locY * SCREEN_HEIGHT;
    // 建立實體
    var p = new Snow(mx, my);
    p.create();
    // 將實體收納至陣列中
    snowList.push(p);
};

// 更新顆粒位置
var updateSn = function () 
{
    var list = [];
    for (var i = 0; i < snowList.length; i++) 
    {
        snowList[i].update();
        // 若刪除旗標未被立起就收納至陣列中
        if (!snowList[i].isRemove) 
        {
            list.push(snowList[i]);
        }
    }
    snowList = list;
    angel += 0.01;
};

// 顆粒的描繪
var drawSn = function () 
{
    ctx.save();
    for (var i = 0; i < snowList.length; i++) 
    {
        snowList[i].draw();
    }
    ctx.restore();
};


/**
 * Circle 類別
 */
// 建構子
var Snow = function (x, y) 
{
    this.x = x;
    this.y = y;
};

// 屬性與方法
Snow.prototype = 
{
    // 屬性
    x: null,        // X座標
    y: null,        // Y座標
    d: null,
    size:0,
    radius: 0,      // 半徑
    color: null,    // 顏色
    isRemove: false,// 移除旗標

    // 隨機設定初始尺寸、顏色
    create: function () 
    {
        this.size = 20 + Math.random()*20;
        this.radius = Math.random() * 4 + 1;
        this.color = "rgba(255,255,255,0.8)";
        this.d =  Math.random() * MaxSnow;
    },

    // 更新位置
    update: function () 
    {
        this.x += Math.sin(angel) * 2;
        this.y += Math.cos(angel + this.d) + 1 + this.radius/2;
        // 顆粒跑出畫面外時設立刪除旗標
        if (this.x > SCREEN_WIDTH || this.y > SCREEN_HEIGHT) 
        {
            this.isRemove = true;
        }
    },

    // 描繪
    draw: function () 
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.drawImage(tmpCanvas, this.x, this.y, this.size ,this.size * 0.8);
        ctx.fill();
    }
};

/* Snow  ==================================================*/

