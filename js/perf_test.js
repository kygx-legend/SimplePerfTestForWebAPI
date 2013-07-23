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
function data_generate(){
    var p = document.getElementById("content");
    var input = document.getElementById("scale");
    if(p != null && input != null){
        var content = p.innerHTML;
        var scale = input.value;
        var case_str = '';
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
    }
    this.quick_sort = function quick_sort(data){
        this.data = data.split('');
        this.quick_sort_main(this.data);
    }
    this.quick_sort_main = function quick_sort_main(data, left, right){
        if(left >= right){
            return ;
        }
        var index = this.partition(data, left, right);
        this.quick_sort_main(data, left, index-1);
        this.quick_sort_main(data, index+1, right);
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
    var test = new xwalk_test_goal('t');
    test.set_property(data);
    alert(test.data);
    test.get_property(data);
    alert(test.data);
    /*
    for(d in data){
        time = perf_test(goal_test_function, d);
        result.push(time);
    }
    visualize(result);
    */
}

// call main function
// 1. call directly
// perf_test_main();
// 2. call through pressing the button
document.onreadystatechange = function(){
    document.getElementById("testBtn").onclick=function(){perf_test_main();};
}
