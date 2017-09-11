var validate = (function(){

    // 预定义验证规则字典
    var DEFINED_RULES = {
        required: /^.+$/,
        phone: /^(?:1\d{10})?$/,
        username: /\w{6-20}/,
        password: /\w{6-20}/
    };

    /**
     * 默认错误执行函数
     * @param {String} msg 错误提示内容
     */
    function defaultErrorFn(msg) {
        alert(msg);
    }

    function validate(){
        var args = Array.prototype.slice.call(arguments);
        for (var i = 0, j = args.length; i < j; i++) {
            var value = args[i][0], rules = args[i][1], msg = args[i][2], cb = args[i][3];
            for (var m = 0, n = rules.length; m < n; m++) {
                var nowRule = null;
                if ('function' === typeof rules[m]) nowRule = rules[m];
                else if ('string' === typeof rules[m]) {
                    var ivalRul = DEFINED_RULES[rules[m]];
                    'function' === typeof ivalRul ? nowRule = ivalRul : nowRule = function() { return ivalRul.test(value) };
                } else if (rules[m] instanceof RegExp) nowRule = function() { return rules[m].test(value) };
                else throw '验证规则格式错误！';

                if (!nowRule(value)) {
                    typeof cb === 'function' ? cb(false, msg[m]) : defaultErrorFn(msg[m]);
                    return false;
                }
            }
            typeof cb === 'function' && cb(true);
        }
        return true;
    }

    return validate;
})();