/*
    Author: LegendLee(legendlee1314@gmail.com)
    Date: 2013-07-19
    Last Modified Date: 2013-07-23
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

// xwalk test goal
function xwalk_test_goal(goal){
    this.goal = goal;
    this.set_property = function set_property(data){
        this.bubble_sort(data);
    }
    this.get_property = function get_property(data){
        this.quick_sort(data); 
        return this.data;
    }
    this.quick_sort = function quick_sort(data){
        this.data = data.split('');
        this.quick_sort_main(this.data, 0, this.data.length);
    }
    this.quick_sort_main = function quick_sort_main(data, left, right){
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
    }
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
    }
    this.bubble_sort = function bubble_sort(data){
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
    }
}

// pert test for different API
function perf_test(xwalk_object, data){
    var time = new Object();
    time.starttime = new Date().getTime();

    xwalk_object.set_property(data);

    time.midtime = new Date().getTime();

    var newdata = xwalk_object.get_property(data);

    time.endtime = new Date().getTime();
    //@todo
    //validate(data, newdata);
    return time
}

// visualization
function visualize(times, method){
    if(times != null){
        var container = document.getElementById("result");
        var scale = document.getElementById("scale");
        var variable = document.getElementById('variable');
        var data_set = [], data_get = [];
        if(method == 'linear'){
            var s = parseInt(scale.value);
            var k = parseInt(variable.value);
            for(x in times){
                ds = [s+k, (times[x].midtime-times[x].starttime)/1000];
                dg = [s+k, (times[x].endtime-times[x].midtime)/1000];
                data_set.push(ds);
                data_get.push(dg);
                s += k;
            }
        }
        else{
            var s = parseInt(scale.value);
            var pow = parseInt(variable.value);
            s = s * pow
            for(x in times){
                ds = [s+s, (times[x].midtime-times[x].starttime)/1000];
                dg = [s+s, (times[x].endtime-times[x].midtime)/1000];
                data_set.push(ds);
                data_get.push(dg);
                s += s;
            }
        }
        Flotr.draw(container, [
                  { data: data_set, label: 'set',
                    points: {show: true}, lines: {show: true}},
                  { data: data_get, label: 'get',
                    points: {show: true}, lines: {show: true}},
                  ], {
                    xaxis: {
                        minorTickFreq: 4
                    } 
                  });
    }
}

// main loop of `perf_test`
function perf_test_main(){
    var input = document.getElementById('method');
    var method = input.value;
    var input = document.getElementById('number');
    var number = parseInt(input.value);
    var result = new Array();
    
    var xwalk_test_object = new xwalk_test_goal();

    if(method == 'linear'){
        var data = get_data_unit();
        var k = document.getElementById('variable').value;
        var add = new String();
        for(var i=0; i<parseInt(k); i++){
            add += data;
        }
        for(var i=1; i<number; i++){
            data += add; 
            time = perf_test(xwalk_test_object, data);
            result.push(time);
        }
    }
    else{
        var unit = get_data_unit();
        var pow = document.getElementById('variable').value;
        var data = new String();
        for(var i=0; i<parseInt(pow); i++){
            data += unit;
        }
        for(var i=1; i<number; i++){
            data += data; 
            time = perf_test(xwalk_test_object, data);
            result.push(time);
        }
    }
    visualize(result, method);
}

// call main function
// 1. call directly
// perf_test_main();
// 2. call through pressing the button
document.onreadystatechange = function(){
    document.getElementById("testBtn").onclick=function(){perf_test_main();};
}
