/*
Author: LegendLee(legendlee1314@gmail.com)
Date: 2013-07-19
Last Modified Date: 2013-07-24
Module: Perf_Test
Description:
    API Object Performance Test
    1. To generate test strings arrays and ints arrays with linear length.
    2. To test one function of API by loading generated parameters.
        There are two subtasks:
        a) Get the time of writing and reading to show the speed performance.
        b) Test and verify the integrity and accuracy.
        c) * More in depth, make the above visualization.
    3. Two main test tasks:
        one time for large data; more times for small data;
    4. Test object are `setProperty` and `getProperty`. \
        by one large string or one string array with more small strings.
*/


// xwalk test goal example
function XWalkTestGoal(goal){
    this.goal = goal;
    this.setProperty = function setProperty(data){
        this.bubbleSort(data);
    };
    this.getProperty = function getProperty(data){
        this.quickSort(data); 
        return this.data;
    };
    this.quickSort = function quickSort(data){
        this.data = data.split('');
        this.quickSort_main(this.data, 0, this.data.length);
    };
    this.quickSort_main = function quickSort_main(data, left, right){
        var stack1 = new Array();
        var stack2 = new Array();
        var mid = this.partition(data, left, right);
        stack1.push(left);
        stack2.push(mid - 1);
        stack1.push(mid + 1);
        stack2.push(right);
        while(stack1.length != 0 || stack2.length != 0){
            var left=stack1.pop();
            var right=stack2.pop();
            var mid = this.partition(data, left, right);
            if(left < mid - 1){
                stack1.push(left);
                stack2.push(mid - 1);
            }
            if(mid + 1 < right){
                stack1.push(mid + 1);
                stack2.push(right);
            }
        }
    };
    this.partition = function partition(data, left, right){
        var index = left;
        var pivot = data[index];
        for(var i=left; i<right; i++){
            if(data[i] < pivot){
                var tmp = data[index];
                data[index] = data[i];
                data[i] = tmp;
                index++;
            }
        }
        return index;
    };
    this.bubbleSort = function bubbleSort(data){
        this.data = data.split('');
        for(var i=0; i<this.data.length; i++){
            for(var j=0; j<this.data.length-i-1; j++){
                if(this.data[j] > this.data[j+1]){
                    var tmp = this.data[j];
                    this.data[j] = this.data[j+1];
                    this.data[j+1] = tmp;
                }
            }
        }
    };
}

// test data generate
function get_data_unit(){
    var p = document.getElementById("content");
    var input = document.getElementById("scale");
    if(p != null && input != null){
        var content = p.innerHTML;
        var scale = parseInt(input.value);
        var case_str = new String();
        for(var i=0; i<scale; i++){
            case_str += content;
        }
        return case_str;
    }
}

// pert test for different API
function perf_test(xwalk_object, data){
    // object time to set up three kinds
    var time = new Object();
    time.start = new Date().getTime();
    
    // test setProperty
    xwalk_object.setProperty(data);

    time.mid = new Date().getTime();

    // test getProperty
    var newdata = xwalk_object.getProperty(data);

    time.end = new Date().getTime();

    //@todo
    //validate(data, newdata);
    return time
}

// visualization
function visualize(times, method){
    if(times != null){
        var container1 = document.getElementById("result1");
        var container2 = document.getElementById("result2");
        var scale = document.getElementById("scale");
        var variable = document.getElementById('variable');
        var data_set = [], data_get = [];
        var time_set = [], time_get = [];
        if(method == 'linear'){
            var s = parseInt(scale.value);
            var k = parseInt(variable.value);
            for(x in times){
                var st = (times[x].mid-times[x].start)/1000;
                var et = (times[x].end-times[x].mid)/1000;
                var ds = [s+k, st], dg = [s+k, et];
                var ts = [x, st], tg = [x, et];
                data_set.push(ds);
                data_get.push(dg);
                time_set.push(ts);
                time_get.push(tg);
                s += k;
            }
        }
        else{
            var s = parseInt(scale.value);
            var pow = parseInt(variable.value);
            s = s * pow
            for(x in times){
                var st = (times[x].mid-times[x].start)/1000;
                var et = (times[x].end-times[x].mid)/1000;
                var ds = [s+s, st], dg = [s+s, et];
                var ts = [x, st], tg = [x, et];
                data_set.push(ds);
                data_get.push(dg);
                time_set.push(ts);
                time_get.push(tg);
                s += s;
            }
        }
        // draw diagram with Flotr
        // scale-time diagram
        Flotr.draw(container1, [
                  { data: data_set, label: 'set',
                    points: {show: true}, lines: {show: true}},
                  { data: data_get, label: 'get',
                    points: {show: true}, lines: {show: true}},
                  ], {
                    title: "Test Result",
                    subtitle: "Scale - Time Diagram",
                    xaxis: {
                        title: "case scale"
                    },
                    yaxis: {
                        title: "run time"
                    }
                  });
        // times-time diagram
        Flotr.draw(container2, [
                  { data: time_set, label: 'set',
                    points: {show: true}, lines: {show: true}},
                  { data: time_get, label: 'get',
                    points: {show: true}, lines: {show: true}},
                  ], {
                    title: "Test Result",
                    subtitle: "Times - Time Diagram",
                    xaxis: {
                        title: "times"
                    },
                    yaxis: {
                        title: "run time"
                    }
                  });
    }
}

// main function of `perf_test`
function perf_test_main(){
    var input = document.getElementById('method');
    var method = input.value;
    var input = document.getElementById('number');
    var number = parseInt(input.value);
    var times = new Array();// record the running time

    // new one object of test goal of xwalk
    var xwalk_test_object = new XWalkTestGoal('t');

    // test for linear
    // y = k * x + x for n cases 
    if(method == 'linear'){
        var data = get_data_unit();
        var k = document.getElementById('variable').value;
        var add = new String();
        for(var i=0; i<parseInt(k); i++){
            add += data;
        }
        for(var i=0; i<number; i++){
            time = perf_test(xwalk_test_object, data);
            times.push(time);
            // link linearly
            data += add; 
        }
    }
    // test for non-linear
    // y = pow(p * x, 2) for n cases
    else{
        var unit = get_data_unit();
        var p = document.getElementById('variable').value;
        var data = new String();
        for(var i=0; i<parseInt(p); i++){
            data += unit;
        }
        for(var i=0; i<number; i++){
            time = perf_test(xwalk_test_object, data);
            times.push(time);
            // link non-linearly
            data += data; 
        }
    }
    // visualize the result after testing
    visualize(times, method);
}

// call main function
// 1. call directly
// perf_test_main();
// 2. call through pressing the button
document.onreadystatechange = function(){
    document.getElementById("testBtn").onclick=function(){perf_test_main();};
}
