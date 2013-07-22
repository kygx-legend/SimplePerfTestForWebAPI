/*
    Author: LegendLee(legendlee1314@gmail.com)
    Date: 2013-07-19
    Last Modified Date: 2013-07-22
    Module: Perf_Test
    Description:
        API Performance Test
        1. To generate test strings arrays and ints arrays with linear length.
        2. To test one function of API by loading generated parameters.
            There are two subtasks:
            a) Get the time of writing and reading to show the speed performance.
            b) Test and verify the integrity and accuracy.
            c) * More in depth, make the above visualization.
        3. Two main test tasks:
            one time for large data; more times for small data;
        4. Test object are `set_property` and `get_property`. \
            by one large string or one string array with more small strings.
   */

// goal test function
function goal_test_function(data){
    this.data = data;
    this.loop = 10000;
    for(var i = 0; i < parseInt(Math.random() * loop); i++){
        for(var j = 0; j < parseInt(Math.random() * loop); j++){
            for(var k = 0; k < parseInt(Math.random() * loop); k++){
                var a = 1;
            }
        }
    }
}

// test data generate
function data_generate(){
    var p_str = document.getElementById("case");
    if(p_str != null){
        return p_str;
    }
}

// pert test for different API
function perf_test(api_function, data){
    var time = new Object();
    time.starttime = new Date().getTime();
    api_function(data);
    time.midtime = new Date().getTime();
    var newdata = api_function.data;
    time.endtime = new Date().getTime();
    //@todo
    //validate(data, newdata);
    return time
}

// visualization
function visualize(result){
    if(result != null){
        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");
        var k = 20;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(0, 0);
        for(x in result){
            context.lineTo(k, result[x].midtime - result[x].starttime);
            k += 10;
        }
        context.strokeStyle = '#ff0000';
        context.stroke();
        context.closePath();
        context.beginPath();
        var k = 20;
        context.moveTo(0, 0);
        for(x in result){
            context.lineTo(k, result[x].endtime - result[x].midtime);
            k += 10;
        }
        context.strokeStyle = '#0000ff';
        context.stroke();
        context.closePath();
    }
}

// main loop of `perf_test`
function perf_test_main(){
    var data = data_generate();
    var result = new Array();
    for(d in data){
        time = perf_test(goal_test_function, d);
        result.push(time);
    }
    visualize(result);
}

// call main function
// 1. call directly
// perf_test_main();
// 2. call through pressing the button
document.onreadystatechange = function(){
    document.getElementById("testBtn").onclick=function(){perf_test_main();};
}
