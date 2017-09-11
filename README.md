# 多值多条件顺序验证

## 使用说明

``` javascript
validate(validate1, validate2, ...); // 验证列表

// validate1, validate2等为数组，包含以下内容
[value, [rule1, rule2, ...], [errorMsg1, errorMsg2, ...], cb]

// 完整写法：
validate(
    [value1, [rule1, rule2, ...], [errorMsg1, errorMsg2, ...], cb],
    [value2, [rule1, rule2, ...], [errorMsg1, errorMsg2, ...], cb],
    [value3, [rule1, rule2, ...], [errorMsg1, errorMsg2, ...], cb]
)
```

- value【String】：需要验证的值；
- rules【String|RegExp|Function】：每一条验证规则；
    - String：预定义的规则字典键值，详见代码中的 DEFINED_RULES；
    - RegExp：正则表达式，和value进行test操作；
    - Function(value)：函数的返回值必须为true|false，表示该条规则是否验证成功，默认传递value作为其参数
- errorMsg【String】：验证失败需要提示的字符串
- cb(isOK, msg)【Function/选填】：每条验证的回调，isOK表示本条数据所有规则是否都满足，msg表示第一条不满足规则对应的errorMsg。如果无该参数，默认成功无回调，错误执行 defaultErrorFn。
    - PS: 在有回调函数的时候默认的错误函数defaultErrorFn不会执行。

## 实例

### 1. 预定义规则使用

验证用户名（必填和格式），密码（必填和格式）

``` javascripts
validate(
    [username, ['required', 'username'], ['用户名不能为空', '用户名格式错误']],
    [password, ['required', 'password'], ['密码不能为空', '密码格式错误']]
)
```

### 2. 正则规则使用

验证用户名（必填和格式），密码（必填和格式），验证码（必填和4位长度数字限制）。

``` javascripts
validate(
    [username, ['required', 'username'], ['用户名不能为空', '用户名格式错误']],
    [password, ['required', 'password'], ['密码不能为空', '密码格式错误']],
    [code, ['required', /^\d{4}$/], ['验证码不能为空', '验证码格式错误']]
)
```

### 3. 函数规则使用

验证用户名（必填和格式），密码（必填和格式），重复密码（必填和格式和原密码一致）
``` javascripts
validate(
    [username, ['required', 'username'], ['用户名不能为空', '用户名格式错误']],
    [password, ['required', 'password'], ['密码不能为空', '密码格式错误']],
    [repassword, ['required', 'password', function(val){
        return val === password;
    }], ['密码不能为空', '密码格式错误', '两次密码不一致']]
)
```

### 4. 回调函数的使用

验证失败的时候给对应的表单元素添加error类并且显示错误信息。

``` javascripts
validate(
    [username, ['required', 'username'], ['用户名不能为空', '用户名格式错误'], function(isOK, msg) {
        if(!isOK) $('username').addClass('error').siblings('msg').html('msg');
        else $('username').removeClass('error').siblings('msg').html('');
    }],
    [password, ['required', 'password'], ['密码不能为空', '密码格式错误'], function(isOK, msg) {
        if(!isOK) $('password').addClass('error').siblings('msg').html('msg');
        else $('password').removeClass('error').siblings('msg').html('');
    }]
)
```


### 5. 特殊情况

例如头像是否上传的情况，头像的值是一个file不是字符串，可以通过设定规则为函数：

``` javascripts
validate(
    [username, ['required', 'username'], ['用户名不能为空', '用户名格式错误']],
    [password, ['required', 'password'], ['密码不能为空', '密码格式错误']],
    ['', [function(){return files.length;}], ['头像必须上传']]
)
```