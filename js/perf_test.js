/*
    Author: LegendLee(legendlee1314@gmail.com)
    Date: 2013-07-19
    Last Modified Date: 2013-07-19
    Module: Perf_Test
    Description:
        XWalk API Performance Test
        1. To generate test strings arrays and ints arrays with linear length.
        2. To test one function of API by loading generated parameters. There are two subtasks:
            a) Get the time of writing and reading to show the speed performance.
            b) Test and verify the integrity and accuracy.
            c) * More in depth, make the above visualization.
   */

// alert('ttt');
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
    var p_str = document.getElementsByTagName("p");
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
    //validate(data, newdata);
    return time
}

// main loop of `perf_test`
function perf_test_main(){
    var data = data_generate();
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0, 0);
    var k = 10;
    for(d in data){
        time = perf_test(goal_test_function, d);
        context.lineTo(time.endtime - time.starttime, k);
        k += 10;
    }
    context.stroke();
}

// call main function
// 1. call directly
// perf_test_main();
// 2. call through pressing the button
document.onreadystatechange = function(){
    document.getElementById("testBtn").onclick=function(){perf_test_main();};
}
