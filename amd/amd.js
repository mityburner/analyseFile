/*
    https://curiosity-driven.org/minimal-loader?utm_source=echojs
*/
(function(document) {

    /*listeners，模块请求容器，形式为：listeners[name] = [listener]，name为require(name, listener)的模块名称，listener为模块加载后要做的处理,数组表明模块会被请求多次
    *resolves，加载信息容器，形式为：resolves[name] = value，name为模块名，value为加载后的值（或者说是js代码执行后的结果）
    *config，配置信息容器，形式为：config[name] = url;name为模块名，url为模块对应的加载地址
    *loaded：存储已经加载的模块
    *anonymous：匿名模块值存储容器，
    */
    var listeners = {}, resolves = {}, config = {}, loaded = {}, anonymous = [];;


    //载入事件的处理函数
    function onScriptLoad(evt) {
        var node = evt.currentTarget || evt.srcElement;
        if(evt.type==='load' || /^(complete|loaded)$/.test(node.readyState)) {
            //不再监听载入事件
            node.removeEventListener('load', onScriptLoad, false);
            //获取属性名(模块的名称)
            var name = node.getAttribute('data-requiremodule');
            //循环匿名模块值存储容器，为模块添加名称并加载
            anonymous.forEach(function(value) {
                resolve(name, value);
            });
            anonymous = [];
        }
    }

    /*加载模块*/
    function addLoadListener(name, listener) {
        //name模块已被加载，其值为(模块已加载，且返回值为)resolves[name]，则立即执行require(name, fn)中的fn
        if(name in resolves) listener(name, resolves[name]);
        //模块未被加载且曾被请求过，则将fn存储在listeners模块请求容器中
        else if(listeners[name]) listeners[name].push(listener);
        else {
            //模块未被加载且未曾请求过，则将fn存储并将该文件引入到网页中
            if(config[name] && !loaded[config[name]]) {
                var node = document.createElement('SCRIPT');
                //为标签指定一个属性，该属性的值为匿名模块的名称
                node.setAttribute('data-requiremodule', name);
                //为节点添加载入(load)事件监听器
                node.addEventListener('load', onScriptLoad, false);
                node.src = config[name];
                document.head.appendChild(node);
                //标示已经载入的模块
                loaded[config[name]] = true;
            }
        }
    }
    /*加载(解释)模块*/
    function resolve(name, value) {
        //模块是匿名模块则该模块的值存储起来，待该模块有名称时再加载
        if(!name) {
            anonymous.push(value);
            return;
        }
        //将加载后的值存储到resolves对象中，即，在name模块加载之后，将返回值value存储在resolves对象中
        resolves[name] = value;
        //判断模块是否被require(name, fn)请求过
        if(listeners[name]) {
            //将模块名name和返回值value作为参数，立即执行fn
            listeners[name].forEach(function(listener) {
                listener(name, value);
            });
            //从请求容器listeners中将name模块删除
            delete listeners[name];
        }
    }

    /*定义require()方法*/
    function require(deps, definition) {
        //没有依赖则直接执行definition()处理函数
        if(!deps.length) definition();
        else {
            /*values存储加载后的值
            loaded存储依赖模块累计加载数
            */
            var values = [], loaded = 0;
            deps.forEach(function(dep) {
                //分别加载模块
                addLoadListener(dep, function(name, value) {
                    //将每次加载模块后返回的值value进行存储
                    values[deps.indexOf(name)] = value;
                    //所有依赖模块加载完毕，执行自定义的处理函数definition()
                    if(++loaded >= deps.length) definition.apply(null, values);
                });
            });
        }
    }

    /*定义define()方法*/
    function define(name, deps, definition) {
        //处理匿名模块,参数有两个或者一个
        //deps--->definition
        //name--->deps
        if(typeof(name)!=='string') {
            definition = deps;
            deps = name;
            name = '';
        }
        //处理没有依赖的情况，有两个参数
        //deps-->definition
        if(!definition) {
            definition = deps;
            deps = [];
        }
        //没有依赖则直接加载
        if(!deps.length) resolve(name, definition());
        else {
            //有依赖时，则请求依赖的模块
            require(deps, function() {
                resolve(name, definition.apply(null, arguments));
            });
        }
    }
    /*定义require.config()方法
    将配置文件存储在config对象中*/
    require.config = function(map) {
        for(var n in map) config[n] = map[n]; 
    };
    
    define.amd = config;

    window.require = require;
    window.define = define;
}(document));